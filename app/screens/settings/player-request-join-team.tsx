import {
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import * as styles from "../../theme/appStyle"
import { Feather } from "@expo/vector-icons"
import React from "react"
import { Text, Screen, Header } from "../../components"
import { spacing } from "../../theme"
import Loader from "../../components/spinner/loader"
import { AddPlayerToTeamModel, UserModel } from "../../models/data/user-model"
import { translate } from "../../i18n"
import { TextInput as TextInputPaper } from "react-native-paper"
import * as EmailValidator from "email-validator"
import UserService from "../../middleware/services/user-service"

export interface RequestToJoinTeamProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  playerId: number
  coachEmail: string
  coachEmailLabel: string
  user: UserModel
}

export const RequestToJoinTeam: React.FunctionComponent<RequestToJoinTeamProps> = props => {
  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])
  const { height } = Dimensions.get("window")
  const userService = new UserService(props)
  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    playerId: props.route.params.playerId ? props.route.params.playerId : 0,
    coachEmail: "",
    coachEmailLabel: translate("requestToJoinTeam.coachEmail"),
    user:  props.route.params.user ?  props.route.params.user : null
  })

  React.useMemo(() => {}, [])
  const sendRequestToJoinTeam = async () => {
    if (state.coachEmail !== "") {
      if (EmailValidator.validate(state.coachEmail)) {
        setState(s => ({ ...s, loading: false, infoMessage: "" }))
        //Send email to coach
        const addPlayerModel  = new AddPlayerToTeamModel
        addPlayerModel.playerEmailAddress = state.user.emailAddress;
        addPlayerModel.coachEmailAddress = state.coachEmail;
        addPlayerModel.playerId = state.playerId;
        addPlayerModel.coachId = 0;
        addPlayerModel.coachTenantId = 0;
        addPlayerModel.fullName = state.user.name + ' ' + state.user.surname;
        await userService
        .sendRequestToCoach(addPlayerModel)
        .then((res)=> {
          if(res.userResponse !== null){
            props.navigation.navigate("requesttojointeamsent", {
              coachEmail: state.coachEmail,
            })
          }
        })
      } else {
        setState(s => ({
          ...s,
          loading: false,
          showErrorPanel: true,
          infoMessage: translate("playersettingsdetail.invalidEmail"),
        }))
      }
    } else {
      setState(s => ({
        ...s,
        loading: false,
        showErrorPanel: true,
        infoMessage: translate("playersettingsdetail.emailRequired"),
      }))
    }
  }

  return (
    <Screen style={styles.ROOT}>
      <ScrollView
        style={{
          height: height - 300,
          backgroundColor: "#323943",
        }}
      >
        <Loader loading={state.loading} />
        <Header
          headerTx="requestToJoinTeam.joinTeam"
          style={{ ...styles.LISTITEM_CONTAINER, ...styles.SETTING_HEADER_TITLE_BOLD }}
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
          <TextInputPaper
            label={state.coachEmailLabel}
            value={state.coachEmail}
            placeholder={state.coachEmailLabel}
            onChangeText={text => setState(s => ({ ...s, coachEmail: text }))}
            style={styles.TEXTBOXSTYLEPAPER}
            theme={styles.TEXTBOXSTYLEPAPER_THEME}
            underlineColor="white"
            keyboardType="email-address"
          />
          <TouchableOpacity
            style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE]}
            onPress={sendRequestToJoinTeam}
          >
            <Text
              style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]}
              tx="requestToJoinTeam.requestToJoinTeam"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  )
}
