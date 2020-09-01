import * as React from "react"
import { View, SafeAreaView, TouchableOpacity } from "react-native"
import { ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Screen, Text, Header, TextField } from "../../components"
import * as styles from "../../theme/appStyle"
import { spacing } from "../../theme"
import Loader from "../../components/spinner/loader"
import { Feather } from "@expo/vector-icons"
import * as EmailValidator from "email-validator"
import RegisterService from "../../middleware/services/register-service"

interface State {
  showErrorPanel: boolean
  loading: boolean
  infoMessage: string
  userOrEmail: string
}

export interface ForgotPasswordScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

export const ForgotPasswordScreen: React.FunctionComponent<ForgotPasswordScreenProps> = props => {
  const registerService = new RegisterService(props)
  const [state, setState] = React.useState<State>({
    showErrorPanel: false,
    loading: false,
    infoMessage: "",
    userOrEmail: "",
  })

  const forgotPasswordValidateAndSendInstructions = async () => {
    if (!!state.userOrEmail) {
      state.userOrEmail = state.userOrEmail.trim()
      if (EmailValidator.validate(state.userOrEmail)) {
        setState(s => ({ ...s, loading: true }))
        registerService.forgotPassword(state.userOrEmail).then(res => {
          if (res.kind === "NETWORK_ISSUE") {
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: "Network not available.",
            }))
          } else if (res.failureResponse != null) {
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: res.failureResponse.message,
            }))
          } else {
            setState(s => ({ ...s, loading: false }))
            props.navigation.navigate("emailsent", {
              isForgotPassword: true,
              userOrEmail: null,
              password: null,
            })
          }
        })
      } else {
        setState(s => ({
          ...s,
          loading: false,
          showErrorPanel: true,
          infoMessage: "Invalid Email",
        }))
      }
    } else {
      setState(s => ({
        ...s,
        loading: false,
        showErrorPanel: true,
        infoMessage: "Email is required",
      }))
    }
  }

  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])

  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Loader loading={state.loading} />
      <Header
        headerTx="forgotPasswordScreen.header"
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
      <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[6] }]}>
        <Text style={{ width: "100%" }}>
          <Text style={styles.TEXT16} tx="forgotPasswordScreen.forgotPasswordMainText" />
        </Text>
        <TextField
          style={styles.TEXTBOX_CONTAINER}
          inputStyle={styles.TEXTBOXSTYLE}
          placeholderTx="forgotPasswordScreen.emailPlaceholder"
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={text => setState(s => ({ ...s, userOrEmail: text }))}
          value={state.userOrEmail}
        />
        <TouchableOpacity
          style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE]}
          onPress={forgotPasswordValidateAndSendInstructions}
        >
          <Text style={[styles.BLUEBUTTONTEXT]} tx="forgotPasswordScreen.forgotPasswordButton" />
        </TouchableOpacity>
      </View>
      <SafeAreaView style={styles.FOOTER}>
        <View style={styles.FOOTER_CONTENT}></View>
      </SafeAreaView>
    </Screen>
  )
}
