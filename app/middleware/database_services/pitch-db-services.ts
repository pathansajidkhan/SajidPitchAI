import { Component } from "react";
import LocalDatabase from "../db/local-database";
import { GetPitchesModel } from "../../models/data/pitch-model";

export default class PitchDBService extends Component {
    database: LocalDatabase;
    constructor(props?) {
        super(props);
        this.database = new LocalDatabase();
    }

    async AddPitch(pitchDbObject: GetPitchesModel, isSync: boolean) {
        const db = await this.database.initDB();
        const execResults = await this.database.sqlExecutor(db,
            `INSERT INTO Pitch (id, playerUserId, playerFullName, playerEmailAddress, pitchDate, filmSourceId, filmSourceCode, coachId, coachFullName, coachEmailAddress, ` +
            `videoUrl, videoBlobSASUrl, videoSkeletonUrl, videoSkeletonBlobSASUrl, videoReportUrl, statusId, statusCode, originalCoordinates, kinematics, comparisonCoordinates2d, comparisonCoordinates3d, ` +
            `isSync, localCreationTime, encodedPitchId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                `${pitchDbObject.id}`,
                `${!!pitchDbObject.playerUserId ? pitchDbObject.playerUserId : ""}`,
                `${!!pitchDbObject.playerFullName ? pitchDbObject.playerFullName : ""}`,
                `${!!pitchDbObject.playerEmailAddress ? pitchDbObject.playerEmailAddress : ""}`,
                `${!!pitchDbObject.pitchDate ? pitchDbObject.pitchDate : ""}`,
                `${!!pitchDbObject.filmSourceId ? pitchDbObject.filmSourceId : ""}`,
                `${!!pitchDbObject.filmSourceCode ? pitchDbObject.filmSourceCode : ""}`,
                `${!!pitchDbObject.coachId ? pitchDbObject.coachId : ""}`,
                `${!!pitchDbObject.coachFullName ? pitchDbObject.coachFullName : ""}`,
                `${!!pitchDbObject.coachEmailAddress ? pitchDbObject.coachEmailAddress : ""}`,
                `${!!pitchDbObject.videoUrl ? pitchDbObject.videoUrl : ""}`,
                `${!!pitchDbObject.videoBlobSASUrl ? pitchDbObject.videoBlobSASUrl : ""}`,
                `${!!pitchDbObject.videoSkeletonUrl ? pitchDbObject.videoSkeletonUrl : ""}`,
                `${!!pitchDbObject.videoSkeletonBlobSASUrl ? pitchDbObject.videoSkeletonBlobSASUrl : ""}`,
                `${!!pitchDbObject.videoReportUrl ? pitchDbObject.videoReportUrl : ""}`,
                `${!!pitchDbObject.statusId ? pitchDbObject.statusId : ""}`,
                `${!!pitchDbObject.statusCode ? pitchDbObject.statusCode : ""}`,
                `${!!pitchDbObject.originalCoordinates ? "" : ""}`,
                `${!!pitchDbObject.kinematics ? "" : ""}`,
                `${!!pitchDbObject.comparisonCoordinates2d ? "" : ""}`,
                `${!!pitchDbObject.comparisonCoordinates3d ? "" : ""}`,
                `${!!pitchDbObject.encodedPitchId ? "" : ""}`,
                `${isSync == true ? 1 : 0}`,
                `${Date.now()}`
            ]
        );

        return execResults;
    }

    async UpdatePitch(pitchDbObject: GetPitchesModel, isSync: boolean) {
        const db = await this.database.initDB();
        const execResults = await this.database.sqlExecutor(db,
            `UPDATE Pitch SET playerUserId = ?, playerFullName = ?, playerEmailAddress = ?, pitchDate = ?, filmSourceId = ?, filmSourceCode = ?, coachId = ?, ` +
            `coachFullName = ?, coachEmailAddress = ?, videoUrl = ?, videoBlobSASUrl = ?, videoSkeletonUrl = ?, videoSkeletonBlobSASUrl = ?, videoReportUrl = ?, statusId = ?, statusCode = ?, ` + 
            `originalCoordinates = ?, kinematics = ?, comparisonCoordinates2d = ?, comparisonCoordinates3d  = ?, isSync = ?, localCreationTime = ?, encodedPitchId = ?` +
            `WHERE id = ?`,
            [
                `${!!pitchDbObject.playerUserId ? pitchDbObject.playerUserId : ""}`,
                `${!!pitchDbObject.playerFullName ? pitchDbObject.playerFullName : ""}`,
                `${!!pitchDbObject.playerEmailAddress ? pitchDbObject.playerEmailAddress : ""}`,
                `${!!pitchDbObject.pitchDate ? pitchDbObject.pitchDate : ""}`,
                `${!!pitchDbObject.filmSourceId ? pitchDbObject.filmSourceId : ""}`,
                `${!!pitchDbObject.filmSourceCode ? pitchDbObject.filmSourceCode : ""}`,
                `${!!pitchDbObject.coachId ? pitchDbObject.coachId : ""}`,
                `${!!pitchDbObject.coachFullName ? pitchDbObject.coachFullName : ""}`,
                `${!!pitchDbObject.coachEmailAddress ? pitchDbObject.coachEmailAddress : ""}`,
                `${!!pitchDbObject.videoUrl ? pitchDbObject.videoUrl : ""}`,
                `${!!pitchDbObject.videoBlobSASUrl ? pitchDbObject.videoBlobSASUrl : ""}`,
                `${!!pitchDbObject.videoSkeletonUrl ? pitchDbObject.videoSkeletonUrl : ""}`,
                `${!!pitchDbObject.videoSkeletonBlobSASUrl ? pitchDbObject.videoSkeletonBlobSASUrl : ""}`,
                `${!!pitchDbObject.videoReportUrl ? pitchDbObject.videoReportUrl : ""}`,
                `${!!pitchDbObject.statusId ? pitchDbObject.statusId : ""}`,
                `${!!pitchDbObject.statusCode ? pitchDbObject.statusCode : ""}`,
                `${!!pitchDbObject.originalCoordinates ? "" : ""}`,
                `${!!pitchDbObject.kinematics ? "" : ""}`,
                `${!!pitchDbObject.comparisonCoordinates2d ? "" : ""}`,
                `${!!pitchDbObject.comparisonCoordinates3d ? "" : ""}`, 
                `${!!pitchDbObject.encodedPitchId ? "" : ""}`,
                `${isSync == true ? 1 : 0}`,
                `${Date.now()}`,
                `${pitchDbObject.id}`
            ]
        );

        return execResults;
    }

    async UpdatePitchVideoUrlLocal(localVideoUrl: string, pitchId: number) {
        const db = await this.database.initDB();
        const execResults = await this.database.sqlExecutor(db,
            `UPDATE Pitch SET videoUrlLocal = ?` +
            `WHERE id = ?`,
            [
                `${!!localVideoUrl ? localVideoUrl : ""}`,
                `${pitchId}`
            ]
        );
        return execResults;
    }
    
    async UpdatePitchVideoSkeletonUrlLocal(localVideoSkeletonUrl: string, pitchId: number) {
        const db = await this.database.initDB();
        const execResults = await this.database.sqlExecutor(db,
            `UPDATE Pitch SET videoSkeletonUrlLocal = ?` +
            `WHERE id = ?`,
            [
                `${!!localVideoSkeletonUrl ? localVideoSkeletonUrl : ""}`,
                `${pitchId}`
            ]
        );
        return execResults;
    }

    async getPitchById(pitchId: number): Promise<GetPitchesModel> {
        let pitchObj: GetPitchesModel;
        const db = await this.database.initDB();
        const execResults = await this.database.sqlExecutor(db, `SELECT p.* FROM Pitch p WHERE p.Id = ?`, [`${pitchId}`]);
        if (execResults.rows.length > 0) {
            pitchObj = execResults.rows._array[0] as GetPitchesModel;
        }
        return pitchObj;
    }

    async checkIfPitchExistsThenAddOrUpdate(pitchId: number, pitchObj: GetPitchesModel, isSync: boolean) {
        try {
            const db = await this.database.initDB();
            let execResults = await this.database.sqlExecutor(db, `SELECT p.* FROM Pitch p WHERE p.Id = ?`, [`${pitchId}`]);
            if (execResults.rows.length > 0) {
                execResults = await this.UpdatePitch(pitchObj, true);
            } else {
                execResults = await this.AddPitch(pitchObj, true);
            }
            return execResults;
        } catch (e) {
            console.log(e);
        }
    }
}