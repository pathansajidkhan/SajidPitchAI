import * as React from "react"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import { View, TouchableOpacity, ScrollView, Alert } from "react-native"
import { Text, Screen, Header, Button } from "../../components"
import Loader from "../../components/spinner/loader"
import * as styles from "../../theme/appStyle"
import { spacing, color } from "../../theme"
import { FontAwesome5, Feather } from "@expo/vector-icons"
import { TextInput as TextInputPaper } from "react-native-paper"
import { translate } from "../../i18n/"
import UserService from "../../middleware/services/user-service"
import { AddPlayerModel } from "../../models/data/user-model"
import * as AsyncStorage from "../../utils/storage/storage"
import { CurrentLoginInfoModel } from "../../models/data/session-model"

export interface PlayerAddScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>
  route: any
}

interface Player {
  name: string
  emailAddress: string
  valid: boolean
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  playerList: Array<Player>
  navigateFrom: string
}

export const PlayerAddScreen: React.FunctionComponent<PlayerAddScreenProps> = props => {
  const userService = new UserService(props)
  const playerObj = { emailAddress: "", name: "", valid: true } as Player
  const playerListInitialData = [] as Player[]
  for (let i = 0; i < 1; i++) {
    playerListInitialData.push(playerObj)
  }

  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    playerList: playerListInitialData,
    navigateFrom:
      props.route.params &&
      props.route.params.navigateFrom &&
      props.route.params.navigateFrom === "New Pitch"
        ? "New Pitch"
        : "Players",
  })

  const goBack = React.useMemo(
    () => () => {
      props.navigation.goBack()
    },
    [props],
  )

  const checkFormFilled = () => {
    setState(s => ({ ...s, formFilled: false }))
    for (let i = 0; i < state.playerList.length; i++) {
      if (
        state.playerList[i].name.trim() !== "" ||
        state.playerList[i].emailAddress.trim() !== ""
      ) {
        setState(s => ({ ...s, formFilled: true }))
        break
      }
    }
  }

  const changePlayerName = (index: number, value: string) => {
    const list = state.playerList
    list[index].name = value
    setState(s => ({ ...s, playerList: list }))
    checkFormFilled()
  }

  const changePlayerEmail = (index: number, value: string) => {
    const list = state.playerList
    list[index].emailAddress = value
    setState(s => ({ ...s, playerList: list }))
    checkFormFilled()
  }

  const validatePlayerList = (): number => {
    let playerWithErrorCount = 0
    state.playerList.map(player => {
      if (player.name === null || player.name === "") {
        player.valid = false
        playerWithErrorCount = playerWithErrorCount + 1
      }
    })
    return playerWithErrorCount
  }

  const addAnotherPlayer = () => {
    const errorCount = validatePlayerList()
    const newPlayer = state.playerList
    if (errorCount === 0) {
      newPlayer.push({ emailAddress: "", name: "", valid: true })
    }
    setState(s => ({ ...s, playerList: newPlayer }))
  }

  const addPlayer = async () => {
    const errorCount = validatePlayerList()
    if (errorCount === 0) {
      setState(s => ({ ...s, loading: true }))
      const addPlayerModelList = [] as AddPlayerModel[]
      state.playerList.forEach(item => {
        addPlayerModelList.push({
          emailAddress: item.emailAddress,
          fullname: item.name,
        } as AddPlayerModel)
      })
      await userService.addPlayers(addPlayerModelList).then(async response => {
        if (response.kind === "NETWORK_ISSUE") {
          setState(s => ({
            ...s,
            loading: false,
            showErrorPanel: true,
            infoMessage: "Network not available.",
          }))
        } else if (response.failureResponse != null) {
          setState(s => ({
            ...s,
            loading: false,
            showErrorPanel: true,
            infoMessage: response.failureResponse.message,
          }))
        } else {
          setState(s => ({ ...s, loading: false }))
          const userDetails = JSON.parse(
            await AsyncStorage.loadString("UserDetails"),
          ) as CurrentLoginInfoModel
          await userService.getUser(userDetails.user.id).then(async user => {
            if (response.kind === "NETWORK_ISSUE") {
              setState(s => ({
                ...s,
                loading: false,
                showErrorPanel: true,
                infoMessage: "Network not available.",
              }))
            } else if (response.failureResponse != null) {
              setState(s => ({
                ...s,
                loading: false,
                showErrorPanel: true,
                infoMessage: response.failureResponse.message,
              }))
            } else {
              props.navigation.replace("dashboard", {
                user: user.userResponse,
                session: userDetails,
                selectedTab: state.navigateFrom,
              })
            }
          })
         
        }
      })
    } else {
      const newPlayer = state.playerList
      setState(s => ({
        ...s,
        playerList: newPlayer,
      }))
    }
  }

  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Loader loading={state.loading} />
      <Header
        headerTx="playerAdd.header"
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
      <ScrollView>
        <View style={[styles.MAIN_VIEW_CONTAINER, { width: "100%" }]}>
          <Text
            style={[
              styles.TEXT18,
              styles.FONTMEDIUM,
              styles.TEXTALIGNLEFT,
              { marginTop: spacing[2] },
            ]}
            tx="playerAdd.addPlayersToTeam"
          ></Text>
          {state.playerList &&
            state.playerList.map((key, index) => (
              <View
                key={index}
                style={[
                  {
                    marginTop: spacing[4],
                    width: "100%",
                    borderBottomColor: color.palette.black,
                    borderBottomWidth: 1,
                    paddingBottom: 15,
                    paddingTop: 15,
                  },
                ]}
              >
                <View key={index} style={{ flexDirection: "row" }}>
                  <TextInputPaper
                    label={translate("playerAdd.playerFullName")}
                    style={styles.TEXTBOXSTYLEPAPER}
                    theme={styles.TEXTBOXSTYLEPAPER_THEME}
                    underlineColor="white"
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={state.playerList[index].name.toString()}
                    onChangeText={text => changePlayerName(index, text)}
                  />
                  {!state.playerList[index].valid && (
                    <FontAwesome5
                      style={{ position: "relative", top: 20, right: 30 }}
                      name="exclamation-circle"
                      size={20}
                      color={color.palette.red}
                    />
                  )}
                </View>
                {!state.playerList[index].valid && (
                  <Text
                    style={[styles.ERROR_TEXT, { marginBottom: 10 }]}
                    tx="teamSetupScreen.playerNameRequired"
                  ></Text>
                )}
                <TextInputPaper
                  label={translate("teamSetupScreen.playerEmail")}
                  style={styles.TEXTBOXSTYLEPAPER}
                  theme={styles.TEXTBOXSTYLEPAPER_THEME}
                  underlineColor="white"
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={state.playerList[index].emailAddress}
                  onChangeText={text => changePlayerEmail(index, text)}
                />
              </View>
            ))}

          <TouchableOpacity
            style={[
              styles.IMAGE_PICKER,
              styles.JUSTIFYCENTER,
              styles.ALIGNCENTER,
              { marginTop: spacing[5], width: "100%", height: 45 },
            ]}
            onPress={addAnotherPlayer}
          >
            <View style={[{ flexDirection: "row" }]}>
              <FontAwesome5 name="plus" size={16} color="white" />
              <Text
                style={[styles.WHITEBUTTONTEXT, { marginRight: 10, marginLeft: 10 }]}
                tx="teamSetupScreen.addAnotherPlayer"
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={{ height: 75, backgroundColor: "#10151b", padding: 20, marginTop: 15 }}>
        <Button
          style={styles.LoginButton}
          tx="playerListScreen.addPlayers"
          textStyle={styles.BLUEBUTTONTEXT}
          onPress={addPlayer}
        />
      </View>
    </Screen>
  )
}
