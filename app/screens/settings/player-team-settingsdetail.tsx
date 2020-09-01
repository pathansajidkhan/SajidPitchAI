import { View, ScrollView, Dimensions, TouchableOpacity, Alert, FlatList } from "react-native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import * as styles from "../../theme/appStyle"
import { Feather, FontAwesome5 } from "@expo/vector-icons"
import React from "react"
import { Text, Screen, Header } from "../../components"
import { color } from "../../theme"
import { ListItem } from "react-native-elements"
import Loader from "../../components/spinner/loader"
import { PlayerTeamsModel } from "../../models/data/user-model"
import { translate } from "../../i18n"
import UserService from "../../middleware/services/user-service"

export interface PlayerTeamSettingsDetailProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  playerTeamList: PlayerTeamsModel[]
  playerId: number
  playerEmail: string
}

export const PlayerTeamSettingsDetail: React.FunctionComponent<PlayerTeamSettingsDetailProps> = props => {
  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])
  const { height } = Dimensions.get("window")
  const keyExtractor = (item, index) => index.toString()
  const userService = new UserService()

  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    playerTeamList: props.route.params.playerTeamList ? props.route.params.playerTeamList : [],
    playerId: props.route.params.playerId ? props.route.params.playerId : 0,
    playerEmail: props.route.params.playerEmail ? props.route.params.playerEmail : "",
  })
  function pendingElement(): React.ReactElement {
    return (
      <View style={{ flexDirection: "row" }}>
        <FontAwesome5 name="exclamation-circle" size={18} color="yellow" />
        <Text
          tx="playerTeamSettingsDetail.requestPending"
          style={[styles.SETTING_LISTITEM_TITLE_BOLD, { marginLeft: 5 }]}
        />
      </View>
    )
  }
  React.useMemo(() => {}, [])

  const renderItem = ({ item }) => {
    if (item && (item.linkStatus === "PL_PND" || item.linkStatus === "PND")) {
      return (
        <View>
          <ListItem
            key={item.id}
            leftAvatar={{
              source:
                item.team.teamLogoLocal === undefined || item.team.teamLogoLocal === ""
                  ? require("../../../assets/defailt-image-team.png")
                  : { uri: item.team.teamLogoLocal },
              rounded: false,
              containerStyle: { width: 80, height: 80, padding: 10 },
            }}
            title={item.team.name}
            titleStyle={styles.OVERVIEW_LISTITEM_TITLE_BOLD}
            subtitle={pendingElement()}
            subtitleStyle={styles.LISTITEM_TITLE}
            bottomDivider={false}
            containerStyle={[
              styles.LISTITEM_CONTAINER,
              { backgroundColor: "#10151b", paddingVertical: 10, margin: 10, height: 100 },
            ]}
          />
          <ListItem
            key={Math.random()}
            title={pendingElement2(
              item.team.name,
              item.linkStatus,
              item.teamCoachEmail,
              item.team.Id,
              item.playerId,
            )}
            titleStyle={styles.OVERVIEW_LISTITEM_TITLE_BOLD}
            subtitleStyle={styles.LISTITEM_TITLE}
            bottomDivider={false}
            containerStyle={[
              styles.LISTITEM_CONTAINER,
              {
                backgroundColor: "#10151b",
                paddingVertical: 10,
                paddingHorizontal: 30,
                marginTop: -10,
                marginLeft: 10,
                marginRight: 10,
                paddingTop: 20,
              },
            ]}
          />
        </View>
      )
    } else {
      return (
        <ListItem
          key={item.id}
          leftAvatar={{
            source:
              item.team.teamLogoLocal === undefined || item.team.teamLogoLocal === ""
                ? require("../../../assets/defailt-image-team.png")
                : { uri: item.team.teamLogoLocal },
            rounded: false,
            containerStyle: { width: 80, height: 80, padding: 10 },
          }}
          title={item.team.name}
          titleStyle={styles.OVERVIEW_LISTITEM_TITLE_BOLD}
          subtitleStyle={styles.LISTITEM_TITLE}
          containerStyle={[
            styles.LISTITEM_CONTAINER,
            { backgroundColor: "#10151b", paddingVertical: 10, margin: 10, height: 100 },
          ]}
          rightIcon={{
            name: "delete",
            color: color.palette.white,
            onPress: () => {
              Alert.alert(
                translate("playerTeamSettingsDetail.leaveTeamConfirm", {
                  teamName: item.team.name,
                }),
                "",
                [
                  {
                    text: translate("playerTeamSettingsDetail.cancel"),
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: translate("playerTeamSettingsDetail.ok"),
                    onPress: () => {
                      unLinkPlayerFromTeam(item.teamId, item.playerId)
                    },
                  },
                ],
                { cancelable: false },
              )
            },
          }}
        />
      )
    }
  }

  function getPendingRequestText(teamName, teamEmail, linkStatus) {
    if (linkStatus === "PL_PND") {
      return translate("playerTeamSettingsDetail.aRequestToJoinATeamHasBeenSentTo", {
        teamName: teamName,
        teamEmail: teamEmail,
      })
    } else {
      return translate("playerTeamSettingsDetail.aRequestToJoinATeamFromCoach", {
        teamName: teamName,
        teamEmail: state.playerEmail,
      })
    }
    //state.playerEmail
  }

  function pendingElement2(teamName, linkStatus, teamEmail, teamId, playerId) {
    if (linkStatus === "PL_PND" || linkStatus === "PND") {
      return (
        <View style={{ width: "100%", margin: 0, padding: 0 }}>
          <Text
            text={getPendingRequestText(teamName, teamEmail, linkStatus)}
            style={[styles.SETTING_LISTITEM_TITLE_BOLD, { fontSize: 12 }]}
          ></Text>
          {linkStatus === "PL_PND" && (
            <TouchableOpacity
              style={[styles.WHITEBUTTON, styles.TOUCHABLE_OPACITY_STYLE, { width: "100%" }]}
              onPress={() => cancelRequest(teamName, teamId, playerId)}
            >
              <Text style={styles.WHITEBUTTONTEXT} tx="playerTeamSettingsDetail.cancelRequest" />
            </TouchableOpacity>
          )}
        </View>
      )
    } else {
      return <Text style={{ fontWeight: "bold", marginLeft: -20 }} text={teamName}></Text>
    }
  }

  function cancelRequest(teamName: string, teamId: number, playerId: number) {
    Alert.alert(
      translate("playerTeamSettingsDetail.cancelRequestConfirm", {
        teamName: teamName,
      }),
      "",
      [
        {
          text: translate("playerTeamSettingsDetail.cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: translate("playerTeamSettingsDetail.ok"),
          onPress: () => {
            cancelRequestToJoinTeam(teamId, playerId)
          },
        },
      ],
      { cancelable: false },
    )
  }

  function cancelRequestToJoinTeam(teamId: number, playerId: number) {
    userService.cancelRequestToJoinTeam(teamId, playerId).then(result => {
      if (result.failureResponse === null) {
        //playerTeamList.
        setState(s => ({
          ...s,
          playerTeamList: state.playerTeamList.filter(
            item => item.playerId !== playerId && item.team.id !== teamId,
          ),
        }))
      }
    })
  }

  function unLinkPlayerFromTeam(teamId: number, playerId: number) {
    userService.unLinkPlayerFromTeam(teamId, playerId).then(result => {
      if (result.failureResponse === null) {
        //playerTeamList.
        setState(s => ({
          ...s,
          playerTeamList: state.playerTeamList.filter(
            item => item.playerId !== playerId && item.teamId !== teamId,
          ),
        }))
      }
    })
  }

  const goToJoinTeam = () => {
    props.navigation.navigate("requesttojointeam", {
      playerId: state.playerId,
      session: props.route.params.session,
      user: props.route.params.user,
    })
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
          headerTx="playerTeamSettingsDetail.team"
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
        <View style={{ height: "100%" }}>
          <View style={{ padding: 10 }}>
            <FlatList
              keyExtractor={keyExtractor}
              data={state.playerTeamList}
              renderItem={renderItem}
            />
          </View>
          <View style={{ padding: 20 }}>
            <TouchableOpacity
              style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE, {}]}
              onPress={goToJoinTeam}
            >
              <Text style={[styles.BLUEBUTTONTEXT, {}]} tx="playerTeamSettingsDetail.joinTeam" />
            </TouchableOpacity>
          </View>

          {/* )} */}
        </View>
      </ScrollView>
    </Screen>
  )
}
