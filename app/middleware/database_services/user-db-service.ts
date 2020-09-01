import { Component } from "react"
import LocalDatabase from "../db/local-database"
import { UserModel, AllUsersModel } from "../../models/data/user-model"

export default class UserDBService extends Component {
  database: LocalDatabase
  constructor(props?) {
    super(props)
    this.database = new LocalDatabase()
  }

  async AddUser(userDbObject: UserModel, isSync: boolean) {
    const db = await this.database.initDB()
    const execResults = await this.database.sqlExecutor(
      db,
      `INSERT INTO Users (id, username, name, surname, fullName, emailAddress, isActive, age, height, weight, ` +
        `isRightHanded, userPhotoUrl, userPhotoLocal, downloadOverWiFiOnly, birthDate, userLinkStatusId, userLinkStatusCode, isSync, localCreationTime) ` +
        `VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        `${userDbObject.id}`,
        `${!!userDbObject.userName ? userDbObject.userName : ""}`,
        `${!!userDbObject.name ? userDbObject.name : ""}`,
        `${!!userDbObject.surname ? userDbObject.surname : ""}`,
        `${!!userDbObject.fullName ? userDbObject.fullName : ""}`,
        `${!!userDbObject.emailAddress ? userDbObject.emailAddress : ""}`,
        `${!!userDbObject.isActive && userDbObject.isActive == true ? 1 : 0}`,
        `${!!userDbObject.age ? userDbObject.age : ""}`,
        `${!!userDbObject.height ? userDbObject.height : ""}`,
        `${!!userDbObject.weight ? userDbObject.weight : ""}`,
        `${!!userDbObject.isRightHanded && userDbObject.isRightHanded == true ? 1 : 0}`,
        `${!!userDbObject.userPhotoUrl ? userDbObject.userPhotoUrl : ""}`,
        `${!!userDbObject.userPhotoLocal ? userDbObject.userPhotoLocal : ""}`,
        `${userDbObject.downloadOverWiFiOnly == true ? 1 : 0}`,
        `${!!userDbObject.birthDate ? userDbObject.birthDate : ""}`,
        `${!!userDbObject.userLinkStatusId ? userDbObject.userLinkStatusId : 0}`,
        `${!!userDbObject.userLinkStatusCode ? userDbObject.userLinkStatusCode : ""}`,
        `${isSync == true ? 1 : 0}`,
        `${Date.now()}`,
      ],
    )

    return execResults
  }

  async UpdateUser(userDbObject: UserModel, isSync: boolean) {
    const db = await this.database.initDB()
    const execResults = await this.database.sqlExecutor(
      db,
      `UPDATE Users SET username = ?, name = ?, surname = ?, fullName = ?, emailAddress = ?, isActive = ?, age = ?, height = ?, weight = ?, ` +
        `isRightHanded = ?, userPhotoUrl = ?, userPhotoLocal = ?, downloadOverWiFiOnly = ?, birthDate = ?, userLinkStatusId = ?, userLinkStatusCode = ?, ` +
        `isSync = ?, localCreationTime = ? WHERE id = ?`,
      [
        `${!!userDbObject.userName ? userDbObject.userName : ""}`,
        `${!!userDbObject.name ? userDbObject.name : ""}`,
        `${!!userDbObject.surname ? userDbObject.surname : ""}`,
        `${!!userDbObject.fullName ? userDbObject.fullName : ""}`,
        `${!!userDbObject.emailAddress ? userDbObject.emailAddress : ""}`,
        `${!!userDbObject.isActive && userDbObject.isActive == true ? 1 : 0}`,
        `${!!userDbObject.age ? userDbObject.age : ""}`,
        `${!!userDbObject.height ? userDbObject.height : ""}`,
        `${!!userDbObject.weight ? userDbObject.weight : ""}`,
        `${!!userDbObject.isRightHanded && userDbObject.isRightHanded == true ? 1 : 0}`,
        `${!!userDbObject.userPhotoUrl ? userDbObject.userPhotoUrl : ""}`,
        `${!!userDbObject.userPhotoLocal ? userDbObject.userPhotoLocal : ""}`,
        `${userDbObject.downloadOverWiFiOnly == true ? 1 : 0}`,
        `${!!userDbObject.birthDate ? userDbObject.birthDate : ""}`,
        `${!!userDbObject.userLinkStatusId ? userDbObject.userLinkStatusId : 0}`,
        `${!!userDbObject.userLinkStatusCode ? userDbObject.userLinkStatusCode : ""}`,
        `${isSync == true ? 1 : 0}`,
        `${Date.now()}`,
        `${userDbObject.id}`,
      ],
    )

    return execResults
  }

  async updateUserId(localUserId: number, apiResponseUserId: number) {
    const db = await this.database.initDB()
    const execResults = await this.database.sqlExecutor(
      db,
      `UPDATE Users Set Id = ?, IsSync = 1 WHERE RowId = ?`,
      [`${apiResponseUserId}`, `${localUserId}`],
    )
  }

  async getUserByLocalId(localUserId: number) {
    const db = await this.database.initDB()
    const execResults = await this.database.sqlExecutor(
      db,
      `SELECT u.* FROM Users u WHERE u.RowId = ?`,
      [`${localUserId}`],
    )
    console.log(execResults)
  }

  async getUserById(userId: number): Promise<UserModel> {
    let userObj: UserModel
    const db = await this.database.initDB()
    const execResults = await this.database.sqlExecutor(
      db,
      `SELECT u.* FROM Users u WHERE u.Id = ?`,
      [`${userId}`],
    )
    if (execResults.rows.length > 0) {
      userObj = execResults.rows._array[0] as UserModel
    }
    return userObj
  }

  async getAllUsers(): Promise<AllUsersModel> {
    let userObj: UserModel
    let users: UserModel[]
    const db = await this.database.initDB()
    const execResults = await this.database.sqlExecutor(
      db,
      `SELECT u.* FROM Users u WHERE u.Id = ?`,
      [],
    )
    if (execResults.rows.length > 0) {
      for (let i = 0; i < execResults.rows.length; i++) {
        userObj = null
        userObj = execResults.rows._array[0] as UserModel
        users.push(userObj)
      }
    }
    const allUsers: AllUsersModel = {
      totalCount: execResults.rows.length,
      items: users,
    }

    return allUsers
  }

  async checkIfUserExistsThenAddOrUpdate(userId: number, userObj: UserModel, isSync: boolean) {
    try {
      const db = await this.database.initDB()
      let execResults = await this.database.sqlExecutor(
        db,
        `SELECT u.* FROM Users u WHERE u.Id = ?`,
        [`${userId}`],
      )
      if (execResults.rows.length > 0) {
        execResults = await this.UpdateUser(userObj, true)
        console.log(execResults)
      } else {
        execResults = await this.AddUser(userObj, true)
        console.log(execResults)
      }
      return execResults
    } catch (e) {
      console.log(e)
    }
  }
}
