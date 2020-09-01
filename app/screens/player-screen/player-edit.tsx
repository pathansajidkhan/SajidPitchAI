import * as React from "react"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import {
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from "react-native"
import { FontAwesome5, Feather } from "@expo/vector-icons"
import { CheckBox } from "react-native-elements"
import DateTimePicker, { AndroidEvent } from "@react-native-community/datetimepicker"

import { Screen, Header, Text } from "../../components"
import Loader from "../../components/spinner/loader"
import * as styles from "../../theme/appStyle"
import { UserModel } from "../../models/data/user-model"
import UserService from "../../middleware/services/user-service"
import { color } from "../../theme"
import { translate } from "../../i18n"

export interface PlayerEditScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  fullName: string
  handedness: string
  dateOfBirth: Date
  dateOfBirthStr: string
  height: string
  weight: string
  showCalender: boolean
  userDetail: UserModel
  email: string
  redirectFrom: string
  pitchId: number
  pitchDate: string
  pitchVideoUrlLocal: string
  username: string
}

export const PlayerEditScreen: React.FunctionComponent<PlayerEditScreenProps> = props => {
  const userService = new UserService()

  const convertHeightToFeetInches = (height: number): string => {
    if (!height) {
      return ""
    }
    const feet = Math.floor(height / 12)
    const inche = height % 12

    return feet + "'" + inche + '"'
  }

  const convertHeightToInches = (height: string): number => {
    if (!height) {
      return null
    }
    const numbers = height.match(/\d+/g).map(Number)
    const feet = numbers[0]
    const inche = numbers[1] ? numbers[1] : 0

    return feet * 12 + inche
  }

  const dateToDateString = (date: Date): string => {
    if (!date) {
      return ""
    }
    const userBirthDate = new Date(date)
    const dateStr =
      userBirthDate.getDate().toFixed(0).length === 1
        ? "0" + userBirthDate.getDate().toString()
        : userBirthDate.getDate().toString()
    const monthStr =
      (userBirthDate.getMonth() + 1).toFixed(0).length === 1
        ? "0" + (userBirthDate.getMonth() + 1).toString()
        : (userBirthDate.getMonth() + 1).toString()

    return dateStr + "-" + monthStr + "-" + userBirthDate.getFullYear().toString()
  }

  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    fullName: props.route.params.user.fullName,
    handedness: props.route.params.user.isRightHanded ? "Right" : "Left",
    dateOfBirth: new Date(props.route.params.user.birthDate),
    dateOfBirthStr: dateToDateString(props.route.params.user.birthDate),
    height: convertHeightToFeetInches(+props.route.params.user.height),
    weight: props.route.params.user.weight ? props.route.params.user.weight : "",
    showCalender: false,
    email: props.route.params.user.emailAddress,
    userDetail: props.route.params.user,
    username: props.route.params.user.username,
    redirectFrom:
      props.route.params.redirectFrom && props.route.params.redirectFrom !== ""
        ? props.route.params.redirectFrom
        : "",
    pitchId:
      props.route.params.pitchId && props.route.params.pitchId !== ""
        ? props.route.params.pitchId
        : "",
    pitchDate:
      props.route.params.pitchDate && props.route.params.pitchDate !== ""
        ? props.route.params.pitchDate
        : "",
    pitchVideoUrlLocal:
      props.route.params.pitchVideoUrlLocal && props.route.params.pitchVideoUrlLocal !== ""
        ? props.route.params.pitchVideoUrlLocal
        : "",
  })

  const openCalender = () => {
    Keyboard.dismiss()
    setState((s: State) => ({ ...s, showCalender: true, dateOfBirth: new Date() }))
  }

  const setDateOfBirth = (event: AndroidEvent, selectedDate: Date) => {
    if (event.type === "set") {
      if (selectedDate) {
        const userBirthDate = new Date(selectedDate)

        const dateStr =
          userBirthDate.getDate().toFixed(0).length === 1
            ? "0" + userBirthDate.getDate().toString()
            : userBirthDate.getDate().toString()
        const monthStr =
          (userBirthDate.getMonth() + 1).toFixed(0).length === 1
            ? "0" + (userBirthDate.getMonth() + 1).toString()
            : (userBirthDate.getMonth() + 1).toString()

        const date = dateStr + "-" + monthStr + "-" + userBirthDate.getFullYear().toString()
        setState((s: State) => ({
          ...s,
          showCalender: false,
          dateOfBirth: selectedDate,
          dateOfBirthStr: date,
        }))
      }
    } else if (event.type === "dismissed") {
      setState((s: State) => ({
        ...s,
        showCalender: false,
        dateOfBirth: null,
        dateOfBirthStr: null,
      }))
    }
  }

  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])

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
    setState(s => ({
      ...s,
      loading: true,
    }))

    const firstName = getFirstName(state.fullName)
    const surName = getSurName(state.fullName)

    if (firstName === "" || !firstName) {
      setState(s => ({
        ...s,
        showErrorPanel: true,
        infoMessage: translate("editPlayer.playerFullNameIsRequired"),
        loading: false,
      }))
      return
    }
    if (state.userDetail && checkHeightValidation(state.height)) {
      const user = ({
        id: state.userDetail.id,
        userName: state.username,
        emailAddress: state.email,
        name: firstName,
        surname: surName,
        isRightHanded: state.handedness === "Right",
        weight: +state.weight,
        height: convertHeightToInches(state.height),
        isAccountSetup: true,
        birthDate: userBirthDate,
        isActive: true,
      } as unknown) as UserModel
      await userService.updateUser(user).then(response => {
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
          if (state.redirectFrom === "") {
            props.navigation.replace("playerDetailScreen", {
              userId: response.userResponse.id,
              showHeader: true,
            })
          } else {
            props.navigation.replace("pitchreport", {
              userId: response.userResponse.id,
              pitchId: state.pitchId,
              pitchDate: state.pitchDate,
              pitchVideoUrlLocal: state.pitchVideoUrlLocal,
              userDetail: response.userResponse,
              playerId: response.userResponse.id,
            })
          }
        }
      })
    }
  }

  function redirectToPitchReport() {
    props.navigation.replace("pitchreport", {
      userId: state.userDetail.id,
      pitchId: state.pitchId,
      pitchDate: state.pitchDate,
      pitchVideoUrlLocal: state.pitchVideoUrlLocal,
      userDetail: state.userDetail,
      playerId: state.userDetail.id,
      redirectFrom: "playeredit",
    })
  }
  const { height } = Dimensions.get("window")

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{
        height: height - 100,
        backgroundColor: color.palette.charcoalGrey,
      }}
    >
      <KeyboardAvoidingView enabled>
        <Screen style={styles.ROOT} preset="scroll">
          <Loader loading={state.loading} />
          <Header
            headerTx="editPlayer.header"
            style={styles.SCREENHEADER}
            leftIcon="back"
            onLeftPress={state.redirectFrom === "" ? goBack : redirectToPitchReport}
          />
          {state.showErrorPanel && (
            <View style={styles.ERROR_PANEL}>
              <Feather name="info" style={styles.INFOICON} size={20} />
              <Text style={styles.ERROR_PANEL_TEXT}>{state.infoMessage}</Text>
            </View>
          )}
          <View style={styles.MAIN_VIEW_CONTAINER}>
            <View style={[styles.PASSWORDCONTAINER, { marginTop: 50 }]}>
              <TextInput
                style={styles.FEATHERINPUTSTYLE}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Player Full Name"
                onChangeText={text => setState(s => ({ ...s, fullName: text }))}
                value={state.fullName}
                placeholderTextColor={color.palette.offWhite}
              />
            </View>
            <View style={styles.PASSWORDCONTAINER}>
              <TextInput
                style={styles.FEATHERINPUTSTYLE}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Email (optional)"
                onChangeText={text => setState(s => ({ ...s, email: text }))}
                value={state.email}
                placeholderTextColor={color.palette.offWhite}
              />
            </View>
            <View style={styles.PASSWORDCONTAINER}>
              <TextInput
                style={styles.FEATHERINPUTSTYLE}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Date of birth (optional) (dd-mm-yyy)"
                placeholderTextColor={color.palette.offWhite}
                onChangeText={text =>
                  setState(s => ({
                    ...s,
                    dateOfBirthStr: text,
                    dateOfBirth: text === null || text === "" ? null : new Date(text),
                  }))
                }
                value={state.dateOfBirthStr}
              />
              <Feather name="calendar" style={styles.EYEICON} size={20} onPress={openCalender} />
            </View>
            <Text style={styles.WIDTH_100}>
              <Text style={styles.TEXT16} tx="playerSetUpScreen.handedness" />
            </Text>
            <View style={styles.RADIO_BUTTON_VIEW}>
              <CheckBox
                title="Right"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={state.handedness === "Right"}
                onPress={() => setState(s => ({ ...s, handedness: "Right" }))}
                containerStyle={styles.RADIO_BUTTON_CONTAINER}
                textStyle={[styles.TEXT16]}
              />
              <CheckBox
                title="Left"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={state.handedness === "Left"}
                onPress={() => setState(s => ({ ...s, handedness: "Left" }))}
                containerStyle={styles.RADIO_BUTTON_CONTAINER}
                textStyle={[styles.TEXT16]}
              />
            </View>
            <View style={styles.PASSWORDCONTAINER}>
              <TextInput
                style={styles.FEATHERINPUTSTYLE}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Height (optional) eg. 6'3&#34;"
                onChangeText={text => setState(s => ({ ...s, height: text }))}
                value={state.height.toString()}
                placeholderTextColor={color.palette.offWhite}
              />
              <FontAwesome5 name="caret-down" size={20} style={styles.EYEICON} />
            </View>
            <View style={styles.PASSWORDCONTAINER}>
              <TextInput
                style={styles.FEATHERINPUTSTYLE}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Weight (optional)"
                onChangeText={text => setState(s => ({ ...s, weight: text }))}
                value={state.weight.toString()}
                keyboardType="numeric"
                placeholderTextColor={color.palette.offWhite}
              />
              <Text tx="playerSetUpScreen.lbs" style={styles.EYEICON}></Text>
            </View>

            <TouchableOpacity
              style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE]}
              onPress={savePlayer}
            >
              <Text
                style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]}
                tx="editPlayer.saveButtonText"
              />
            </TouchableOpacity>
          </View>
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
        </Screen>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}
