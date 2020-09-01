import {
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
  Picker,
} from "react-native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import * as styles from "../../theme/appStyle"
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons"
import React from "react"
import { Text, Screen, Header, TextField } from "../../components"
import { spacing, color } from "../../theme"
import { UserModel, UpdatePasswordModel } from "../../models/data/user-model"
import UserService from "../../middleware/services/user-service"
import * as ImagePicker from "expo-image-picker"
import Constants from "expo-constants"
import Loader from "../../components/spinner/loader"
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types"
import * as EmailValidator from "email-validator"
import RegisterService from "../../middleware/services/register-service"
import TenantService from "../../middleware/services/tenant-service"
import CommonService from "../../middleware/services/common-service"
import { CommonValueModel } from "../../models/data/common-model"
import BlobService from "../../middleware/services/blob-service"
import { TextInput as TextInputPaper } from "react-native-paper"
import { translate } from "../../i18n"

export interface CoachSettingsDetailProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  userid: number
  controlName: string
  controlValue: string
  showErrorPanel: boolean
  infoMessage: string
  user: UserModel
  tenant: any
  password: string
  confirmPassword: string
  teamLogoUrl: string
  originalEmail: string
  teamNameError: boolean
  coachNameError: boolean
  cityError: boolean
  countryError: boolean
  teamError: boolean
}
export interface PlayerLogoData {
  logo: ImageInfo
  country: string
}

export const CoachSettingsDetail: React.FunctionComponent<CoachSettingsDetailProps> = props => {
  const blobService = new BlobService()
  const tenantService = new TenantService(props)
  const commonService = new CommonService(props)

  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])
  const userService = new UserService()
  const registerService = new RegisterService(props)
  const [countries, setCountries] = React.useState<CommonValueModel[]>([])

  React.useEffect(() => {
    ;(async () => {
      if (Constants.platform.ios) {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync()
        if (status !== "granted") {
          Alert.alert("Sorry, we need camera roll permissions to make this work!")
        }
      }
      await commonService.getCommonValueByTypeCode("CTR").then(country => {
        setCountries(country.CommonValueByTypeCodeResponse)
      })
    })()
  }, [])
  const [state, setState] = React.useState<State>({
    userid: 0,
    user: props.route.params.user,
    tenant: props.route.params.tenant,
    loading: false,
    controlName: props.route.params.controlName,
    controlValue: props.route.params.controlValue,
    showErrorPanel: false,
    infoMessage: "",
    password: "",
    confirmPassword: "",
    teamLogoUrl: "",
    originalEmail: props.route.params.user.emailAddress,
    teamNameError: false,
    coachNameError: false,
    cityError: false,
    countryError: false,
    teamError: false,
  })
  const [data, setData] = React.useState<PlayerLogoData>({
    logo: props.route.params.logo,
    country: state.tenant.countryId,
  })
  const { height } = Dimensions.get("window")
  const [icon, setIcon] = React.useState("md-eye-off")
  const [confirmIcon, setConfirmIcon] = React.useState("md-eye-off")
  const [hidePassword, setHidePassword] = React.useState(true)
  const [hideConfirmPassword, setConfirmHidePassword] = React.useState(true)

  const _changePasswordIcon = () => {
    icon !== "md-eye"
      ? (setIcon("md-eye"), setHidePassword(false))
      : (setIcon("md-eye-off"), setHidePassword(true))
  }

  const _changeConfirmPasswordIcon = () => {
    confirmIcon !== "md-eye"
      ? (setConfirmIcon("md-eye"), setConfirmHidePassword(false))
      : (setConfirmIcon("md-eye-off"), setConfirmHidePassword(true))
  }
  const getFirstName = (fullName: string): string => {
    const names = fullName.split(" ")
    return names[0]
  }

  const getSurName = (fullName: string): string => {
    const names = fullName.split(" ")
    if (names.length >= 1) {
      var lastName = ""
      for (var i = 1; i < names.length; i++) {
        if (i > 1) {
          lastName += " "
        }
        lastName += names[i]
      }
      return lastName
    } else {
      return " "
    }
  }

  const pickImage = async () => {
    let result: any
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.cancelled) {
      setData(s => ({ ...s, logo: result }))
      data.logo = result
      props.route.params.logo = result
    }
  }

  const saveTeam = async () => {
    if (state.user) {
      setState(s => ({
        ...s,
        loading: true,
      }))
      const user = state.user as UserModel

      let newEmailAddress = state.user.emailAddress
      if (state.controlName === translate("coachsettingsdetail.email")) {
        newEmailAddress = state.controlValue
      }
      const originalEmailAddress = state.originalEmail
      const userToupdate = {
        id: user.id,
        userName: user.emailAddress,
        emailAddress: user.emailAddress,
        name: user.name,
        surname: user.surname,
        fullName: user.fullName,
        isAccountSetup: true,
        isActive: true,
      } as UserModel
      await tenantService.getTenant(state.tenant.id).then(async result => {
        const tenantToupdate = result.tenantResponse
        if (tenantToupdate != null) {
          tenantToupdate.isAccountSetup = true
        }
        let response = null
        if (
          state.controlName === translate("coachsettingsdetail.email") &&
          newEmailAddress != originalEmailAddress
        ) {
          //Send email to user to verify.
          if (!!state.user.emailAddress) {
            const userOrEmail = state.controlValue.trim()
            const receiverName = state.user.name.trim() + " " + state.user.surname.trim()
            if (EmailValidator.validate(userOrEmail)) {
              setState(s => ({ ...s, loading: true }))

              registerService
                .confirmEmailAddress(userOrEmail, receiverName, state.user.id)
                .then(function() {
                  setState(s => ({ ...s, loading: false }))
                  props.navigation.navigate("emailsent", {
                    isForgotPassword: true,
                    userOrEmail: null,
                    password: null,
                  })
                })
            } else {
              setState(s => ({
                ...s,
                loading: false,
                showErrorPanel: true,
                infoMessage: translate("coachsettingsdetail.invalidEmail"),
              }))
            }
          } else {
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: translate("coachsettingsdetail.emailRequired"),
            }))
          }
        } else if (state.controlName === translate("coachsettingsdetail.password")) {
          if (!!state.password && !!state.confirmPassword) {
            if (state.password === state.confirmPassword) {
              const updatePasswordObj = {
                newPassword: state.password,
                userId: user.id,
              } as UpdatePasswordModel
              setState(s => ({ ...s, loading: true, showErrorPanel: false, infoMessage: "" }))
              await userService.updatePassword(updatePasswordObj).then(uploadPasswordResult => {
                if (uploadPasswordResult.failureResponse != null) {
                  setState(s => ({
                    ...s,
                    loading: false,
                    showErrorPanel: true,
                    infoMessage: uploadPasswordResult.failureResponse.message,
                  }))
                } else {
                  setState(s => ({ ...s, loading: false, showErrorPanel: false, infoMessage: "" }))
                  props.navigation.navigate("coachsettings", { reloaduser: response.userResponse })
                }
              })
            } else {
              setState(s => ({
                ...s,
                loading: false,
                showErrorPanel: true,
                infoMessage: translate("coachsettingsdetail.passwordDoesNotMatch"),
              }))
            }
          } else {
            if (state.password == null || state.password == "") {
              setState(s => ({
                ...s,
                loading: false,
                showErrorPanel: true,
                infoMessage: translate("coachsettingsdetail.passwordRequired"),
              }))
            } else if (state.confirmPassword == null || state.confirmPassword == "") {
              setState(s => ({
                ...s,
                loading: false,
                showErrorPanel: true,
                infoMessage: translate("coachsettingsdetail.confirmPasswordRequired"),
              }))
            }
          }
        } else if (state.controlName === translate("coachsettingsdetail.name")) {
          userToupdate.name = getFirstName(state.controlValue)
          userToupdate.surname = getSurName(state.controlValue)
          if (userToupdate.name.trim() !== "") {
            userToupdate.fullName = userToupdate.name + " " + userToupdate.surname
            response = await userService.updateUser(userToupdate)
            if (response.kind === "NETWORK_ISSUE") {
              setState(s => ({
                ...s,
                loading: false,
                showErrorPanel: true,
                infoMessage: translate("coachsettingsdetail.noNetwork"),
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
              props.navigation.navigate("coachsettings", { reloaduser: response.userResponse })
            }
          } else {
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: translate("coachsettingsdetail.invalidName"),
            }))
          }
        } else if (state.controlName === translate("coachsettingsdetail.logo")) {
          await blobService.uploadTeamLogo(data.logo).then(uploadFileResult => {
            tenantToupdate.teamLogoUrl = uploadFileResult.blobResponse.fileUri
            saveTenant(tenantToupdate, userToupdate)
          })
        } else if (state.controlName == translate("coachsettingsdetail.team")) {
          tenantToupdate.name = state.controlValue
          if (tenantToupdate.name.trim() == "") {
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: translate("coachsettingsdetail.teamRequired"),
            }))
          } else {
            saveTenant(tenantToupdate, userToupdate)
          }
        } else if (state.controlName == translate("coachsettingsdetail.city")) {
          tenantToupdate.city = state.controlValue
          if (tenantToupdate.city.trim() == "") {
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: translate("coachsettingsdetail.cityRequired"),
            }))
          } else {
            saveTenant(tenantToupdate, userToupdate)
          }
        } else if (state.controlName == translate("coachsettingsdetail.country")) {
          tenantToupdate.countryId = Number(data.country)
          if (tenantToupdate.countryId <= 0) {
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: translate("coachsettingsdetail.countryRequired"),
            }))
          } else {
            saveTenant(tenantToupdate, userToupdate)
          }
        }
      })
    }
  }

  const saveTenant = async (tenantToupdate, userToupdate) => {
    tenantToupdate.country = null
    await tenantService.updateTenant(tenantToupdate).then(async result => {
      if (result.kind === "NETWORK_ISSUE") {
        setState(s => ({
          ...s,
          loading: false,
          showErrorPanel: true,
          infoMessage: translate("coachsettingsdetail.noNetwork"),
        }))
      } else if (result.failureResponse != null) {
        setState(s => ({
          ...s,
          loading: false,
          showErrorPanel: true,
          infoMessage: result.failureResponse.message,
        }))
      } else {
        setState(s => ({
          ...s,
          loading: false,
        }))
        const response = await userService.updateUser(userToupdate)
        if (response.kind === "NETWORK_ISSUE") {
          setState(s => ({
            ...s,
            loading: false,
            showErrorPanel: true,
            infoMessage: translate("coachsettingsdetail.noNetwork"),
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
          props.navigation.navigate("coachsettings", { reloaduser: response.userResponse })
        }
      }
    })
  }

  React.useMemo(() => {}, [])

  return (
    <Screen style={styles.ROOT}>
      <ScrollView
        style={{
          height: height - 300,
          backgroundColor: "#323943",
        }}
      >
        <Loader loading={state.loading} />
        <Header
          headerText={state.controlName}
          style={{ ...styles.LISTITEM_CONTAINER, ...styles.SETTING_HEADER_TITLE_BOLD }}
          leftIcon="back"
          onLeftPress={goBack}
        />
        {state.showErrorPanel && (
          <View style={styles.ERROR_PANEL}>
            <Feather name="info" style={styles.INFOICON} size={20} />
            <Text style={styles.ERROR_PANEL_TEXT}>{state.infoMessage}</Text>
          </View>
        )}
        <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[4] }]}>
          {/* Name section starts */}
          {state.controlName === translate("coachsettingsdetail.name") && (
            <TextInputPaper
              label={state.controlName}
              value={state.controlValue}
              onChangeText={text => setState(s => ({ ...s, controlValue: text }))}
              style={styles.TEXTBOXSTYLEPAPER}
              theme={styles.TEXTBOXSTYLEPAPER_THEME}
              underlineColor="white"
            />
          )}
          {/* Name section starts */}
          {/* Email section starts */}
          {state.controlName == translate("coachsettingsdetail.email") && (
            <TextInputPaper
              label={state.controlName}
              value={state.controlValue}
              onChangeText={text => setState(s => ({ ...s, controlValue: text }))}
              style={styles.TEXTBOXSTYLEPAPER}
              theme={styles.TEXTBOXSTYLEPAPER_THEME}
              underlineColor="white"
            />
          )}
          {/* Email section ends */}
          {/* Password section starts */}
          {state.controlName == translate("coachsettingsdetail.password") && (
            <View style={[styles.TEXTBOX_CONTAINER, { marginTop: 0 }]}>
              <TextInput
                style={styles.TEXTBOX_CONTAINER}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder={state.controlName}
              />
              <View style={styles.PASSWORDCONTAINER}>
                <TextInput
                  style={styles.FEATHERINPUTSTYLE}
                  autoCorrect={false}
                  autoCapitalize="none"
                  secureTextEntry={hidePassword}
                  placeholder="Password"
                  onChangeText={text => setState(s => ({ ...s, password: text }))}
                  value={state.password}
                />
                <Ionicons
                  name={icon}
                  style={styles.EYEICON}
                  size={20}
                  onPress={() => _changePasswordIcon()}
                />
              </View>
              <View style={styles.PASSWORDCONTAINER}>
                <TextInput
                  style={styles.FEATHERINPUTSTYLE}
                  autoCorrect={false}
                  autoCapitalize="none"
                  secureTextEntry={hideConfirmPassword}
                  placeholder="Confirm Password"
                  onChangeText={text => setState(s => ({ ...s, confirmPassword: text }))}
                  value={state.confirmPassword}
                />
                <Ionicons
                  name={confirmIcon}
                  style={styles.EYEICON}
                  size={20}
                  onPress={() => _changeConfirmPasswordIcon()}
                />
              </View>
            </View>
          )}
          {/* Email section ends */}
          {/* Team section starts */}
          {state.controlName == translate("coachsettingsdetail.team") && (
            <View style={{ flexDirection: "row" }}>
              <TextInputPaper
                label={state.controlName}
                value={state.controlValue}
                onChangeText={text => setState(s => ({ ...s, controlValue: text }))}
                style={state.cityError ? styles.TEXTBOXSTYLEWITHERROR : styles.TEXTBOXSTYLEPAPER}
                theme={styles.TEXTBOXSTYLEPAPER_THEME}
                underlineColor="white"
              />
              {state.teamError && (
                <FontAwesome5
                  style={{ position: "relative", top: 30, right: 30 }}
                  name="exclamation-circle"
                  size={20}
                  color={color.palette.red}
                />
              )}
              {state.teamError && (
                <Text style={styles.ERROR_TEXT} tx="coachsettingsdetail.teamRequired"></Text>
              )}
            </View>
          )}
          {/* Team section ends */}
          {/* City section starts */}
          {state.controlName == translate("coachsettingsdetail.city") && (
            <View style={{ flexDirection: "row" }}>
              <TextInputPaper
                label={state.controlName}
                value={state.controlValue}
                onChangeText={text => setState(s => ({ ...s, controlValue: text }))}
                style={state.cityError ? styles.TEXTBOXSTYLEWITHERROR : styles.TEXTBOXSTYLEPAPER}
                theme={styles.TEXTBOXSTYLEPAPER_THEME}
                underlineColor="white"
              />
              {state.cityError && (
                <FontAwesome5
                  style={{ position: "relative", top: 30, right: 30 }}
                  name="exclamation-circle"
                  size={20}
                  color={color.palette.red}
                />
              )}
              {state.cityError && (
                <Text style={styles.ERROR_TEXT} tx="coachsettingsdetail.cityRequired"></Text>
              )}
            </View>
          )}
          {/* City section ends */}
          {/* Country section starts */}
          {state.controlName == translate("coachsettingsdetail.country") && (
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <Picker
                mode="dropdown"
                selectedValue={data.country}
                style={[styles.PICKER, { color: color.palette.white }]}
                itemStyle={styles.PICKER}
                onValueChange={itemValue => setData(s => ({ ...s, country: itemValue }))}
              >
                <Picker.Item label="Country" value="0" />
                {countries &&
                  countries != null &&
                  countries.map((key, index) => (
                    <Picker.Item
                      label={countries[index].description}
                      key={"picker" + countries[index].id}
                      value={countries[index].id}
                    />
                  ))}
              </Picker>
              {state.countryError && (
                <FontAwesome5
                  style={{ position: "relative", top: 30, right: 30 }}
                  name="exclamation-circle"
                  size={20}
                  color={color.palette.red}
                />
              )}
              {state.countryError && (
                <Text style={styles.ERROR_TEXT} tx="teamSetupScreen.countryRequired"></Text>
              )}
            </View>
          )}
          {/* Country section ends */}
          {/* Photo section starts */}
          {state.controlName == translate("coachsettingsdetail.logo") && (
            <TouchableOpacity
              style={[
                styles.IMAGE_PICKER,
                styles.JUSTIFYCENTER,
                styles.ALIGNCENTER,
                { marginTop: spacing[5], marginBottom: spacing[5] },
              ]}
              onPress={pickImage}
            >
              {(!data.logo || data.logo == null || data.logo.uri == "") && (
                <View style={[{ flexDirection: "row" }]}>
                  <FontAwesome5 name="plus" size={16} color="white" />
                  <Text
                    style={[styles.WHITEBUTTONTEXT, { marginRight: 10, marginLeft: 10 }]}
                    tx="coachsettingsdetail.addLogo"
                  />
                </View>
              )}
              {data.logo && data.logo.uri && data.logo.uri != "" && (
                <Image source={{ uri: data.logo.uri }} style={{ width: 200, height: 200 }} />
              )}
            </TouchableOpacity>
          )}
          {/* Photo section ends */}
          <TouchableOpacity
            style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE]}
            onPress={saveTeam}
          >
            <Text
              style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]}
              tx="coachsettingsdetail.save"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  )
}
