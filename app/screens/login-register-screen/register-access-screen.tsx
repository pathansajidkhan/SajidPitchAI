import React, { useState } from "react"
import { FontAwesome5, Feather } from "@expo/vector-icons"
import { View, Linking, TouchableOpacity } from "react-native"
import { ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Button, Screen, Text, Header, TextField } from "../../components"
import * as styles from "../../theme/appStyle"
import RegisterService from "../../middleware/services/register-service"
import * as AsyncStorage from "../../utils/storage/storage"
import Loader from "../../components/spinner/loader"
import { spacing } from "../../theme"

interface State {
  showErrorPanel: boolean
  accessCode: string
  loading: boolean
  infoMessage: string
}

export interface RegisterAccessScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
  route: any
}

export const RegisterAccessScreen: React.FunctionComponent<RegisterAccessScreenProps> = props => {
  const registerService = new RegisterService(props)
  const [state, setState] = useState<State>({
    showErrorPanel: false,
    accessCode: "",
    loading: false,
    infoMessage: "",
  })

  const checkCode = async () => {
    if (!!state.accessCode) {
      setState(s => ({ ...s, loading: true }))
      state.accessCode.trim()
      await registerService.validateCode(state.accessCode).then(res => {
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
          if (res.accountResponse !== null) {
            setState(s => ({ ...s, showErrorPanel: false, loading: false }))
            gotoRegister()
            AsyncStorage.saveString("code", state.accessCode)
          } else {
            setState(s => ({
              ...s,
              showErrorPanel: true,
              loading: false,
              infoMessage: "Invalid Access Code",
            }))
          }
        }
      })
    } else {
      setState(s => ({
        ...s,
        showErrorPanel: true,
        loading: false,
        infoMessage: "Access Code is required",
      }))
    }
  }

  const gotoRegister = React.useMemo(
    () => () => {
      props.navigation.navigate("loginorregister", { isLogin: props.route.params.isLogin })
    },
    [props.navigation],
  )
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
      <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[4] }]}>
        <Text style={{ width: "100%" }}>
          <Text style={styles.TEXT16} tx="registerScreen.accessCodeRegister" />
        </Text>
        <TextField
          style={styles.TEXTBOX_CONTAINER}
          inputStyle={styles.TEXTBOXSTYLE}
          placeholderTx="registerScreen.accessCode"
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={text => setState(s => ({ ...s, accessCode: text }))}
          value={state.accessCode}
        />
        <TouchableOpacity
          style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE]}
          onPress={checkCode}
        >
          <Text style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]} tx="registerScreen.next" />
          <FontAwesome5 name="arrow-right" size={16} color="black" />
        </TouchableOpacity>
      </View>
    </Screen>
  )
}
