import * as SQLite from 'expo-sqlite';

const database_name = "PicthAI.db";
const database_version = "1.0";
const database_displayname = "PitchAI SQLite Offline Database";

export default class LocalDatabase {
    database: SQLite.WebSQLDatabase;
    async initDB(): Promise<SQLite.WebSQLDatabase> {
        this.database = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname
        );

        //await this.dropTables(this.database);

        // CREATE USER TABLE
        await this.sqlExecutor(this.database, `CREATE TABLE IF NOT EXISTS Users (RowId INTEGER PRIMARY KEY AUTOINCREMENT, ` +
            `id INTEGER, ` +
            `username TEXT, ` +
            `name TEXT, ` +
            `surname TEXT, ` +
            `fullName TEXT, ` +
            `emailAddress TEXT, ` +
            `isActive INTEGER, ` +
            `age TEXT, ` +
            `height TEXT, ` +
            `weight TEXT, ` +
            `isRightHanded INTEGER, ` +
            'userPhotoUrl TEXT, ' +
            'userPhotoLocal TEXT, ' +
            'downloadOverWiFiOnly INTEGER, ' +
            'birthDate TEXT, ' +
            'userLinkStatusId INTEGER, ' +
            'userLinkStatusCode TEXT, ' +
            'isSync INTEGER, ' +
            `localCreationTime TEXT)`, []);

        // CREATE TENANT TABLE
        await this.sqlExecutor(this.database, `CREATE TABLE IF NOT EXISTS Tenants (RowId INTEGER PRIMARY KEY AUTOINCREMENT, ` +
            `id INTEGER, ` +
            `tenancyName TEXT, ` +
            `teamName TEXT, ` +
            `isActive INTEGER, ` +
            `coachFullName TEXT, ` +
            `countryId INTEGER, ` +
            `countryTenantId INTEGER, ` +
            `countryCode TEXT, ` +
            `countryDescription TEXT, ` +
            `countryParentId INTEGER, ` +
            `commonValueTypeTenantId INTEGER, ` +
            `commonValueTypeCode TEXT, ` +
            `commonValueTypeDescription TEXT, ` +
            `commonValueTypeIsActive TEXT, ` +
            `commonValueTypeId INTEGER, ` +
            `city TEXT, ` +
            `teamLogoUrl TEXT, ` +
            `teamLogoLocal TEXT, ` +
            `isAccountSetup INTEGER, ` +
            'isSync INTEGER, ' +
            `localCreationTime TEXT)`, []);

        // CREATE PITCH TABLE
        await this.sqlExecutor(this.database, `CREATE TABLE IF NOT EXISTS Pitch (RowId INTEGER PRIMARY KEY AUTOINCREMENT, ` +
            `id INTEGER, ` +
            `playerUserId INTEGER, ` +
            `playerFullName TEXT, ` +
            `playerEmailAddress TEXT, ` +
            `pitchDate TEXT, ` +
            `filmSourceId INTEGER, ` +
            `filmSourceCode TEXT, ` +
            `coachId INTEGER, ` +
            `coachFullName TEXT, ` +
            `coachEmailAddress TEXT, ` +
            `videoUrl TEXT, ` +
            `videoBlobSASUrl TEXT, ` +
            `videoUrlLocal TEXT, ` +
            `videoSkeletonUrl TEXT, ` +
            `videoSkeletonBlobSASUrl TEXT, ` +
            `videoSkeletonUrlLocal TEXT, ` +
            `videoReportUrl TEXT, ` +
            `statusId INTEGER, ` +
            `statusCode TEXT, ` +
            `originalCoordinates BLOB, ` +
            `kinematics BLOB, ` +
            `comparisonCoordinates2d BLOB, ` +
            `comparisonCoordinates3d BLOB, ` +
            `encodedPitchId TEXT, ` +
            'isSync INTEGER, ' +
            `localCreationTime TEXT)`, []);

          // CREATE PlayerTeams Table
          await this.sqlExecutor(this.database, `CREATE TABLE IF NOT EXISTS PlayerTeams (RowId INTEGER PRIMARY KEY AUTOINCREMENT, ` +
          `id INTEGER, ` +
          `tenancyName TEXT, ` +
          `teamName TEXT, ` +
          `isActive INTEGER, ` +
          `coachFullName TEXT, ` +
          `teamLogoUrl TEXT, ` +
          `teamLogoLocal TEXT, ` +
          'isSync INTEGER, ' +
          'playerId INTEGER, ' +
          'coachId INTEGER, ' +
          'coachEmailAddress TEXT, ' +
          'linkStatus TEXT, ' +
          `localCreationTime TEXT)`, []);


        return this.database;
    };

    sqlExecutor(db, strSql, params = []) {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(strSql, params,
                    (_, result) => resolve(result),
                    (_, err) => reject(err));
            });
        });
    }

    closeDatabase(db) {
        if (db) {
            console.log("Closing DB");
            db.close();
        } else {
            console.log("Database was not OPENED");
        }
    };

    dropTables = async (db) => {
        await this.sqlExecutor(db, "DROP TABLE IF EXISTS Users", []);
        await this.sqlExecutor(db, "DROP TABLE IF EXISTS Tenants", []);
        await this.sqlExecutor(db, "DROP TABLE IF EXISTS Pitch", []);
    }
}