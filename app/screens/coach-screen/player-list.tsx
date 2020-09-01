import * as React from "react"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import { Screen, Text, Button } from "../../components"
import {
  TextInput,
  View,
  FlatList,
  SafeAreaView,
  Image,
  YellowBox,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native"

import * as styles from "../../theme/appStyle"
import { Entypo, FontAwesome5 } from "@expo/vector-icons"
import { ListItem } from "react-native-elements"
import UserService from "../../middleware/services/user-service"
import * as AsyncStorage from "../../utils/storage/storage"
import { CurrentLoginInfoModel } from "../../models/data/session-model"
import { UserModel } from "../../models/data/user-model"
import Loader from "../../components/spinner/loader"
import { spacing, color } from "../../theme"
import { translate } from "../../i18n"

export interface PlayerListScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  searchText: string
  playerList: UserModel[]
  filteredPlayerList: UserModel[]
  showPlayerList: boolean
}

export const PlayerListScreen: React.FunctionComponent<PlayerListScreenProps> = props => {
  const userService = new UserService(props)

  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    searchText: "",
    playerList: [],
    filteredPlayerList: [],
    showPlayerList: false,
  })

  const getPlayers = async (): Promise<void> => {
    setState(s => ({ ...s, loading: true }))
    const userDetails = await AsyncStorage.loadString("UserDetails")
    if (userDetails) {
      const localUser = JSON.parse(userDetails) as CurrentLoginInfoModel
      const tenantId = localUser.tenant.id
      userService.getUsersByTenantId(tenantId).then(result => {
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
          if (result.userResponse.items.length > 1) {
            result.userResponse.items.sort((a, b) =>
              a.fullName.toLowerCase() > b.fullName.toLowerCase() ? 1 : -1,
            )
            setState(s => ({
              ...s,
              loading: false,
              showPlayerList: true,
              playerList: result.userResponse.items.filter(user => user.id !== localUser.user.id),
              filteredPlayerList: result.userResponse.items.filter(
                user => user.id !== localUser.user.id,
              ),
            }))
          } else {
            setState(s => ({
              ...s,
              loading: false,
              showPlayerList: false,
            }))
          }
        }
      })
    }
  }

  React.useMemo(() => {
    YellowBox.ignoreWarnings([
      "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.", // TODO: Remove when fixed
    ])
    getPlayers()
  }, [])

  const keyExtractor = (item, index) => index.toString()

  const goToPlayerDetail = (item: any) => {
    setState(s => ({
      ...s,
      loading: true,
    }))
    if (item.userLinkStatusCode === "PND") {
      props.navigation.navigate("playerResendRequest", {
        userId: item.id,
        fullName: item.fullName,
        emailAddress: item.emailAddress,
      })
    } else {
      props.navigation.navigate("playerDetailScreen", {
        userId: item.id,
        showHeader: true,
      })
    }
    setState(s => ({
      ...s,
      loading: false,
    }))
  }

  function pendingElement(item: any): React.ReactElement {
    if (item.userLinkStatusCode === "PND") {
      return (
        <View style={{ flexDirection: "row" }}>
          <FontAwesome5 name="exclamation-circle" size={18} color="yellow" />
          <Text
            tx="playersettings.pending"
            style={[styles.SETTING_LISTITEM_TITLE_BOLD, { marginLeft: 5 }]}
          />
        </View>
      )
    }
  }

  const goToPlayerAddScreen = () => {
    props.navigation.navigate("playerAddScreen")
  }

  const renderItem = ({ item }) => (
    <ListItem
      key={1}
      leftAvatar={{
        source: require("../../../assets/default-image-player.png"),
        rounded: false,
      }}
      title={item.fullName}
      rightElement={() => pendingElement(item)}
      titleStyle={styles.LISTITEM_TITLE}
      subtitle={item.emailAddress}
      subtitleStyle={styles.LISTITEM_TITLE}
      bottomDivider={true}
      chevron={{ size: 40 }}
      containerStyle={styles.LISTITEM_CONTAINER}
      onPress={() => goToPlayerDetail(item)}
    />
  )

  const searchPlayer = () => {
    const filteredList = state.playerList.filter(player => {
      if (
        player.fullName.toLowerCase().indexOf(state.searchText.toLowerCase()) > -1 ||
        player.name.toLowerCase().indexOf(state.searchText.toLowerCase()) > -1 ||
        player.emailAddress.toLowerCase().indexOf(state.searchText.toLowerCase()) > -1 ||
        player.surname.toLowerCase().indexOf(state.searchText.toLowerCase()) > -1
      ) {
        return player
      } else {
        return null
      }
    })
    if (filteredList.length > 0) {
      setState(s => ({
        ...s,
        filteredPlayerList: filteredList,
      }))
    } else {
      setState(s => ({
        ...s,
        filteredPlayerList: [],
      }))
    }
  }
  const { height } = Dimensions.get("window")

  return (
    <Screen style={styles.ROOT} preset="scroll">
      <ScrollView
        style={{
          height: height - 300,
          backgroundColor: color.palette.charcoalGrey,
        }}
      >
        <Loader loading={state.loading} />
        {!state.showPlayerList && (
          <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: 100 }]}>
            <View style={{ alignItems: "center" }}>
              <Image source={require("../../../assets/dashboard.png")} />
              <Text
                style={[styles.TEXT18, { marginTop: spacing[4] }]}
                tx="playerListScreen.noPlayerFound"
              />
            </View>
            <Button
              style={[styles.LoginButton, { marginTop: 20 }]}
              tx="playerListScreen.addPlayers"
              textStyle={styles.BLUEBUTTONTEXT}
              onPress={goToPlayerAddScreen}
            />
          </View>
        )}
        {state.showPlayerList && (
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
            <View style={styles.PASSWORDCONTAINER}>
              <TextInput
                style={styles.FEATHERINPUTSTYLE}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder={translate("playerListScreen.searchForPlayers")}
                onChangeText={text => setState(s => ({ ...s, searchText: text }))}
                value={state.searchText}
                placeholderTextColor={color.palette.offWhite}
              />
              <TouchableOpacity style={{ width: 20 }} onPress={searchPlayer}>
                <Entypo name="magnifying-glass" size={20} color="black" style={styles.EYEICON} />
              </TouchableOpacity>
            </View>
            <ListItem
              key={1}
              title={translate("playerListScreen.player")}
              bottomDivider
              containerStyle={{ backgroundColor: "#10151b", paddingVertical: 5 }}
              titleStyle={{ color: "#ffffff" }}
            />
            <FlatList
              keyExtractor={keyExtractor}
              data={state.filteredPlayerList}
              renderItem={renderItem}
              style={{ width: "100%" }}
            />
          </View>
        )}
        <SafeAreaView style={styles.FOOTER}>
          <View style={styles.FOOTER_CONTENT}></View>
        </SafeAreaView>
      </ScrollView>
    </Screen>
  )
}
