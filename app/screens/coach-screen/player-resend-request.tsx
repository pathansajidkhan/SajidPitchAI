import * as React from "react"
import { View, SafeAreaView, TouchableOpacity } from "react-native"
import { Text, Screen, Header } from "../../components"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import * as styles from "../../theme/appStyle"
import Loader from "../../components/spinner/loader"
import { spacing } from "../../theme"
import UserService from "../../middleware/services/user-service"
import { translate } from "../../i18n"

export interface PlayerResendRequestScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}
interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  userId: number
  fullName: string
  emailAddress: string
}

export const PlayerResendRequestScreen: React.FunctionComponent<PlayerResendRequestScreenProps> = props => {
  const userService = new UserService(props)

  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    userId: props.route.params.userId ? props.route.params.userId : null,
    fullName: props.route.params.fullName ? props.route.params.fullName : "",
    emailAddress: props.route.params.emailAddress ? props.route.params.emailAddress : "",
  })

  const resendRequest = async () => {
    setState(s => ({
      ...s,
      loading: true,
    }))
    await userService.joinTeam(state.emailAddress).then(result => {
      if (result.kind === "NETWORK_ISSUE") {
        setState(s => ({
          ...s,
          loading: false,
          showErrorPanel: true,
          infoMessage: "Network not available.",
        }))
      } else if (result.failureResponse != null) {
        setState(s => ({
          ...s,
          loading: false,
          showErrorPanel: true,
          infoMessage: result.failureResponse.message,
        }))
      } else {
        props.navigation.replace("playerListScreen")
      }
      setState(s => ({
        ...s,
        loading: false,
      }))
    })
  }

  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Loader loading={state.loading} />
      <Header
        headerTx="playerResendRequestScreen.header"
        style={styles.SCREENHEADER}
        leftIcon="back"
        onLeftPress={() => props.navigation.replace("playerListScreen")}
      />
      <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[4] }]}>
        <Text style={{ marginTop: 10, marginBottom: 10, fontSize: 18 }}>
          {translate("playerResendRequestScreen.hasNotAcceptedYourRequest", {
            fullName: state.fullName,
            emailAddress: state.emailAddress,
          })}
        </Text>
        <TouchableOpacity
          style={[styles.WHITEBUTTON, styles.TOUCHABLE_OPACITY_STYLE]}
          onPress={resendRequest}
        >
          <Text style={styles.WHITEBUTTONTEXT} tx="playerResendRequestScreen.resendRequest" />
        </TouchableOpacity>
      </View>
      <SafeAreaView style={styles.FOOTER}>
        <View style={styles.FOOTER_CONTENT}></View>
      </SafeAreaView>
    </Screen>
  )
}
