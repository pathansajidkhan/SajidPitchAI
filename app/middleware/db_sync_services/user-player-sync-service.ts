import { Component } from "react";
import { UserModel, PlayerSetupModel } from "../../models/data/user-model";
import LocalDatabase from "../db/local-database"
import UserService from "../services/user-service";
import UserDBService from "../database_services/user-db-service";

export default class UserPlayerSyncService extends Component {
    database: LocalDatabase
    constructor(props?) {
        super(props)
    }

    SyncAddPlayers = async () => {
        let userObj: UserModel;
        const userDBService = new UserDBService();
        const userService = new UserService();

        // Initialize Database
        this.database = new LocalDatabase();

        const db = await this.database.initDB()
        const execResults = await this.database.sqlExecutor(db, `SELECT u.* FROM Users u WHERE u.Id = 0 AND u.IsSync = 0`, [])
        if (execResults.rows.length > 0) {
            for (let i = 0; i < execResults.rows.length; i++) {
                userObj = execResults.rows._array[i] as UserModel
                let playerModel: PlayerSetupModel = {
                    fullName: userObj.fullName,
                    emailAddress: userObj.emailAddress,
                    name: "",
                    surname: ""
                };
                let response = await userService.addPlayer(playerModel);
                await userDBService.checkIfUserExistsThenAddOrUpdate(response.userResponse.id, response.userResponse, true);
            }
        }
    }

    SyncUpdatePlayers = async () => {
        let userObj: UserModel;
        const userDBService = new UserDBService();
        const userService = new UserService();

        // Initialize Database
        this.database = new LocalDatabase();

        const db = await this.database.initDB()
        const execResults = await this.database.sqlExecutor(db, `SELECT u.* FROM Users u WHERE u.IsSync = 0`, [])
        if (execResults.rows.length > 0) {
            for (let i = 0; i < execResults.rows.length; i++) {
                userObj = execResults.rows._array[i] as UserModel
                let response = await userService.updateUser(userObj);
                await userDBService.checkIfUserExistsThenAddOrUpdate(response.userResponse.id, response.userResponse, true);
            }
        }
    }
}