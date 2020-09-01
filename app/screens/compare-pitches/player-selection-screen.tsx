import React from "react"
import { View, YellowBox, FlatList, Alert, SegmentedControlIOSBase } from "react-native"
import { Screen, Text } from "../../components"

import Loader from "../../components/spinner/loader"
import * as styles from "../../theme/appStyle"
import { Button } from "../../components"
import { color } from "../../theme"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import { DropdownModel } from "../../models/data/common-model"
import PitchService from "../../middleware/services/pitch-service"
import { GetPitchesModel } from "../../models/data/pitch-model"
import moment from "moment"
import { ListItem } from "react-native-elements"
import { translate } from "../../i18n"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"

import RNPickerSelect from "react-native-picker-select"
import { SvgXml } from "react-native-svg"
import { Ionicons } from "@expo/vector-icons"
import { GetRecentPitchesResponse } from "../../services/api"
import { Video } from "expo-av"
import BlobService from "../../middleware/services/blob-service"
import PitchDBService from "../../middleware/database_services/pitch-db-services"

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  searchText: string
  playerList: DropdownModel[]
  pitchList1: GetPitchesModel[]
  pitchList2: GetPitchesModel[]
  showPlayerList: boolean
  selectedPlayer1: number
  selectedPlayer2: number
  selectedPitch1: number
  selectedPitch2: number
  firstPlayerfilteredPitch: GetPitchesModel
  secondPlayerfilteredPitch: GetPitchesModel
  firstPlayerVideoReferenceObjArr: VideoReferenceObject[]
  secondPlayerVideoReferenceObjArr: VideoReferenceObject[]
}

interface VideoReferenceObject {
  videoReference: Video
  videoObject: GetPitchesModel
  index: number
  play: boolean
}

export interface ComparePitchesPlayerSelectionScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
  route: any
}

export const ComparePitchesPlayerSelectionScreen: React.FunctionComponent<ComparePitchesPlayerSelectionScreenProps> = props => {
  const pitchService = new PitchService(props)
  const blobService = new BlobService()
  const pitchDBService = new PitchDBService()

  const [pitch, setPitch] = React.useState([] as GetPitchesModel[])
  const [firstPlayerVideoRef, setFirstPlayerVideoRef] = React.useState<Video>(null)
  const [secondPlayerVideoRef, setSecondPlayerVideoRef] = React.useState<Video>(null)
  let firstPlayerVideoRefArray: VideoReferenceObject[] = []
  let secondPlayerVideoRefArray: VideoReferenceObject[] = []

  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    searchText: "",
    playerList: [],
    pitchList1: [],
    pitchList2: [],
    showPlayerList: false,
    selectedPlayer1:
      props.route.params &&
      props.route.params.selectedPlayer1 &&
      props.route.params.selectedPlayer1 > 0
        ? props.route.params.selectedPlayer1
        : null,
    selectedPlayer2:
      props.route.params &&
      props.route.params.selectedPlayer2 &&
      props.route.params.selectedPlayer2 > 0
        ? props.route.params.selectedPlayer2
        : null,
    selectedPitch1:
      props.route.params &&
      props.route.params.selectedPitch1 &&
      props.route.params.selectedPitch1 > 0
        ? props.route.params.selectedPitch1
        : 0,
    selectedPitch2:
      props.route.params &&
      props.route.params.selectedPitch2 &&
      props.route.params.selectedPitch2 > 0
        ? props.route.params.selectedPitch2
        : 0,
    firstPlayerfilteredPitch: null,
    secondPlayerfilteredPitch: null,
    firstPlayerVideoReferenceObjArr: [],
    secondPlayerVideoReferenceObjArr: [],
  })

  const getPitchesForPlayer = async (playerId, dropdown): Promise<void> => {
    if (dropdown == "pitch1") {
      setState(s => ({ ...s, loading: true }))
      firstPlayerVideoRefArray = []
      let counter = 0
      var pitches = pitch
        .filter(obj => {
          return obj.playerUserId == playerId
        })
        .sort((a, b) => new Date(b.pitchDate).getTime() - new Date(a.pitchDate).getTime())
      await pitches.forEach(async pitch => {
        firstPlayerVideoRefArray.push({
          videoReference: null,
          videoObject: pitch,
          index: pitch.id,
          play: false,
        })
        if (pitches.length - 1 == counter) {
          setState(s => ({
            ...s,
            pitchList1: pitches,
            firstPlayerVideoReferenceObjArr: firstPlayerVideoRefArray,
          }))
        } else {
          counter++
        }
      })
    } else {
      setState(s => ({ ...s, loading: true }))
      secondPlayerVideoRefArray = []
      let counter = 0
      var pitches = pitch
        .filter(obj => {
          return obj.playerUserId == playerId && obj.id !== state.selectedPitch1
        })
        .sort((a, b) => new Date(b.pitchDate).getTime() - new Date(a.pitchDate).getTime())
      pitches.forEach(async pitch => {
        //console.log(state.selectedPitch1)
        secondPlayerVideoRefArray.push({
          videoReference: null,
          videoObject: pitch,
          index: pitch.id,
          play: false,
        })
        if (pitches.length - 1 == counter) {
          setState(s => ({
            ...s,
            pitchList2: pitches,
            secondPlayerVideoReferenceObjArr: secondPlayerVideoRefArray,
          }))
        } else {
          counter++
        }
      })
    }
    setState(s => ({ ...s, loading: false }))
  }

  const getPlayers = async (): Promise<void> => {
    setState(s => ({ ...s, loading: true }))
    await pitchService.getRecentPitches(-1).then(response => {
      if (!!response.pitchResponse && response.pitchResponse.pitches.length > 0) {
        let counter = 0
        response.pitchResponse.pitches.forEach(async pitch => {
          let videoUrlBlobSASResponse = await blobService.getFileUrlWithToken(pitch.videoUrl)
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
              pitch.videoSkeletonBlobSASUrl = videoSkeletonBlobSASResponse.blobResponse.fileUri
              isUpdated = true
            }
          }
          if (isUpdated) {
            await pitchDBService
              .checkIfPitchExistsThenAddOrUpdate(pitch.id, pitch, true)
              .then(() => {
                isUpdated = false
              })
          }
          if (response.pitchResponse.pitches.length - 1 == counter) {
            setPitch(response.pitchResponse.pitches)

            if (state.selectedPitch1 !== null) {
              //populate pitchList based on selectedPitch1
              const pitchArray = response.pitchResponse.pitches.filter(
                p => p.id == state.selectedPitch1,
              )
              setState(s => ({
                ...s,
                filteredPitch1List: pitchArray[0],
                selectedPitch1: state.selectedPitch1,
              }))
            }

            var dropdownMap = response.pitchResponse.pitches
              .sort((a, b) =>
                a.playerFullName > b.playerFullName
                  ? 1
                  : b.playerFullName > a.playerFullName
                  ? -1
                  : 0,
              )

              .map(obj => {
                return ({
                  label:
                    obj.playerUserId !== 0
                      ? obj.playerFullName === null ||
                        obj.playerFullName === undefined ||
                        obj.playerFullName.trim() == ""
                        ? obj.playerEmailAddress && obj.playerEmailAddress !== null
                          ? obj.playerEmailAddress
                          : ""
                        : obj.playerFullName.trim()
                      : translate("teamoverview.unknownPlayer"),
                  value: obj.playerUserId,
                } as unknown) as DropdownModel
              })

            var uniquePlayers = [
              ...new Set(
                dropdownMap.map(item => {
                  return JSON.stringify(item)
                }),
              ),
            ]
            dropdownMap = uniquePlayers.map(obj => {
              return JSON.parse(obj) as DropdownModel
            })
            setState(s => ({ ...s, loading: false, showPlayerList: true, playerList: dropdownMap }))
          } else {
            counter++
          }
        })
      }
    })
  }

  const keyExtractor = (item, index) => index.toString()

  const handlePlayPause = async (
    videoReferenceObject: VideoReferenceObject,
    isFirstPlayerHandleRequest: boolean,
  ) => {
    await pitchService
      .checkIfVideoExistsAndDownloadVideo(videoReferenceObject.videoObject)
      .then(async item => {
        const videoReference = videoReferenceObject.videoReference
        if (!!item.videoSkeletonUrlLocal) {
          await videoReference.setNativeProps({ source: { uri: item.videoSkeletonUrlLocal } })
        } else if (!!item.videoUrlLocal) {
          await videoReference.setNativeProps({ source: { uri: item.videoUrlLocal } })
        } else {
          Alert.alert("Video cannot be downloaded")
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

        if (isFirstPlayerHandleRequest) {
          state.firstPlayerVideoReferenceObjArr.find(
            x => x.index == videoReferenceObject.index,
          ).play = !videoReferenceObject.play
          setState(s => ({
            ...s,
            firstPlayerVideoReferenceObjArr: state.firstPlayerVideoReferenceObjArr,
          }))
        } else {
          state.secondPlayerVideoReferenceObjArr.find(
            x => x.index == videoReferenceObject.index,
          ).play = !videoReferenceObject.play
          setState(s => ({
            ...s,
            secondPlayerVideoReferenceObjArr: state.secondPlayerVideoReferenceObjArr,
          }))
        }
      })
  }

  const onPlaybackStatusUpdate = (
    playbackStatus,
    videoReferenceObj,
    isFirstPlayerHandleRequest: boolean,
  ) => {
    if (playbackStatus.didJustFinish) {
      if (isFirstPlayerHandleRequest) {
        if (
          !!state.firstPlayerVideoReferenceObjArr &&
          state.firstPlayerVideoReferenceObjArr.length > 0
        ) {
          state.firstPlayerVideoReferenceObjArr.find(
            x => x.index == videoReferenceObj.index,
          ).play = !videoReferenceObj.play
          setState(s => ({
            ...s,
            firstPlayerVideoReferenceObjArr: state.firstPlayerVideoReferenceObjArr,
          }))
        }
      } else {
        if (
          !!state.secondPlayerVideoReferenceObjArr &&
          state.secondPlayerVideoReferenceObjArr.length > 0
        ) {
          state.secondPlayerVideoReferenceObjArr.find(
            x => x.index == videoReferenceObj.index,
          ).play = !videoReferenceObj.play
          setState(s => ({
            ...s,
            secondPlayerVideoReferenceObjArr: state.secondPlayerVideoReferenceObjArr,
          }))
        }
      }
    }
  }

  const renderFirstPlayerItem = ({ pitchDetail }) => {
    let item: GetPitchesModel = pitchDetail
    return (
      <View
        style={[styles.LISTITEM_CONTAINER, { flexDirection: "row", marginTop: 16 }]}
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
      >
        <View style={{ left: 20, right: 20, justifyContent: "center" }}>
          <Video
            ref={ref => {
              setFirstPlayerVideoRef(ref)
              state.firstPlayerVideoReferenceObjArr.forEach(refItem => {
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
                state.firstPlayerVideoReferenceObjArr.find(x => x.index == item.id),
                true,
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
              await handlePlayPause(
                state.firstPlayerVideoReferenceObjArr.find(x => x.index == item.id),
                true,
              )
            }
          >
            <SvgXml
              xml={
                state.firstPlayerVideoReferenceObjArr.find(x => x.index == item.id).play
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
              (item.playerFullName
                ? item.playerFullName
                : translate("teamoverview.unknownPlayer")) +
              "\n\n" +
              moment(item.pitchDate).format("MMM DD, YYYY")
            }
            titleStyle={styles.OVERVIEW_LISTITEM_TITLE_BOLD}
            subtitleStyle={styles.LISTITEM_TITLE}
            bottomDivider={false}
            chevron={{ size: 40 }}
            containerStyle={[styles.LISTITEM_CONTAINER, { marginBottom: 10 }]}
            style={[
              { width: "65%", marginLeft: "10%", marginBottom: 15 },
              state.selectedPitch1 == item.id && state.firstPlayerfilteredPitch == null
                ? {
                    borderColor: color.palette.lightBlue,
                    borderWidth: 4,
                    borderStyle: "solid",
                    borderBottomColor: color.palette.lightBlue,
                    borderBottomWidth: 4,
                  }
                : {},
            ]}
            onPress={() => {
              var filter = state.pitchList1.filter(p => p.id == item.id)
              setState(s => ({
                ...s,
                firstPlayerfilteredPitch: filter[0],
                selectedPitch1: item.id,
              }))
            }}
          />
      </View>
    )
  }

  const renderSecondPlayerItem = ({ pitchDetail }) => {
    let item: GetPitchesModel = pitchDetail
    return (
      <View
        style={[styles.LISTITEM_CONTAINER, { flexDirection: "row", marginTop: 16 }]}
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
      >
        <View style={{ left: 20, right: 20, justifyContent: "center" }}>
          <Video
            ref={ref => {
              setSecondPlayerVideoRef(ref)
              state.secondPlayerVideoReferenceObjArr.forEach(refItem => {
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
                state.secondPlayerVideoReferenceObjArr.find(x => x.index == item.id),
                false,
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
              await handlePlayPause(
                state.secondPlayerVideoReferenceObjArr.find(x => x.index == item.id),
                false,
              )
            }
          >
            <SvgXml
              xml={
                state.secondPlayerVideoReferenceObjArr.find(x => x.index == item.id).play
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
          style={[
            { width: "65%", marginLeft: "10%", marginBottom: 15 },
            state.selectedPitch2 == item.id && state.secondPlayerfilteredPitch == null
              ? {
                  borderColor: color.palette.lightBlue,
                  borderWidth: 4,
                  borderStyle: "solid",
                  borderBottomColor: color.palette.lightBlue,
                  borderBottomWidth: 4,
                }
              : {},
          ]}
          onPress={() => {
            var filter = state.pitchList2.filter(p => p.id == item.id)
            setState(s => ({ ...s, secondPlayerfilteredPitch: filter[0], selectedPitch2: item.id }))
          }}
        />
      </View>
    )
  }

  React.useMemo(async () => {
    YellowBox.ignoreWarnings([
      "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.", // TODO: Remove when fixed
    ])
    await getPlayers()
  }, [])

  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Loader loading={state.loading} />
      <ScrollView>
        <View style={[styles.MAIN_VIEW_CONTAINER, styles.ALIGNLEFT, { marginTop: 15 }]}>
          <Text style={[styles.TEXT18, styles.FONTREGULAR]} tx="comparePitches.select2Pitches" />
          <View style={[styles.ALIGNLEFT, { marginTop: 15, width: "100%" }]}>
            <View
              style={
                state.firstPlayerfilteredPitch && state.firstPlayerfilteredPitch !== null
                  ? { flexDirection: "row", width: "100%" }
                  : {}
              }
            >
              <Text
                style={[
                  styles.TEXT18,
                  styles.FONTBOLD,
                  styles.TEXTALIGNLEFT,
                  { paddingBottom: 10, width: "50%" },
                ]}
                tx="comparePitches.pitch1"
              />
              {!!state.firstPlayerfilteredPitch && (
                <View style={{ width: "50%" }}>
                  <TouchableOpacity
                    hitSlop={{ left: -100, right: 0 }}
                    style={styles.ALIGNRIGHT}
                    onPress={() => {
                      setState(s => ({
                        ...s,
                        firstPlayerfilteredPitch: null,
                        selectedPlayer2: null,
                        selectedPitch2: null,
                        secondPlayerfilteredPitch: null,
                      }))
                    }}
                  >
                    <SvgXml
                      xml={styles.ICON_EDIT}
                      style={[styles.PROVIDERICON, { marginLeft: 35 }]}
                    />
                    <Text tx="comparePitches.change" style={[styles.TEXT16, styles.FONTMEDIUM]} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {!!state.firstPlayerfilteredPitch ? (
              renderFirstPlayerItem({ pitchDetail: state.firstPlayerfilteredPitch })
            ) : (
              <View style={{ width: "100%" }}>
                <RNPickerSelect
                  onValueChange={async value => {
                    setState(s => ({ ...s, selectedPlayer1: value, selectedPitch1: null }))
                    getPitchesForPlayer(value, "pitch1")
                  }}
                  items={state.playerList}
                  placeholder={{ label: "Player", value: null }}
                  value={state.selectedPlayer1}
                  useNativeAndroidPickerStyle={false}
                  style={{ ...styles.pickerSelectStyles, iconContainer: { top: 10, right: 12 } }}
                  Icon={() => {
                    return <Ionicons name="md-arrow-dropdown" size={24} color="white" />
                  }}
                />
                {!!state.firstPlayerVideoReferenceObjArr &&
                  state.firstPlayerVideoReferenceObjArr.length > 0 && (
                    <View style={{ marginTop: 10, width: "100%", maxHeight: "75%" }}>
                      <FlatList
                        nestedScrollEnabled
                        keyExtractor={keyExtractor}
                        data={state.pitchList1}
                        renderItem={item => renderFirstPlayerItem({ pitchDetail: item.item })}
                      />
                    </View>
                  )}
              </View>
            )}
            <View
              style={
                state.selectedPitch1 > 0
                  ? { flexDirection: "row", width: "100%", paddingTop: 10 }
                  : { paddingTop: 10 }
              }
            >
              <Text
                style={[
                  styles.TEXT18,
                  styles.FONTBOLD,
                  styles.TEXTALIGNLEFT,
                  { paddingBottom: 10, width: "50%" },
                ]}
                tx="comparePitches.pitch2"
              />
              {!!state.secondPlayerfilteredPitch && (
                <View style={{ width: "50%" }}>
                  <TouchableOpacity
                    style={styles.ALIGNRIGHT}
                    onPress={() => {
                      setState(s => ({
                        ...s,
                        selectedPitch2: null,
                        secondPlayerfilteredPitch: null,
                      }))
                    }}
                  >
                    <SvgXml
                      xml={styles.ICON_EDIT}
                      style={[styles.PROVIDERICON, { marginLeft: 35 }]}
                    />
                    <Text tx="comparePitches.change" style={[styles.TEXT16, styles.FONTMEDIUM]} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {state.selectedPlayer1 !== null && state.selectedPitch1 > 0 ? (
              !!state.secondPlayerfilteredPitch ? (
                renderSecondPlayerItem({ pitchDetail: state.secondPlayerfilteredPitch })
              ) : (
                <View style={{ width: "100%" }}>
                  <RNPickerSelect
                    onValueChange={async value => {
                      setState(s => ({ ...s, selectedPlayer2: value, selectedPitch2: null }))
                      await getPitchesForPlayer(value, "pitch2")
                    }}
                    items={state.playerList}
                    placeholder={{ label: "Player", value: null }}
                    value={state.selectedPlayer2}
                    useNativeAndroidPickerStyle={false}
                    style={{ ...styles.pickerSelectStyles, iconContainer: { top: 10, right: 12 } }}
                    Icon={() => {
                      return <Ionicons name="md-arrow-dropdown" size={24} color="white" />
                    }}
                  />
                  {state.selectedPlayer2 !== null &&
                    (!!state.secondPlayerVideoReferenceObjArr &&
                    state.secondPlayerVideoReferenceObjArr.length > 0 ? (
                      <View style={{ marginTop: 10, width: "100%", maxHeight: "75%" }}>
                        <FlatList
                          nestedScrollEnabled
                          keyExtractor={keyExtractor}
                          data={state.pitchList2}
                          renderItem={item => renderSecondPlayerItem({ pitchDetail: item.item })}
                        />
                      </View>
                    ) : (
                      <View>
                        <Text
                          tx="comparePitches.noAvailablePitches"
                          style={[styles.TEXT16, styles.TEXTALIGNCENTER]}
                        />
                      </View>
                    ))}
                </View>
              )
            ) : (
              <Text style={[styles.TEXT16, styles.FONTREGULAR]} tx="comparePitches.selectPitch1" />
            )}
          </View>
        </View>
      </ScrollView>
      <View
        style={[
          styles.HORIZONTAL_PADDING,
          styles.JUSTIFYCENTER,
          styles.ALIGNCENTER,
          {
            backgroundColor: color.palette.blackGrey,
            width: "100%",
            position: "relative",
            bottom: 0,
            height: "18%",
          },
        ]}
      >
        <Text
          style={[styles.TEXT14, styles.FONTREGULAR, { paddingBottom: 5 }]}
          tx="comparePitches.pitchesSelected"
          txOptions={{
            num:
              state.selectedPitch1 > 0 && state.selectedPitch2 > 0
                ? 2
                : state.selectedPitch1 > 0 || state.selectedPitch2 > 0
                ? 1
                : 0,
          }}
        />
        <Button
          style={
            state.selectedPitch1 > 0 && state.selectedPitch2 > 0
              ? [styles.BLUEBUTTON]
              : [styles.DISABLEDBUTTON]
          }
          tx="comparePitches.comparePitches"
          textStyle={
            state.selectedPitch1 > 0 && state.selectedPitch2 > 0
              ? styles.BLUEBUTTONTEXT
              : styles.DISABLEDUTTONTEXT
          }
          disabled={state.selectedPitch1 > 0 && state.selectedPitch2 > 0 ? false : true}
          onPress={() =>
            props.navigation.navigate("pitchcompare", {
              pitch1: state.selectedPitch1,
              pitch2: state.selectedPitch2,
            })
          }
        ></Button>
      </View>
    </Screen>
  )
}
