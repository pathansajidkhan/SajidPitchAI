import React from "react"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Text, Screen, Header, Button, TextField } from "../../components"
const { API_URL } = require("../../config/env")
import {
  View,
  Dimensions,
  Alert,
  TouchableHighlight,
  Image,
  Platform,
  StatusBar,
  Clipboard,
  Modal,
} from "react-native"
import Loader from "../../components/spinner/loader"
import * as styles from "../../theme/appStyle"
import { ParamListBase } from "@react-navigation/native"
import { spacing, color } from "../../theme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { LineChart, YAxis } from "react-native-svg-charts"
import { Line, SvgXml } from "react-native-svg"
import { translate } from "../../i18n"
import PitchService from "../../middleware/services/pitch-service"
import { comparisonCoordinates2d, kinematic } from "../../models/data/pitch-model"
import NetworkValidator from "../../../app/middleware/network-validator"
import Tooltip from "react-native-walkthrough-tooltip"
import { UserModel } from "../../models/data/user-model"
import { FirstPitch } from "../compare-pitches/pitch-compare-screen"
import Dash from "react-native-dash"
import { Video } from "expo-av"
import * as ScreenOrientation from "expo-screen-orientation"
import * as AsyncStorage from "../../utils/storage/storage"
import UserService from "../../middleware/services/user-service"
import { CurrentLoginInfoModel } from "../../models/data/session-model"

export interface PitchReportScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
  route: any
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  share: boolean
  fullscreen: boolean
  play: boolean
  currentTime: number
  duration: number
  selectedDataPointType: string
  userDetail: UserModel
  pitchDate: string
  year: string
  years: string
  firstPitchId: number
  frameNumber: number
  firstFrameData: any
  secondFrameData: any
  firstPlayerName: string
  secondPlayerName: string
  graphData: any
  graphData2: any
  graphData3: any
  toolTipVisible: boolean
  yAxisPoints: number[]
  yAxisPoints2: number[]
  yAxisPoints3: number[]
  elbowExtensionVisible: boolean
  shoulderHorizontalAbductionVisible: boolean
  shoulderAbductionVisible: boolean
  elbowExtension2Visible: boolean
  shoulderHorizontalAbduction2Visible: boolean
  shoulderAbduction2Visible: boolean
  trunkFlexionVisible: boolean
  trunkRotationVisible: boolean
  leadKneeFlexionVisible: boolean
  trailLegKneeExtensionVisible: boolean
  pelvisRotationVisible: boolean
  hipShoulderSeparationVisible: boolean
  playerId: number
  externalRotationThrowingArmVisible: boolean
  externalRotationGloveArmVisible: boolean
  videoUrlLocal: string
  pitchVideoUrlLocal: string
  pelvisRotationSEQVisible: boolean
  torsoRotationSEQVisible: boolean
  elbowExtensionSEQVisible: boolean
  shoulderInternalRotationSEQVisible: boolean
  marker_fp: number
  marker_br: number
  marker_mer: number
  videoUrl: string
  videoBlobSASUrl: string
  videoSkeletonUrl: string
  videoSkeletonUrlLocal: string
  videoSkeletonBlobSASUrl: string
  width: number
  height: number
  redirectFrom: string
  session: CurrentLoginInfoModel
  reportUrl: string
}

export const PitchReportScreen: React.FunctionComponent<PitchReportScreenProps> = props => {
  const userService = new UserService(props)
  const [videoRef, setVideoRef] = React.useState<Video>(null)

  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    share: false,
    fullscreen: false,
    play: false,
    currentTime: 0,
    duration: 0,
    selectedDataPointType: "1",
    userDetail: props.route.params.userDetail ? props.route.params.userDetail : null,
    pitchDate: props.route.params.pitchDate ? props.route.params.pitchDate.toString() : "",
    year: translate("pitchReport.year"),
    years: translate("pitchReport.years"),
    firstPitchId: props.route.params.pitchId ? props.route.params.pitchId : 0,
    frameNumber: 0,
    firstFrameData: [],
    secondFrameData: [],
    firstPlayerName: "",
    secondPlayerName: "",
    graphData: [],
    graphData2: [],
    graphData3: [],
    elbowExtensionVisible: true,
    shoulderHorizontalAbductionVisible: true,
    shoulderAbductionVisible: true,
    elbowExtension2Visible: true,
    shoulderHorizontalAbduction2Visible: true,
    shoulderAbduction2Visible: true,
    trunkFlexionVisible: true,
    trunkRotationVisible: false,
    leadKneeFlexionVisible: true,
    trailLegKneeExtensionVisible: false,
    pelvisRotationVisible: false,
    hipShoulderSeparationVisible: true,
    toolTipVisible: false,
    yAxisPoints: [],
    yAxisPoints2: [],
    yAxisPoints3: [],
    playerId: props.route.params.playerId ? props.route.params.playerId : 0,
    externalRotationThrowingArmVisible: true,
    externalRotationGloveArmVisible: true,
    videoUrlLocal: null,
    pitchVideoUrlLocal: null,
    pelvisRotationSEQVisible: true,
    torsoRotationSEQVisible: true,
    elbowExtensionSEQVisible: true,
    shoulderInternalRotationSEQVisible: true,
    marker_fp: 0,
    marker_br: 0,
    marker_mer: 0,
    videoUrl: null,
    videoBlobSASUrl: null,
    videoSkeletonUrl: null,
    videoSkeletonUrlLocal: null,
    videoSkeletonBlobSASUrl: null,
    width: Dimensions.get("window").width,
    height:
      Platform.OS === "android" && Platform.Version > 26
        ? Dimensions.get("screen").height - StatusBar.currentHeight
        : Dimensions.get("window").height,
    redirectFrom: props.route.params.redirectFrom ? props.route.params.redirectFrom : "",
    session: props.route.params.session ? props.route.params.session : null,
    reportUrl: "",
  })

  const pitchService = new PitchService(props)
  let firstPitch = new FirstPitch()
  const { height } = Dimensions.get("window")
  const disabledColor = "#6e727a"
  // Check network before fethcing values
  const checkNetworkStatus = async (): Promise<boolean> => {
    let isNetworkConnected = false
    const networkValidator = new NetworkValidator()
    isNetworkConnected = await networkValidator.CheckConnectivity()
    return isNetworkConnected
  }

  const changeGraphType = async (value: string): Promise<void> => {
    setState(s => ({
      ...s,
      loading: true,
    }))
    const selectedDataPointType = value !== undefined ? value : state.selectedDataPointType
    const tempData = []
    const tempData2 = []
    const tempData3 = []
    var firstPitchData = await setFirstPitchDetails()
    if (firstPitchData) {
      firstPitch = firstPitchData
      switch (+selectedDataPointType) {
        case 1:
          // Angles - Throwing Arm
          if (state.elbowExtensionVisible) {
            tempData.push({
              data: firstPitch.firstElbowExtensionThrowingArmAngle,
              svg: { stroke: firstColor, strokeDasharray: [2, 4], strokeWidth: 3 },
            })
          }
          if (state.shoulderHorizontalAbductionVisible) {
            tempData.push({
              data: firstPitch.firstShoulderHorizontalAbductionThrowingArmAngle,
              svg: { stroke: secondColor, strokeWidth: 3 },
            })
          }
          if (state.shoulderAbductionVisible) {
            tempData.push({
              data: firstPitch.firstShoulderAbductionThrowingArmAngle,
              svg: { stroke: thirdColor, strokeDasharray: [6, 8], strokeWidth: 3 },
            })
          }
          if (state.externalRotationThrowingArmVisible) {
            tempData.push({
              data: firstPitch.firstExternalRotationThrowingArmAngle,
              svg: { stroke: fourthColor, strokeDasharray: [6, 8], strokeWidth: 3 },
            })
          }
          const yAxisData: number[] = []
          for (let i = 0; i < tempData.length; i++) {
            yAxisData.push(...tempData[i].data)
          }
          const max = Math.max(...yAxisData)
          let min = Math.min(...yAxisData)

          const yAxisStep = Math.floor((max - min) / 10)
          const element: number[] = []
          for (let i = 0; i < 10; i++) {
            min = min + yAxisStep
            element.push(+min.toFixed(1))
          }
          setState(s => ({
            ...s,
            selectedDataPointType: "1",
            graphData: tempData,
            loading: false,
            yAxisPoints: element,
          }))
          // Angles - Glove Arm
          if (state.elbowExtension2Visible) {
            tempData2.push({
              data: firstPitch.firstElbowExtensionGloveArmAngle,
              svg: { stroke: firstColor, strokeDasharray: [2, 4], strokeWidth: 3 },
            })
          }
          if (state.shoulderHorizontalAbduction2Visible) {
            tempData2.push({
              data: firstPitch.firstShoulderHorizontalAbductionGloveArmAngle,
              svg: { stroke: secondColor, strokeWidth: 3 },
            })
          }
          if (state.shoulderAbduction2Visible) {
            tempData2.push({
              data: firstPitch.firstShoulderAbductionGloveArmAngle,
              svg: { stroke: thirdColor, strokeDasharray: [6, 8], strokeWidth: 3 },
            })
          }
          if (state.externalRotationGloveArmVisible) {
            tempData2.push({
              data: firstPitch.firstExternalRotationGloveArmAngle,
              svg: { stroke: fourthColor, strokeDasharray: [6, 8], strokeWidth: 3 },
            })
          }
          const yAxisData2: number[] = []
          for (let i = 0; i < tempData2.length; i++) {
            yAxisData2.push(...tempData2[i].data)
          }
          const max2 = Math.max(...yAxisData2)
          let min2 = Math.min(...yAxisData2)

          const yAxisStep2 = Math.floor((max2 - min2) / 10)
          const element2: number[] = []
          for (let i = 0; i < 10; i++) {
            min2 = min2 + yAxisStep2
            element2.push(+min2.toFixed(1))
          }
          setState(s => ({
            ...s,
            selectedDataPointType: "1",
            graphData2: tempData2,
            loading: false,
            yAxisPoints2: element2,
          }))
          // Angles - Trunk And Legs
          if (state.trunkFlexionVisible) {
            tempData3.push({
              data: firstPitch.firstTrunkFlexionAngle,
              svg: { stroke: firstColor, strokeDasharray: [6, 8], strokeWidth: 3 },
            })
          }

          if (state.trunkRotationVisible) {
            tempData3.push({
              data: firstPitch.firstTrunkRotationAngle,
              svg: { stroke: secondColor, strokeDasharray: [6, 8], strokeWidth: 3 },
            })
          }

          if (state.leadKneeFlexionVisible) {
            tempData3.push({
              data: firstPitch.firstLeadKneeFlexionAngle,
              svg: { stroke: thirdColor, strokeDasharray: [2, 4], strokeWidth: 3 },
            })
          }

          if (state.trailLegKneeExtensionVisible) {
            tempData3.push({
              data: firstPitch.firstTrailLegKneeExtensionAngle,
              svg: { stroke: fourthColor, strokeWidth: 3 },
            })
          }
          if (state.pelvisRotationVisible) {
            tempData3.push({
              data: firstPitch.firstPelvisRotationAngle,
              svg: { stroke: fifthColor, strokeWidth: 3 },
            })
          }
          if (state.hipShoulderSeparationVisible) {
            tempData3.push({
              data: firstPitch.firstHipShoulderSeparationAngle,
              svg: { stroke: sixthColor, strokeWidth: 3 },
            })
          }
          const yAxisData3: number[] = []
          for (let i = 0; i < tempData3.length; i++) {
            yAxisData3.push(...tempData3[i].data)
          }
          const max3 = Math.max(...yAxisData3)
          let min3 = Math.min(...yAxisData3)

          const yAxisStep3 = Math.floor((max3 - min3) / 10)
          const element3: number[] = []
          for (let i = 0; i < 10; i++) {
            min3 = min3 + yAxisStep3
            element3.push(+min3.toFixed(1))
          }
          setState(s => ({
            ...s,
            selectedDataPointType: "1",
            graphData3: tempData3,
            loading: false,
            yAxisPoints3: element3,
          }))

          break
        case 2:
          // Velocity - Throwing Arm

          if (state.elbowExtensionVisible) {
            tempData.push({
              data: firstPitch.firstElbowExtensionThrowingArmVelocity,
              svg: { stroke: firstColor, strokeDasharray: [2, 4], strokeWidth: 3 },
            })
          }
          if (state.shoulderHorizontalAbductionVisible) {
            tempData.push({
              data: firstPitch.firstShoulderHorizontalAbductionThrowingArmVelocity,
              svg: { stroke: secondColor, strokeWidth: 3 },
            })
          }
          if (state.shoulderAbductionVisible) {
            tempData.push({
              data: firstPitch.firstShoulderAbductionThrowingArmVelocity,
              svg: { stroke: thirdColor, strokeDasharray: [6, 8], strokeWidth: 3 },
            })
          }
          if (state.externalRotationThrowingArmVisible) {
            tempData.push({
              data: firstPitch.firstExternalRotationThrowingArmAngle,
              svg: { stroke: fourthColor, strokeDasharray: [6, 8], strokeWidth: 3 },
            })
          }
          const yAxisData_1: number[] = []
          for (let i = 0; i < tempData.length; i++) {
            yAxisData_1.push(...tempData[i].data)
          }
          const max_1 = Math.max(...yAxisData_1)
          let min_1 = Math.min(...yAxisData_1)

          const yAxisStep_1 = Math.floor((max_1 - min_1) / 10)
          const element_1: number[] = []
          for (let i = 0; i < 10; i++) {
            min_1 = min_1 + yAxisStep_1
            element_1.push(+min_1.toFixed(1))
          }
          setState(s => ({
            ...s,
            selectedDataPointType: "2",
            graphData: tempData,
            loading: false,
            yAxisPoints: element_1,
          }))
          // Velocity - Glove Arm
          if (state.elbowExtension2Visible) {
            tempData2.push({
              data: firstPitch.firstElbowExtensionGloveArmVelocity,
              svg: { stroke: firstColor, strokeDasharray: [2, 4], strokeWidth: 3 },
            })
          }
          if (state.shoulderHorizontalAbduction2Visible) {
            tempData2.push({
              data: firstPitch.firstShoulderHorizontalAbductionGloveArmVelocity,
              svg: { stroke: secondColor, strokeWidth: 3 },
            })
          }
          if (state.shoulderAbduction2Visible) {
            tempData2.push({
              data: firstPitch.firstShoulderAbductionGloveArmVelocity,
              svg: { stroke: thirdColor, strokeDasharray: [6, 8], strokeWidth: 3 },
            })
          }
          if (state.externalRotationGloveArmVisible) {
            tempData2.push({
              data: firstPitch.firstExternalRotationGloveArmAngle,
              svg: { stroke: fourthColor, strokeDasharray: [6, 8], strokeWidth: 3 },
            })
          }
          const yAxisData_2: number[] = []
          for (let i = 0; i < tempData2.length; i++) {
            yAxisData_2.push(...tempData2[i].data)
          }
          const max_2 = Math.max(...yAxisData_2)
          let min_2 = Math.min(...yAxisData_2)

          const yAxisStep_2 = Math.floor((max_2 - min_2) / 10)
          const element_2: number[] = []
          for (let i = 0; i < 10; i++) {
            min_2 = min_2 + yAxisStep_2
            element_2.push(+min_2.toFixed(1))
          }
          setState(s => ({
            ...s,
            selectedDataPointType: "2",
            graphData2: tempData2,
            loading: false,
            yAxisPoints2: element_2,
          }))
          // Velocity - Trunk And Legs
          if (state.trunkFlexionVisible) {
            tempData3.push({
              data: firstPitch.firstTrunkFlexionVelocity,
              svg: { stroke: firstColor, strokeDasharray: [6, 8], strokeWidth: 3 },
            })
          }

          if (state.trunkRotationVisible) {
            tempData3.push({
              data: firstPitch.firstTrunkRotationVelocity,
              svg: { stroke: secondColor, strokeDasharray: [6, 8], strokeWidth: 3 },
            })
          }

          if (state.leadKneeFlexionVisible) {
            tempData3.push({
              data: firstPitch.firstLeadKneeFlexionVelocity,
              svg: { stroke: thirdColor, strokeDasharray: [2, 4], strokeWidth: 3 },
            })
          }

          if (state.trailLegKneeExtensionVisible) {
            tempData3.push({
              data: firstPitch.firstTrailLegKneeExtensionVelocity,
              svg: { stroke: fourthColor, strokeWidth: 3 },
            })
          }
          if (state.pelvisRotationVisible) {
            tempData3.push({
              data: firstPitch.firstPelvisRotationVelocity,
              svg: { stroke: fifthColor, strokeWidth: 3 },
            })
          }
          if (state.hipShoulderSeparationVisible) {
            tempData3.push({
              data: firstPitch.firstHipShoulderSeparationVelocity,
              svg: { stroke: sixthColor, strokeWidth: 3 },
            })
          }
          const yAxisData_3: number[] = []
          for (let i = 0; i < tempData3.length; i++) {
            yAxisData_3.push(...tempData3[i].data)
          }
          const max_3 = Math.max(...yAxisData_3)
          let min_3 = Math.min(...yAxisData_3)

          const yAxisStep_3 = Math.floor((max_3 - min_3) / 10)
          const element_3: number[] = []
          for (let i = 0; i < 10; i++) {
            min_3 = min_3 + yAxisStep_3
            element_3.push(+min_3.toFixed(1))
          }
          setState(s => ({
            ...s,
            selectedDataPointType: "2",
            graphData3: tempData3,
            loading: false,
            yAxisPoints3: element_3,
          }))
          break
        case 3:
          // SEQ
          if (state.pelvisRotationSEQVisible) {
            tempData.push({
              data: firstPitch.firstPelvisRotationVelocitySEQ,
              svg: { stroke: firstColor, strokeWidth: 2 },
            })
          }
          if (state.torsoRotationSEQVisible) {
            tempData.push({
              data: firstPitch.firstTorsoRotationAngleSEQ,
              svg: { stroke: secondColor, strokeWidth: 2 },
            })
          }
          if (state.elbowExtensionSEQVisible) {
            tempData.push({
              data: firstPitch.firstElbowExtensionVelocitySEQ,
              svg: { stroke: thirdColor, strokeWidth: 2 },
            })
          }
          if (state.shoulderInternalRotationSEQVisible) {
            tempData.push({
              data: firstPitch.firstShoulderInternalRotationVelocitySEQ,
              svg: { stroke: fourthColor, strokeWidth: 2 },
            })
          }
          const yAxisData4: number[] = []
          for (let i = 0; i < tempData.length; i++) {
            yAxisData4.push(...tempData[i].data)
          }
          const max_4 = Math.max(...yAxisData4)
          let min_4 = Math.min(...yAxisData4)

          const yAxisStep4 = Math.floor((max_4 - min_4) / 10)
          const element_4: number[] = []
          for (let i = 0; i < 10; i++) {
            min_4 = min_4 + yAxisStep4
            element_4.push(+min_4.toFixed(1))
          }
          setState(s => ({
            ...s,
            selectedDataPointType: "3",
            graphData: tempData,
            loading: false,
            yAxisPoints3: element_4,
          }))
          break
        default:
          break
      }
      setState(s => ({
        ...s,
        loading: false,
      }))
    }
  }

  const setInitialGraphData = (): void => {
    const tempData = []
    const tempData2 = []
    const tempData3 = []
    // Angles - Throwing Arm
    if (state.elbowExtensionVisible) {
      tempData.push({
        data: firstPitch.firstElbowExtensionThrowingArmAngle,
        svg: { stroke: firstColor, strokeDasharray: [2, 4], strokeWidth: 3 },
      })
    }
    if (state.shoulderHorizontalAbductionVisible) {
      tempData.push({
        data: firstPitch.firstShoulderHorizontalAbductionThrowingArmAngle,
        svg: { stroke: secondColor, strokeWidth: 3 },
      })
    }
    if (state.shoulderAbductionVisible) {
      tempData.push({
        data: firstPitch.firstShoulderAbductionThrowingArmAngle,
        svg: { stroke: thirdColor, strokeDasharray: [6, 8], strokeWidth: 3 },
      })
    }
    if (state.externalRotationThrowingArmVisible) {
      tempData.push({
        data: firstPitch.firstExternalRotationThrowingArmAngle,
        svg: { stroke: fourthColor, strokeDasharray: [6, 8], strokeWidth: 3 },
      })
    }
    const yAxisData: number[] = []
    for (let i = 0; i < tempData.length; i++) {
      yAxisData.push(...tempData[i].data)
    }
    const max = Math.max(...yAxisData)
    let min = Math.min(...yAxisData)

    const yAxisStep = Math.floor((max - min) / 10)
    const element: number[] = []
    for (let i = 0; i < 10; i++) {
      min = min + yAxisStep
      element.push(+min.toFixed(1))
    }
    setState(s => ({
      ...s,
      selectedDataPointType: "1",
      graphData: tempData,
      loading: false,
      yAxisPoints: element,
    }))
    // Angles - Glove Arm
    if (state.elbowExtensionVisible) {
      tempData2.push({
        data: firstPitch.firstElbowExtensionGloveArmAngle,
        svg: { stroke: firstColor, strokeDasharray: [2, 4], strokeWidth: 3 },
      })
    }
    if (state.shoulderHorizontalAbductionVisible) {
      tempData2.push({
        data: firstPitch.firstShoulderHorizontalAbductionGloveArmAngle,
        svg: { stroke: secondColor, strokeWidth: 3 },
      })
    }
    if (state.shoulderAbductionVisible) {
      tempData2.push({
        data: firstPitch.firstShoulderAbductionGloveArmAngle,
        svg: { stroke: thirdColor, strokeDasharray: [6, 8], strokeWidth: 3 },
      })
    }
    if (state.externalRotationGloveArmVisible) {
      tempData2.push({
        data: firstPitch.firstExternalRotationGloveArmAngle,
        svg: { stroke: fourthColor, strokeDasharray: [6, 8], strokeWidth: 3 },
      })
    }
    const yAxisData2: number[] = []
    for (let i = 0; i < tempData2.length; i++) {
      yAxisData2.push(...tempData2[i].data)
    }
    const max2 = Math.max(...yAxisData2)
    let min2 = Math.min(...yAxisData2)

    const yAxisStep2 = Math.floor((max2 - min2) / 10)
    const element2: number[] = []
    for (let i = 0; i < 10; i++) {
      min2 = min2 + yAxisStep2
      element2.push(+min2.toFixed(1))
    }
    setState(s => ({
      ...s,
      selectedDataPointType: "1",
      graphData2: tempData2,
      loading: false,
      yAxisPoints2: element2,
    }))
    // Angles - Trunk And Legs
    if (state.trunkFlexionVisible) {
      tempData3.push({
        data: firstPitch.firstTrunkFlexionAngle,
        svg: { stroke: firstColor, strokeDasharray: [6, 8], strokeWidth: 3 },
      })
    }

    if (state.trunkRotationVisible) {
      tempData3.push({
        data: firstPitch.firstTrunkRotationAngle,
        svg: { stroke: secondColor, strokeDasharray: [6, 8], strokeWidth: 3 },
      })
    }

    if (state.leadKneeFlexionVisible) {
      tempData3.push({
        data: firstPitch.firstLeadKneeFlexionAngle,
        svg: { stroke: thirdColor, strokeDasharray: [2, 4], strokeWidth: 3 },
      })
    }

    if (state.trailLegKneeExtensionVisible) {
      tempData3.push({
        data: firstPitch.firstTrailLegKneeExtensionAngle,
        svg: { stroke: fourthColor, strokeWidth: 3 },
      })
    }

    if (state.pelvisRotationVisible) {
      tempData3.push({
        data: firstPitch.firstPelvisRotationAngle,
        svg: { stroke: fifthColor, strokeWidth: 3 },
      })
    }
    if (state.hipShoulderSeparationVisible) {
      tempData3.push({
        data: firstPitch.firstHipShoulderSeparationAngle,
        svg: { stroke: sixthColor, strokeWidth: 3 },
      })
    }

    const yAxisData3: number[] = []
    for (let i = 0; i < tempData3.length; i++) {
      yAxisData3.push(...tempData3[i].data)
    }
    const max3 = Math.max(...yAxisData3)
    let min3 = Math.min(...yAxisData3)

    const yAxisStep3 = Math.floor((max3 - min3) / 10)
    const element3: number[] = []
    for (let i = 0; i < 10; i++) {
      min3 = min3 + yAxisStep3
      element3.push(+min3.toFixed(1))
    }
    setState(s => ({
      ...s,
      selectedDataPointType: "1",
      graphData3: tempData3,
      loading: false,
      yAxisPoints3: element3,
    }))
  }

  const setFirstPitchComparisonCoordinate = async (
    coordinates: comparisonCoordinates2d,
  ): Promise<boolean> => {
    const jointListCoordinates = []
    setState(s => ({
      ...s,
      firstPlayerName: coordinates.player,
    }))

    coordinates.joint_list.map(obj => {
      jointListCoordinates.push(obj + "_X")
      jointListCoordinates.push(obj + "_Y")
    })
    const tempFrameData = []
    coordinates.frames.forEach(element => {
      const payload = {}
      element.joints.forEach((obj, index) => {
        const key = jointListCoordinates[index]
        if (key.includes("_X")) {
          obj = (obj + 300) / 2300
        } else if (key.includes("_Y")) {
          obj = 1 - (obj + 300) / 2300
        }
        payload[key] = obj
      })
      tempFrameData.push(payload)
    })
    setState(s => ({ ...s, firstFrameData: tempFrameData }))
    return true
  }

  const setFirstPitchKinemeticCoordinates = async (coordinates: kinematic): Promise<FirstPitch> => {
    const tempElbowThrowingAngle = []
    const tempShoulderHorizontalAbductionThrowingArmAngle = []
    const tempShoulderAbductionThrowingArmAngle = []
    const tempElbowExtensionGloveArmAngle = []
    const tempShoulderHorizontalAbductionGloveArmAngle = []
    const tempShoulderAbductionGloveArmAngle = []
    const tempExternalRotationThrowingArmAngle = []
    const tempExternalRotationGloveArmAngle = []

    const tempElbowThrowingArmVelocity = []
    const tempShoulderHorizontalAbductionThrowingArmVelocity = []
    const tempShoulderAbductionThrowingArmVelocity = []
    const tempElbowExtensionGloveArmVelocity = []
    const tempShoulderHorizontalAbductionGloveArmVelocity = []
    const tempShoulderAbductionGloveArmVelocity = []
    const tempExternalRotationThrowingArmVelocity = []
    const tempExternalRotationGloveArmVelocity = []
    const tempPelvisRotationAngle = []
    const tempHipShoulderSeparationAngle = []
    const tempHipShoulderSeparationVelocity = []

    const tempTrunkFlexionAngle = []
    const tempTrunkRotationAngle = []
    const tempLeadKneeFlexionAngle = []
    const tempTrailLegKneeExtensionAngle = []

    const tempTrunkFlexionVelocity = []
    const tempTrunkRotationVelocity = []
    const tempLeadKneeFlexionVelocity = []
    const tempTrailLegKneeExtensionVelocity = []

    const tempPelvisRotationSEQ = []
    const tempTorsoRotationSEQ = []
    const tempElbowExtensionSEQ = []
    const tempShoulderInternalRotationSEQ = []
    const tempPelvisRotationVelocity = []

    coordinates.frames.forEach((item, mainIndex) => {
      // Angles
      item.angle.forEach((obj, index) => {
        switch (index) {
          case 0:
            tempElbowThrowingAngle.push(obj)
            break
          case 1:
            tempShoulderHorizontalAbductionThrowingArmAngle.push(obj)
            break
          case 2:
            tempShoulderAbductionThrowingArmAngle.push(obj)
            break
          case 3:
            tempExternalRotationThrowingArmAngle.push(obj)
            break
          case 4:
            tempElbowExtensionGloveArmAngle.push(obj)
            break
          case 5:
            tempShoulderHorizontalAbductionGloveArmAngle.push(obj)
            break
          case 6:
            tempShoulderAbductionGloveArmAngle.push(obj)
            break
          case 7:
            tempExternalRotationGloveArmAngle.push(obj)
            break
          case 8:
            tempLeadKneeFlexionAngle.push(obj)
            break
          case 9:
            tempTrailLegKneeExtensionAngle.push(obj)
            break
          case 10:
            tempTrunkFlexionAngle.push(obj)
            break
          case 11:
            tempTrunkRotationAngle.push(obj)
            break
          case 13:
            tempPelvisRotationAngle.push(obj)
            break
          case 14:
            tempHipShoulderSeparationAngle.push(obj)
            break

          default:
            break
        }
      })
      // Velocity
      item.velocity.forEach((obj, index) => {
        switch (index) {
          case 0:
            tempElbowThrowingArmVelocity.push(obj)
            if (mainIndex >= 700) {
              tempElbowExtensionSEQ.push(obj * -1)
            }
            break
          case 1:
            tempShoulderHorizontalAbductionThrowingArmVelocity.push(obj)
            break
          case 2:
            tempShoulderAbductionThrowingArmVelocity.push(obj)
            break
          case 3:
            tempExternalRotationThrowingArmVelocity.push(obj)
            if (mainIndex >= 700) {
              tempShoulderInternalRotationSEQ.push(obj * -1)
            }
            break
          case 4:
            tempElbowExtensionGloveArmVelocity.push(obj)
            break
          case 5:
            tempShoulderHorizontalAbductionGloveArmVelocity.push(obj)
            break
          case 6:
            tempShoulderAbductionGloveArmVelocity.push(obj)
            break
          case 7:
            tempExternalRotationGloveArmVelocity.push(obj)
            break
          case 8:
            tempLeadKneeFlexionVelocity.push(obj)
            break
          case 9:
            tempTrailLegKneeExtensionVelocity.push(obj)
            break
          case 10:
            tempTrunkFlexionVelocity.push(obj)
            break
          case 11:
            tempTrunkRotationVelocity.push(obj)
            break
          case 12:
            if (mainIndex >= 700) {
              tempTorsoRotationSEQ.push(obj)
            }
            break
          case 13:
            tempPelvisRotationVelocity.push(obj)
            if (mainIndex >= 700) {
              tempPelvisRotationSEQ.push(obj)
            }
            break
          case 14:
            tempHipShoulderSeparationVelocity.push(obj)
            break
          default:
            break
        }
      })
    })
    const firstPitch: FirstPitch = {
      firstElbowExtensionThrowingArmAngle: tempElbowThrowingAngle,
      firstShoulderHorizontalAbductionThrowingArmAngle: tempShoulderHorizontalAbductionThrowingArmAngle,
      firstShoulderAbductionThrowingArmAngle: tempShoulderAbductionThrowingArmAngle,
      firstElbowExtensionGloveArmAngle: tempElbowExtensionGloveArmAngle,
      firstShoulderHorizontalAbductionGloveArmAngle: tempShoulderHorizontalAbductionGloveArmAngle,
      firstShoulderAbductionGloveArmAngle: tempShoulderAbductionGloveArmAngle,
      firstElbowExtensionThrowingArmVelocity: tempElbowThrowingArmVelocity,
      firstShoulderAbductionThrowingArmVelocity: tempShoulderHorizontalAbductionThrowingArmVelocity,
      firstShoulderHorizontalAbductionThrowingArmVelocity: tempShoulderAbductionThrowingArmVelocity,
      firstElbowExtensionGloveArmVelocity: tempElbowExtensionGloveArmVelocity,
      firstShoulderHorizontalAbductionGloveArmVelocity: tempShoulderHorizontalAbductionGloveArmVelocity,
      firstShoulderAbductionGloveArmVelocity: tempShoulderAbductionGloveArmVelocity,
      firstLeadKneeFlexionAngle: tempLeadKneeFlexionAngle,
      firstTrailLegKneeExtensionAngle: tempTrailLegKneeExtensionAngle,
      firstTrunkFlexionAngle: tempTrunkFlexionAngle,
      firstTrunkRotationAngle: tempTrunkRotationAngle,
      firstLeadKneeFlexionVelocity: tempLeadKneeFlexionVelocity,
      firstTrailLegKneeExtensionVelocity: tempTrunkRotationVelocity,
      firstTrunkFlexionVelocity: tempTrunkFlexionVelocity,
      firstTrunkRotationVelocity: tempTrunkRotationVelocity,
      firstExternalRotationThrowingArmAngle: tempExternalRotationThrowingArmAngle,
      firstExternalRotationGloveArmAngle: tempExternalRotationGloveArmAngle,
      firstExternalRotationThrowingArmVelocity: tempExternalRotationThrowingArmVelocity,
      firstExternalRotationGloveArmVelocity: tempExternalRotationGloveArmVelocity,
      firstPelvisRotationVelocitySEQ: tempPelvisRotationSEQ,
      firstElbowExtensionVelocitySEQ: tempElbowExtensionSEQ,
      firstShoulderInternalRotationVelocitySEQ: tempShoulderInternalRotationSEQ,
      firstTorsoRotationAngleSEQ: tempTorsoRotationSEQ,
      firstPelvisRotationAngle: tempPelvisRotationAngle,
      firstPelvisRotationVelocity: tempPelvisRotationVelocity,
      firstHipShoulderSeparationAngle: tempHipShoulderSeparationAngle,
      firstHipShoulderSeparationVelocity: tempHipShoulderSeparationVelocity,
    }
    return firstPitch
  }

  let pitchDetailResult = null
  const setFirstPitchDetails = async (): Promise<FirstPitch> => {
    var result = await pitchService.getPitchById(state.firstPitchId)
    pitchDetailResult = result.pitchResponse
    if (
      result.pitchResponse !== undefined &&
      result.pitchResponse !== null &&
      result.pitchResponse.comparisonCoordinates2d &&
      result.pitchResponse.kinematics
    ) {
      const pitch2dCoordinates = JSON.parse(
        result.pitchResponse.comparisonCoordinates2d,
      ) as comparisonCoordinates2d

      await setFirstPitchComparisonCoordinate(pitch2dCoordinates)
      const pitchKinematic = JSON.parse(result.pitchResponse.kinematics) as kinematic
      //FP, BR, MER set state
      var markers = pitchKinematic.markers
      setState(s => ({
        ...s,
        marker_fp: markers.FP,
        marker_br: markers.BR,
        marker_mer: markers.MER,
        reportUrl:
          API_URL.split("/api")[0] +
          "/Pitch/GetReport?value=" +
          result.pitchResponse.encodedPitchId,
      }))

      // if(result.pitchResponse.videoUrl!==null && result.pitchResponse.videoUrl!==''){
      //   var videoUrl= await (await blobService.getFileUrlWithToken(result.pitchResponse.videoUrl)).blobResponse.fileUri;
      //   setState(s => ({
      //     ...s,
      //     videoUrl: videoUrl
      //   }))
      // }
      if (
        result.pitchResponse.videoSkeletonUrl !== null &&
        result.pitchResponse.videoSkeletonUrl !== ""
      ) {
        setState(s => ({
          ...s,
          videoSkeletonUrl: result.pitchResponse.videoSkeletonUrl,
        }))
      }
      return await setFirstPitchKinemeticCoordinates(pitchKinematic)
    } else {
      Alert.alert(
        "",
        translate("pitchReport.analysisNotComplete"),
        [
          {
            text: translate("teamuntaggedpitches.goBack"),
            onPress: goBack,
            style: "default",
          },
        ],
        { cancelable: false },
      )
      setState(s => ({
        ...s,
        loading: false,
      }))
      return null
    }
  }

  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])

  React.useEffect(() => {
    const loadStartupResourcesAsync = async () => {
      setState(s => ({ ...s, loading: true }))
      var result = await checkNetworkStatus()
      if (result) {
        var firstPitchData = await setFirstPitchDetails()
        if (firstPitchData && firstPitchData !== null) {
          firstPitch = firstPitchData
          setInitialGraphData()
          setState(s => ({ ...s, loading: false }))
          await downloadVideo()
        }
      } else {
        setState(s => ({ ...s, loading: false }))
      }
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
              setState(s => ({ ...s, videoUrlLocal: pitchDownloadResult.videoUrlLocal }))
            }

            if (!!pitchDownloadResult.videoSkeletonUrlLocal) {
              setState(s => ({
                ...s,
                videoSkeletonUrlLocal: pitchDownloadResult.videoSkeletonUrlLocal,
              }))
            }
          }
        })
    }
  }

  //const yAxisPoints = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324, 360]

  const getGraphFootLand = (): string => {
    return ((state.marker_fp / 1000) * 100).toString() + "%"
  }
  const getGraphBallRelease = (): string => {
    return ((state.marker_br / 1000) * 100).toString() + "%"
  }

  const getGraphFootLandSEQ = (): string => {
    return (((state.marker_fp - 700) / 300) * 100).toString() + "%"
  }
  const getGraphBallReleaseSEQ = (): string => {
    return (((state.marker_br - 700) / 300) * 100).toString() + "%"
  }
  const getGraphMERSEQ = (): string => {
    return (((state.marker_mer - 700) / 300) * 100).toString() + "%"
  }

  const VerticalLineFootLand = () => {
    return (
      <Line
        key={"zero-axis"}
        x1={getGraphFootLand()}
        x2={getGraphFootLand()}
        y1={"0%"}
        y2={"100%"}
        stroke={"#3a3f43"}
        strokeWidth={3}
      />
    )
  }

  const VerticalLineBallRelease = () => {
    return (
      <Line
        key={"zero-axis"}
        x1={getGraphBallRelease()}
        x2={getGraphBallRelease()}
        y1={"0%"}
        y2={"100%"}
        stroke={"#3a3f43"}
        strokeDasharray={[8, 6]}
        strokeWidth={3}
      />
    )
  }

  const VerticalLineFootLand_SEQ = () => {
    return (
      <Line
        key={"zero-axis"}
        x1={getGraphFootLandSEQ()}
        x2={getGraphFootLandSEQ()}
        y1={"0%"}
        y2={"100%"}
        stroke={"#3a3f43"}
        strokeWidth={2}
      />
    )
  }

  const VerticalLineBallRelease_SEQ = () => {
    return (
      <Line
        key={"zero-axis"}
        x1={getGraphBallReleaseSEQ()}
        x2={getGraphBallReleaseSEQ()}
        y1={"0%"}
        y2={"100%"}
        stroke={"#3a3f43"}
        strokeDasharray={[8, 6]}
        strokeWidth={2}
      />
    )
  }

  const VerticalLineMER_SEQ = () => {
    return (
      <Line
        key={"zero-axis"}
        x1={getGraphMERSEQ()}
        x2={getGraphMERSEQ()}
        y1={"0%"}
        y2={"100%"}
        stroke={"#ff6767"}
        strokeWidth={2}
      />
    )
  }
  const axesSvg = {
    fontSize: 10,
    fill: "#FFFFFF",
    strokeWidth: 1,
    // alignmentBaseline: "baseline",
    // baselineShift: "25",
  }
  const verticalContentInset = { top: 10, bottom: 10 }

  const showAngles = () => {
    setState(s => ({
      ...s,
      selectedDataPointType: "1",
    }))
    changeGraphType("1")
  }
  const showVelocity = () => {
    setState(s => ({
      ...s,
      selectedDataPointType: "2",
    }))
    changeGraphType("2")
  }

  const showSEQ = () => {
    setState(s => ({
      ...s,
      selectedDataPointType: "3",
    }))
    changeGraphType("3")
  }

  const gotoUnknownPlayerScreen = () => {
    props.navigation.replace("unknownplayeradd", {
      pitchId: state.firstPitchId,
      pitchDate: state.pitchDate,
    })
  }

  const goToPlayerEditScreen = async () => {
    await userService.getUser(state.playerId).then(result => {
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
          props.navigation.replace("playerEditScreen", {
            user: result.userResponse,
            redirectFrom: "pitchreport",
            pitchId: state.firstPitchId,
            pitchDate: state.pitchDate,
            pitchVideoUrlLocal: state.pitchVideoUrlLocal,
          })
        }
      }
    })
  }

  const convertHeightToFeetInches = (height: number): string => {
    if (!height) {
      return null
    }
    const feet = Math.floor(height / 12)
    const inche = height % 12

    return feet + "'" + inche + '"'
  }

  const firstColor = "#6ba4ff"
  const secondColor = "#ff6767"
  const thirdColor = "#2be653"
  const fourthColor = "#ffff00"
  const fifthColor = "red"
  const sixthColor = "purple"

  async function goToDashboard() {
    props.route.params.redirectFrom = ""
    const userDetails = await AsyncStorage.loadString("UserDetails")
    const localUser = JSON.parse(userDetails) as CurrentLoginInfoModel
    props.navigation.navigate("dashboard", {
      selectedTab: "Players",
      user: state.userDetail,
      session: localUser,
    })
  }

  props.navigation.addListener("blur", async () => {
    await ScreenOrientation.unlockAsync()
  })

  const handlePlayPause = async () => {
    if (!!state.videoUrlLocal || !!state.videoSkeletonUrlLocal) {
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

  const changeScreenOrientation = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
    //setState(s => ({ ...s, width: Dimensions.get('window').width,height:(Platform.OS === 'android' && Platform.Version > 26 ? Dimensions.get('screen').height - StatusBar.currentHeight: Dimensions.get('window').height)}))
  }

  const onPlaybackStatusUpdate = playbackStatus => {
    if (playbackStatus.didJustFinish) setState(s => ({ ...s, play: !state.play }))
  }
  return state.fullscreen ? (
    <View style={{ width: "100%", height: "100%", justifyContent: "center" }}>
      <Video
        ref={ref => {
          setVideoRef(ref)
        }}
        key={"fsVideo"}
        source={{
          uri: !!state.videoSkeletonUrlLocal ? state.videoSkeletonUrlLocal : state.videoUrlLocal,
        }}
        rate={1}
        volume={0}
        isMuted={false}
        resizeMode="stretch"
        shouldPlay={false}
        isLooping={false}
        style={{ width: "100%", height: "100%" }}
        useNativeControls={false}
        onPlaybackStatusUpdate={playbackStatus => onPlaybackStatusUpdate(playbackStatus)}
      />
      <Button
        style={{ backgroundColor: color.transparent, position: "absolute", alignSelf: "center" }}
        onPress={async () => await handlePlayPause()}
      >
        <SvgXml xml={state.play ? styles.VIDEO_PAUSE : styles.VIDEO_PLAY} />
      </Button>
      <Button
        style={{
          position: "absolute",
          flexDirection: "row",
          top: 5,
          right: 10,
          backgroundColor: color.transparent,
        }}
        onPress={async () => {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT).then(() => {
            setState(s => ({ ...s, fullscreen: !state.fullscreen }))
            showAngles()
          })
        }}
      >
        <Image source={require("../../../assets/_Icons/icon-arrow-back.png")} />
        <Text
          tx="common.back"
          style={[styles.TEXT14, styles.FONTMEDIUM, { marginLeft: 10 }]}
        ></Text>
      </Button>
    </View>
  ) : (
    <Screen style={styles.ROOT} preset="scroll">
      <Loader loading={state.loading} />
      <Header
        headerText={state.pitchDate}
        style={styles.SCREENHEADER}
        leftIcon="back"
        onLeftPress={state.redirectFrom === "" ? goBack : goToDashboard}
      />
      <ScrollView style={{ height: height - 300, backgroundColor: "#323943" }}>
        {state.userDetail === null && (
          <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: -10, paddingBottom: 10 }]}>
            <Button
              style={[styles.LoginButton, { marginTop: 20 }]}
              textStyle={styles.BLUEBUTTONTEXT}
              onPress={gotoUnknownPlayerScreen}
            >
              <SvgXml
                xml={styles.EDIT_ICON_BLACK}
                style={[styles.PROVIDERICON, styles.BLUEBUTTONTEXT, { color: color.palette.black }]}
              />
              <Text tx="pitchReport.addPlayerinformation" style={styles.BLUEBUTTONTEXT} />
            </Button>
          </View>
        )}
        {state.userDetail !== null && (
          <View style={{ marginTop: -10, padding: 20, backgroundColor: "#10151b" }}>
            <View style={{ flexDirection: "row", marginTop: 0, width: "90%" }}>
              <Text style={[styles.SETTING_LISTITEM_TITLE_BOLD]} tx="pitchReport.name"></Text>
              <Text style={[styles.SETTING_LISTITEM_TITLE, { width: "50%" }]}>
                {" "}
                {state.userDetail.fullName}
              </Text>
              <Text style={{ width: "10%" }}></Text>
              <SvgXml xml={styles.EDIT_ICON} onPress={goToPlayerEditScreen} />
              <Text tx="pitchReport.edit" onPress={goToPlayerEditScreen} />
            </View>
            <View style={{ flexDirection: "row", marginTop: spacing[2] }}>
              <Text style={[styles.SETTING_LISTITEM_TITLE_BOLD]} tx="pitchReport.email"></Text>
              <Text style={[styles.SETTING_LISTITEM_TITLE]}> {state.userDetail.emailAddress}</Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: spacing[2] }}>
              <Text style={[styles.SETTING_LISTITEM_TITLE_BOLD]} tx="pitchReport.handedness"></Text>
              {state.userDetail.isRightHanded === 1 && <Text tx="playerDetailScreen.rhp"> </Text>}
              {state.userDetail.isRightHanded === 0 && <Text tx="playerDetailScreen.lhp"> </Text>}
            </View>
            <View style={{ flexDirection: "row", marginTop: spacing[2] }}>
              <Text style={[styles.SETTING_LISTITEM_TITLE_BOLD]} tx="pitchReport.age"></Text>
              {state.userDetail.age > 1 && (
                <Text style={[styles.SETTING_LISTITEM_TITLE]}>
                  {" "}
                  {state.userDetail.age} {state.years}
                </Text>
              )}
              {state.userDetail.age === 1 && (
                <Text>
                  {" "}
                  {state.userDetail.age} {state.year}
                </Text>
              )}
            </View>
            <View style={{ flexDirection: "row", marginTop: spacing[2] }}>
              <Text style={[styles.SETTING_LISTITEM_TITLE_BOLD]} tx="pitchReport.height"></Text>
              <Text style={[styles.SETTING_LISTITEM_TITLE]}>
                {" "}
                {convertHeightToFeetInches(state.userDetail.height)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: spacing[2] }}>
              <Text style={[styles.SETTING_LISTITEM_TITLE_BOLD]} tx="pitchReport.weight"></Text>
              <Text style={[styles.SETTING_LISTITEM_TITLE]}> {state.userDetail.weight} lbs</Text>
            </View>
            <View style={[{ alignItems: "center", justifyContent: "center" }]}></View>
          </View>
        )}
        <Button
          style={{
            backgroundColor: color.transparent,
            flexDirection: "row",
            alignSelf: "flex-start",
            marginLeft: 20,
          }}
          onPress={() => setState(s => ({ ...s, share: true }))}
        >
          <SvgXml xml={styles.ICON_SHARE} />
          <Text
            tx="pitchCompare.share"
            style={[styles.TEXT14, styles.FONTMEDIUM, { paddingLeft: 5 }]}
          />
        </Button>
        <View
          style={{
            height: (Dimensions.get("window").width * 9) / 16,
            maxHeight: (Dimensions.get("window").width * 9) / 16,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 20,
          }}
        >
          <Video
            ref={ref => {
              setVideoRef(ref)
            }}
            source={{
              uri: !!state.videoSkeletonUrlLocal
                ? state.videoSkeletonUrlLocal
                : state.videoUrlLocal,
            }}
            rate={1}
            volume={0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay={false}
            isLooping={false}
            style={{ width: "100%", height: "100%" }}
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
          {(!!state.videoSkeletonUrlLocal || !!state.videoUrlLocal) && (
            <Button
              style={{
                backgroundColor: color.transparent,
                position: "absolute",
                bottom: 15,
                right: 3,
              }}
              onPress={async () => {
                await changeScreenOrientation().then(() => {
                  setState(s => ({
                    ...s,
                    fullscreen: !state.fullscreen,
                    height: Dimensions.get("window").width,
                    width:
                      Platform.OS === "android" && Platform.Version > 26
                        ? Dimensions.get("screen").height - StatusBar.currentHeight
                        : Dimensions.get("window").height,
                  }))
                })
              }}
            >
              <SvgXml xml={styles.VIDEO_FULLSCREEN} />
            </Button>
          )}
        </View>
        <View style={{ marginTop: spacing[4], paddingHorizontal: "5%", marginBottom: 210 }}>
          <View style={{ flexDirection: "row", width: "100%" }}>
            {state.selectedDataPointType === "1" && (
              <Button
                style={[
                  styles.PitchReportButton,
                  styles.PitchReportButtonUnderline,
                  { width: "32%" },
                ]}
                tx="pitchReport.angles"
                textStyle={styles.PITCHREPORTBUTTONTEXT}
                onPress={showAngles}
              />
            )}
            {state.selectedDataPointType !== "1" && (
              <Button
                style={[styles.PitchReportButton, { width: "32%" }]}
                tx="pitchReport.angles"
                textStyle={styles.PITCHREPORTBUTTONTEXT}
                onPress={showAngles}
              />
            )}
            {state.selectedDataPointType === "2" && (
              <Button
                style={[
                  styles.PitchReportButton,
                  styles.PitchReportButtonUnderline,
                  { width: "32%", marginLeft: 10 },
                ]}
                tx="pitchReport.velocity"
                textStyle={styles.PITCHREPORTBUTTONTEXT}
                onPress={showVelocity}
              />
            )}
            {state.selectedDataPointType !== "2" && (
              <Button
                style={[styles.PitchReportButton, { width: "32%", marginLeft: 10 }]}
                tx="pitchReport.velocity"
                textStyle={styles.PITCHREPORTBUTTONTEXT}
                onPress={showVelocity}
              />
            )}
            {state.selectedDataPointType === "3" && (
              <Button
                style={[
                  styles.PitchReportButton,
                  styles.PitchReportButtonUnderline,
                  { width: "32%", marginLeft: 10 },
                ]}
                tx="pitchReport.seq"
                textStyle={styles.PITCHREPORTBUTTONTEXT}
                onPress={showSEQ}
              />
            )}
            {state.selectedDataPointType !== "3" && (
              <Button
                style={[styles.PitchReportButton, { width: "32%", marginLeft: 10 }]}
                tx="pitchReport.seq"
                textStyle={styles.PITCHREPORTBUTTONTEXT}
                onPress={showSEQ}
              />
            )}
          </View>
          {state.selectedDataPointType !== "3" && (
            <View>
              {/* Graph #1 Throwing Arm */}
              <View style={{ marginTop: 10, padding: 20 }}>
                <Text
                  tx="pitchReport.throwingArm"
                  style={{
                    color: "#ffffff",
                    fontSize: 20,
                    fontFamily: "RobotoBold",
                    marginLeft: -20,
                  }}
                />
              </View>
              <View
                style={{
                  height: 250,
                  padding: 10,
                  flexDirection: "row",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                }}
              >
                <YAxis
                  data={state.yAxisPoints}
                  style={{ margin: -10, backgroundColor: "#3a3f43", paddingHorizontal: 10 }}
                  contentInset={verticalContentInset}
                  svg={axesSvg}
                  formatLabel={value => `${value}º/s`}
                  numberOfTicks={10}
                />
                <View style={{ flex: 1, marginRight: 0 }}>
                  <Tooltip
                    arrowSize={{ width: 16, height: 8 }}
                    backgroundColor="rgba(0,0,0,0)"
                    isVisible={state.toolTipVisible}
                    content={
                      <View>
                        <TouchableOpacity style={{ flexDirection: "row" }}>
                          <Dash
                            style={{
                              width: "10%",
                              paddingTop: 5,
                              paddingVertical: 0,
                              marginRight: 5,
                            }}
                            dashColor={"#323943"}
                            dashGap={0}
                            dashLength={3}
                            dashThickness={2}
                          />
                          <Text
                            style={{ color: "black", fontSize: 12 }}
                            tx="pitchCompare.solidLineFootLand"
                          ></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row" }}>
                          <Dash
                            style={{
                              width: "10%",
                              paddingTop: 5,
                              paddingVertical: 0,
                              marginRight: 5,
                            }}
                            dashColor={"#323943"}
                            dashGap={2}
                            dashLength={3}
                            dashThickness={2}
                          />
                          <Text
                            style={{ color: "black", fontSize: 12 }}
                            tx="pitchCompare.dottedLineBallRelease"
                          ></Text>
                        </TouchableOpacity>
                      </View>
                    }
                    placement="center"
                    useReactNativeModal={true}
                    onClose={() => setState(s => ({ ...s, toolTipVisible: false }))}
                  ></Tooltip>
                  <TouchableHighlight
                    onPress={() => setState(s => ({ ...s, toolTipVisible: true }))}
                  >
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={20}
                      color="white"
                      style={{ paddingLeft: "85%" }}
                    ></MaterialCommunityIcons>
                  </TouchableHighlight>
                  <LineChart
                    style={{ flex: 1, marginLeft: 10 }}
                    data={state.graphData}
                    contentInset={{ top: 20, bottom: 20 }}
                    svg={{ stroke: "#FFFFFF" }}
                    fillColor={"purple"}
                    strokeColor={"rgb(134, 65, 244)"}
                  >
                    <VerticalLineFootLand />
                    <VerticalLineBallRelease />
                  </LineChart>
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.elbowExtensionVisible = !state.elbowExtensionVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={!state.elbowExtensionVisible ? disabledColor : firstColor}
                    dashGap={2}
                    dashLength={3}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchReport.elbowExtension"
                    style={
                      state.elbowExtensionVisible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.shoulderHorizontalAbductionVisible = !state.shoulderHorizontalAbductionVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={
                      !state.shoulderHorizontalAbductionVisible ? disabledColor : secondColor
                    }
                    dashGap={0}
                    dashLength={3}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.shoulderHorizontalAbduction"
                    style={
                      state.shoulderHorizontalAbductionVisible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.shoulderAbductionVisible = !state.shoulderAbductionVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={!state.shoulderAbductionVisible ? disabledColor : thirdColor}
                    dashGap={4}
                    dashLength={6}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.shoulderAbduction"
                    style={
                      state.shoulderAbductionVisible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.externalRotationThrowingArmVisible = !state.externalRotationThrowingArmVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={
                      !state.externalRotationThrowingArmVisible ? disabledColor : fourthColor
                    }
                    dashGap={4}
                    dashLength={6}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.externalRotation"
                    style={
                      state.externalRotationThrowingArmVisible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
              </View>

              {/* Graph #2 Glove Arm*/}
              <View style={{ marginTop: 10, padding: 20 }}>
                <Text
                  tx="pitchReport.gloveArm"
                  style={{
                    color: "#ffffff",
                    fontSize: 20,
                    fontFamily: "RobotoBold",
                    marginLeft: -20,
                  }}
                />
              </View>
              <View
                style={{
                  height: 250,
                  padding: 10,
                  flexDirection: "row",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                }}
              >
                <YAxis
                  data={state.yAxisPoints2}
                  style={{ margin: -10, backgroundColor: "#3a3f43", paddingHorizontal: 10 }}
                  contentInset={verticalContentInset}
                  svg={axesSvg}
                  formatLabel={value => `${value}º/s`}
                />

                <View style={{ flex: 1, marginRight: 0 }}>
                  <Tooltip
                    arrowSize={{ width: 16, height: 8 }}
                    backgroundColor="rgba(0,0,0,0)"
                    isVisible={state.toolTipVisible}
                    content={
                      <View>
                        <TouchableOpacity style={{ flexDirection: "row" }}>
                          <Dash
                            style={{
                              width: "10%",
                              paddingTop: 5,
                              paddingVertical: 0,
                              marginRight: 5,
                            }}
                            dashColor={"#323943"}
                            dashGap={0}
                            dashLength={3}
                            dashThickness={2}
                          />
                          <Text style={{ color: "black", fontSize: 12 }}>Solid Line Foot Land</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row" }}>
                          <Dash
                            style={{
                              width: "10%",
                              paddingTop: 5,
                              paddingVertical: 0,
                              marginRight: 5,
                            }}
                            dashColor={"#323943"}
                            dashGap={2}
                            dashLength={3}
                            dashThickness={2}
                          />
                          <Text style={{ color: "black", fontSize: 12 }}>
                            Dotted Line Ball Release
                          </Text>
                        </TouchableOpacity>
                      </View>
                    }
                    placement="center"
                    useReactNativeModal={true}
                    onClose={() => setState(s => ({ ...s, toolTipVisible: false }))}
                  ></Tooltip>
                  <TouchableHighlight
                    onPress={() => setState(s => ({ ...s, toolTipVisible: true }))}
                  >
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={20}
                      color="white"
                      style={{ paddingLeft: "85%" }}
                    ></MaterialCommunityIcons>
                  </TouchableHighlight>
                  <LineChart
                    style={{ flex: 1, marginLeft: 10 }}
                    data={state.graphData2}
                    contentInset={{ top: 20, bottom: 20 }}
                    svg={{ stroke: "#FFFFFF" }}
                  >
                    <VerticalLineFootLand />
                    <VerticalLineBallRelease />
                  </LineChart>
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.elbowExtension2Visible = !state.elbowExtension2Visible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={!state.elbowExtension2Visible ? disabledColor : firstColor}
                    dashGap={2}
                    dashLength={3}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchReport.elbowExtension"
                    style={
                      state.elbowExtension2Visible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.shoulderHorizontalAbduction2Visible = !state.shoulderHorizontalAbduction2Visible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={
                      !state.shoulderHorizontalAbduction2Visible ? disabledColor : secondColor
                    }
                    dashGap={0}
                    dashLength={3}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.shoulderHorizontalAbduction"
                    style={
                      state.shoulderHorizontalAbduction2Visible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.shoulderAbduction2Visible = !state.shoulderAbduction2Visible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={!state.shoulderAbduction2Visible ? disabledColor : thirdColor}
                    dashGap={4}
                    dashLength={6}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.shoulderAbduction"
                    style={
                      state.shoulderAbduction2Visible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.externalRotationGloveArmVisible = !state.externalRotationGloveArmVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={!state.externalRotationGloveArmVisible ? disabledColor : fourthColor}
                    dashGap={4}
                    dashLength={6}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.externalRotation"
                    style={
                      state.externalRotationGloveArmVisible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
              </View>
              {/* Graph #3 Trunks and Legs*/}
              <View style={{ marginTop: 10, padding: 20 }}>
                <Text
                  tx="pitchReport.trunkAndLegs"
                  style={{
                    color: "#ffffff",
                    fontSize: 20,
                    fontFamily: "RobotoBold",
                    marginLeft: -20,
                  }}
                />
              </View>
              <View
                style={{
                  height: 250,
                  padding: 10,
                  flexDirection: "row",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                }}
              >
                <YAxis
                  data={state.yAxisPoints3}
                  style={{ margin: -10, backgroundColor: "#3a3f43", paddingHorizontal: 10 }}
                  contentInset={verticalContentInset}
                  svg={axesSvg}
                  formatLabel={value => `${value}º/s`}
                />

                <View style={{ flex: 1, marginRight: 0 }}>
                  <Tooltip
                    arrowSize={{ width: 16, height: 8 }}
                    backgroundColor="rgba(0,0,0,0)"
                    isVisible={state.toolTipVisible}
                    content={
                      <View>
                        <TouchableOpacity style={{ flexDirection: "row" }}>
                          <Dash
                            style={{
                              width: "10%",
                              paddingTop: 5,
                              paddingVertical: 0,
                              marginRight: 5,
                            }}
                            dashColor={"#323943"}
                            dashGap={0}
                            dashLength={3}
                            dashThickness={2}
                          />
                          <Text style={{ color: "black", fontSize: 12 }}>Solid Line Foot Land</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row" }}>
                          <Dash
                            style={{
                              width: "10%",
                              paddingTop: 5,
                              paddingVertical: 0,
                              marginRight: 5,
                            }}
                            dashColor={"#323943"}
                            dashGap={2}
                            dashLength={3}
                            dashThickness={2}
                          />
                          <Text style={{ color: "black", fontSize: 12 }}>
                            Dotted Line Ball Release
                          </Text>
                        </TouchableOpacity>
                      </View>
                    }
                    placement="center"
                    useReactNativeModal={true}
                    onClose={() => setState(s => ({ ...s, toolTipVisible: false }))}
                  ></Tooltip>
                  <TouchableHighlight
                    onPress={() => setState(s => ({ ...s, toolTipVisible: true }))}
                  >
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={20}
                      color="white"
                      style={{ paddingLeft: "85%" }}
                    ></MaterialCommunityIcons>
                  </TouchableHighlight>
                  <LineChart
                    style={{ flex: 1, marginLeft: 10 }}
                    data={state.graphData3}
                    contentInset={{ top: 20, bottom: 20 }}
                    svg={{ stroke: "#FFFFFF" }}
                  >
                    <VerticalLineFootLand />
                    <VerticalLineBallRelease />
                  </LineChart>
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.trunkFlexionVisible = !state.trunkFlexionVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={!state.trunkFlexionVisible ? disabledColor : firstColor}
                    dashGap={4}
                    dashLength={4}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.trunkFlexion"
                    style={
                      state.trunkFlexionVisible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.trunkRotationVisible = !state.trunkRotationVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={!state.trunkRotationVisible ? disabledColor : secondColor}
                    dashGap={4}
                    dashLength={4}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.trunkRotation"
                    style={
                      state.trunkRotationVisible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.leadKneeFlexionVisible = !state.leadKneeFlexionVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={!state.leadKneeFlexionVisible ? disabledColor : thirdColor}
                    dashGap={2}
                    dashLength={3}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.leadKneeFlexion"
                    style={
                      state.leadKneeFlexionVisible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.trailLegKneeExtensionVisible = !state.trailLegKneeExtensionVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={!state.trailLegKneeExtensionVisible ? disabledColor : fourthColor}
                    dashGap={0}
                    dashLength={3}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.trailLegKneeExtension"
                    style={
                      state.trailLegKneeExtensionVisible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.pelvisRotationVisible = !state.pelvisRotationVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={!state.pelvisRotationVisible ? disabledColor : fifthColor}
                    dashGap={0}
                    dashLength={3}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.pelvisRotation"
                    style={
                      state.pelvisRotationVisible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.hipShoulderSeparationVisible = !state.hipShoulderSeparationVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={!state.hipShoulderSeparationVisible ? disabledColor : sixthColor}
                    dashGap={0}
                    dashLength={3}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.hipShoulderSeparation"
                    style={
                      state.hipShoulderSeparationVisible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {/* SEQ graph */}
          {state.selectedDataPointType === "3" && (
            <View>
              <View style={{ marginTop: 10, padding: 20 }}>
                <Text
                  tx="pitchReport.kinematicsSequencing"
                  style={{
                    color: "#ffffff",
                    fontSize: 20,
                    fontFamily: "RobotoBold",
                    marginLeft: -20,
                  }}
                />
              </View>
              <View
                style={{
                  height: 250,
                  padding: 10,
                  flexDirection: "row",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                }}
              >
                <YAxis
                  data={state.yAxisPoints3}
                  style={{ margin: -10, backgroundColor: "#3a3f43", paddingHorizontal: 10 }}
                  contentInset={verticalContentInset}
                  svg={axesSvg}
                  formatLabel={value => `${value}º/s`}
                />

                <View style={{ flex: 1, marginRight: 0 }}>
                  <Tooltip
                    arrowSize={{ width: 16, height: 8 }}
                    backgroundColor="rgba(0,0,0,0)"
                    isVisible={state.toolTipVisible}
                    content={
                      <View>
                        <TouchableOpacity style={{ flexDirection: "row" }}>
                          <Dash
                            style={{
                              width: "10%",
                              paddingTop: 5,
                              paddingVertical: 0,
                              marginRight: 5,
                            }}
                            dashColor={"#323943"}
                            dashGap={0}
                            dashLength={3}
                            dashThickness={2}
                          />
                          <Text style={{ color: "black", fontSize: 12 }}>Solid Line Foot Land</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row" }}>
                          <Dash
                            style={{
                              width: "10%",
                              paddingTop: 5,
                              paddingVertical: 0,
                              marginRight: 5,
                            }}
                            dashColor={"#323943"}
                            dashGap={2}
                            dashLength={3}
                            dashThickness={2}
                          />
                          <Text style={{ color: "black", fontSize: 12 }}>
                            Dotted Line Ball Release
                          </Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row" }}>
                          <Dash
                            style={{
                              width: "10%",
                              paddingTop: 5,
                              paddingVertical: 0,
                              marginRight: 5,
                            }}
                            dashColor={secondColor}
                            dashGap={0}
                            dashLength={3}
                            dashThickness={3}
                          />
                          <Text style={{ color: "black", fontSize: 12 }}>Solid Line MER</Text>
                        </View>
                      </View>
                    }
                    placement="center"
                    useReactNativeModal={true}
                    onClose={() => setState(s => ({ ...s, toolTipVisible: false }))}
                  ></Tooltip>
                  <TouchableHighlight
                    onPress={() => setState(s => ({ ...s, toolTipVisible: true }))}
                  >
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={20}
                      color="white"
                      style={{ paddingLeft: "85%" }}
                    ></MaterialCommunityIcons>
                  </TouchableHighlight>
                  <LineChart
                    style={{ flex: 1, marginLeft: 10 }}
                    data={state.graphData}
                    contentInset={{ top: 20, bottom: 20 }}
                    svg={{ stroke: "#FFFFFF" }}
                  >
                    <VerticalLineFootLand_SEQ />
                    <VerticalLineBallRelease_SEQ />
                    <VerticalLineMER_SEQ />
                  </LineChart>
                </View>
              </View>

              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.pelvisRotationSEQVisible = !state.pelvisRotationSEQVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={!state.pelvisRotationSEQVisible ? disabledColor : firstColor}
                    dashGap={0}
                    dashLength={3}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.pelvisRotation"
                    style={
                      state.pelvisRotationSEQVisible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.torsoRotationSEQVisible = !state.torsoRotationSEQVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={!state.torsoRotationSEQVisible ? disabledColor : secondColor}
                    dashGap={0}
                    dashLength={3}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.torsoRotation"
                    style={
                      state.torsoRotationSEQVisible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.elbowExtensionSEQVisible = !state.elbowExtensionSEQVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={!state.elbowExtensionSEQVisible ? disabledColor : thirdColor}
                    dashGap={0}
                    dashLength={3}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.elbowExtension"
                    style={
                      state.elbowExtensionSEQVisible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    state.shoulderInternalRotationSEQVisible = !state.shoulderInternalRotationSEQVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "10%", paddingTop: 15, paddingVertical: 0, marginRight: 5 }}
                    dashColor={
                      !state.shoulderInternalRotationSEQVisible ? disabledColor : fourthColor
                    }
                    dashGap={0}
                    dashLength={3}
                    dashThickness={3}
                  />
                  <Text
                    tx="pitchReport.shoulderInternalRotation"
                    style={
                      state.shoulderInternalRotationSEQVisible
                        ? { paddingTop: 5, fontSize: 14 }
                        : { paddingTop: 5, fontSize: 14, color: disabledColor }
                    }
                  ></Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={state.share}
          onRequestClose={() => {
            setState(s => ({
              ...s,
              share: false,
            }))
          }}
        >
          <View
            style={{
              width: "100%",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: 0,
              height: "25%",
              backgroundColor: color.palette.blackGrey,
              padding: "1%",
            }}
          >
            <Text tx="pitchCompare.shareMessage" style={styles.TEXT16}></Text>
            <View style={{ flexDirection: "row" }}>
              <TextField
                editable={false}
                selectTextOnFocus={true}
                style={[styles.TEXTBOX_CONTAINER, { width: "55%" }]}
                inputStyle={styles.TEXTBOXSTYLE}
                value={state.reportUrl}
              ></TextField>
              <Button
                tx="pitchCompare.copy"
                style={[
                  styles.BLUEBUTTON,
                  {
                    width: "30%",
                    borderTopRightRadius: 3,
                    borderBottomRightRadius: 3,
                    marginTop: 17,
                  },
                ]}
                textStyle={styles.BLUEBUTTONTEXT}
                onPress={async () => {
                  await Clipboard.setString(state.reportUrl)
                }}
              ></Button>
            </View>

            <Button
              tx="pitchCompare.cancel"
              style={[styles.WHITEBUTTON]}
              textStyle={styles.WHITEBUTTONTEXT}
              onPress={() => {
                setState(s => ({
                  ...s,
                  share: false,
                }))
              }}
            ></Button>
          </View>
        </Modal>
      </ScrollView>
    </Screen>
  )
}
