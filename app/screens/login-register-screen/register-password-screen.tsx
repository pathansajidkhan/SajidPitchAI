import * as React from "react"
import { View, SafeAreaView, TextInput, Alert, AsyncStorage } from "react-native"
import { ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Button, Screen, Header, Text } from "../../components"
import * as styles from "../../theme/appStyle"
import { Feather, Ionicons } from "@expo/vector-icons"
import RegisterService from "../../middleware/services/register-service"
import { RegisterRequestModel } from "../../models/data/account-model"
import * as storage from "../../utils/storage/storage"
import { useState } from "react"
import { spacing, color } from "../../theme"
import Loader from "../../components/spinner/loader"

export interface RegisterPasswordScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  password: string
  confirmPassword: string
}

export const RegisterPasswordScreen: React.FunctionComponent<RegisterPasswordScreenProps> = props => {
  let userOrEmail: string
  const [state, setState] = useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    password: "",
    confirmPassword: "",
  })

  userOrEmail = props.route.params.userOrEmail
  const registerService = new RegisterService(props)

  const [icon, setIcon] = React.useState("md-eye-off")
  const [confirmIcon, setConfirmIcon] = React.useState("md-eye-off")
  const [hidePassword, setHidePassword] = React.useState(true)
  const [hideConfirmPassword, setConfirmHidePassword] = React.useState(true)

  const _changePasswordIcon = () => {
    icon !== "md-eye"
      ? (setIcon("md-eye"), setHidePassword(false))
      : (setIcon("md-eye-off"), setHidePassword(true))
    console.log(hidePassword)
  }

  const _changeConfirmPasswordIcon = () => {
    confirmIcon !== "md-eye"
      ? (setConfirmIcon("md-eye"), setConfirmHidePassword(false))
      : (setConfirmIcon("md-eye-off"), setConfirmHidePassword(true))
    console.log(hideConfirmPassword)
  }

  const login = async () => {
    if (!!state.password && !!state.confirmPassword) {
      if (state.password === state.confirmPassword) {
        setState(s => ({ ...s, loading: true, showErrorPanel: false, infoMessage: "" }))
        const registerObj: RegisterRequestModel = {
          name: "",
          surname: "",
          userName: "",
          emailAddress: userOrEmail,
          password: state.password,
          accessCode: await storage.loadString("code"),
        }
        await registerService.register(registerObj).then(response => {
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
            if (response.failureResponse != null) {
              setState(s => ({
                ...s,
                loading: false,
                showErrorPanel: true,
                infoMessage: response.failureResponse.message,
              }))
            } else if (response.accountResponse != null) {
              setState(s => ({ ...s, loading: false, showErrorPanel: false, infoMessage: "" }))
              props.navigation.navigate("emailsent", {
                userOrEmail: userOrEmail,
                password: state.password,
                isForgotPassword: false,
              })
            }
          }
        })
      } else {
        setState(s => ({
          ...s,
          loading: false,
          showErrorPanel: true,
          infoMessage: "Password does not match.",
        }))
      }
    } else {
      if (state.password == null || state.password == "") {
        setState(s => ({
          ...s,
          loading: false,
          showErrorPanel: true,
          infoMessage: "Password is Required",
        }))
      } else if (state.confirmPassword == null || state.confirmPassword == "") {
        setState(s => ({
          ...s,
          loading: false,
          showErrorPanel: true,
          infoMessage: "Confirm Password is Required",
        }))
      }
    }
  }

  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])

  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Loader loading={state.loading} />
      <Header
        headerTx="registerScreen.header"
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
        <View style={styles.PASSWORDCONTAINER}>
          <TextInput
            style={styles.FEATHERINPUTSTYLE}
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry={hidePassword}
            placeholder="Password"
            onChangeText={text => setState(s => ({ ...s, password: text }))}
            value={state.password}
            placeholderTextColor={color.palette.offWhite}
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
            placeholderTextColor={color.palette.offWhite}
          />
          <Ionicons
            name={confirmIcon}
            style={styles.EYEICON}
            size={20}
            onPress={() => _changeConfirmPasswordIcon()}
          />
        </View>
        <Button
          style={styles.LoginButton}
          tx="registerEmailScreen.registerButtonText"
          textStyle={styles.BLUEBUTTONTEXT}
          onPress={login}
        />
        <SafeAreaView style={styles.FOOTER}>
          <View style={styles.FOOTER_CONTENT}></View>
        </SafeAreaView>
      </View>
    </Screen>
  )
}
