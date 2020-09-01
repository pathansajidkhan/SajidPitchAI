import { Component } from "react";
import * as AsyncStorage from '../../utils/storage/storage'
import LocalDatabase from "../db/local-database";

export default class ResetStorageService extends Component {
    constructor(props?) {
        super(props);
    }

    resetStorageAndLocalDatabase = async (): Promise<boolean> => {
        try {
            let database = new LocalDatabase();
            const db = await database.initDB();
            database.dropTables(db);
            AsyncStorage.clear();
            return true;
        } catch {
            return false;
        }
    }
}