import * as React from "react"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import { Screen, Text, Header, Button } from "../../components"
import {
  View,
  FlatList,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native"
import * as styles from "../../theme/appStyle"
import { ListItem } from "react-native-elements"
import UserService from "../../middleware/services/user-service"
import * as AsyncStorage from "../../utils/storage/storage"
import { CurrentLoginInfoModel } from "../../models/data/session-model"
import { UserModel } from "../../models/data/user-model"
import Loader from "../../components/spinner/loader"
import PitchService from "../../middleware/services/pitch-service"
import { color } from "../../theme"
import { GetPitchesModel } from "../../models/data/pitch-model"
import { translate } from "../../i18n"
import moment from "moment"
import { Video } from "expo-av"
import TenantService from "../../middleware/services/tenant-service"
import { TenantModel } from "../../models/data/tenant-model"
import BlobService from "../../middleware/services/blob-service"
import { SvgXml } from "react-native-svg"
import PitchDBService from "../../middleware/database_services/pitch-db-services"

export interface TeamUntaggedPitchesScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  pitchList: GetPitchesModel[]
  pitchCount: number
  user: UserModel
  players: string
  teamLogo: string
  tenant: TenantModel
  untaggedPlayerCounts: number
  play: boolean
  videoReferenceObjArr: VideoReferenceObject[]
}

interface VideoReferenceObject {
  videoReference: Video
  videoObject: GetPitchesModel
  index: number
  play: boolean
}

export const TeamUntaggedPitches: React.FunctionComponent<TeamUntaggedPitchesScreenProps> = props => {
  const userService = new UserService(props)
  const tenantService = new TenantService(props)
  const pitchService = new PitchService(props)
  const [videoRef, setVideoRef] = React.useState<Video>(null)
  let videoRefArray: VideoReferenceObject[] = []

  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    pitchList: [],
    pitchCount: 0,
    user: new UserModel(),
    players: translate("teamoverview.playerLabel"),
    teamLogo: "",
    tenant: new TenantModel(),
    untaggedPlayerCounts: 0,
    play: false,
    videoReferenceObjArr: [],
  })

  const { height } = Dimensions.get("window")

  const getPlayers = async (): Promise<void> => {
    setState(s => ({ ...s, loading: true }))
    const blobService = new BlobService()
    const pitchDBService = new PitchDBService()
    const userDetails = await AsyncStorage.loadString("UserDetails")
    if (userDetails) {
      const localUser = JSON.parse(userDetails) as CurrentLoginInfoModel
      userService.getUser(localUser.user.id).then(async res => {
        const playerdetail = res.userResponse
        await tenantService.getTenant(localUser.tenant.id).then(response => {
          const tenant = response.tenantResponse

          if (tenant != null) {
            setState(s => ({ ...s, teamLogo: tenant.teamLogoUrl, tenant: tenant }))
          }
          pitchService.getRecentPitches(-1).then(result => {
            if (result.pitchResponse && result.pitchResponse.pitches.length > 0) {
              result.pitchResponse.pitches = result.pitchResponse.pitches.filter(
                x => x.playerUserId === null || x.playerUserId === 0,
              )
              let counter = 0
              result.pitchResponse.pitches.forEach(async pitch => {
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
                    if (result.pitchResponse.pitches.length - 1 == counter) {
                      setState(s => ({
                        ...s,
                        loading: false,
                        showPlayerList: true,
                        pitchList: result.pitchResponse.pitches,
                        pitchCount: result.pitchResponse.totalPitches,
                        videoReferenceObjArr: videoRefArray,
                        pitches:
                          translate("teamoverview.pitchLabel") +
                          " " +
                          result.pitchResponse.totalPitches.toString(),
                        user: playerdetail,
                        players:
                          translate("teamoverview.playerLabel") +
                          " " +
                          result.pitchResponse.totalPlayers.toString(),
                        untaggedPlayerCounts: result.pitchResponse.totalUntaggedPlayers,
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
                pitches: translate("teamoverview.pitchLabel") + " 0",
                user: playerdetail,
                players:
                  translate("teamoverview.playerLabel") +
                  " " +
                  result.pitchResponse.totalPlayers.toString(),
              }))
            }
          })
        })
      })
    }
  }

  React.useMemo(() => {
    getPlayers()
  }, [])

  const keyExtractor = (item, index) => index.toString()

  const goToPitchDetail = async (item: GetPitchesModel) => {
    props.navigation.navigate("pitchreport", {
      playerId: item.playerUserId,
      pitchId: item.id,
      pitchDate: moment(item.pitchDate).format("MMMM DD, YYYY"),
      userDetail: null,
      pitchVideoUrlLocal:
        item.videoSkeletonUrlLocal && item.videoSkeletonUrl !== null && item.videoSkeletonUrl !== ""
          ? item.videoSkeletonUrlLocal
          : item.videoUrlLocal,
    })
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

  const goBack = React.useMemo(
    () => async () => {
      props.navigation.goBack()
    },
    [props.navigation],
  )

  return (
    <Screen style={[styles.ROOT, { backgroundColor: color.palette.black }]} preset="scroll">
      <Loader loading={state.loading} />
      <Header
        headerTx="teamuntaggedpitches.header"
        style={styles.SCREENHEADER}
        leftIcon="back"
        onLeftPress={goBack}
      />
      {!!state.videoReferenceObjArr && state.videoReferenceObjArr.length > 0 && (
        <View style={{ backgroundColor: "#323943", height: "100%" }}>
          <Text
            style={{
              color: "#ffffff",
              letterSpacing: 0.45,
              fontFamily: "Roboto",
              fontSize: 16,
              marginTop: 20,
              marginLeft: 20,
              lineHeight: 24,
            }}
            tx="teamuntaggedpitches.untaggedPitchHeader"
          />
          <View
            style={{
              borderBottomColor: "#000000",
              borderBottomWidth: 1,
              marginTop: 20,
              marginLeft: 20,
              marginRight: 20,
            }}
          />
          <View style={{ margin: 20 }}>
            <ScrollView
              style={{
                height: height - 220,
                backgroundColor: color.palette.charcoalGrey,
              }}
            >
              <FlatList
                keyExtractor={keyExtractor}
                data={state.pitchList}
                renderItem={renderItem}
              />
            </ScrollView>
          </View>
        </View>
      )}
      <SafeAreaView style={styles.FOOTER}>
        <View style={styles.FOOTER_CONTENT}></View>
      </SafeAreaView>
    </Screen>
  )
}
