import {
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import * as styles from "../../theme/appStyle"
import { Feather, FontAwesome5, Ionicons, FontAwesome } from "@expo/vector-icons"
import React from "react"
import { Text, Screen, Header } from "../../components"
import { spacing } from "../../theme"
import { CheckBox } from "react-native-elements"
import moment from "moment"
import DateTimePicker, { AndroidEvent } from "@react-native-community/datetimepicker"
import { UserModel, UpdatePasswordModel } from "../../models/data/user-model"
import UserService from "../../middleware/services/user-service"
import * as ImagePicker from "expo-image-picker"
import Constants from "expo-constants"
import Loader from "../../components/spinner/loader"
import * as EmailValidator from "email-validator"
import RegisterService from "../../middleware/services/register-service"
import BlobService from "../../middleware/services/blob-service"
import { TextInput as TextInputPaper } from "react-native-paper"
import { translate } from "../../i18n"

export interface PlayerSettingsDetailProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  userid: number
  controlName: string
  controlValue: string
  showErrorPanel: boolean
  infoMessage: string
  showCalender: boolean
  dateOfBirth: Date
  dateOfBirthStr: string
  user: UserModel
  password: string
  confirmPassword: string
  userLogoUrl: string
  originalEmail: string
  requestStatus: string
}

export const PlayerSettingsDetail: React.FunctionComponent<PlayerSettingsDetailProps> = props => {
  const blobService = new BlobService()
  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])
  const userService = new UserService()
  const registerService = new RegisterService(props)
  React.useEffect(() => {
    ;(async () => {
      if (Constants.platform.ios) {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync()
        if (status !== "granted") {
          Alert.alert("Sorry, we need camera roll permissions to make this work!")
        }
      }
    })()
  }, [])
  const [state, setState] = React.useState<State>({
    userid: 0,
    user: props.route.params.user,
    loading: false,
    controlName: props.route.params.controlName,
    controlValue: props.route.params.controlValue,
    showErrorPanel: false,
    infoMessage: "",
    showCalender: false,
    dateOfBirth:
      props.route.params.user.birthDate !== "" && props.route.params.user.birthDate !== null
        ? new Date(props.route.params.user.birthDate)
        : new Date(),
    dateOfBirthStr:
      props.route.params.user.birthDate !== "" && props.route.params.user.birthDate !== null
        ? moment(props.route.params.user.birthDate).format("DD-MM-YYYY")
        : "",
    password: "",
    confirmPassword: "",
    userLogoUrl: "",
    originalEmail: props.route.params.user.emailAddress,
    requestStatus: props.route.params.user.userLinkStatusCode,
  })
  const [data, setData] = React.useState<PlayerLogoData>({
    logo: props.route.params.logo,
  })
  const { height } = Dimensions.get("window")
  const [icon, setIcon] = React.useState("md-eye-off")
  const [confirmIcon, setConfirmIcon] = React.useState("md-eye-off")
  const [hidePassword, setHidePassword] = React.useState(true)
  const [hideConfirmPassword, setConfirmHidePassword] = React.useState(true)
  const openCalender = () => {
    setState((s: State) => ({ ...s, showCalender: true, dateOfBirth: state.dateOfBirth }))
  }
  const setDateOfBirth = (event: AndroidEvent, selectedDate: Date) => {
    if (event.type === "set") {
      if (selectedDate) {
        const date = moment(selectedDate).format("DD-MM-YYYY")
        setState((s: State) => ({
          ...s,
          showCalender: false,
          dateOfBirth: selectedDate,
          dateOfBirthStr: date,
          controlValue: selectedDate ? selectedDate.toString() : date,
        }))
      }
    } else if (event.type === "dismissed") {
      setState((s: State) => ({
        ...s,
        showCalender: false,
        dateOfBirth: null,
        dateOfBirthStr: null,
        controlValue: null,
      }))
    }
  }
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
      exif: true,
    })

    if (!result.cancelled) {
      setData(s => ({ ...s, logo: result }))
      data.logo = result
      props.route.params.logo = result
    }
  }

  const convertHeightToInches = (height: string): number => {
    try {
      if (!height) {
        return null
      }
      const numbers = height.match(/\d+/g).map(Number)
      const feet = numbers[0]
      const inche = numbers[1] ? numbers[1] : 0

      return feet * 12 + inche
    } catch {
      return null
    }
  }

  const checkHeightValidation = (height: string): boolean => {
    let result = false
    const ht = height
    if (!ht) {
      result = true
      return result
    } else {
      const regex = new RegExp(
        "^(?!$|.*'[^\x22]+$)(?:([0-9]+)(?:'|w|\\s|-|ft|ft |feet|feet | feet))?(?:([0-9]+)(?:\"|w||in|inch|inches| in| inch| inches)\x22?)?$",
      )

      result = regex.test(ht)
      if (!result) {
        setState((s: State) => ({
          ...s,
          loading: false,
          showErrorPanel: true,
          infoMessage: "Height is not in correct format, eg. 6'6\"",
        }))
      }
      return result
    }
  }

  const stringToDate = (dateStr: string): Date => {
    if (!dateStr) {
      return null
    }
    const dateArray = dateStr.split("-")
    return new Date(+dateArray[2], +dateArray[1] - 1, +dateArray[0])
  }

  const savePlayer = async () => {
    let userBirthDate = null
    if (state.dateOfBirthStr !== "" || state.dateOfBirthStr !== null) {
      userBirthDate = stringToDate(state.dateOfBirthStr)
    }
    let isError = false
    if (state.user) {
      setState(s => ({
        ...s,
        loading: true,
        showErrorPanel: false,
      }))
      const user = state.user as UserModel
      const newEmailAddress = state.controlValue
      const originalEmailAddress = state.originalEmail
      const userToupdate = {
        id: user.id,
        userName: user.emailAddress,
        emailAddress: user.emailAddress,
        name: user.name,
        surname: user.surname,
        isRightHanded: user.isRightHanded.toString() === "" ? false : user.isRightHanded,
        weight: +user.weight,
        height: +user.height,
        //height: convertHeightToInches((+user.height).toString()),
        isAccountSetup: true,
        birthDate: userBirthDate,
        isActive: true,
        userPhotoUrl: user.userPhotoUrl,
      } as UserModel
      if (
        state.controlName === translate("playersettingsdetail.email") &&
        newEmailAddress != originalEmailAddress
      ) {
        //Send email to user to verify.
        if (!!state.controlValue) {
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
              infoMessage: translate("playersettingsdetail.invalidEmail"),
            }))
          }
        } else {
          setState(s => ({
            ...s,
            loading: false,
            showErrorPanel: true,
            infoMessage: translate("playersettingsdetail.emailRequired"),
          }))
        }
      } else if (state.controlName === translate("playersettingsdetail.password")) {
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
                props.navigation.navigate("playersettings", { reloaduser: userToupdate })
              }
            })
          } else {
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: translate("playersettingsdetail.passwordDoesNotMatch"),
            }))
          }
        } else {
          if (state.password == null || state.password == "") {
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: translate("playersettingsdetail.passwordRequired"),
            }))
          } else if (state.confirmPassword == null || state.confirmPassword == "") {
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: translate("playersettingsdetail.confirmPasswordRequired"),
            }))
          }
        }
      } else {
        if (state.controlName === translate("playersettingsdetail.name")) {
          userToupdate.name = getFirstName(state.controlValue)
          userToupdate.surname = getSurName(state.controlValue)

          if (userToupdate.name.trim() !== "") {
            userToupdate.fullName = userToupdate.name + " " + userToupdate.surname
          } else {
            isError = true
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: translate("playersettingsdetail.invalidName"),
            }))
          }
        }
        if (
          state.controlName === translate("playersettingsdetail.age") ||
          state.controlName === translate("playersettingsdetail.birthDate")
        ) {
          userToupdate.birthDate = userBirthDate
        }
        if (state.controlName === translate("playersettingsdetail.handedness")) {
          userToupdate.isRightHanded =
            state.controlValue === translate("playersettingsdetail.left") ? false : true
        }
        if (state.controlName === translate("playersettingsdetail.height")) {
          if (checkHeightValidation(state.controlValue)) {
            const userheight = convertHeightToInches(state.controlValue)
            if (userheight !== null) {
              userToupdate.height = userheight
            } else {
              isError = true
              setState(s => ({
                ...s,
                loading: false,
                showErrorPanel: true,
                infoMessage: translate("playersettingsdetail.invalidHeight"),
              }))
            }
          } else {
            isError = true
          }
        }
        if (state.controlName === translate("playersettingsdetail.weight")) {
          if (!isNaN(Number(state.controlValue))) {
            userToupdate.weight = Number(state.controlValue)
          } else {
            isError = true
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: translate("playersettingsdetail.invalidWeight"),
            }))
          }
        }

        {
          state.controlName === translate("playersettingsdetail.photo2") &&
            (await blobService.uploadUserProfileImage(data.logo).then(uploadFileResult => {
              userToupdate.userPhotoUrl = uploadFileResult.blobResponse.fileUri
            }))
        }
        if (isError === false) {
          await userService.updateUser(userToupdate).then(response => {
            if (response.kind === "NETWORK_ISSUE") {
              setState(s => ({
                ...s,
                loading: false,
                showErrorPanel: true,
                infoMessage: translate("playersettingsdetail.noNetwork"),
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
              props.navigation.navigate("playersettings", { reloaduser: response.userResponse })
            }
          })
        }
      }
    }
  }

  React.useMemo(() => {}, [])
  const inputMask = React.createRef<TextInput>()

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
          {state.controlName === translate("playersettingsdetail.name") && (
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
          {state.controlName == translate("playersettingsdetail.email") && (
            <TextInputPaper
              label={state.controlName}
              value={state.controlValue}
              onChangeText={text => setState(s => ({ ...s, controlValue: text }))}
              style={styles.TEXTBOXSTYLEPAPER}
              theme={styles.TEXTBOXSTYLEPAPER_THEME}
              underlineColor="white"
              keyboardType="email-address"
            />
          )}
          {/* Email section ends */}
          {/* Password section starts */}
          {state.controlName == translate("playersettingsdetail.password") && (
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

          {/* Age/Birthdate section starts */}
          {(state.controlName === translate("playersettingsdetail.age") ||
            state.controlName === translate("playersettingsdetail.birthDate")) && (
            <View style={styles.PASSWORDCONTAINER}>
              <TextInput
                style={styles.FEATHERINPUTSTYLE}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Date of birth (optional) (dd-mm-yyyy)"
                onChangeText={text =>
                  setState(s => ({ ...s, dateOfBirthStr: text, controlValue: text }))
                }
                value={state.dateOfBirthStr}
              />
              <Feather name="calendar" style={styles.EYEICON} size={20} onPress={openCalender} />
              {state.showCalender && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={state.dateOfBirth}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={setDateOfBirth}
                  maximumDate={new Date()}
                />
              )}
            </View>
          )}
          {/* Age/Birthdate section ends */}

          {/* Handedness section starts */}
          {state.controlName === translate("playersettingsdetail.handedness") && (
            <View style={styles.RADIO_BUTTON_VIEW}>
              <Text preset="fieldLabel" text={state.controlName} />
            </View>
          )}
          {state.controlName === translate("playersettingsdetail.handedness") && (
            <View style={{ ...styles.RADIO_BUTTON_VIEW, ...styles.MARGIN_1 }}>
              <CheckBox
                title="Right"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={state.controlValue === "Right"}
                onPress={() => setState(s => ({ ...s, controlValue: "Right" }))}
                containerStyle={styles.RADIO_BUTTON_CONTAINER}
                textStyle={[styles.TEXT16]}
              />
              <CheckBox
                title="Left"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={state.controlValue === "Left"}
                onPress={() => setState(s => ({ ...s, controlValue: "Left" }))}
                containerStyle={styles.RADIO_BUTTON_CONTAINER}
                textStyle={[styles.TEXT16]}
              />
            </View>
          )}
          {/* Handedness section ends */}
          {/* Height section starts */}
          {state.controlName == translate("playersettingsdetail.height") && (
            <TextInputPaper
              label={state.controlName}
              value={state.controlValue.toString()}
              placeholder="Height (optional) eg. 6'3&#34;"
              onChangeText={text => setState(s => ({ ...s, controlValue: text }))}
              style={styles.TEXTBOXSTYLEPAPER}
              theme={styles.TEXTBOXSTYLEPAPER_THEME}
              underlineColor="white"
            />
          )}
          {/* Height section ends */}
          {/* Weight section starts */}
          {state.controlName == translate("playersettingsdetail.weight") && (
            <TextInputPaper
              label={state.controlName}
              value={state.controlValue}
              onChangeText={text => setState(s => ({ ...s, controlValue: text }))}
              style={styles.TEXTBOXSTYLEPAPER}
              theme={styles.TEXTBOXSTYLEPAPER_THEME}
              underlineColor="white"
            />
          )}
          {/* Weight section ends */}
          {/* Photo section starts */}
          {state.controlName == translate("playersettingsdetail.photo2") && (
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
                    tx="playersettingsdetail.addPhoto"
                  />
                </View>
              )}
              {data.logo && data.logo.uri && data.logo.uri != "" && (
                <Image source={{ uri: data.logo.uri }} style={{ width: 200, height: 200 }} />
              )}
            </TouchableOpacity>
          )}
          {state.controlName === "Team" && state.requestStatus === "PL_PND" && (
            <View>
              <View style={{ flexDirection: "row" }}>
                <FontAwesome
                  name="exclamation-circle"
                  size={24}
                  color="yellow"
                  style={{ marginTop: 5 }}
                />
                <Text
                  tx="playersettingsdetail.requestPending"
                  style={{ marginLeft: 10, fontSize: 24 }}
                />
              </View>

              <Text
                tx="playersettingsdetail.aRequestToJoinATeamHasBeenSentTo"
                style={{ marginTop: 10, marginBottom: 10, fontSize: 18 }}
              ></Text>
              <TouchableOpacity
                style={[styles.WHITEBUTTON, styles.TOUCHABLE_OPACITY_STYLE]}
                onPress={cancelRequest}
              >
                <Text style={styles.WHITEBUTTONTEXT} tx="playersettingsdetail.cancelRequest" />
              </TouchableOpacity>
            </View>
          )}
          {state.controlName !== "Team" && (
            <TouchableOpacity
              style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE]}
              onPress={savePlayer}
            >
              <Text
                style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]}
                tx="playersettingsdetail.save"
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Screen>
  )
}
