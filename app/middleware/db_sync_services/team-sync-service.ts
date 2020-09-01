import { Component } from "react";
import LocalDatabase from "../db/local-database"
import { MainTenantModel, CountryModel, CommonValueTypeModel } from "../../models/data/tenant-model";
import { CurrentLoginInfoModel } from "../../models/data/session-model";
import * as AsyncStorage from '../../utils/storage/storage';
import TenantService from "../services/tenant-service";
import TenantDBService from "../database_services/tenant-db-service";

export default class TeamSyncService extends Component {
    database: LocalDatabase
    constructor(props?) {
        super(props)
    }

    SyncTeams = async () => {
        let tenantObj: MainTenantModel;
        let tenantService = new TenantService();
        let tenantDBService = new TenantDBService();

        // Initialize Database
        this.database = new LocalDatabase();

        let tenantId: number;
        let userDetailObj = await AsyncStorage.loadString("UserDetails");
        if (!!userDetailObj) {
            const userDetails = JSON.parse(userDetailObj) as CurrentLoginInfoModel;
            tenantId = userDetails.tenant.id
        }

        const db = await this.database.initDB();
        const execResults = await this.database.sqlExecutor(db, `SELECT t.* FROM Tenants t WHERE t.IsSync = 0`, [])
        if (execResults.rows.length > 0) {
            for (let i = 0; i < execResults.rows.length; i++) {
                let tenantLocalDBObj = execResults.rows._array[i];
                let commonTypeValueObj: CommonValueTypeModel = {
                    tenantId: tenantId,
                    code: tenantLocalDBObj.CommonValueTypeCode,
                    description: tenantLocalDBObj.CommonValueTypeDescription,
                    isActive: tenantLocalDBObj.CommonValueTypeIsActive == 0 ? false : true
                }
                let countryObj: CountryModel = {
                    tenantId: tenantId,
                    code: tenantLocalDBObj.CountryCode,
                    description: tenantLocalDBObj.CountryDescription,
                    parentId: tenantLocalDBObj.CountryParentId,
                    commonValueType: commonTypeValueObj,
                    commonValueTypeId: tenantLocalDBObj.CommonValueTypeId
                }
                tenantObj = {
                    id: tenantId,
                    tenancyName: tenantLocalDBObj.TenancyName,
                    name: tenantLocalDBObj.TeamName,
                    isActive: tenantLocalDBObj.IsActive == 0 ? false : true,
                    coachFullName: tenantLocalDBObj.CoachFullName,
                    countryId: tenantLocalDBObj.CountryId,
                    country: countryObj,
                    city: tenantLocalDBObj.City,
                    teamLogoUrl: tenantLocalDBObj.TeamLogoUrl,
                    teamLogoLocal: tenantLocalDBObj.teamLogoLocal,
                    isAccountSetup: tenantLocalDBObj.isAccountSetup == 1 ? true : false
                }

                let response = await tenantService.updateTenant(tenantObj);
                await tenantDBService.checkIfTenantExistsThenAddOrUpdate(response.tenantResponse.id, response.tenantResponse, true);
            }
        }
    }
}