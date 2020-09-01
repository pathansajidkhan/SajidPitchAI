import * as React from "react"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import { Screen, Text, Button } from "../../components"
import { View, FlatList, ScrollView, SafeAreaView, Image, TouchableOpacity } from "react-native"

import * as styles from "../../theme/appStyle"
import { ListItem } from "react-native-elements"
import { UserModel } from "../../models/data/user-model"
import Loader from "../../components/spinner/loader"
import PitchService from "../../middleware/services/pitch-service"
import { spacing, color } from "../../theme"
import { GetPitchesModel } from "../../models/data/pitch-model"
import { translate } from "../../i18n"
import moment from "moment"
import { Video } from "expo-av"
import PitchDBService from "../../middleware/database_services/pitch-db-services"
import BlobService from "../../middleware/services/blob-service"
import { CurrentLoginInfoModel } from "../../models/data/session-model"
import { SvgXml } from "react-native-svg"

export interface PlayerOverviewScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  searchText: string
  pitchList: GetPitchesModel[]
  pitchCount: number
  user: UserModel
  pitches: string
  videoReferenceObjArr: VideoReferenceObject[]
}

interface VideoReferenceObject {
  videoReference: Video
  videoObject: GetPitchesModel
  index: number
  play: boolean
}

export const PlayerOverview: React.FunctionComponent<PlayerOverviewScreenProps> = props => {
  const pitchService = new PitchService(props)
  const blobService = new BlobService()
  const pitchDBService = new PitchDBService()
  const [, setVideoRef] = React.useState<Video>(null)
  let videoRefArray: VideoReferenceObject[] = []

  const userDetails = props.route.params.user as UserModel
  const userSessionDetails = props.route.params.session as CurrentLoginInfoModel
  const [state, setState] = React.useState<State>({
    loading: true,
    showErrorPanel: false,
    infoMessage: "",
    searchText: "",
    pitchList: [],
    pitchCount: 0,
    user: new UserModel(),
    pitches: translate("playeroverview.pitchLabel"),
    videoReferenceObjArr: [],
  })

  // React.useEffect(() => {
  //   async function requestPlayers() {
  //     await getPlayers();
  //   }
  //   requestPlayers();
  // }, []);

  const getPlayers = async (): Promise<void> => {
    //const userDetails = await AsyncStorage.loadString("UserDetails")
    if (userSessionDetails) {
      // const localUser = JSON.parse(userDetails) as CurrentLoginInfoModel
      let playerDetail = props.route.params.user as UserModel
      if (!!playerDetail) {
        await pitchService.getRecentPitchesByUserId(4).then(result => {
          if (result.kind === translate("playeroverview.networkIssue")) {
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: translate("playeroverview.noNetwork"),
            }))
          } else if (result.failureResponse !== null) {
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: result.failureResponse.message,
            }))
          } else if (result.pitchResponse && result.pitchResponse.pitches.length > 0) {
            let counter = 0
            result.pitchResponse.pitches.forEach(async pitch => {
              // let videoUrlBlobSASResponse = await blobService.getFileUrlWithToken(pitch.videoUrl)
              await blobService
                .getFileUrlWithToken(pitch.videoUrl)
                .then(async videoUrlBlobSASResponse => {
                  let isUpdated = false
                  if (
                    !!videoUrlBlobSASResponse.blobResponse &&
                    !!videoUrlBlobSASResponse.blobResponse.fileUri
                  ) {
                    pitch.videoBlobSASUrl = videoUrlBlobSASResponse.blobResponse.fileUri
                    isUpdated = true
                  }
                  if (!!pitch.videoSkeletonUrl) {
                    let videoSkeletonBlobSASResponse = await blobService.getFileUrlWithToken(
                      pitch.videoSkeletonUrl,
                    )
                    if (
                      !!videoSkeletonBlobSASResponse.blobResponse &&
                      !!videoSkeletonBlobSASResponse.blobResponse.fileUri
                    ) {
                      pitch.videoSkeletonBlobSASUrl =
                        videoSkeletonBlobSASResponse.blobResponse.fileUri
                      isUpdated = true
                    }
                  }

                  videoRefArray.push({
                    videoReference: null,
                    videoObject: pitch,
                    index: pitch.id,
                    play: false,
                  })
                  if (isUpdated) {
                    await pitchDBService
                      .checkIfPitchExistsThenAddOrUpdate(pitch.id, pitch, true)
                      .then(() => {
                        isUpdated = false
                      })
                  }
                  if (result.pitchResponse.pitches.length - 1 <= counter) {
                    setState(s => ({
                      ...s,
                      loading: false,
                      showPlayerList: true,
                      pitchList: result.pitchResponse.pitches,
                      pitchCount: result.pitchResponse.totalPitches,
                      videoReferenceObjArr: videoRefArray,
                      pitches:
                        translate("playeroverview.pitchLabel") +
                        " " +
                        result.pitchResponse.totalPitches.toString(),
                      user: userDetails,
                    }))
                  }
                  counter++
                })
            })
          } else {
            setState(s => ({
              ...s,
              loading: false,
              showPlayerList: false,
              pitchList: null,
              pitchCount: 0,
              pitches: translate("playeroverview.pitchLabel") + " 0",
              user: userDetails,
            }))
          }
        })
      }
    }
  }

  //This is to reload control after update.
  if (props.route.params.reloadPitches && props.route.params.reloadPitches.toString() != "") {
    getPlayers()
    props.route.params.reloadPitches = ""
  }

  React.useMemo(() => {
    getPlayers()
  }, [])

  const keyExtractor = (item, index) => index.toString()

  const goToPitchDetail = async (item: GetPitchesModel) => {
    setState(s => ({ ...s, loading: true }))
    setState(s => ({ ...s, loading: false }))
    props.navigation.navigate("pitchreport", {
      playerId: item.playerUserId,
      pitchId: item.id,
      pitchDate: moment(item.pitchDate).format("MMM DD, YYYY"),
      userDetail: state.user,
      session: userSessionDetails,
    })
  }

  const goToPitchCreateScreen = () => {
    props.navigation.navigate("pitchVideoRecord")
  }

  const handlePlayPause = async (videoReferenceObject: VideoReferenceObject) => {
    await pitchService
      .checkIfVideoExistsAndDownloadVideo(videoReferenceObject.videoObject)
      .then(async item => {
        const videoReference = videoReferenceObject.videoReference
        if (!!item.videoSkeletonUrlLocal) {
          await videoReference.setNativeProps({ source: { uri: item.videoSkeletonUrlLocal } })
        } else if (!!item.videoUrlLocal) {
          await videoReference.setNativeProps({ source: { uri: item.videoUrlLocal } })
        } else {
          return
        }
        let videoStatus = await videoReference.getStatusAsync()
        let pauseTime = 0
        if (videoStatus.positionMillis != videoStatus.durationMillis) {
          pauseTime = videoStatus.positionMillis
        }
        if (videoReferenceObject.play) {
          await videoReference.pauseAsync()
        } else {
          await videoReference.playFromPositionAsync(pauseTime)
        }
        state.videoReferenceObjArr.find(
          x => x.index == videoReferenceObject.index,
        ).play = !videoReferenceObject.play
        setState(s => ({ ...s, videoReferenceObjArr: state.videoReferenceObjArr }))
      })
  }

  const onPlaybackStatusUpdate = (playbackStatus, videoReferenceObj) => {
    if (playbackStatus.didJustFinish) {
      state.videoReferenceObjArr.find(
        x => x.index == videoReferenceObj.index,
      ).play = !videoReferenceObj.play
      setState(s => ({ ...s, videoReferenceObj: state.videoReferenceObjArr }))
    }
  }

  const renderItem = renderObject => {
    let item: GetPitchesModel = renderObject.item
    return (
      <TouchableOpacity
        style={[styles.LISTITEM_CONTAINER, { flexDirection: "row", marginTop: 16 }]}
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
      >
        <View style={{ left: 20, right: 20, justifyContent: "center" }}>
          <Video
            ref={ref => {
              setVideoRef(ref)
              state.videoReferenceObjArr.forEach(refItem => {
                if (refItem.videoObject.id == item.id) {
                  refItem.videoReference = ref
                }
              })
            }}
            source={{
              uri: !!item.videoSkeletonBlobSASUrl
                ? item.videoSkeletonBlobSASUrl
                : item.videoBlobSASUrl,
            }}
            rate={1.0}
            volume={1.0}
            isMuted={true}
            resizeMode="contain"
            shouldPlay={false}
            style={{ width: 100, height: 56 }}
            useNativeControls={false}
            onPlaybackStatusUpdate={playbackStatus =>
              onPlaybackStatusUpdate(
                playbackStatus,
                state.videoReferenceObjArr.find(x => x.index == item.id),
              )
            }
          />
          <Button
            style={{
              backgroundColor: color.transparent,
              position: "absolute",
              alignSelf: "center",
              width: 100,
              height: 56,
            }}
            onPress={async () =>
              await handlePlayPause(state.videoReferenceObjArr.find(x => x.index == item.id))
            }
          >
            <SvgXml
              xml={
                state.videoReferenceObjArr.find(x => x.index == item.id).play
                  ? styles.VIDEO_PAUSE_LIST
                  : styles.VIDEO_PLAY
              }
              style={{ maxHeight: 32, maxWidth: 32 }}
            />
          </Button>
        </View>
        <ListItem
          key={item.id}
          title={
            (item.playerFullName ? item.playerFullName : translate("teamoverview.unknownPlayer")) +
            "\n\n" +
            moment(item.pitchDate).format("MMM DD, YYYY")
          }
          titleStyle={styles.OVERVIEW_LISTITEM_TITLE_BOLD}
          subtitleStyle={styles.LISTITEM_TITLE}
          bottomDivider={false}
          chevron={{ size: 40 }}
          containerStyle={[styles.LISTITEM_CONTAINER, { marginBottom: 10 }]}
          style={[{ width: "65%", marginLeft: "10%" }]}
          onPress={() => goToPitchDetail(item)}
        />
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView style={[styles.ROOT]}>
      <Screen preset="scroll">
        <Loader loading={state.loading} />
        <View
          style={[
            styles.MAIN_VIEW_CONTAINER,
            {
              paddingVertical: 25,
              flexDirection: "row",
              backgroundColor: color.palette.black,
            },
          ]}
        >
          <View
            style={{
              justifyContent: "flex-start",
              marginHorizontal: -10,
              width: 80,
              height: 80,
            }}
          >
            {!!state.user.userPhotoLocal ? (
              <Image
                source={{ uri: state.user.userPhotoLocal }}
                style={{ width: 80, height: 80 }}
              />
            ) : (
              <Image
                source={require("../../../assets/default-image-player.png")}
                style={{ width: 80, height: 80 }}
              />
            )}
          </View>
          <View
            style={{
              justifyContent: "flex-end",
              marginHorizontal: 25,
              marginVertical: 25,
              backgroundColor: color.palette.black,
              marginTop: 10,
            }}
          >
            <Text
              style={[styles.OVERVIEW_LISTITEM_TITLE_BOLD, { fontSize: 24, letterSpacing: 0.68 }]}
              text={state.user.fullName}
            ></Text>
            <Text style={[styles.OVERVIEW_LISTITEM_TITLE_BOLD, { letterSpacing: 0.39 }]}>
              {state.pitches}
            </Text>
          </View>
        </View>

        {state.pitchCount <= 0 && (
          <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: 100, height: "100%" }]}>
            <View style={{ alignItems: "center" }}>
              <Image source={require("../../../assets/dashboard.png")} />
              <Text
                style={[styles.TEXT18, { marginTop: spacing[4] }]}
                tx="playeroverview.noPitchesFound"
              />
            </View>
            <Button
              style={[styles.LoginButton, { marginTop: 20 }]}
              tx="playeroverview.recordAPitch"
              textStyle={styles.BLUEBUTTONTEXT}
              onPress={goToPitchCreateScreen}
            />
          </View>
        )}
        {!!state.videoReferenceObjArr && state.videoReferenceObjArr.length > 0 && (
          <View style={{ height: "100%" }}>
            <Text
              style={{
                color: "#ffffff",
                letterSpacing: 0.63,
                fontWeight: "500",
                fontFamily: "Roboto",
                fontSize: 20,
                marginTop: 20,
                marginLeft: 20,
              }}
              tx="playeroverview.recentPitches"
            ></Text>
            <View style={{ margin: 20 }}>
              <FlatList
                keyExtractor={keyExtractor}
                data={state.pitchList}
                renderItem={renderItem}
              />
            </View>
          </View>
        )}
        <SafeAreaView style={styles.FOOTER}>
          <View style={styles.FOOTER_CONTENT}></View>
        </SafeAreaView>
      </Screen>
    </ScrollView>
  )
}
