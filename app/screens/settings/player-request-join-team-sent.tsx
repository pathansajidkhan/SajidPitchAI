import { View, Image, ScrollView, Dimensions, TouchableOpacity } from "react-native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import * as styles from "../../theme/appStyle"
import React from "react"
import { Text, Screen, Header } from "../../components"
import { spacing } from "../../theme"
import { CurrentLoginInfoModel } from "../../models/data/session-model"
import * as AsyncStorage from "../../utils/storage/storage"

export interface RequestToJoinTeamSentProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  coachEmail: string
}

export const RequestToJoinTeamSent: React.FunctionComponent<RequestToJoinTeamSentProps> = props => {
  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])
  const [state, setState] = React.useState<State>({
    coachEmail: props.route.params.coachEmail ? props.route.params.coachEmail : "",
    loading: true,
  })
  React.useMemo(() => {
   
  }, [])
  const goToSetting = async () => {
    const userDetails = await AsyncStorage.loadString("UserDetails");
    const localUser = JSON.parse(userDetails) as CurrentLoginInfoModel

    props.navigation.navigate("playersettings", {user: localUser.user, session: localUser})
  }

  return (
    <Screen style={styles.ROOT}>
      <Header
        headerTx="requestToJoinTeamSent.requestSent"
        style={{ ...styles.LISTITEM_CONTAINER, ...styles.SETTING_HEADER_TITLE_BOLD }}
        leftIcon="back"
        onLeftPress={goBack}
      />
      <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[6] }]}>
        <View>
          <Image source={require("../../../assets/confirmation-email.png")} />
        </View>
        <Text
          style={[styles.TEXT20, { marginTop: spacing[6] }]}
          tx="requestToJoinTeamSent.requestToJoinATeamHasSent"
        />
        <Text
          style={[styles.TEXT16, { marginTop: spacing[6] }]}
          tx="requestToJoinTeamSent.tellYourCoachToCheckEmail"
        />
        <Text style={{ fontWeight: "bold" }}>{state.coachEmail}</Text>
        <TouchableOpacity
          style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE, { marginTop: 20 }]}
          onPress={goToSetting}
        >
          <Text
            style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]}
            tx="requestToJoinTeamSent.backToSettings"
          />
        </TouchableOpacity>
      </View>
    </Screen>
  )
}
