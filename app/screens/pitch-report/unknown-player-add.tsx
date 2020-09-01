import * as React from "react"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import { View, TouchableOpacity, ScrollView, FlatList, Alert, TextInput } from "react-native"
import { Text, Screen, Header, Button } from "../../components"
import Loader from "../../components/spinner/loader"
import * as styles from "../../theme/appStyle"
import { spacing, color } from "../../theme"
import { FontAwesome5, Feather, Entypo } from "@expo/vector-icons"
import { TextInput as TextInputPaper } from "react-native-paper"
import { translate } from "../../i18n"
import UserService from "../../middleware/services/user-service"
import { AddPlayerModel, UserModel } from "../../models/data/user-model"
import * as AsyncStorage from "../../utils/storage/storage"
import { CurrentLoginInfoModel } from "../../models/data/session-model"
import moment from "moment"
import { ListItem } from "react-native-elements"
import PitchService from "../../middleware/services/pitch-service"

export interface UnknownPlayerAddScreenProps {
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
  player: Player
  pitchId: number
  pitchDate: string
  playerList: UserModel[]
  filteredPlayerList: UserModel[]
  searchText: string
  isAddPlayer: boolean
  addPlayerList: Array<Player>
}

export const UnknownPlayerAddScreen: React.FunctionComponent<UnknownPlayerAddScreenProps> = props => {
  const userService = new UserService(props)
  const pitchService = new PitchService(props)
  const playerObj = { emailAddress: "", name: "", valid: true } as Player
  const playerListInitialData = [] as Player[]
  for (let i = 0; i < 1; i++) {
    playerListInitialData.push(playerObj)
  }

  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    player: props.route.params.player ? props.route.params.player : playerObj,
    pitchId: props.route.params.pitchId ? props.route.params.pitchId : 0,
    pitchDate: props.route.params.pitchDate
      ? props.route.params.pitchDate
      : moment(new Date()).format("M DD, YYYY"),
    playerList: [],
    filteredPlayerList: [],
    searchText: "",
    isAddPlayer: false,
    addPlayerList: playerListInitialData,
  })

  const goBack = React.useMemo(
    () => () => {
      props.navigation.goBack()
    },
    [props],
  )

  React.useEffect(() => {
    getPlayers()
  }, [])

  const getPlayers = async () => {
    setState(s => ({ ...s, loading: true }))
    const userDetails = await AsyncStorage.loadString("UserDetails")
    if (userDetails) {
      const localUser = JSON.parse(userDetails) as CurrentLoginInfoModel
      if (localUser.user.roleNames.includes("COACH")) {
        const tenantId = localUser.tenant.id
        await userService.getUsersByTenantId(tenantId).then(result => {
          if (result && result.userResponse && result.userResponse.items.length > 0) {
            setState(s => ({
              ...s,
              loading: false,
              showPlayerList: true,
              playerList: result.userResponse.items.filter(user => user.id !== localUser.user.id),
              filteredPlayerList: result.userResponse.items.filter(
                user => user.id !== localUser.user.id,
              ),
            }))
          }
        })
      }
    }
  }

  const goToPlayerAddScreen = () => {
    //props.navigation.navigate("playerAddScreen", { untaggedPitchPlayer: true })
    setState(s => ({ ...s, isAddPlayer: true }))
  }

  const addPlayer = async playerId => {
    setState(s => ({ ...s, loading: true }))
    await pitchService.addUntaggedPitchPlayer(playerId, state.pitchId).then(async response => {
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
        //If unknown player added successfully then assign this player to existing pitch
        await userService.getUser(playerId).then(result => {
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
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: false,
            }))
            if (result && result.userResponse) {
              props.navigation.navigate("pitchreport", {
                playerId: playerId,
                pitchId: state.pitchId,
                pitchDate: moment(state.pitchDate).format("MMMM DD, YYYY"),
                userDetail: result.userResponse,
              })
            }
          }
        })
      }
    })
  }
  const keyExtractor = (item, index) => index.toString()

  const renderItem = ({ item }) => (
    <ListItem
      key={1}
      leftAvatar={{
        source: require("../../../assets/default-image-player.png"),
        rounded: false,
      }}
      title={item.fullName}
      titleStyle={styles.LISTITEM_TITLE}
      subtitle={item.emailAddress}
      subtitleStyle={styles.LISTITEM_TITLE}
      bottomDivider={true}
      chevron={{ size: 40 }}
      containerStyle={styles.LISTITEM_CONTAINER}
      //onPress={() => }
      onPress={() => {
        Alert.alert(
          translate("unknownPlayerAdd.doYouWantToSelectThisPlayer", {
            selectedPlayer: item.fullName,
          }),
          "",
          [
            {
              text: translate("unknownPlayerAdd.cancel"),
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: translate("unknownPlayerAdd.ok"),
              onPress: () => {
                addPlayer(item.id)
              },
            },
          ],
          { cancelable: false },
        )
      }}
    />
  )

  const searchPlayer = () => {
    setState(s => ({
      ...s,
      loading: true,
      filteredPlayerList: state.playerList.filter(player => {
        if (
          player.fullName.toLowerCase().indexOf(state.searchText.toLowerCase()) > -1 ||
          player.name.toLowerCase().indexOf(state.searchText.toLowerCase()) > -1 ||
          player.emailAddress.toLowerCase().indexOf(state.searchText.toLowerCase()) > -1 ||
          player.surname.toLowerCase().indexOf(state.searchText.toLowerCase()) > -1
        ) {
          setState(s => ({
            ...s,
            showPlayerList: true,
            loading: false,
          }))
          return player
        } else {
          setState(s => ({
            ...s,
            loading: false,
            showPlayerList: false,
          }))
          return null
        }
      }),
    }))
  }

  const checkFormFilled = () => {
    setState(s => ({ ...s, formFilled: false }))
    for (let i = 0; i < state.addPlayerList.length; i++) {
      if (
        state.addPlayerList[i].name.trim() !== "" ||
        state.addPlayerList[i].emailAddress.trim() !== ""
      ) {
        setState(s => ({ ...s, formFilled: true }))
        break
      }
    }
  }

  const validatePlayerList = (): number => {
    let playerWithErrorCount = 0
    state.addPlayerList.map(player => {
      if (player.name === null || player.name === "") {
        player.valid = false
        playerWithErrorCount = playerWithErrorCount + 1
      }
    })
    return playerWithErrorCount
  }
  const addNewPlayer = async () => {
    const errorCount = validatePlayerList()
    if (errorCount === 0) {
      setState(s => ({ ...s, loading: true }))
      const addPlayerModelList = [] as AddPlayerModel[]
      state.addPlayerList.forEach(item => {
        addPlayerModelList.push({
          emailAddress: item.emailAddress,
          fullname: item.name,
        } as AddPlayerModel)
      })
      await userService.addPlayers(addPlayerModelList).then(response => {
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
          setState(s => ({ ...s, loading: false, isAddPlayer: false }))
          getPlayers()
        }
      })
    } else {
      const newPlayer = state.addPlayerList
      setState(s => ({
        ...s,
        addPlayerList: newPlayer,
      }))
    }
  }

  const changePlayerName = (index: number, value: string) => {
    const list = state.addPlayerList
    list[index].name = value
    setState(s => ({ ...s, addPlayerList: list }))
    checkFormFilled()
  }

  const changePlayerEmail = (index: number, value: string) => {
    const list = state.addPlayerList
    list[index].emailAddress = value
    setState(s => ({ ...s, addPlayerList: list }))
    checkFormFilled()
  }

  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Loader loading={state.loading} />
      <Header
        headerTx="unknownPlayerAdd.header"
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
        {state.player && (
          <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[3] }]}>
            <TouchableOpacity
              style={[
                styles.IMAGE_PICKER,
                styles.JUSTIFYCENTER,
                styles.ALIGNCENTER,
                { marginBottom: spacing[3], width: "100%", height: 45 },
              ]}
              onPress={goToPlayerAddScreen}
            >
              <View style={[{ flexDirection: "row" }]}>
                <FontAwesome5 name="plus" size={16} color="white" />
                <Text
                  style={[styles.WHITEBUTTONTEXT, { marginRight: 10, marginLeft: 10 }]}
                  tx="playerListScreen.addPlayers"
                />
              </View>
            </TouchableOpacity>
            <Text
              tx="unknownPlayerAdd.selectPlayer"
              style={[styles.TEXT16, { paddingVertical: 20 }]}
            ></Text>

            {!state.isAddPlayer && (
              <View style={styles.PASSWORDCONTAINER}>
                <TextInput
                  style={styles.FEATHERINPUTSTYLE}
                  autoCorrect={false}
                  autoCapitalize="none"
                  placeholder="Search for players"
                  onChangeText={text => setState(s => ({ ...s, searchText: text }))}
                  value={state.searchText}
                />
                <Entypo
                  name="magnifying-glass"
                  size={20}
                  color="black"
                  style={styles.EYEICON}
                  onPress={searchPlayer}
                />
              </View>
            )}
            {!state.isAddPlayer && (
              <FlatList
                keyExtractor={keyExtractor}
                data={state.filteredPlayerList}
                style={{ width: "100%" }}
                renderItem={renderItem}
              />
            )}
          </View>
        )}
        {state.isAddPlayer &&
          state.addPlayerList &&
          state.addPlayerList.map((key, index) => (
            <View key={1} style={styles.MAIN_VIEW_CONTAINER}>
              <View key={2} style={{ flexDirection: "row" }}>
                <TextInputPaper
                  label={translate("playerAdd.playerFullName")}
                  style={styles.TEXTBOXSTYLEPAPER}
                  theme={styles.TEXTBOXSTYLEPAPER_THEME}
                  underlineColor="white"
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={state.player.name.toString()}
                  onChangeText={text => changePlayerName(index, text)}
                />
                {!state.addPlayerList[index].valid && (
                  <FontAwesome5
                    style={{ position: "relative", top: 20, right: 30 }}
                    name="exclamation-circle"
                    size={20}
                    color={color.palette.red}
                  />
                )}
              </View>
              {!state.addPlayerList[index].valid && (
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
                value={state.addPlayerList[index].emailAddress}
                onChangeText={text => changePlayerEmail(index, text)}
              />
            </View>
          ))}

        {!state.player && (
          <View>
            <Text tx="playerListScreen.noPlayerFound"></Text>
          </View>
        )}
      </ScrollView>
      {state.isAddPlayer && (
        <View style={{ height: 75, backgroundColor: "#10151b", padding: 20, marginTop: 15 }}>
          <Button
            style={styles.LoginButton}
            tx="playerListScreen.addPlayers"
            textStyle={styles.BLUEBUTTONTEXT}
            onPress={addNewPlayer}
          />
        </View>
      )}
    </Screen>
  )
}
