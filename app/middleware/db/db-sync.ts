import { Component } from "react";
import UserPlayerSyncService from "../db_sync_services/user-player-sync-service";
import * as AsyncStorage from '../../utils/storage/storage';
import { CurrentLoginInfoModel } from "../../models/data/session-model";
import TeamSyncService from "../db_sync_services/team-sync-service";

export default class DatabaseSync extends Component {
    constructor(props?) {
        super(props);
        AsyncStorage.loadString("UserDetails").then(async res => {
            if (!!res) {
                const userDetails = JSON.parse(res) as CurrentLoginInfoModel;
                let filteredCoachData = userDetails.user.roleNames.filter(x => String(x.toLowerCase()).includes("coach"));
                let filteredPlayerData = userDetails.user.roleNames.filter(x => String(x.toLowerCase()).includes("player"));
                if (filteredCoachData.length > 0) {
                    await this.SyncTeamTable();
                    await this.SyncAddPlayerTable();
                    await this.SyncUpdatePlayerTable();
                } else if (filteredPlayerData.length > 0) {
                    await this.SyncUpdatePlayerTable();
                } else {
                    await this.SyncTeamTable();
                    await this.SyncAddPlayerTable();
                    await this.SyncUpdatePlayerTable();
                }
            }
        });
    }

    SyncTeamTable = async () => {
        const teamSyncService = new TeamSyncService();
        await teamSyncService.SyncTeams();
    }

    SyncAddPlayerTable = async () => {
        const userPlayerSyncService = new UserPlayerSyncService();
        await userPlayerSyncService.SyncAddPlayers();
    }

    SyncUpdatePlayerTable = async () => {
        const userPlayerSyncService = new UserPlayerSyncService();
        await userPlayerSyncService.SyncUpdatePlayers();
    }
}