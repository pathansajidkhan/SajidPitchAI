import * as React from "react"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import {
  View,
  Dimensions,
  ScrollView,
  FlatList,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from "react-native"

import * as styles from "../../theme/appStyle"
import { Feather, FontAwesome5, FontAwesome } from "@expo/vector-icons"
import { UserModel } from "../../models/data/user-model"
import Loader from "../../components/spinner/loader"
import { spacing, color } from "../../theme"
import { SvgXml } from "react-native-svg"
import { ListItem, CheckBox } from "react-native-elements"
import { Text, Header, Screen, Button } from "../../components"
import * as AsyncStorage from "../../utils/storage/storage"
import { CurrentLoginInfoModel } from "../../models/data/session-model"
import UserService from "../../middleware/services/user-service"
import { GetPitchesModel } from "../../models/data/pitch-model"
import PitchService from "../../middleware/services/pitch-service"
import moment from "moment"
import { translate } from "../../i18n"
import { Video } from "expo-av"
import * as ScreenOrientation from "expo-screen-orientation"

export interface PlayerDetailScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  searchedPlayer: string
  userDetail: UserModel
  teamName: string
  orderPitchBy: string
  showPlayerDetails: boolean
  pitchList: GetPitchesModel[]
  userId: number
  selectedPitches: number[]
  showLoadMorePitches: boolean
  loadMorePitchCounts: number
  loadMorePageNumber: number
  pageSize: number
  loggedUser: UserModel
  sortBy: string
  session: CurrentLoginInfoModel
  isCoach: boolean
  showSortDropDown: boolean
  lastPitchDate: string
  lastPitchVideoUrl: string
  play: boolean
  arePitchesAvailable: boolean
  showHeader: boolean
}

export const PlayerDetailScreen: React.FunctionComponent<PlayerDetailScreenProps> = props => {
  const userService = new UserService()
  const pitchService = new PitchService(props)
  const [videoRef, setVideoRef] = React.useState<Video>(null)
  const convertHeightToFeetInches = (height: number): string => {
    if (!height) {
      return null
    }
    const feet = Math.floor(height / 12)
    const inche = height % 12

    return feet + "'" + inche + '"'
  }

  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    searchedPlayer: "",
    userDetail: new UserModel(),
    teamName: "",
    orderPitchBy: "1",
    showPlayerDetails: false,
    pitchList: [] as GetPitchesModel[],
    userId: props.route.params.userId ? props.route.params.userId : null,
    selectedPitches: [],
    showLoadMorePitches: true,
    loadMorePitchCounts: 2,
    loadMorePageNumber: 0,
    pageSize: 4,
    loggedUser: new UserModel(),
    sortBy: translate("playerDetailScreen.sortByNewFirst"),
    session: null,
    isCoach: null,
    showSortDropDown: false,
    lastPitchDate: "",
    lastPitchVideoUrl: null,
    play: false,
    arePitchesAvailable: false,
    showHeader: props.route.params.showHeader,
  })

  function goBack() {
    props.navigation.navigate("dashboard", {
      selectedTab: "Players",
      user: state.loggedUser,
      session: state.session,
    })
  }

  function lastPitchDate() {
    if (state.pitchList && state.pitchList.length > 0) return <Text>{state.lastPitchDate}</Text>
    else return <Text></Text>
  }

  function checkIcon(item) {
    return (
      <CheckBox
        checked={state.selectedPitches.includes(item.id) ? true : false}
        onPress={() => onSelectedPitches(item)}
      />
    )
  }

  const onSelectedPitches = item => {
    let tmp = state.selectedPitches
    if (tmp.includes(item.id)) {
      tmp.splice(tmp.indexOf(item))
    } else {
      tmp.push(item.id)
    }
    if (tmp && tmp.length > 2) {
      tmp.splice(tmp.indexOf(item))
      Alert.alert(translate("playerDetailScreen.cantSelectMoreThan2Player"))
    }
    setState(s => ({
      ...s,
      selectedPitches: tmp,
    }))
  }

  const goToPitchDetail = async (item: GetPitchesModel) => {
    setState(s => ({ ...s, loading: true }))
    await userService.getUser(item.playerUserId).then(async result => {
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
        setState(s => ({ ...s, loading: false }))
        props.navigation.navigate("pitchreport", {
          playerId: item.playerUserId,
          pitchId: item.id,
          pitchDate: moment(item.pitchDate).format("MMMM DD, YYYY"),
          userDetail: result.userResponse,
        })
      }
    })
  }

  const renderItem = ({ item }) => (
    <ListItem
      key={item.id}
      leftIcon={checkIcon(item)}
      titleStyle={styles.LISTITEM_TITLE}
      bottomDivider={true}
      chevron={{ size: 40 }}
      containerStyle={[styles.LISTITEM_CONTAINER, { paddingVertical: 2 }]}
      title={moment(item.pitchDate).format("MMM D, YYYY")}
      onPress={() => {
        goToPitchDetail(item)
      }}
    />
  )

  const sortPitchList = (selectedValue: any): void => {
    closeDropDown()
    if (+selectedValue === 1) {
      // Newest first
      setState(s => ({
        ...s,
        pitchList: state.pitchList.sort(
          (a, b) => new Date(b.pitchDate).getTime() - new Date(a.pitchDate).getTime(),
        ),
        orderPitchBy: "1",
        sortBy: translate("playerDetailScreen.sortByNewFirst"),
      }))
    } else if (+selectedValue === 2) {
      // Oldest first
      setState(s => ({
        ...s,
        pitchList: state.pitchList.sort(
          (a, b) => new Date(a.pitchDate).getTime() - new Date(b.pitchDate).getTime(),
        ),
        orderPitchBy: "2",
        sortBy: translate("playerDetailScreen.sortByOldFirst"),
      }))
    }
  }

  const keyExtractor = (item: any, index: { toString: () => any }) => index.toString()

  const { height } = Dimensions.get("window")

  const removeUser = async (): Promise<void> => {
    await userService.deleteUser(state.userDetail.id).then(async result => {
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
        const userDetails = JSON.parse(
          await AsyncStorage.loadString("UserDetails"),
        ) as CurrentLoginInfoModel
        await userService.getUser(userDetails.user.id).then(async user => {
          props.navigation.replace("dashboard", {
            user: user.userResponse,
            session: userDetails,
            selectedTab: "Players",
          })
        })
      }
    })
  }

  const openRemovePlayerConfirmation = () => {
    Alert.alert(
      "",
      "Remove " + state.userDetail.fullName + " from the " + state.teamName + "?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "default",
        },
        { text: "REMOVE", onPress: value => removeUser(value) },
      ],
      { cancelable: false },
    )
  }

  const getCurrentLoggedInUser = async () => {
    const userDetails = await AsyncStorage.loadString("UserDetails")
    const localUser = JSON.parse(userDetails) as CurrentLoginInfoModel
    const userId = localUser.user.id
    await userService.getUser(userId).then(result => {
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
          teamName: localUser.tenant.name,
          loggedUser: result.userResponse,
          session: localUser,
          isCoach: localUser.user.roleNames.includes("COACH"),
        }))
      }
    })
  }

  let pitchDetailResult = null
  const getPitches = async () => {
    setState(s => ({ ...s, loading: true }))
    await pitchService
      .getPitchListByPlayerId(state.userId, state.loadMorePageNumber, state.pageSize)
      .then(async pitches => {
        if (pitches.kind === "NETWORK_ISSUE") {
          setState(s => ({
            ...s,
            loading: false,
            showErrorPanel: true,
            infoMessage: "Network not available.",
          }))
        } else if (pitches.failureResponse != null) {
          setState(s => ({
            ...s,
            loading: false,
            showErrorPanel: true,
            infoMessage: pitches.failureResponse.message,
          }))
        } else {
          pitchDetailResult = pitches.pitchResponse.pitches[0]
          setState(s => ({
            ...s,
            loading: false,
            arePitchesAvailable:
              !!pitches.pitchResponse.pitches && pitches.pitchResponse.pitches.length > 0,
            pitchList: state.pitchList.concat(pitches.pitchResponse.pitches),
            loadMorePageNumber: state.loadMorePageNumber + 1,
            loadMorePitchCounts: state.loadMorePitchCounts + state.pageSize,
            lastPitchDate:
              !!pitches.pitchResponse.pitches && pitches.pitchResponse.pitches.length > 0
                ? moment(pitches.pitchResponse.pitches[0].pitchDate).format("MMM DD, YYYY")
                : null,
          }))
          if (pitches.pitchResponse.totalPitches <= state.loadMorePitchCounts) {
            setState(s => ({
              ...s,
              loading: false,
              showLoadMorePitches: false,
            }))
          }
        }
      })
  }

  const getUserDetails = async () => {
    // This is sample data
    const samplePitchList = [] as GetPitchesModel[]

    for (let i = 0; i < 10; i++) {
      samplePitchList.push({ id: i, pitchDate: new Date() } as GetPitchesModel)
    }
    if (state.userId) {
      const userId = state.userId
      await userService.getUser(userId).then(result => {
        setState(s => ({ ...s, loading: false, userDetail: result.userResponse }))
      })
    }
  }

  React.useEffect(() => {
    const loadStartupResourcesAsync = async () => {
      await getCurrentLoggedInUser().then(async () => {
        await getUserDetails().then(async () => {
          await getPitches().then(async () => {
            await downloadVideo()
          })
        })
      })
    }
    loadStartupResourcesAsync()
  }, [])

  const downloadVideo = async () => {
    if (
      !!pitchDetailResult &&
      (!!pitchDetailResult.videoSkeletonUrl || !!pitchDetailResult.videoUrl)
    ) {
      await pitchService
        .checkIfVideoExistsAndDownloadVideo(pitchDetailResult)
        .then(async pitchDownloadResult => {
          if (!!pitchDownloadResult) {
            if (!!pitchDownloadResult.videoUrlLocal) {
              setState(s => ({
                ...s,
                lastPitchVideoUrl: pitchDownloadResult.videoUrlLocal,
              }))
            }

            if (!!pitchDownloadResult.videoSkeletonUrlLocal) {
              setState(s => ({
                ...s,
                lastPitchVideoUrl: pitchDownloadResult.videoSkeletonUrlLocal,
              }))
            }
          }
        })
    }
  }

  const togglePlayerDetails = () => {
    setState(s => ({
      ...s,
      showPlayerDetails: !state.showPlayerDetails,
    }))
  }

  const goToPlayerEditScreen = () => {
    props.navigation.navigate("playerEditScreen", { user: state.userDetail })
  }

  const goToPitchCreateScreen = () => {
    let isRightHanded = true
    if (state.userDetail.isRightHanded === 1) {
      isRightHanded = true
    } else if (state.userDetail.isRightHanded === 0) {
      isRightHanded = false
    }
    props.navigation.navigate("pitchVideoRecord", {
      userId: state.userId,
      isRightHanded: isRightHanded,
    })
  }

  const gotoSelectionScreen = () => {
    props.navigation.replace("dashboard", {
      selectedTab: "Compare",
      user: state.loggedUser,
      selectedPlayer1: state.userDetail.id,
      selectedPlayer2: state.selectedPitches.length === 2 ? state.userDetail.id : null,
      selectedPitch1: state.selectedPitches.length >= 1 ? state.selectedPitches[0] : null,
      selectedPitch2: state.selectedPitches.length === 2 ? state.selectedPitches[1] : null,
      session: state.session,
    })
  }

  const gotoCompareScreen = () => {
    props.navigation.navigate("pitchcompare", {
      pitch1: state.selectedPitches[0],
      pitch2: state.selectedPitches[1],
    })
  }

  const dropDownArray = [
    {
      label: translate("playerDetailScreen.sortByNewFirst"),
      value: 1,
    },
    {
      label: translate("playerDetailScreen.sortByOldFirst"),
      value: 2,
    },
  ]

  const openDropDown = () => {
    setState(s => ({
      ...s,
      showSortDropDown: true,
    }))
  }

  const closeDropDown = () => {
    setState(s => ({
      ...s,
      showSortDropDown: false,
    }))
  }

  props.navigation.addListener("blur", async () => {
    await ScreenOrientation.unlockAsync()
  })

  const handlePlayPause = async () => {
    if (!!state.lastPitchVideoUrl) {
      let videoStatus = await videoRef.getStatusAsync()
      if (videoStatus.positionMillis == videoStatus.durationMillis) {
        state.play ? await videoRef.pauseAsync() : await videoRef.playFromPositionAsync(0)
      } else {
        state.play
          ? await videoRef.pauseAsync()
          : await videoRef.playFromPositionAsync(videoStatus.positionMillis)
      }
      setState(s => ({ ...s, play: !state.play }))
    } else {
      Alert.alert("Please wait, while the video is being downloaded...")
    }
  }

  const onPlaybackStatusUpdate = playbackStatus => {
    if (playbackStatus.didJustFinish) setState(s => ({ ...s, play: !state.play }))
  }

  return (
    <Screen>
      <ScrollView
        style={{
          height: height - 300,
          backgroundColor: "#323943",
        }}
      >
        <Loader loading={state.loading} />
        {state.showHeader && (
          <Header
            headerTx="playerDetailScreen.header"
            style={styles.SCREENHEADER}
            leftIcon="back"
            onLeftPress={goBack}
          />
        )}
        {state.showErrorPanel && (
          <View style={styles.ERROR_PANEL}>
            <Feather name="info" style={styles.INFOICON} size={20} />
            <Text style={styles.ERROR_PANEL_TEXT}>{state.infoMessage}</Text>
          </View>
        )}
        {state.isCoach && (
          <View>
            {!state.showPlayerDetails && (
              <View
                style={{
                  width: "100%",
                  backgroundColor: "#000000",
                  maxHeight: 400,
                }}
              >
                <View
                  style={{
                    height: "40%",
                    flexDirection: "row",
                    alignItems: "center",
                    maxHeight: 400,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text style={{ textAlign: "left" }}>&#32; </Text>
                  </View>
                  <View
                    style={{
                      flex: 4,
                      alignItems: "center",
                      marginTop: "40%",
                    }}
                  >
                    <SvgXml xml={styles.USER_PROFILE_LARGE} />
                    <Text
                      style={{ fontSize: 24, marginVertical: 15 }}
                      text={state.userDetail.fullName}
                    ></Text>
                    <View style={{ paddingTop: 30 }}></View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        resizeMode: "contain",
                      }}
                    />
                    <SvgXml
                      xml={styles.DELETE_SVG}
                      onPress={openRemovePlayerConfirmation}
                      style={{ marginRight: 35 }}
                    />
                  </View>
                </View>
                <View style={{ marginTop: 125 }}>
                  <ListItem
                    onPress={togglePlayerDetails}
                    key={1}
                    title={translate("pitchCompare.playerDetails")}
                    bottomDivider
                    containerStyle={{
                      backgroundColor: "#323943",
                      paddingVertical: 15,
                      marginBottom: 1,
                      marginHorizontal: 15,
                    }}
                    titleStyle={{ color: "#ffffff" }}
                    rightIcon={{
                      brand: true,
                      type: "font-awesome",
                      name: "angle-down",
                      color: "white",
                    }}
                  />
                </View>
              </View>
            )}

            {state.showPlayerDetails && (
              <View
                style={{
                  width: "100%",
                  backgroundColor: "#000000",
                  paddingTop: 5,
                  paddingBottom: 20,
                  margin: -10,
                }}
              >
                <View style={{ marginHorizontal: 25 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text
                      style={{ fontSize: 24, marginVertical: 15, marginRight: "auto" }}
                      text={state.userDetail.fullName}
                    ></Text>

                    <SvgXml
                      xml={styles.DELETE_SVG}
                      onPress={openRemovePlayerConfirmation}
                      style={{ marginTop: 20 }}
                    />
                  </View>
                  <View>
                    <ListItem
                      onPress={togglePlayerDetails}
                      key={1}
                      title={translate("pitchCompare.playerDetails")}
                      bottomDivider
                      containerStyle={{
                        backgroundColor: "#323943",
                        paddingVertical: 10,
                        marginBottom: 1,
                      }}
                      titleStyle={{ color: "#ffffff" }}
                      rightIcon={{
                        brand: true,
                        type: "font-awesome",
                        name: "angle-up",
                        color: "white",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      marginTop: 0,
                      paddingTop: 5,
                      paddingBottom: 20,
                      paddingHorizontal: 15,
                      backgroundColor: "#323943",
                    }}
                  >
                    <View style={{ flexDirection: "row", marginTop: spacing[1] }}>
                      <Text style={{ fontWeight: "700" }} tx="playerDetailScreen.email"></Text>
                      <Text> {state.userDetail.emailAddress}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: spacing[1] }}>
                      <Text style={{ fontWeight: "700" }} tx="playerDetailScreen.handedness"></Text>
                      <Text>&#32;</Text>
                      {state.userDetail.isRightHanded === 1 && (
                        <Text tx="playerDetailScreen.rhp"> </Text>
                      )}
                      {state.userDetail.isRightHanded === 0 && (
                        <Text tx="playerDetailScreen.lhp"> </Text>
                      )}
                    </View>
                    <View style={{ flexDirection: "row", marginTop: spacing[1] }}>
                      <Text style={{ fontWeight: "700" }} tx="playerDetailScreen.age"></Text>
                      {state.userDetail.age > 1 && <Text> {state.userDetail.age} years</Text>}
                      {state.userDetail.age === 1 && <Text> {state.userDetail.age} year</Text>}
                    </View>
                    <View style={{ flexDirection: "row", marginTop: spacing[1] }}>
                      <Text style={{ fontWeight: "700" }} tx="playerDetailScreen.height"></Text>
                      <Text> {convertHeightToFeetInches(state.userDetail.height)}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: spacing[1] }}>
                      <Text style={{ fontWeight: "700" }} tx="playerDetailScreen.weight"></Text>
                      <Text> {state.userDetail.weight} lbs</Text>
                    </View>
                    <View style={[{ alignItems: "center", justifyContent: "center" }]}>
                      <TouchableOpacity
                        style={[styles.WHITEBUTTON, styles.TOUCHABLE_OPACITY_STYLE]}
                        onPress={goToPlayerEditScreen}
                      >
                        <SvgXml xml={styles.EDIT_ICON} />
                        <Text style={{ marginLeft: 10 }} tx="playerDetailScreen.editDetails" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
        <View style={{ marginHorizontal: spacing[6], marginTop: spacing[6] }}>
          {state.arePitchesAvailable && (
            <ListItem
              key={1}
              title={translate("playerDetailScreen.lastPitch")}
              bottomDivider
              containerStyle={{ backgroundColor: "#10151b", paddingVertical: 5 }}
              titleStyle={{ color: "#ffffff" }}
              rightElement={lastPitchDate()}
            />
          )}
          {state.arePitchesAvailable && !!state.lastPitchVideoUrl && (
            <View
              style={{
                width: "100%",
                top: 0,
                height: (Dimensions.get("window").width * 9) / 16,
                justifyContent: "center",
              }}
            >
              <Video
                ref={ref => {
                  setVideoRef(ref)
                }}
                source={{ uri: state.lastPitchVideoUrl }}
                rate={1.0}
                volume={1.0}
                isMuted={true}
                resizeMode="contain"
                shouldPlay={false}
                style={{ width: "100%", height: "100%", backgroundColor: "black" }}
                useNativeControls={false}
                onPlaybackStatusUpdate={playbackStatus => onPlaybackStatusUpdate(playbackStatus)}
              />
              <Button
                style={{
                  backgroundColor: color.transparent,
                  position: "absolute",
                  alignSelf: "center",
                }}
                onPress={async () => await handlePlayPause()}
              >
                <SvgXml xml={state.play ? styles.VIDEO_PAUSE : styles.VIDEO_PLAY} />
              </Button>
            </View>
          )}
          {state.lastPitchVideoUrl === "" && (
            <View
              style={{
                height: "30%",
                backgroundColor: "#ffffff",
                opacity: 0.24,
                alignItems: "center",
                justifyContent: "center",
                maxHeight: 200,
              }}
            >
              <SvgXml xml={styles.VIDEO_PLAY} />
            </View>
          )}
          <View style={[{ alignItems: "center", justifyContent: "center", marginVertical: 20 }]}>
            <TouchableOpacity
              style={[styles.BUTTON_TRANSPARENT_DASHED, styles.TOUCHABLE_OPACITY_STYLE]}
              onPress={goToPitchCreateScreen}
            >
              <FontAwesome5 name="plus" size={16} color="white" />
              <Text style={{ marginLeft: 10 }} tx="playerDetailScreen.newPitch" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                paddingVertical: 5,
                fontSize: 14,
              }}
              tx="playerDetailScreen.selectAPitchToCompareResult"
            ></Text>
          </View>
          <View>
            <TouchableOpacity
              style={[styles.PICKER, { flexDirection: "row" }]}
              onPress={openDropDown}
            >
              <Text style={{ width: "95%", paddingHorizontal: 10, paddingVertical: 10 }}>
                {state.sortBy}
              </Text>
              <FontAwesome
                name="caret-down"
                size={18}
                color="white"
                style={{ marginRight: 0, marginTop: 15, paddingRight: 0 }}
              ></FontAwesome>
            </TouchableOpacity>
            <Modal
              transparent={true}
              visible={state.showSortDropDown}
              onRequestClose={() => (state.showSortDropDown = !state.showSortDropDown)}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "90%",
                    height: 100,
                    backgroundColor: "white",
                    borderRadius: 5,
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                  }}
                >
                  {dropDownArray.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => sortPitchList(item.value)}
                        style={{
                          padding: 5,
                        }}
                      >
                        <Text style={[styles.FONTMEDIUM, { color: "black" }]}>{item.label}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            </Modal>
          </View>
          <View style={{ marginBottom: 200 }}>
            <ListItem
              key={2}
              title="DATE"
              bottomDivider
              containerStyle={{ backgroundColor: "#10151b", paddingVertical: 5, marginTop: 10 }}
              titleStyle={{ color: "#ffffff" }}
            />
            <FlatList keyExtractor={keyExtractor} data={state.pitchList} renderItem={renderItem} />
            {state.showLoadMorePitches && (
              <TouchableOpacity
                style={[styles.WHITEBUTTON, styles.TOUCHABLE_OPACITY_STYLE, { width: "100%" }]}
                onPress={getPitches}
              >
                <Text tx="playerDetailScreen.loadMorePitches" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <SafeAreaView style={styles.FOOTER}>
          <View style={styles.FOOTER_CONTENT}></View>
          <View style={styles.FOOTER_CONTENT}></View>
          <View style={styles.FOOTER_CONTENT}></View>
        </SafeAreaView>
      </ScrollView>
      {state.selectedPitches.length !== 0 && (
        <View
          style={[
            {
              backgroundColor: color.palette.blackGrey,
              width: "100%",
              position: "absolute",
              bottom: 0,
              paddingTop: 20,
            },
            styles.HORIZONTAL_PADDING,
            styles.JUSTIFYCENTER,
            styles.ALIGNCENTER,
          ]}
        >
          {state.selectedPitches.length === 1 && (
            <Text tx="playerDetailScreen.selectASecondPitch"></Text>
          )}
          <TouchableOpacity
            style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE, { bottom: 5 }]}
            onPress={state.selectedPitches.length === 1 ? gotoSelectionScreen : gotoCompareScreen}
          >
            {state.selectedPitches.length === 1 ? (
              <Text
                style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]}
                tx="playerDetailScreen.otherPlayers"
              />
            ) : (
              <Text
                style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]}
                tx="playerDetailScreen.comparePitches"
              />
            )}
            <FontAwesome5 name="arrow-right" size={16} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </Screen>
  )
}
