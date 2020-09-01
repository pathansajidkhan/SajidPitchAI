import * as React from "react"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import { Screen, Text, Header } from "../../components"
import { View, FlatList, ScrollView, TouchableOpacity, YellowBox } from "react-native"

import * as styles from "../../theme/appStyle"
import { FontAwesome5 } from "@expo/vector-icons"
import { ListItem } from "react-native-elements"
import UserService from "../../middleware/services/user-service"
import * as AsyncStorage from "../../utils/storage/storage"
import { CurrentLoginInfoModel } from "../../models/data/session-model"
import { UserModel } from "../../models/data/user-model"
import Loader from "../../components/spinner/loader"
import PitchService from "../../middleware/services/pitch-service"
import {  color } from "../../theme"

export interface PitchCreateScreenProps extends React.Component {
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
  showHeader: boolean
}

export const PitchCreateScreen: React.FunctionComponent<PitchCreateScreenProps> = props => {
  const userService = new UserService(props)
  const pitchService = new PitchService(props)

  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    searchText: "",
    playerList: [],
    filteredPlayerList: [],
    showPlayerList: false,
    showHeader: props.route.params && props.route.params.headerShown ? props.route.params.headerShown : false
  })
  const [data, setData] = React.useState<any>({
    players: []
  });
  const getPlayers = async (): Promise<void> => {
    setState(s => ({ ...s, loading: true }))
    const userDetails = await AsyncStorage.loadString("UserDetails")
    if (userDetails) {
      const localUser = JSON.parse(userDetails) as CurrentLoginInfoModel
      if (localUser.user.roleNames.includes("COACH")) {
      const tenantId = localUser.tenant.id
      userService.getUsersByTenantId(tenantId).then(result => {
        if (result.userResponse.items.length > 0) {
          result.userResponse.items.sort((a, b) => (a.fullName.toLowerCase() > b.fullName.toLowerCase() ? 1 : -1))
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
      else{
        goToPitchRecord(localUser.user.id,localUser.user.isRightHanded);
      }
    }
  }

  React.useMemo(() => {
    YellowBox.ignoreWarnings([
      "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.", // TODO: Remove when fixed
    ])
    getPlayers()
  }, [])

  const keyExtractor = (item, index) => index.toString()

  const goToPitchRecord = (id: number,isRightHanded: boolean ) => {
    console.log("sent "+id +" handedness: " + isRightHanded)
    props.navigation.navigate("pitchVideoRecord", {
      userId: id,
      isRightHanded: isRightHanded
    })
  }

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
      onPress={() => goToPitchRecord(item.id,item.isRightHanded)}
    />
  )
  const addPlayer = () => {
      props.navigation.navigate("playerAddScreen", { navigateFrom: "New Pitch"})
    
  }
  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation]);


  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Loader loading={state.loading} />
      {state.showHeader && (
        <Header
          headerTx="createPitch.header"
          style={styles.SCREENHEADER}
          leftIcon="back"
          onLeftPress={goBack}
        />
      )}
      <ScrollView>
      <View style={[styles.MAIN_VIEW_CONTAINER]}>
        
        {state.showPlayerList && (
          <View style={{ width: "100%" }}>
            <Text tx="createPitch.selectPlayer" style={[styles.TEXT16,{paddingVertical:20}]}></Text>
           
            <View style={{ }}>
                <FlatList
                  keyExtractor={keyExtractor}
                  data={state.filteredPlayerList}
                  renderItem={renderItem}
                />
            </View>
          </View>
        )}
        {!state.showPlayerList && (
          <View>
            <Text tx="playerListScreen.noPlayerFound"></Text>
          </View>
        )}
        
        <TouchableOpacity style={[styles.IMAGE_PICKER, styles.JUSTIFYCENTER, styles.ALIGNCENTER, { width: "100%", height: 45, marginTop:10, marginBottom: 30 }]} onPress={addPlayer} >
          <View style={[{ flexDirection: "row" }]}>
            <FontAwesome5 name="plus" size={16} color="white" />
            <Text style={[styles.WHITEBUTTONTEXT, { marginRight: 10, marginLeft: 10 }]} tx="createPitch.addPlayer" />
          </View>
        </TouchableOpacity>
       
      </View>
      
      </ScrollView>
      <View style={[{backgroundColor:color.palette.blackGrey,width:"100%",position:"relative",bottom:0,height:"14%"},styles.HORIZONTAL_PADDING,styles.JUSTIFYCENTER, styles.ALIGNCENTER]}>
          <TouchableOpacity style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE]} onPress={()=>{props.navigation.navigate("pitchVideoRecord")}}>
            <Text style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]} tx="teamSetupScreen.skip" />
            <FontAwesome5 name="arrow-right" size={16} color="black" />
          </TouchableOpacity>
      </View>
    </Screen>
  )
}
