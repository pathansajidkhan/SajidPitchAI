import * as React from "react"
import { View, SafeAreaView, TextInput, Alert } from "react-native"
import { ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Button, Screen, Text, Header, TextField } from "../../components"
import * as styles from "../../theme/appStyle"
import { Feather } from "@expo/vector-icons"
import TokenAuthService from "../../middleware/services/tokenauth-service"
import SessionService from "../../middleware/services/session-service"
import UserService from "../../middleware/services/user-service"
import { AuthenticateRequestModel } from "../../models/data/token-auth-model"
import * as EmailValidator from "email-validator"
import Loader from "../../components/spinner/loader"
import { spacing, color } from "../../theme"
import { translate } from "../../i18n"

export interface LoginScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  userOrEmail: string
  password: string
}

export const LoginScreen: React.FunctionComponent<LoginScreenProps> = props => {
  const tokenAuthService = new TokenAuthService()
  const sessionService = new SessionService()
  const userService = new UserService()

  const [icon, setIcon] = React.useState("eye-off")
  const [hidePassword, setHidePassword] = React.useState(true)
  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    userOrEmail: "",
    password: "",
  })

  const _changeIcon = () => {
    icon !== "eye"
      ? (setIcon("eye"), setHidePassword(false))
      : (setIcon("eye-off"), setHidePassword(true))
    console.log(hidePassword)
  }

  const login = async () => {
    if (!!state.userOrEmail && !!state.password) {
      state.userOrEmail = state.userOrEmail.trim()
      if (EmailValidator.validate(state.userOrEmail)) {
        setState(s => ({ ...s, loading: true, showErrorPanel: false, infoMessage: "" }))
        const authModel: AuthenticateRequestModel = {
          userNameOrEmailAddress: state.userOrEmail,
          password: state.password,
          rememberClient: true,
        }

        const authResult = await tokenAuthService.authenticate(authModel)
        if (authResult.kind === "NETWORK_ISSUE") {
          setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: "Network not available." }))
        } else if (authResult.failureResponse != null) {
          setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: authResult.failureResponse.message }))
        } else {
          const currentSessionResult = await sessionService.getCurrentLoginInformation()
          if (currentSessionResult.kind === "NETWORK_ISSUE") {
            setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: "Network not available." }))
          } else if (currentSessionResult.failureResponse != null) {
            setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: currentSessionResult.failureResponse.message }))
          } else {
            const userDetailResult = await userService.getUser(currentSessionResult.sessionResponse.user.id)
            console.log(userDetailResult)
            if (userDetailResult.kind === "NETWORK_ISSUE") {
              setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: "Network not available." }))
            } else if (userDetailResult.failureResponse != null) {
              setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: userDetailResult.failureResponse.message }))
            } else {
              setState(s => ({ ...s, loading: false, showErrorPanel: false, infoMessage: "" }));
              props.navigation.navigate("dashboard", { user: userDetailResult.userResponse, session: currentSessionResult.sessionResponse })
            }
          }
        }
      } else {
        setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: "Invalid Email" }))
      }
    } else {
      if (state.userOrEmail == null || state.userOrEmail == "") {
        setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: "Email is required." }))
      } else {
        setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: "Password is required." }))
      }
    }
  }

  const gotoForgotPassword = async () => {
    props.navigation.navigate("forgotpassword")
  }
  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])

  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Loader loading={state.loading} />
      <Header
        headerTx="loginScreen.header"
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
      <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[4] }]}>
        <View style={styles.PASSWORDCONTAINER}>
          <TextInput
            style={styles.FEATHERINPUTSTYLE}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder={translate("registerScreen.emailPlaceHolder")}
            placeholderTextColor={color.palette.offWhite}
            onChangeText={text => setState(s => ({ ...s, userOrEmail: text }))}
            value={state.userOrEmail}
          />
        </View>
        <View style={styles.PASSWORDCONTAINER}>
          <TextInput
            style={styles.FEATHERINPUTSTYLE}
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry={hidePassword}
            placeholder="Password"
            placeholderTextColor={color.palette.offWhite}
            onChangeText={text => setState(s => ({ ...s, password: text }))}
            value={state.password}
          />
          <Feather name={icon} style={styles.EYEICON} size={20} onPress={() => _changeIcon()} />
        </View>
        {/* forgotPasswordLinkText */}
        <Button
          style={styles.LoginButton}
          tx="loginScreen.loginButtonText"
          textStyle={styles.BLUEBUTTONTEXT}
          onPress={login}
        />
        <Text
          style={[styles.TEXT16, { marginTop: spacing[6] }]}
          tx="loginScreen.forgotPasswordLinkText"
          onPress={gotoForgotPassword}
        />
      </View>
      <SafeAreaView style={styles.FOOTER}>
        <View style={styles.FOOTER_CONTENT}></View>
      </SafeAreaView>
    </Screen>
  )
}
