import * as React from "react"
import { View, Image, SafeAreaView } from "react-native"
import { Ionicons, FontAwesome, Feather } from "@expo/vector-icons"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import Dash from "react-native-dash"

import Loader from "../../components/spinner/loader"
import * as styles from "../../theme/appStyle"
import { Screen, Header, Text, Button } from "../../components"
import { spacing } from "../../theme"
import { UserModel } from "../../models/data/user-model"
import UserService from "../../middleware/services/user-service"
import { CurrentLoginInfoModel } from "../../models/data/session-model"
import * as AsyncStorage from "../../utils/storage/storage"

export interface PlayerSetUpStepThreeProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  dateOfBirth: Date
  showErrorPanel: boolean
  infoMessage: string
  height: number
  weight: string
  handedness: string
  name: string
  surname: string
}

export const PlayerSetUpStepThree: React.FunctionComponent<PlayerSetUpStepThreeProps> = props => {
  const userService = new UserService(props)

  const convertHeightToInches = (height: string): number => {
    if (!height) {
      return null
    }
    const numbers = height.match(/\d+/g).map(Number)
    const feet = numbers[0]
    const inche = numbers[1] ? numbers[1] : 0

    return feet * 12 + inche
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

  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    dateOfBirth: props.route.params.dateOfBirth,
    height: +convertHeightToInches(props.route.params.height),
    weight: props.route.params.weight ? props.route.params.weight : 0,
    handedness: props.route.params.handedness,
    name: getFirstName(props.route.params.fullName),
    surname: getSurName(props.route.params.fullName),
  })

  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])

  const savePlayer = async () => {
    const userDetails = await AsyncStorage.loadString("UserDetails")
    if (userDetails) {
      setState(s => ({
        ...s,
        loading: true,
        showErrorPanel: false,
      }))
      const localUser = JSON.parse(userDetails) as CurrentLoginInfoModel
      const user = ({
        id: localUser.user.id,
        userName: localUser.user.userName,
        emailAddress: localUser.user.emailAddress,
        name: state.name,
        surname: state.surname,
        isRightHanded: state.handedness === "Right",
        weight: +state.weight,
        height: +state.height,
        isAccountSetup: true,
        birthDate: state.dateOfBirth,
        isActive: true,
      } as unknown) as UserModel

      await userService.updateUser(user).then(async response => {
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
          const userDetails = await AsyncStorage.loadString("UserDetails")
          const localUser = JSON.parse(userDetails) as CurrentLoginInfoModel
          localUser.user.isAccountSetup = true
          props.navigation.navigate("dashboard", {
            user: response.userResponse,
            session: localUser,
          })
        }
      })
    }
  }

  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Loader loading={state.loading} />
      <Header
        headerTx="playerSetUpScreen.header"
        style={styles.SCREENHEADER}
        leftIcon="back"
        onLeftPress={goBack}
      />
      {state.showErrorPanel && (
        <View style={styles.ERROR_PANEL}>
          <Feather name="info" style={styles.INFOICON} size={20} />
          <Text style={styles.ERROR_PANEL_TEXT}>{state.infoMessage}</Text>
        </View>
      )}
      <Text
        tx="playerSetUpScreen.setupYourAccountToGetStarted"
        style={{ ...styles.TEXT18, marginTop: spacing[4] }}
      ></Text>
      <View style={styles.PROGRESS_STEP_VIEW}>
        <Ionicons name="ios-checkmark-circle" size={32} color="#6ba4ff" />
        <Dash
          style={styles.WIDTH_38}
          dashColor="#6ba4ff"
          dashGap={0}
          dashLength={18}
          dashThickness={2}
        />
        <Ionicons name="ios-checkmark-circle" size={32} color="#6ba4ff" />
        <Dash
          style={styles.WIDTH_38}
          dashColor="#6ba4ff"
          dashGap={0}
          dashLength={18}
          dashThickness={2}
        />
        <FontAwesome name="dot-circle-o" size={32} color="#6ba4ff" />
      </View>
      <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[6] }]}>
        <View>
          <Image source={require("../../../assets/confirmation-email.png")} />
        </View>
        <Text
          style={[styles.TEXT18, { marginTop: spacing[4] }]}
          tx="playerSetUpScreen.setUpComplete"
        />
        <Text
          style={[styles.TEXT16, { marginTop: spacing[4] }]}
          tx="playerSetUpScreen.yourAccountHasBeenSetup"
        />
        <Text
          style={styles.TEXT16}
          tx="playerSetUpScreen.youCanNowStartRecordingAndAnalyzingYourPitches"
        />
        <Button
          style={[styles.LoginButton, { marginTop: spacing[6] }]}
          tx="playerSetUpScreen.finishButtonText"
          textStyle={styles.BLUEBUTTONTEXT}
          onPress={savePlayer}
        />
      </View>
      <SafeAreaView style={styles.FOOTER}>
        <View style={styles.FOOTER_CONTENT}></View>
      </SafeAreaView>
    </Screen>
  )
}
