import * as React from "react"
import { View, Image, SafeAreaView, Platform, Dimensions, Alert } from "react-native"
import { ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Button, Screen, Text } from "../../components"
import * as styles from "../../theme/appStyle"
import * as Device from "expo-device"
import * as AsyncStorage from "../../utils/storage/storage"
import NotificationService from "../../services/api_services/notification_services/notification-service"
import MainNotificationHandler from "../../services/api_services/notification_services/notification-handler"
import { any } from "ramda"

export interface WelcomeScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>
}
const Swiper = Platform.select({
  ios: () => require("react-native-swiper"),
  android: () => require("react-native-swiper"),
  default: () => null,
})()

class NotificationState {
  status: string;
  registeredOS: string;
  registeredToken: string;
  isRegistered: boolean;
  isBusy: boolean;
}

export const WelcomeScreen: React.FunctionComponent<WelcomeScreenProps> = props => {
  let onTokenReceived: any;
  let onNotificationReceived: any;
  const { width } = Dimensions.get("window")
  const gotoRegister = React.useMemo(
    () => () => props.navigation.navigate("registeraccess", { isLogin: false }),
    [props.navigation],
  )
  const gotoLogin = React.useMemo(
    () => () => props.navigation.navigate("loginorregister", { isLogin: true }),
    [props.navigation],
  )

  onTokenReceived = async (token: any) => {
    if (!!token) {
      let notificationState: NotificationState = {
        registeredToken: token.token,
        registeredOS: token.os,
        isRegistered: false,
        isBusy: false,
        status: `The push notifications token has been received.`
      }
      await AsyncStorage.saveString("notificationState", JSON.stringify(notificationState)).then(() => { console.log("Notification State Stored ...") });
    }
  }

  onNotificationReceived = (notification: any) => {
    let notificationState: NotificationState;
    AsyncStorage.loadString("notificationState").then(result => {
      notificationState = JSON.parse(result) as NotificationState;
      notificationState.status = `Received a push notification...`;
      AsyncStorage.saveString("notificationState", JSON.stringify(notificationState));
    });
  }

  React.useEffect(() => {
    const initializeNotificationService = () => {
      new NotificationService(onTokenReceived, onNotificationReceived);
    };

    initializeNotificationService();
  }, []);
  
  return (
    <Screen style={styles.ROOT} preset="scroll">
      <View style={styles.LOGO_TOP}>
        <View style={{ position: "absolute", top: 0 }}>
          <Image
            style={{ width: width, height: 420 }}
            source={require("../../../assets/baseball-field.png")}
          />
        </View>
        <View style={styles.LOGO}>
          <Image
            style={{ width: 160, height: 150 }}
            source={require("../../../assets/pitchai-logo-vertical.png")}
          />
        </View>
      </View>
      <View style={[styles.MAIN_VIEW_CONTAINER, styles.WELCOME_LAYOUT]}>
        <View style={styles.WELCOMETITLEVIEW}>
          <Text tx="welcomeScreen.welcomePitchAI" style={styles.TEXT22}></Text>
          {Device.brand !== null && (
            <Swiper
              dot={<View style={styles.SWIPERDOT} />}
              activeDot={<View style={styles.SWIPERACTIVEDOT} />}
              paginationStyle={{ bottom: 20 }}
              loop={false}
            >
              <View>
                <Text tx="welcomeScreen.slide1" style={[styles.TEXT16, { marginTop: 8 }]}></Text>
              </View>
              <View>
                <Text tx="welcomeScreen.slide2" style={[styles.TEXT16, { marginTop: 8 }]}></Text>
              </View>
              <View>
                <Text tx="welcomeScreen.slide3" style={[styles.TEXT16, { marginTop: 8 }]}></Text>
              </View>
              <View>
                <Text tx="welcomeScreen.slide4" style={[styles.TEXT16, { marginTop: 8 }]}></Text>
              </View>
            </Swiper>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Button
            style={styles.BLUEBUTTON}
            tx="welcomeScreen.register"
            textStyle={styles.BLUEBUTTONTEXT}
            onPress={gotoRegister}
          />
          <Button
            style={[styles.WHITEBUTTON, { marginTop: 24 }]}
            tx="welcomeScreen.login"
            textStyle={styles.WHITEBUTTONTEXT}
            onPress={gotoLogin}
          />
        </View>
        <SafeAreaView style={styles.FOOTER}>
          <View style={styles.FOOTER_CONTENT}>
            <Image source={require("../../../assets/powered-by-proplayai-white.png")} />
          </View>
        </SafeAreaView>
        <MainNotificationHandler />
      </View>
    </Screen>
  )
}
