import { Component } from "react";
import LocalDatabase from "../db/local-database";
import { MainTenantModel, CommonValueTypeModel, CountryModel } from "../../models/data/tenant-model";
import { PlayerTeamsModel } from "../../models/data/user-model";

export default class TenantDBService extends Component {
    database: LocalDatabase;
    constructor(props?) {
        super(props);
        this.database = new LocalDatabase();
    }

    async AddTenant(tenantDbObject: MainTenantModel, isSync: boolean) {
        const db = await this.database.initDB();
        const execResults = await this.database.sqlExecutor(db,
            `INSERT INTO Tenants (id, tenancyName, teamName, isActive, coachFullName, countryId, countryTenantId, countryCode, countryDescription, countryParentId, ` +
            `commonValueTypeTenantId, commonValueTypeCode, commonValueTypeDescription, commonValueTypeIsActive, commonValueTypeId, city, teamLogoUrl, teamLogoLocal, ` +
            `isAccountSetup, isSync, localCreationTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                `${tenantDbObject.id}`,
                `${!!tenantDbObject.tenancyName ? tenantDbObject.tenancyName : ""}`,
                `${!!tenantDbObject.name ? tenantDbObject.name : ""}`,
                `${tenantDbObject.isActive == true ? 1 : 0}`,
                `${!!tenantDbObject.coachFullName ? tenantDbObject.coachFullName : ""}`,
                `${!!tenantDbObject.countryId ? tenantDbObject.countryId : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.tenantId ? tenantDbObject.country.tenantId : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.code ? tenantDbObject.country.code : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.description ? tenantDbObject.country.description : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.parentId ? tenantDbObject.country.parentId : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.commonValueType && !!tenantDbObject.country.commonValueType.tenantId ? tenantDbObject.country.commonValueType.tenantId : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.commonValueType && !!tenantDbObject.country.commonValueType.code ? tenantDbObject.country.commonValueType.code : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.commonValueType && !!tenantDbObject.country.commonValueType.description ? tenantDbObject.country.commonValueType.description : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.commonValueType && tenantDbObject.country.commonValueType.isActive == true ? 1 : 0}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.commonValueTypeId ? tenantDbObject.country.commonValueTypeId : ""}`,
                `${!!tenantDbObject.city ? tenantDbObject.city : ""}`,
                `${!!tenantDbObject.teamLogoUrl ? tenantDbObject.teamLogoUrl : ""}`,
                `${!!tenantDbObject.teamLogoLocal ? tenantDbObject.teamLogoLocal : ""}`,
                `${!!tenantDbObject.isAccountSetup == true ? 1 : 0}`,
                `${isSync == true ? 1 : 0}`,
                `${Date.now()}`
            ]
        );

        return execResults;
    }

    async UpdateTenant(tenantDbObject: MainTenantModel, isSync: boolean) {
        const db = await this.database.initDB();
        const execResults = await this.database.sqlExecutor(db,
            `UPDATE Tenants SET tenancyName = ?, teamName = ?, isActive = ?, coachFullName = ?, countryId = ?, countryTenantId = ?, countryCode = ?, countryDescription = ?, ` +
            `countryParentId = ?, commonValueTypeTenantId = ?, commonValueTypeCode = ?, commonValueTypeDescription = ?, commonValueTypeIsActive = ?, commonValueTypeId = ?, ` +
            `city = ?, teamLogoUrl = ?, teamLogoLocal = ?, isAccountSetup = ?, isSync = ?, localCreationTime = ? WHERE id = ?`,
            [
                `${!!tenantDbObject.tenancyName ? tenantDbObject.tenancyName : ""}`,
                `${!!tenantDbObject.name ? tenantDbObject.name : ""}`,
                `${tenantDbObject.isActive == true ? 1 : 0}`,
                `${!!tenantDbObject.coachFullName ? tenantDbObject.coachFullName : ""}`,
                `${!!tenantDbObject.countryId ? tenantDbObject.countryId : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.tenantId ? tenantDbObject.country.tenantId : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.code ? tenantDbObject.country.code : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.description ? tenantDbObject.country.description : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.parentId ? tenantDbObject.country.parentId : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.commonValueType && !!tenantDbObject.country.commonValueType.tenantId ? tenantDbObject.country.commonValueType.tenantId : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.commonValueType && !!tenantDbObject.country.commonValueType.code ? tenantDbObject.country.commonValueType.code : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.commonValueType && !!tenantDbObject.country.commonValueType.description ? tenantDbObject.country.commonValueType.description : ""}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.commonValueType && tenantDbObject.country.commonValueType.isActive == true ? 1 : 0}`,
                `${!!tenantDbObject.country && !!tenantDbObject.country.commonValueTypeId ? tenantDbObject.country.commonValueTypeId : ""}`,
                `${!!tenantDbObject.city ? tenantDbObject.city : ""}`,
                `${!!tenantDbObject.teamLogoUrl ? tenantDbObject.teamLogoUrl : ""}`,
                `${!!tenantDbObject.teamLogoLocal ? tenantDbObject.teamLogoLocal : ""}`,
                `${!!tenantDbObject.isAccountSetup == true ? 1 : 0}`,
                `${isSync == true ? 1 : 0}`,
                `${Date.now()}`,
                `${tenantDbObject.id}`
            ]
        );

        return execResults;
    }

    async getTenantById(tenantId: number): Promise<MainTenantModel> {
        let tenantObj: MainTenantModel;
        const db = await this.database.initDB();
        const execResults = await this.database.sqlExecutor(db, `SELECT t.* FROM Tenants t WHERE t.Id = ?`, [`${tenantId}`]);
        if (execResults.rows.length > 0) {
            let tenantDBObj = execResults.rows._array[0];
            let commonValueTypeObj: CommonValueTypeModel = {
                tenantId: tenantDBObj.commonValueTypeTenantId,
                code: tenantDBObj.commonValueTypeCode,
                description: tenantDBObj.commonValueTypeDescription,
                isActive: tenantDBObj.commonValueTypeIsActive
            };
            let countryObj: CountryModel = {
                tenantId: tenantDBObj.countryTenantId,
                code: tenantDBObj.countryCode,
                description: tenantDBObj.countryDescription,
                parentId: tenantDBObj.countryParentId,
                commonValueType: commonValueTypeObj,
                commonValueTypeId: tenantDBObj.commonValueTypeId,
            }
            tenantObj = {
                id: tenantDBObj.id,
                tenancyName: tenantDBObj.tenancyName,
                name: tenantDBObj.teamName,
                isActive: tenantDBObj.isActive,
                coachFullName: tenantDBObj.coachFullName,
                countryId: tenantDBObj.countryId,
                country: countryObj,
                city: tenantDBObj.city,
                teamLogoUrl: tenantDBObj.teamLogoUrl,
                teamLogoLocal: tenantDBObj.teamLogoLocal,
                isAccountSetup: tenantDBObj.isAccountSetup == 1 ? true : false
            }
        }
        return tenantObj;
    }

    async checkIfTenantExistsThenAddOrUpdate(tenantId: number, tenantObj: MainTenantModel, isSync: boolean) {
        try {
            const db = await this.database.initDB();
            let execResults = await this.database.sqlExecutor(db, `SELECT t.* FROM Tenants t WHERE t.Id = ?`, [`${tenantId}`]);
            if (execResults.rows.length > 0) {
                execResults = await this.UpdateTenant(tenantObj, isSync);
            } else {
                execResults = await this.AddTenant(tenantObj, isSync);
            }
            return execResults;
        } catch (e) {
            console.log(e);
        }
    }


    async checkIfPlayerTeamsExistsThenAddOrUpdate(playerId: number, tenantObj: PlayerTeamsModel, isSync: boolean) {
        try {
            const db = await this.database.initDB();
            let execResults = await this.delete_AddPlayerTeams(tenantObj, playerId, isSync);
            return execResults;
        } catch (e) {
            console.log(e);
        }
    }

    async updateTeamLogo(tenantId: number, teamLogoUrl: string) {
        try {
            const db = await this.database.initDB();
            let execResults = await this.database.sqlExecutor(db, `UPDATE Tenants SET teamLogoUrl = ?, teamLogoLocal = ?  WHERE t.Id = ?`, [`${teamLogoUrl}`, `${teamLogoUrl}`, `${tenantId}`]);
            return execResults;
        } catch (e) {
            console.log(e);
        }
    }

    async delete_AddPlayerTeams(tenantDbObject: PlayerTeamsModel, playerId: number, isSync: boolean) {
        const db = await this.database.initDB();
        await this.database.sqlExecutor(db,
            `DELETE FROM PlayerTeams WHERE PlayerId = ?;`,
            [
                `${playerId}`
            ]
        );
        const execResults = await this.database.sqlExecutor(db,
            `INSERT INTO PlayerTeams (id, tenancyName, teamName, isActive, coachFullName, teamLogoUrl, teamLogoLocal, ` +
            `playerId, coachId, coachEmailAddress, linkStatus, isSync, localCreationTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                `${tenantDbObject.team.id}`,
                `${!!tenantDbObject.team.tenancyName ? tenantDbObject.team.tenancyName : ""}`,
                `${!!tenantDbObject.team.name ? tenantDbObject.team.name : ""}`,
                `${tenantDbObject.team.isActive == true ? 1 : 0}`,
                `${!!tenantDbObject.team.coachFullName ? tenantDbObject.team.coachFullName : ""}`,
                `${!!tenantDbObject.team.teamLogoUrl ? tenantDbObject.team.teamLogoUrl : ""}`,
                `${!!tenantDbObject.team.teamLogoLocal ? tenantDbObject.team.teamLogoLocal : ""}`,
                `${playerId}`,
                `${!!tenantDbObject.teamCoachId ? tenantDbObject.teamCoachId : ""}`,
                `${!!tenantDbObject.teamCoachEmail ? tenantDbObject.teamCoachEmail : ""}`,
                `${!!tenantDbObject.linkStatus ? tenantDbObject.linkStatus : ""}`,
                `${isSync == true ? 1 : 0}`,
                `${Date.now()}`
            ]
        );

        return execResults;
    }

    async getTeamsByPlayerId(playerId: number): Promise<PlayerTeamsModel[]> {
        let tenantObj: PlayerTeamsModel[];
        const db = await this.database.initDB();
        const execResults = await this.database.sqlExecutor(db, `SELECT p.* FROM PlayerTeams p WHERE p.Id = ?`, [`${playerId}`]);
        tenantObj = execResults as PlayerTeamsModel[];
        return tenantObj;
    }

}