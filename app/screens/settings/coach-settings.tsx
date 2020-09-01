import { View, Image, ScrollView, Switch, Dimensions } from "react-native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import * as styles from "../../theme/appStyle"
import Loader from "../../components/spinner/loader"
import { Feather } from "@expo/vector-icons"
import React, { useState } from "react"
import { Text, Screen, Header } from "../../components"
import { ListItem } from "react-native-elements"
import { CurrentLoginInfoModel } from "../../models/data/session-model"
import { UserModel } from "../../models/data/user-model"
import * as AsyncStorage from "../../utils/storage/storage"
import UserService from "../../middleware/services/user-service"
import { translate } from "../../i18n/"
import TenantService from "../../middleware/services/tenant-service"
import CommonService from "../../middleware/services/common-service"
import { CommonValueModel } from "../../models/data/common-model"
import ResetStorageService from "../../middleware/services/reset-storage-service"

export interface CoachSettingsProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  userid: number
  showErrorPanel: boolean
  infoMessage: string
  loggedUser: UserModel
  tenant: any
  tenantid: number
  teamName: string
  city: string
  country: string
  uploadoverwifionly: string
  teamLogoUrl: string
  isExternalAuth: boolean
  downloadOverWiFiOnly: boolean
  session: CurrentLoginInfoModel
}

export const CoachSettings: React.FunctionComponent<CoachSettingsProps> = props => {
  const userService = new UserService()
  const tenantService = new TenantService(props)
  const commonService = new CommonService(props)

  const [] = React.useState<CommonValueModel[]>([])
  let userDetails = props.route.params.session.user as UserModel
  const userSessionDetails = props.route.params.session as CurrentLoginInfoModel

  const [state, setState] = React.useState<State>({
    userid: 0,
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    loggedUser: props.route.params.reloaduser ? props.route.params.reloaduser : userDetails,
    tenant: props.route.params.reloadtenant ? props.route.params.reloadtenant : null,
    tenantid: 0,
    teamName: "",
    city: "",
    country: "",
    uploadoverwifionly: "",
    teamLogoUrl: "",
    isExternalAuth: userSessionDetails.user.isExternalAuth,
    downloadOverWiFiOnly: true,
    session: userSessionDetails,
  })

  async function goBack() {
    props.navigation.replace("dashboard", {
      selectedTab: "Overview",
      user: props.route.params.reloaduser ? props.route.params.reloaduser : state.loggedUser,
      session: userSessionDetails,
    })
  }
  const getLoggedInUser = async (): Promise<void> => {
    setState(s => ({
      ...s,
      loading: true,
    }))

    await AsyncStorage.loadString("uploadoverwifionly").then(res => {
      state.uploadoverwifionly = res != null ? res : "true"
    })
    if (userDetails) {
      setState(s => ({
        ...s,
        loading: true,
        userid: userDetails.id,
        teamName: userSessionDetails.tenant.name,
        tenantid: userSessionDetails.tenant.id,
        loggedUser: userDetails,
      }))
      await tenantService.getTenant(props.route.params.session.tenant.id).then(async result => {
        const tenant = result.tenantResponse
        if (tenant != null) {
          //Set country
          let selectedCountry = ""
          await commonService.getCommonValueByTypeCode("CTR").then(country => {
            const countries = country.CommonValueByTypeCodeResponse

            if (countries && countries != null) {
              countries.map(key => {
                if (tenant.countryId == Number(key.id)) {
                  selectedCountry = key.description
                }
              })
            }
            setState(s => ({
              ...s,
              userid: userDetails.id,
              loading: false,
              showErrorPanel: false,
              infoMessage: "",
              loggedUser: userDetails,
              tenant: tenant,
              tenantid: tenant.id,
              teamName: tenant.name,
              city: tenant.city,
              country: selectedCountry,
              uploadoverwifionly: state.uploadoverwifionly,
              teamLogoUrl: tenant.teamLogoUrl,
              countryId: tenant.countryId,
              downloadOverWiFiOnly: userDetails.downloadOverWiFiOnly,
            }))
          })
        }
      })
    }
  }
  //This is to reload this control after details changes
  if (props.route.params.reloaduser && props.route.params.reloaduser != "") {
    userDetails = props.route.params.reloaduser
    getLoggedInUser()
    props.route.params.reloaduser = ""
    props.route.params.reloadtenant = ""
  }
  if (props.route.params.reloadtenant && props.route.params.reloadtenant != "") {
    getLoggedInUser()
    props.route.params.reloadtenant = ""
  }

  function checkIcon() {
    return <Text tx="coachsettings.change" style={styles.SETTING_LISTITEM_TITLE_BOLD} />
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

  function goToPlayerDetail(controlName, controlValue) {
    props.navigation.navigate("coachsettingsdetail", {
      user: state.loggedUser,
      tenant: state.tenant,
      controlName: controlName,
      controlValue: controlValue,
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
        ></Header>
        {state.showErrorPanel && (
          <View style={styles.ERROR_PANEL}>
            <Feather name="info" style={styles.INFOICON} size={20} />
            <Text style={styles.ERROR_PANEL_TEXT}>{state.infoMessage}</Text>
          </View>
        )}
        <View style={[styles.ROOT]}>
          <Text
            style={{ ...styles.SETTINGHEADERSTYLE, textAlign: "left", backgroundColor: "#000000" }}
            tx="coachsettings.account"
          ></Text>
          <ListItem
            key={1}
            leftElement={leftElement(translate("coachsettings.name"))}
            title={state.loggedUser.name + " " + state.loggedUser.surname}
            titleStyle={styles.SETTING_LISTITEM_TITLE}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE}
            bottomDivider={true}
            chevron={{ size: 40 }}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={checkIcon()}
            onPress={() =>
              goToPlayerDetail(
                translate("coachsettings.nameLabel"),
                state.loggedUser.name + " " + state.loggedUser.surname,
              )
            }
          />
          <ListItem
            key={2}
            leftElement={leftElement(translate("coachsettings.email"))}
            title={state.loggedUser.emailAddress}
            titleStyle={styles.SETTING_LISTITEM_TITLE}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE}
            bottomDivider={true}
            chevron={{ size: 40 }}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={checkIcon()}
            onPress={() =>
              goToPlayerDetail(translate("coachsettings.emailLabel"), state.loggedUser.emailAddress)
            }
          />
          {state.isExternalAuth !== true && (
            <ListItem
              key={3}
              title={leftElement(translate("coachsettings.password"))}
              titleStyle={styles.SETTING_LISTITEM_TITLE_BOLD}
              subtitleStyle={styles.SETTING_LISTITEM_TITLE_BOLD}
              bottomDivider={true}
              chevron={{ size: 40 }}
              containerStyle={styles.SETTING_LISTITEM_VIEW}
              rightIcon={checkIcon()}
              onPress={() =>
                goToPlayerDetail(
                  translate("coachsettings.passwordLabel"),
                  state.loggedUser.emailAddress,
                )
              }
            />
          )}

          <Text
            style={{ ...styles.SETTINGHEADERSTYLE, backgroundColor: "#000000" }}
            tx="coachsettings.team1"
          ></Text>
          <ListItem
            key={4}
            leftElement={leftElement(translate("coachsettings.team"))}
            title={state.teamName}
            titleStyle={styles.SETTING_LISTITEM_TITLE}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE}
            bottomDivider={true}
            chevron={{ size: 40 }}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={checkIcon()}
            onPress={() => goToPlayerDetail(translate("coachsettings.teamLabel"), state.teamName)}
          />
          <ListItem
            key={5}
            leftElement={leftElement(translate("coachsettings.city"))}
            title={state.city}
            titleStyle={styles.SETTING_LISTITEM_TITLE}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE}
            bottomDivider={true}
            chevron={{ size: 40 }}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={checkIcon()}
            onPress={() => goToPlayerDetail(translate("coachsettings.cityLabel"), state.city)}
          />
          <ListItem
            key={6}
            leftElement={leftElement(translate("coachsettings.country"))}
            title={state.country}
            titleStyle={styles.SETTING_LISTITEM_TITLE}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE}
            bottomDivider={true}
            chevron={{ size: 40 }}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={checkIcon()}
            onPress={() => goToPlayerDetail(translate("coachsettings.countryLabel"), state.country)}
          />
          <ListItem
            key={7}
            title={leftElement(translate("coachsettings.logo"))}
            titleStyle={styles.SETTING_LISTITEM_TITLE_BOLD}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE_BOLD}
            bottomDivider={true}
            chevron={{ size: 40 }}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={checkIcon()}
            onPress={() =>
              goToPlayerDetail(translate("coachsettings.logoLabel"), state.teamLogoUrl)
            }
          />
          <Text style={{ ...styles.SETTINGHEADERSTYLE, backgroundColor: "#000000" }}></Text>
          <ListItem
            key={8}
            title={leftElement(translate("coachsettings.uploaddownloadoverwifi"))}
            titleStyle={styles.SETTING_LISTITEM_TITLE_BOLD}
            subtitleStyle={styles.SETTING_LISTITEM_TITLE_BOLD}
            bottomDivider={false}
            containerStyle={styles.SETTING_LISTITEM_VIEW}
            rightIcon={wifiIcon()}
            // onPress={() => goToPlayerDetail(item.id)}
          />
          <ListItem
            key={9}
            title={leftElement(translate("coachsettings.logout"))}
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
