import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import {
  WelcomeScreen,
  DemoScreen,
  PlaybackScreen,
  HomeScreen,
  LoginScreen,
  LoginRegisterScreen,
  RegisterAccessScreen,
  RegisterEmailScreen,
  RegisterPasswordScreen,
  EmailSentScreen,
  AccountSetupScreen,
  ForgotPasswordScreen,
  DashboardScreen,
  PlayerDetailScreen,
  PlayerEditScreen,
  PlayerSetUpStepOne,
  PlayerSetUpStepTwo,
  PlayerSetUpStepThree,
  TeamSetupScreen1,
  TeamSetupScreen2,
  TeamSetupScreen3,
  TeamSetupScreen4,
  PitchVideoRecordScreen,
  PitchAnalyzeScreen,
  PlayerAddScreen,
  PlayerSettings,
  CoachSettings,
  PlayerSettingsDetail,
  CoachSettingsDetail,
  PlayerOverview,
  TeamOverview,
  TeamUntaggedPitches,
  PitchCompareScreen,
  PlayerResendRequestScreen,
  PlayerListScreen,
  PitchReportScreen,
  PitchCreateScreen,
  UnknownPlayerAddScreen,
  PitchReportVideoModal,
} from "../screens"
import { PrimaryParamList } from "./types" 
import { PlayerTeamSettingsDetail } from "../screens/settings/player-team-settingsdetail"
import { RequestToJoinTeam } from "../screens/settings/player-request-join-team"
import { RequestToJoinTeamSent } from "../screens/settings/player-request-join-team-sent"

const Stack = createStackNavigator<PrimaryParamList>()

export function PrimaryNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="welcome" component={WelcomeScreen} />
      <Stack.Screen name="demo" component={DemoScreen} />
      <Stack.Screen name="registeraccess" component={RegisterAccessScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="dashboard" component={DashboardScreen} />
      <Stack.Screen name="playback" component={PlaybackScreen} />
      <Stack.Screen name="loginorregister" component={LoginRegisterScreen} />
      <Stack.Screen name="registeremail" component={RegisterEmailScreen} />
      <Stack.Screen name="registerpassword" component={RegisterPasswordScreen} />
      <Stack.Screen name="emailsent" component={EmailSentScreen} />
      <Stack.Screen name="accountsetup" component={AccountSetupScreen} />
      <Stack.Screen name="forgotpassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="playerDetailScreen" component={PlayerDetailScreen} />
      <Stack.Screen name="playerListScreen" component={PlayerListScreen} />
      <Stack.Screen name="playerEditScreen" component={PlayerEditScreen} />
      <Stack.Screen name="teamSetup1" component={TeamSetupScreen1} />
      <Stack.Screen name="teamSetup2" component={TeamSetupScreen2} />
      <Stack.Screen name="teamSetup3" component={TeamSetupScreen3} />
      <Stack.Screen name="teamSetup4" component={TeamSetupScreen4} />
      <Stack.Screen name="playersetupstepone" component={PlayerSetUpStepOne} />
      <Stack.Screen name="playersetupsteptwo" component={PlayerSetUpStepTwo} />
      <Stack.Screen name="playersetupstepthree" component={PlayerSetUpStepThree} />
      <Stack.Screen name="playersettings" component={PlayerSettings} />
      <Stack.Screen name="coachsettings" component={CoachSettings} />
      <Stack.Screen name="playersettingsdetail" component={PlayerSettingsDetail} />
      <Stack.Screen name="coachsettingsdetail" component={CoachSettingsDetail} />
      <Stack.Screen name="pitchVideoRecord" component={PitchVideoRecordScreen} />
      <Stack.Screen name="pitchAnalyze" component={PitchAnalyzeScreen} />
      <Stack.Screen name="playerAddScreen" component={PlayerAddScreen} />
      <Stack.Screen name="playeroverview" component={PlayerOverview} />
      <Stack.Screen name="teamoverview" component={TeamOverview} />
      <Stack.Screen name="teamuntaggedpitches" component={TeamUntaggedPitches} />
      <Stack.Screen name="pitchcompare" component={PitchCompareScreen} />
      <Stack.Screen name="playerResendRequest" component={PlayerResendRequestScreen} />
      <Stack.Screen name="playerlistscreen" component={PlayerListScreen} />
      <Stack.Screen name="pitchreport" component={PitchReportScreen} />
      <Stack.Screen name="playerteamsettingsdetail" component={PlayerTeamSettingsDetail} />
      <Stack.Screen name="requesttojointeam" component={RequestToJoinTeam} />
      <Stack.Screen name="requesttojointeamsent" component={RequestToJoinTeamSent} />
      <Stack.Screen name="unknownplayeradd" component={UnknownPlayerAddScreen} />
      <Stack.Screen name="pitchCreateScreen" component={PitchCreateScreen} />
      <Stack.Screen name="pitchreportvideomodal" component={PitchReportVideoModal} />
      
    </Stack.Navigator>
  )
}

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 */
export const exitRoutes: string[] = ["welcome"]
