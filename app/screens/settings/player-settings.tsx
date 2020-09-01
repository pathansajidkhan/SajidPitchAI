import { View, Image, ScrollView, Switch, Dimensions, FlatList, Alert } from "react-native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import * as styles from "../../theme/appStyle"
import Loader from "../../components/spinner/loader"
import { Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons"
import React, { useState } from "react"
import { Text, Screen, Header } from "../../components"
import { ListItem } from "react-native-elements"
import { CurrentLoginInfoModel } from "../../models/data/session-model"
import { UserModel, PlayerTeamsModel } from "../../models/data/user-model"
import * as AsyncStorage from "../../utils/storage/storage"
import UserService from "../../middleware/services/user-service"
import { translate } from "../../i18n/"
import ResetStorageService from "../../middleware/services/reset-storage-service"
import moment from "moment"
import { color } from "../../theme"
import TenantService from "../../middleware/services/tenant-service"

export interface PlayerSettingsProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  userid: number
  showErrorPanel: boolean
  infoMessage: string
  loggedUser: UserModel
  height: string
  weight: string
  age: string
  birthdate: string
  isRightHanded: boolean
  handedness: string
  tenantid: number
  teamName: string
  city: string
  country: string
  uploadoverwifionly: string
  userPhotoUrl: string
  isExternalAuth: boolean
  downloadOverWiFiOnly: boolean
  requestStatus: string
  playerTeams: string
  playerTeamList: PlayerTeamsModel[]
  session: CurrentLoginInfoModel
}

export const PlayerSettings: React.FunctionComponent<PlayerSettingsProps> = props => {
  const userService = new UserService()
  const tenantService = new TenantService()
  const convertHeightToFeetInches = (height: number): string => {
    if (!height) {
      return null
    }
    const feet = Math.floor(height / 12)
    const inche = height % 12

    return feet + "'" + inche + '"'
  }

  const usermodel = new UserModel()
  usermodel.name = ""
  usermodel.surname = ""
  usermodel.fullName = ""
  usermodel.emailAddress = ""
  usermodel.height = 0
  usermodel.weight = 0
  usermodel.downloadOverWiFiOnly = false
  usermodel.isRightHanded = true
  usermodel.userPhotoUrl = ""

  const [state, setState] = React.useState<State>({
    userid: 0,
    loading: true,
    showErrorPanel: false,
    infoMessage: "",
    loggedUser: props.route.params.reloaduser ? props.route.params.reloaduser : usermodel,
    height: "",
    weight: "",
    age: "",
    birthdate: "",
    isRightHanded: true,
    handedness: "Right",
    tenantid: 0,
    teamName: "",
    city: "",
    country: "",
    uploadoverwifionly: "",
    userPhotoUrl: "",
    isExternalAuth: false,
    downloadOverWiFiOnly: true,
    requestStatus: "",
    playerTeams: "",
    playerTeamList: [],
    session: null,
  })

  function goBack() {
    props.navigation.replace("dashboard", {
      selectedTab: "Overview",
      user: props.route.params.reloaduser ? props.route.params.reloaduser : state.loggedUser,
      session: state.session,
    })
  }
  const getLoggedInUser = async (): Promise<void> => {
    setState(s => ({
      ...s,
      loading: true,
    }))
    const userDetails = await AsyncStorage.loadString("UserDetails")
    await AsyncStorage.loadString("uploadoverwifionly").then(res => {
      state.uploadoverwifionly = res != null ? res : "true"
    })
    const localUser = JSON.parse(userDetails) as CurrentLoginInfoModel
    state.isExternalAuth = localUser.user.isExternalAuth
    if (userDetails) {
      setState(s => ({
        ...s,
        loading: true,
        userid: localUser.user.id,
        teamName: localUser.tenant.name,
        tenantid: localUser.tenant.id,
        loggedUser: props.route.params.reloaduser ? props.route.params.reloaduser : usermodel,
        session: localUser,
        isExternalAuth: localUser.user.isExternalAuth
      }))

      //Get player information by playerid(userid)
      await userService.getUser(localUser.user.id).then(async result => {
        const playerdetail = result.userResponse
        //Get Team names for this player
        await tenantService.getTeamsByPlayerId(localUser.user.id).then(res => {
          let teams = res.userResponse.filter(
            x => x.team.id !== localUser.tenant.id,
          ) as PlayerTeamsModel[]
          let teamNames = teams.map(x => x.team.name).join("\n")
          setState(s => ({
            ...s,
            loggedUser: playerdetail,
            loading: false,
            height:
              +playerdetail.height !== 0 ? convertHeightToFeetInches(playerdetail.height) : "",
            weight: +playerdetail.weight !== 0 ? playerdetail.weight.toString() : "",
            age: playerdetail.birthDate !== null ? playerdetail.age.toString() : "",
            birthdate:
              playerdetail.birthDate !== null &&
              playerdetail.birthDate !== undefined &&
              playerdetail.birthDate !== ""
                ? dateToDateString(playerdetail.birthDate).toString()
                : "",
            isRightHanded: playerdetail.isRightHanded,
            handedness: setHandedness(playerdetail.isRightHanded),
            userPhotoUrl: playerdetail.userPhotoUrl,
            authenticationSource: localUser.user.isExternalAuth,
            downloadOverWiFiOnly: playerdetail.downloadOverWiFiOnly,
            requestStatus: playerdetail.userLinkStatusCode,
            playerTeams: teamNames,
            playerTeamList: teams,
          }))
        })
      })
    }
  }
  //This is to reload control after update.
  if (props.route.params.reloaduser && props.route.params.reloaduser != "") {
    getLoggedInUser()
    props.route.params.reloaduser = ""
  }
  const dateToDateString = (date: Date): string => {
    const userBirthDate = new Date(date)
    return moment(userBirthDate).format("DD-MM-YYYY")
  }
  function setHandedness(value: boolean) {
    return value ? translate("playersettings.right") : translate("playersettings.left")
  }
  function checkIcon() {
    return <Text tx="playersettings.change" style={styles.SETTING_LISTITEM_TITLE_BOLD} />
  }
  function checkTeamIcon() {
    if (state.playerTeamList && state.playerTeamList.length > 0) {
      return <Text tx="playersettings.manage" style={styles.SETTING_LISTITEM_TITLE_BOLD} />
    } else {
      return <Text tx="playersettings.change" style={styles.SETTING_LISTITEM_TITLE_BOLD} />
    }
  }
  function logoutIcon() {
    return <Image source={require("../../../assets/_Icons/icon-account-log-out.png")} />
  }
  function wifiIcon() {
    return (
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={state.uploadoverwifionly ? "#cccccc" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={!!(state.uploadoverwifionly && state.uploadoverwifionly === "true")}
      />
    )
  }
  const [isEnabled, setIsEnabled] = useState(false)

  const toggleSwitch = async () => {
    await AsyncStorage.saveString("uploadoverwifionly", isEnabled.toString()).then(res => {
      state.uploadoverwifionly = isEnabled.toString()
      state.downloadOverWiFiOnly = isEnabled
      savePlayer()
      setIsEnabled(previousState => !previousState)
    })
  }
  const savePlayer = async () => {
    if (state.loggedUser) {
      setState(s => ({
        ...s,
        loading: true,
      }))
      const user = state.loggedUser as UserModel
      const userToupdate = {
        id: user.id,
        userName: user.emailAddress,
        emailAddress: user.emailAddress,
        name: user.name,
        surname: user.surname,
        isRightHanded: user.isRightHanded,
        weight: +user.weight,
        height: +user.height,
        isAccountSetup: true,
        birthDate: user.birthDate,
        isActive: true,
        userPhotoUrl: user.userPhotoUrl,
        downloadOverWiFiOnly: user.downloadOverWiFiOnly,
      } as UserModel

      userToupdate.downloadOverWiFiOnly = state.downloadOverWiFiOnly
      await userService.updateUser(userToupdate).then(response => {
        if (response.kind === "NETWORK_ISSUE") {
          setState(s => ({
            ...s,
            loading: false,
            showErrorPanel: true,
            infoMessage: "Network not available.",
          }))
        } else if (response.failureResponse != null) {
          setState(s => ({
            ...s,
            loading: false,
            showErrorPanel: true,
            infoMessage: response.failureResponse.message,
          }))
        } else {
          setState(s => ({
            ...s,
            loading: false,
          }))
        }
      })
    }
  }
  function leftElement(txt) {
    return <Text style={{ ...styles.SETTING_LISTITEM_TITLE_BOLD, textAlign: "left" }} >{txt}</Text>
  }
  const keyExtractor = (item, index) => index.toString()

  function leftElementTeam(txt) {
    return (
      <View
        style={[
          styles.ALIGNLEFT,
          {
            paddingVertical: 10,
            paddingHorizontal: 0,
            flexDirection: "column",
            marginLeft: 0,
            width: "60%",
          },
        ]}
      >
        <Text
          tx={txt}
          style={{
            ...styles.SETTING_LISTITEM_TITLE_BOLD,
            textAlign: "left",
            textAlignVertical: "center",
          }}
        />
        <FlatList keyExtractor={keyExtractor} data={state.playerTeamList} renderItem={renderItem} />
      </View>
    )
  }

  function leftPendingElement(status: string): React.ReactElement {
    if (status && (status === "PL_PND" || status === "PND")) {
      return (
        <View style={{ flexDirection: "row", height: 20 }}>
          <FontAwesome5 name="exclamation-circle" size={18} color="yellow" />
        </View>
      )
    } else {
      return <Text></Text>
    }
  }
  function rightPendingElement(teamname) {
    return (
      <Text
        style={{
          fontWeight: "bold",
          fontFamily: "Roboto",
          marginLeft: 5,
          marginRight: 40,
          textAlign: "left",
          width: "80%",
          height: 20,
        }}
      >
        {teamname}
      </Text>
    )
  }

  const renderItem = ({ item }) => {
    return (
      <ListItem
        key={item.teamId}
        leftElement={item ? leftPendingElement(item.linkStatus) : ""}
        titleStyle={[
          styles.SETTING_LISTITEM_TITLE,
          { color: color.palette.white, textAlign: "left" },
        ]}
        subtitleStyle={styles.SETTING_LISTITEM_TITLE}
        bottomDivider={false}
        rightElement={rightPendingElement(item.team.name)}
        containerStyle={[styles.LISTITEM_CONTAINER, { borderBottomWidth: 0, height: 20 }]}
      />
    )
  }

  function pendingElement(): React.ReactElement {
    return (
      <View
        style={{
          paddingVertical: 5,
          paddingHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <FontAwesome name="exclamation-circle" size={18} color="yellow" />
        <Text
          tx="playersettings.pending"
          style={{ ...styles.SETTING_LISTITEM_TITLE_BOLD, textAlign: "left", marginLeft: 10 }}
        />
      </View>
    )
  }

  function goToPlayerDetail(controlName: string, controlValue: string) {
    props.navigation.navigate("playersettingsdetail", {
      user: state.loggedUser,
      controlName: controlName,
      controlValue: controlValue,
    })
  }

  function goToPlayerTeamDetail(controlName: string, controlValue: string) {
    props.navigation.navigate("playerteamsettingsdetail", {
      user: state.loggedUser,
      playerTeamList: state.playerTeamList,
      playerId: state.loggedUser.id,
      playerEmail: state.loggedUser.emailAddress,
    })
  }

  function logout() {
    const resetStorageService = new ResetStorageService()
    resetStorageService.resetStorageAndLocalDatabase()
    props.navigation.navigate("welcome")
  }

  const { height } = Dimensions.get("window")

  React.useMemo(() => {
    getLoggedInUser()
  }, [])

  return (
    <ScrollView
      style={{
        height: height - 300,
        backgroundColor: "#323943",
      }}
    >
      <Screen style={styles.ROOT}>
        <Loader loading={state.loading} />
        <Header
          style={styles.SCREENHEADER}
          leftIcon="close"
          showBackground={true}
          showLogo={true}
          onLeftPress={goBack}
        />
        {state.showErrorPanel && (
          <View style={styles.ERROR_PANEL}>
            <Feather name="info" style={styles.INFOICON} size={20} />
            <Text style={styles.ERROR_PANEL_TEXT}>{state.infoMessage}</Text>
          </View>
        )}
        <View style={[styles.ROOT]}>
          <Text
            style={{ ...styles.SETTINGHEADERSTYLE, textAlign: "left", backgroundColor: "#000000" }}
            tx="playersettings.account"
          ></Text>
          <ListItem
            key={1}
            leftElement={leftElement("playersettings.name")}
            title={state.loggedUser.name + " " + state.loggedUser.surname}
            titleStyle={styles.SETTING_LISTITEM_TITLE}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE}
            bottomDivider={true}
            chevron={{ size: 40 }}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={checkIcon()}
            onPress={() =>
              goToPlayerDetail(
                translate("playersettings.nameLabel"),
                state.loggedUser.name + " " + state.loggedUser.surname,
              )
            }
          />

          <ListItem
            key={2}
            leftElement={leftElement(translate("playersettings.email"))}
            title={state.loggedUser.emailAddress}
            titleStyle={styles.SETTING_LISTITEM_TITLE}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE}
            bottomDivider={true}
            chevron={{ size: 40 }}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={checkIcon()}
            onPress={() =>
              goToPlayerDetail(
                translate("playersettings.emailLabel"),
                state.loggedUser.emailAddress,
              )
            }
          />
           {!state.isExternalAuth && (
            <ListItem
              key={3}
              title={leftElement(translate("playersettings.password"))}
              titleStyle={styles.SETTING_LISTITEM_TITLE_BOLD}
              subtitleStyle={styles.SETTING_LISTITEM_TITLE_BOLD}
              bottomDivider={true}
              chevron={{ size: 40 }}
              containerStyle={styles.SETTING_LISTITEM_VIEW}
              rightIcon={checkIcon()}
              onPress={() =>
                goToPlayerDetail(
                  translate("playersettings.passwordLabel"),
                  state.loggedUser.emailAddress,
                )
              }
            />
          )} 

          <Text
            style={{ ...styles.SETTINGHEADERSTYLE, backgroundColor: "#000000" }}
            tx="playersettings.personaldetails"
          ></Text>
          <ListItem
            key={4}
            leftElement={leftElementTeam("playersettings.team")}
            title={state.playerTeamList && state.playerTeamList.length > 0 ? "" : state.playerTeams}
            titleStyle={[styles.SETTING_LISTITEM_TITLE, { paddingLeft: -10 }]}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE}
            bottomDivider={true}
            chevron={{ size: 40 }}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={checkTeamIcon()}
            onPress={() =>
              goToPlayerTeamDetail(translate("playersettings.teamLabel"), state.loggedUser.name)
            }
          />
          <ListItem
            key={5}
            leftElement={leftElement(translate("playersettings.handedness"))}
            title={state.handedness}
            titleStyle={styles.SETTING_LISTITEM_TITLE}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE}
            bottomDivider={true}
            chevron={{ size: 40 }}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={checkIcon()}
            onPress={() =>
              goToPlayerDetail(translate("playersettings.handednessLabel"), state.handedness)
            }
          />
          <ListItem
            key={6}
            leftElement={leftElement(translate("playersettings.age"))}
            title={state.age}
            titleStyle={styles.SETTING_LISTITEM_TITLE}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE}
            bottomDivider={true}
            chevron={{ size: 40 }}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={checkIcon()}
            onPress={() => goToPlayerDetail(translate("playersettings.ageLabel"), state.age)}
          />
          <ListItem
            key={7}
            leftElement={leftElement(translate("playersettings.birthdate"))}
            title={state.birthdate}
            titleStyle={styles.SETTING_LISTITEM_TITLE}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE}
            bottomDivider={true}
            chevron={{ size: 40 }}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={checkIcon()}
            onPress={() =>
              goToPlayerDetail(
                translate("playersettings.birthdateLabel"),
                state.birthdate === undefined || state.birthdate === null || state.birthdate === ""
                  ? moment(new Date()).format("DD-MM-YYYY")
                  : state.birthdate,
              )
            }
          />
          <ListItem
            key={8}
            leftElement={leftElement(translate("playersettings.height"))}
            title={state.height}
            titleStyle={styles.SETTING_LISTITEM_TITLE}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE}
            bottomDivider={true}
            chevron={{ size: 40 }}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={checkIcon()}
            onPress={() => goToPlayerDetail(translate("playersettings.heightLabel"), state.height)}
          />
          <ListItem
            key={9}
            leftElement={leftElement(translate("playersettings.weight"))}
            title={state.weight + " lbs"}
            titleStyle={styles.SETTING_LISTITEM_TITLE}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE}
            bottomDivider={true}
            chevron={{ size: 40 }}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={checkIcon()}
            onPress={() => goToPlayerDetail(translate("playersettings.weightLabel"), state.weight)}
          />
          <ListItem
            key={10}
            title={leftElement(translate("playersettings.photo"))}
            titleStyle={styles.SETTING_LISTITEM_TITLE_BOLD}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE_BOLD}
            bottomDivider={true}
            chevron={{ size: 40 }}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={checkIcon()}
            onPress={() =>
              goToPlayerDetail(translate("playersettings.photoLabel"), state.userPhotoUrl)
            }
          />
          <Text style={{ ...styles.SETTINGHEADERSTYLE, backgroundColor: "#000000" }}></Text>
          <ListItem
            key={11}
            title={leftElement(translate("playersettings.uploaddownloadoverwifi"))}
            titleStyle={styles.SETTING_LISTITEM_TITLE_BOLD}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE_BOLD}
            bottomDivider={false}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={wifiIcon()}
            // onPress={() => goToPlayerDetail(item.id)}
          />
          <ListItem
            key={12}
            title={leftElement(translate("playersettings.logout"))}
            titleStyle={styles.SETTING_LISTITEM_TITLE_BOLD}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE_BOLD}
            bottomDivider={false}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            leftIcon={logoutIcon()}
            onPress={() => logout()}
          />
          {/* <Text style={{ ...styles.SETTINGHEADERSTYLE, backgroundColor: "#000000" }}></Text>
          <Text style={{ ...styles.SETTINGHEADERSTYLE, backgroundColor: "#000000" }}></Text> */}
        </View>
      </Screen>
    </ScrollView>
  )
}
