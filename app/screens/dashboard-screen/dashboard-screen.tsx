import * as React from "react"
import { View, Text, TouchableOpacity, Alert } from "react-native"
import { ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Screen, Header } from "../../components"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import * as styles from "../../theme/appStyle"

import { SvgXml } from "react-native-svg"
import { PlayerListScreen } from "../coach-screen/player-list"
import { createStackNavigator } from "@react-navigation/stack"
import { PrimaryParamList } from "../../navigation/types"
import { UserModel } from "../../models/data/user-model"
import { CurrentLoginInfoModel } from "../../models/data/session-model"
import { PitchCreateScreen } from "../pitch-screen/pitch-create"
import { TeamOverview } from "../overview-screen/team-overview"
import { PlayerOverview } from "../overview-screen/player-overview"
import { ComparePitchesPlayerSelectionScreen } from "../compare-pitches/player-selection-screen"
import { PlayerDetailScreen } from "../coach-screen/player-details"
// import NotificationService from "../../services/api_services/notification_services/notification-service"
import NotificationRegistrationService from "../../services/api_services/notification_services/notification-registration-service"
import DeviceInfo from 'react-native-device-info';
import * as AsyncStorage from "../../utils/storage/storage"

export interface DashboardScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
  route: any
}

declare const global: { HermesInternal: null | {} };

class NotificationState {
  status: string;
  registeredOS: string;
  registeredToken: string;
  isRegistered: boolean;
  isBusy: boolean;
}

export const DashboardScreen: React.FunctionComponent<DashboardScreenProps> = props => {
  const userDetails = props.route.params.user as UserModel
  const userSessionDetails = props.route.params.session as CurrentLoginInfoModel
  const deviceId: string = DeviceInfo.getUniqueId();
  let notificationRegistrationService: NotificationRegistrationService;
  let notificationState: NotificationState;

  async function gotoSettings() {
    if (userSessionDetails.user.roleNames.includes("COACH")) {
      props.navigation.navigate("coachsettings", {
        user: userDetails,
        session: props.route.params.session,
      })
    } else if (userSessionDetails.user.roleNames.includes("PLAYER")) {
      props.navigation.navigate("playersettings", {
        user: userDetails,
        session: props.route.params.session,
      })
    }
  }

  if (!userSessionDetails.user.isAccountSetup && userSessionDetails.user.roleNames.includes("COACH")) {
    props.navigation.replace("teamSetup1", { user: userDetails, session: props.route.params.session })
    return null
  } else if (!userSessionDetails.user.isAccountSetup && userSessionDetails.user.roleNames.includes("PLAYER")) {
    props.navigation.replace("playersetupstepone", { user: userDetails })
    return null
  } else {
    //stack navigator for create pitch
    const PitchStack = createStackNavigator<PrimaryParamList>()
    function CreatePitchStack() {
      return (
        <PitchStack.Navigator>
          <PitchStack.Screen
            name="pitchCreateScreen"
            component={PitchCreateScreen}
            options={{ headerShown: false }}
          />
        </PitchStack.Navigator>
      )
    }
    //end stack navigator for create pitch
    //stack navigator for create pitch
    const PlayerListStack = createStackNavigator<PrimaryParamList>()
    function CreatePlayerListStack() {
      return (
        <PlayerListStack.Navigator>
          <PlayerListStack.Screen
            name="playerListScreen"
            component={PlayerListScreen}
            options={{ headerShown: false }}
          />
        </PlayerListStack.Navigator>
      )
    }
    //end stack navigator for create pitch
    // const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation]);
    const Tab = createBottomTabNavigator()

    function TabBar({ state, descriptors, navigation }) {
      return (
        <View key={"key" + state.index} style={{ flexDirection: "row", height: "12%" }}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key]
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name

            const isFocused = state.index === index
            let iconName

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
              })

              if (!isFocused && !event.defaultPrevented) {
                if (
                  route.name == "New Pitch" &&
                  userSessionDetails.user.roleNames.includes("PLAYER")
                ) {
                  navigation.navigate("pitchVideoRecord", {
                    userId: userSessionDetails.user.id,
                    isRightHanded: userSessionDetails.user.isRightHanded,
                  })
                } else navigation.navigate(route.name)
              }
            }

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              })
            }
            if (route.name === "Overview") {
              iconName = styles.OVERVIEW_SVG
            } else if (route.name === "New Pitch") {
              iconName = styles.NEWPITCHES_SVG
            } else if (route.name === "Players") {
              iconName = styles.PLAYERS_SVG
            } else if (route.name === "Compare") {
              iconName = styles.COMPARE_SVG
            } else if (route.name === "Pitches") {
              iconName = styles.PITCHES_SVG
            }
            return (
              <TouchableOpacity
                key={"tab" + Math.random()}
                accessibilityRole="button"
                accessibilityStates={isFocused ? ["selected"] : []}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  flex: 1,
                  height: "100%",
                  borderTopWidth: isFocused ? 2 : 0,
                  borderTopColor: isFocused ? "#6BA4FF" : "",
                  backgroundColor: "#20252B",
                  justifyContent: "center",
                  display: "flex",
                  borderRightColor: "#404956",
                  borderRightWidth: 1,
                }}
              >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <SvgXml
                    fill={isFocused ? "#6BA4FF" : "#FFFFFF"}
                    xml={iconName}
                    style={[{ paddingBottom: 20, justifyContent: "center", alignItems: "center" }]}
                  />
                </View>
                <Text
                  style={{ flex: 1, color: isFocused ? "#6BA4FF" : "#FFFFFF", textAlign: "center" }}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )
    }

    React.useEffect(() => {
      const initializePushRegisterService = async () => {
        await AsyncStorage.loadString("notificationState").then(result => {
          if (!!result) {
            const notificationStateResult = result;
            notificationState = JSON.parse(notificationStateResult) as NotificationState
          }
        });
      }

      initializePushRegisterService().then(() => {
        registerNotificationService();
        console.log("Registration Service Initialized.")
      });
    }, [])

    const registerNotificationService = async () => {
      if (!notificationState.registeredToken || !notificationState.registeredOS) {
        Alert.alert("The push notifications token wasn't received.");
        return;
      }

      let status: string = "Registering...";
      let isRegistered = notificationState.isRegistered;
      try {
        const pnPlatform = notificationState.registeredOS == "ios" ? "apns" : "fcm";
        const pnToken = notificationState.registeredToken;
        const request = {
          installationId: deviceId,
          platform: pnPlatform,
          pushChannel: pnToken,
          tags: ["username:" + userDetails.emailAddress]
        };
        notificationRegistrationService = new NotificationRegistrationService();
        const response = await notificationRegistrationService.registerDevice(request);
        status = `Registered for ${notificationState.registeredOS} push notifications`;
        console.log(response);
        console.log(status);
        isRegistered = true;
      } catch (e) {
        status = `Registration failed: ${e}`;
      }
      finally {
        notificationState.status = status;
        notificationState.isRegistered = isRegistered;
      }
    }

    return (
      <Screen style={styles.ROOT} preset="scroll">
        <Header
          style={styles.SCREENHEADER}
          leftIcon="setting"
          showBackground={true}
          onLeftPress={gotoSettings}
        ></Header>
        <Tab.Navigator
          tabBar={props => <TabBar {...props} />}
          initialRouteName={
            props.route.params.selectedTab !== undefined
              ? props.route.params.selectedTab
              : "Overview"
          }
        >
          {userSessionDetails.user.roleNames.includes("COACH") && (
            <Tab.Screen
              name="Overview"
              component={TeamOverview}
              initialParams={props.route.params}
            />
          )}
          {userSessionDetails.user.roleNames.includes("PLAYER") && (
            <Tab.Screen
              name="Overview"
              component={PlayerOverview}
              initialParams={props.route.params}
            />
          )}
          <Tab.Screen name="New Pitch" component={PitchCreateScreen} />
          {userSessionDetails.user.roleNames.includes("COACH") && (
            <Tab.Screen name="Players" component={PlayerListScreen} />
          )}
          {userSessionDetails.user.roleNames.includes("COACH") && (
            <Tab.Screen
              name="Compare"
              component={ComparePitchesPlayerSelectionScreen}
              initialParams={props.route.params}
            />
          )}
          {userSessionDetails.user.roleNames.includes("PLAYER") && (
            <Tab.Screen
              name="Pitches"
              component={PlayerDetailScreen}
              initialParams={{ userId: userDetails.id, showHeader: false }}
            />
          )}
        </Tab.Navigator>
      </Screen>
    )
  }
}
