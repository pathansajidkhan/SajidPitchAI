import * as React from "react";
import { View, SafeAreaView, Image } from "react-native";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { Screen, Text, Header, Button } from "../../components";
import * as styles from "../../theme/appStyle";
import { spacing } from "../../theme";
import { AuthenticateRequestModel } from "../../models/data/token-auth-model";
import TokenAuthService from "../../middleware/services/tokenauth-service";
import SessionService from "../../middleware/services/session-service";
import UserService from "../../middleware/services/user-service";
import { Feather } from "@expo/vector-icons";
import Loader from "../../components/spinner/loader";

export interface EmailSentScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean;
  showErrorPanel: boolean;
  infoMessage: string;
}

export const EmailSentScreen: React.FunctionComponent<EmailSentScreenProps> = props => {
  const tokenAuthService = new TokenAuthService(props);
  const sessionService = new SessionService(props);
  const userService = new UserService(props);
  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: ""
  });

  const validateEmailConfirmation = async () => {
    let userOrEmail = props.route.params.userOrEmail;
    let password = props.route.params.password;
    if (!!(userOrEmail) && !!(password)) {
      setState(s => ({ ...s, loading: true }));
      const authModel: AuthenticateRequestModel = {
        userNameOrEmailAddress: userOrEmail,
        password: password,
        rememberClient: true,
      }

      await tokenAuthService.authenticate(authModel).then(async authResult => {
        if (authResult.kind === 'NETWORK_ISSUE') {
          setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: "Network not available." }));
        } else if (authResult.failureResponse != null) {
          setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: authResult.failureResponse.message }));
        } else {
          const currentSessionResult = await sessionService.getCurrentLoginInformation();
          console.log(currentSessionResult);
          if (currentSessionResult.kind === 'NETWORK_ISSUE') {
            setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: "Network not available." }));
          } else if (currentSessionResult.failureResponse != null) {
            setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: currentSessionResult.failureResponse.message }));
          } else {
            const userDetailResult = await userService.getUser(currentSessionResult.sessionResponse.user.id);
            console.log(userDetailResult);
            if (userDetailResult.kind === 'NETWORK_ISSUE') {
              setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: "Network not available." }));
            } else if (userDetailResult.failureResponse != null) {
              setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: userDetailResult.failureResponse.message }));
            } else {
              setState(s => ({ ...s, loading: false, showErrorPanel: false, infoMessage: "" }));
              props.navigation.navigate("dashboard", { user: userDetailResult.userResponse, session: currentSessionResult.sessionResponse })
            }
          }
        }
      });
    } else {
      props.navigation.navigate("welcome");
    }
  }

  const backToLogin = async () => {
    props.navigation.navigate("login", { isLogin: true });
  }

  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation]);
  
  return (
    <Screen style={styles.ROOT} preset="scroll" >
      <Loader loading={state.loading} />
      <Header headerTx="emailSentScreen.header" style={styles.SCREENHEADER} leftIcon="back" onLeftPress={goBack} />
      {
        state.showErrorPanel && <View style={styles.ERROR_PANEL}>
          <Feather name="info" style={styles.INFOICON} size={20} />
          <Text style={styles.ERROR_PANEL_TEXT} >{state.infoMessage}</Text>
        </View>
      }
      <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[6] }]}>
        <View>
          <Image source={require("../../../assets/confirmation-email.png")} />
        </View>
        {
          props.route.params.isForgotPassword ?
            <Text style={[styles.TEXT20, { marginTop: spacing[6] }]} tx="forgotPasswordScreen.resetInstructionsHeader" /> :
            <Text style={[styles.TEXT20, { marginTop: spacing[6] }]} tx="emailSentScreen.checkEmail" />
        }
        {
          !props.route.params.isForgotPassword ?
            <View >
              <Text style={[styles.TEXT16, { marginTop: spacing[6] }]} txOptions={{email:props.route.params.userOrEmail} } tx="emailSentScreen.confirmationEmailText" />
            </View> : null
        }
        {
          props.route.params.isForgotPassword ?
            <Text style={[styles.TEXT16, { marginTop: spacing[4] }]} tx="forgotPasswordScreen.resetPasswordMainText" /> :
            <Text style={[styles.TEXT16, { marginTop: spacing[6] }]} tx="emailSentScreen.confirmationText" />
        }
        {
          props.route.params.isForgotPassword ?
            <Button style={[styles.LoginButton, { marginTop: spacing[6] }]} tx="forgotPasswordScreen.backToLoginButtonText" textStyle={styles.BLUEBUTTONTEXT} onPress={validateEmailConfirmation} /> :
            <Button style={[styles.LoginButton, { marginTop: spacing[6] }]} tx="emailSentScreen.continueButtonText" textStyle={styles.BLUEBUTTONTEXT} onPress={backToLogin} />
        }
      </View>
      <SafeAreaView style={styles.FOOTER}>
        <View style={styles.FOOTER_CONTENT}>
        </View>
      </SafeAreaView>
    </Screen>
  )
}
