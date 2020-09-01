import React, { useState, useEffect } from "react"
import Modal from 'react-native-modal';
import { View, Alert, ScrollView, Image } from "react-native"
import { ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Button, Screen, Text, Header, Icon } from "../../components"
import * as styles from "../../theme/appStyle"
import { authorize } from 'react-native-app-auth';
import { FontAwesome5, Feather } from "@expo/vector-icons"
import * as Facebook from "expo-facebook"
import { useTwitter } from "react-native-simple-twitter"

import { RegisterRequestModel } from "../../models/data/account-model"
import TokenAuthService from "../../middleware/services/tokenauth-service"
import { ExternalAuthenticateRequestModel } from "../../models/data/token-auth-model"
import SessionService from "../../middleware/services/session-service"
import UserService from "../../middleware/services/user-service"
import * as AsyncStorage from '../../utils/storage/storage'
import { color, spacing } from "../../theme";
import Loader from "../../components/spinner/loader";
import { SvgXml } from "react-native-svg";
const { GOOGLE_IOS_CLIENT_ID_STANDALONE, GOOGLE_ANDROID_CLIENT_ID_STANDALONE, FACEBOOK_CLIENT_ID, TWITTER_KEY, TWITTER_SECRET_KEY } = require("../../config/env")

var jwtDecode = require('jwt-decode');

export interface LoginRegisterScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean;
  showErrorPanel: boolean;
  infoMessage: string;
}

export function LoginRegisterScreen(props) {
  const tokenAuthService = new TokenAuthService(props);
  const sessionService = new SessionService(props);
  const userService = new UserService(props);

  const externalTokenVariableName = "external-token";
  const externalProfileVariableName = "external-profile";
  enum LoginType {
    Google,
    Facebook,
    Twitter,
    Email,
  }

  enum LoginStatus {
    Succcess = "success",
    Failure = "failure",
  }

  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: ""
  });

  const createUserFromGoogleProfile = (userProfile: any) => {
    return {
      userName: userProfile.email,
      name: userProfile.givenName,
      surname: userProfile.familyName,
      emailAddress: userProfile.email
    } as RegisterRequestModel
  }

  const createUserFromFacebookProfile = (userProfile: any) => {
    return {
      userName: userProfile.email,
      name: userProfile.name,
      surname: userProfile.name,
      emailAddress: userProfile.email,
    } as RegisterRequestModel
  }

  const createUserFromTwitterProfile = (userProfile: any) => {
    return {
      userName: userProfile.screen_name,
      name: userProfile.name,
      surname: userProfile.name,
      emailAddress: userProfile.email,
    } as RegisterRequestModel
  }

  const createUser = async (userProfile: any, loginType: LoginType) => {
    setState(s => ({ loading: true, showErrorPanel: false, infoMessage: "" }));
    let loginTypeName = "";
    let userModel: RegisterRequestModel
    switch (loginType) {
      case LoginType.Google:
        loginTypeName = "Google";
        userModel = createUserFromGoogleProfile(userProfile)
        break
      case LoginType.Facebook:
        loginTypeName = "Facebook";
        userModel = createUserFromFacebookProfile(userProfile)
        break
      case LoginType.Twitter:
        loginTypeName = "Twitter";
        userModel = createUserFromTwitterProfile(userProfile)
        break
    }

    let authObj: ExternalAuthenticateRequestModel = {
      authProvider: loginTypeName,
      providerKey: userModel.emailAddress,
      providerAccessCode: await AsyncStorage.loadString(externalTokenVariableName),
      isLogin: props.route.params.isLogin,
      accessCode: await AsyncStorage.loadString("code")
    };

    await tokenAuthService.externalAuthenticate(authObj).then(async authResult => {
      if (authResult.kind === 'NETWORK_ISSUE') {
        setState(s => ({ loading: false, showErrorPanel: true, infoMessage: "Network not available." }));
      } else if (authResult.failureResponse != null) {
        setState(s => ({ loading: false, showErrorPanel: true, infoMessage: authResult.failureResponse.message }));
      } else {
        const currentSessionResult = await sessionService.getCurrentLoginInformation();
        //console.log(currentSessionResult);
        if (currentSessionResult.kind === 'NETWORK_ISSUE') {
          setState(s => ({ loading: false, showErrorPanel: true, infoMessage: "Network not available." }));
        } else if (currentSessionResult.failureResponse != null) {
          setState(s => ({ loading: false, showErrorPanel: true, infoMessage: currentSessionResult.failureResponse.message }));
        } else {
          const userDetailResult = await userService.getUser(currentSessionResult.sessionResponse.user.id);
          //console.log(userDetailResult);
          if (userDetailResult.kind === 'NETWORK_ISSUE') {
            setState(s => ({ loading: false, showErrorPanel: true, infoMessage: "Network not available." }));
          } else if (userDetailResult.failureResponse != null) {
            setState(s => ({ loading: false, showErrorPanel: true, infoMessage: userDetailResult.failureResponse.message }));
          } else {
            setState(s => ({ loading: false, showErrorPanel: false, infoMessage: "" }));
            if (currentSessionResult.sessionResponse.user.isAccountSetup) {
              props.navigation.navigate("dashboard", { user: userDetailResult.userResponse, session: currentSessionResult.sessionResponse })
            } else {
              if (!currentSessionResult.sessionResponse.user.isAccountSetup && currentSessionResult.sessionResponse.user.roleNames.includes("COACH")) {
                props.navigation.replace("teamSetup1", { user: userDetailResult.userResponse, session: currentSessionResult.sessionResponse })
              }
              if (!currentSessionResult.sessionResponse.user.isAccountSetup && currentSessionResult.sessionResponse.user.roleNames.includes("PLAYER")) {
                props.navigation.replace("playersetupstepone", { user: userDetailResult.userResponse })
              }
            }
          }
        }
      }
    });
  }

  const saveTokenAndUserInLocaStorage = async (token: string, user: any) => {
    await AsyncStorage.saveString(externalTokenVariableName, token)
    await AsyncStorage.saveString(externalProfileVariableName, user)
  };

  const [me, setMe] = useState<any>({});
  const [showTC, setTC] = useState<boolean>(false);
  const [showPP, setPP] = useState<boolean>(false);
  const [token, setToken] = useState<{ oauth_token: string; oauth_token_secret: string }>({
    oauth_token: null,
    oauth_token_secret: null,
  });

  const { twitter, TWModal } = useTwitter({
    onSuccess: (user, accessToken) => {
      setMe(user)
      setToken(accessToken)
      // Here we only have  the user information not the accessToken
    },
  });

  useEffect(() => {
    // This  method is called when the app opens, it checks the async storage
    // If the storage has the token it gets the user profile from twitter
    AsyncStorage.loadString(externalTokenVariableName).then(async accessToken => {
      if (accessToken != null) {
        const userToken = accessToken;
        twitter.setAccessToken(userToken.oauth_token, userToken.oauth_token_secret);
        const options = {
          include_entities: false,
          skip_status: true,
          include_email: true,
        }
        try {
          const response = await twitter.api("GET", "account/verify_credentials.json", options);
          if (response !== null) {
            console.log(response)
            props.navigation.replace("dashboard", { user: response });
          }
        } catch (e) {
          props.navigation.navigate("loginorregister", { isLogin: props.route.params.isLogin });
        }
      }
    })
  }, []);

  useEffect(() => {
    if (token.oauth_token && token.oauth_token_secret && me) {
      saveTokenAndUserInLocaStorage(JSON.stringify(token), JSON.stringify(me))
      createUser(me, LoginType.Twitter)
    }
  }, [token]);

  const signInWithTwitter = async () => {
    try {
      twitter.setConsumerKey(TWITTER_KEY, TWITTER_SECRET_KEY)
      await twitter.login()
    } catch (e) {
      Alert.alert("Error while login")
      console.log(e.errors)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const config = {
        issuer: 'https://accounts.google.com',
        clientId: GOOGLE_ANDROID_CLIENT_ID_STANDALONE,
        redirectUrl: 'com.proplayai.pitchai:/callback',
        scopes: ['openid', 'profile', 'email']
      };
      const result = await authorize(config);
      if (!!result && !!result.idToken) {
        var decodedIDTokenDetails = jwtDecode(result.idToken);
        let userProfileDetail = {
          name: decodedIDTokenDetails.name,
          email: decodedIDTokenDetails.email
        }
        saveTokenAndUserInLocaStorage(result.accessToken, userProfileDetail)
        createUser(userProfileDetail, LoginType.Google)
        return result.idToken
      } else {
        return { cancelled: true }
      }
    } catch (e) {
      Alert.alert("Error while Login", JSON.stringify(e))
      console.error(JSON.stringify(e));
      return { error: true }
    }
  }

  const signInWithFacebook = async () => {
    try {
      await Facebook.initializeAsync(FACEBOOK_CLIENT_ID)
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({ permissions: ['email ', 'public_profile'] });
      if (type === LoginStatus.Succcess) {
        fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`)
          .then(response => response.json())
          .then(data => {
            saveTokenAndUserInLocaStorage(token, data)
            createUser(data, LoginType.Facebook)
          })
          .catch(e => Alert.alert(e.message))
      } else {
        console.log(`Facebook Login Error: `)
      }
    } catch (error) {
      Alert.alert("Facebook error", error.message)
    }
  }


  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation]);
  const continueWithEmail = React.useMemo(() => () => props.navigation.navigate("login"), [props.navigation]);
  const registerWithEmail = React.useMemo(() => () => props.navigation.navigate("registeremail"), [props.navigation]);

  return (
    <Screen style={styles.ROOT} preset="scroll" >
      <Loader loading={state.loading} />
      {
        props.route.params.isLogin == false ?
          <Header headerTx="registerScreen.header" style={styles.SCREENHEADER} leftIcon="back" onLeftPress={goBack} /> :
          <Header headerTx="loginScreen.header" style={styles.SCREENHEADER} leftIcon="back" onLeftPress={goBack} />
      }
      {
        state.showErrorPanel && <View style={styles.ERROR_PANEL}>
          <Feather name="info" style={styles.INFOICON} size={20} />
          <Text style={styles.ERROR_PANEL_TEXT} >{state.infoMessage}</Text>
        </View>
      }
      <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[4] }]}>
        <Button style={styles.PROVIDERBUTTON} onPress={signInWithGoogle}>
          <SvgXml xml={styles.GOOGLE_SVG} style={styles.PROVIDERICON} />
          <Text style={styles.ICON_TEXT_SPLITTER}></Text>
          <Text style={styles.BLACKBUTTONTEXT}> Continue with Google</Text>
        </Button>
        <Button style={styles.PROVIDERBUTTON} onPress={signInWithTwitter}>
          <SvgXml xml={styles.TWITTER_SVG} style={styles.PROVIDERICON} />
          <Text style={styles.ICON_TEXT_SPLITTER}></Text>
          <Text style={styles.BLACKBUTTONTEXT}> Continue with Twitter</Text>
        </Button>
        <TWModal />
        <Button style={styles.PROVIDERBUTTON} onPress={signInWithFacebook}>
          <SvgXml xml={styles.FACEBOOK_SVG} style={styles.PROVIDERICON} />
          <Text style={styles.ICON_TEXT_SPLITTER}></Text>
          <Text style={styles.BLACKBUTTONTEXT}> Continue with Facebook</Text>
        </Button>
        {
          props.route.params.isLogin == true ?
            <Button style={styles.PROVIDERBUTTON} onPress={continueWithEmail}>
              <SvgXml xml={styles.EMAIL_SVG} style={styles.PROVIDERICON} />
              <Text style={styles.ICON_TEXT_SPLITTER}></Text>
              <Text style={styles.BLACKBUTTONTEXT}> Login with email</Text>
            </Button> :
            <Button style={styles.PROVIDERBUTTON} onPress={registerWithEmail}>
              <SvgXml xml={styles.EMAIL_SVG} style={styles.PROVIDERICON} />
              <Text style={styles.ICON_TEXT_SPLITTER}></Text>
              <Text style={styles.BLACKBUTTONTEXT}> Register with email</Text>
            </Button>
        }
      </View>
      <View style={styles.MAIN_VIEW_CONTAINER}>
        {
          props.route.params.isLogin == false ?
            <Text style={[styles.ALIGNLEFT]}>
              <Text style={styles.TEXT16} tx="registerScreen.termsprivacy">
              </Text>
              <Text tx="registerScreen.termsandconditions" style={[styles.TEXTUNDERLINE, styles.TEXT16]}
                onPress={() => setTC(true)}>
              </Text>
              <Text style={styles.TEXT16} tx="registerScreen.and">
              </Text>
              <Text tx="registerScreen.privacypolicy" style={[styles.TEXTUNDERLINE, styles.TEXT16]}
                onPress={() => setPP(true)}>
              </Text>
            </Text>
            : null
        }
      </View>
      <Modal style={{ margin: 0 }} propagateSwipe isVisible={showTC} coverScreen={true} backdropOpacity={1} backdropColor={color.palette.charcoalGrey}>
        <ScrollView >
          <Header headerTx="registerScreen.termsandconditions" style={styles.SCREENHEADER} leftIcon="back" onLeftPress={() => { setTC(false) }} />
          <Text tx="registerScreen.ppText" style={[styles.MAIN_VIEW_CONTAINER, { marginTop: 24 }]}></Text>
        </ScrollView>
      </Modal>
      <Modal style={{ margin: 0 }} propagateSwipe isVisible={showPP} coverScreen={true} backdropOpacity={1} backdropColor={color.palette.charcoalGrey}>
        <ScrollView >
          <Header headerTx="registerScreen.privacypolicy" style={styles.SCREENHEADER} leftIcon="back" onLeftPress={() => setPP(false)} />
          <Text tx="registerScreen.ppText" style={[styles.MAIN_VIEW_CONTAINER, { marginTop: 24 }]}></Text>
        </ScrollView>
      </Modal>
    </Screen>
  )
}

LoginRegisterScreen.navigationOptions = {
  header: null,
}

export default LoginRegisterScreen;