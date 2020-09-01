import React from "react"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Text, Screen, Header, Button, TextField } from "../../components"
import {
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Dimensions,
  Picker,
  Alert,
  TouchableHighlight,
  Modal,
  Clipboard,
} from "react-native"
import Loader from "../../components/spinner/loader"
import * as styles from "../../theme/appStyle"
import { ParamListBase } from "@react-navigation/native"
import { spacing, color } from "../../theme"
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { Skeleton } from "../../components/skeleton/skeleton"
import { Slider } from "react-native-elements"
import { LineChart, YAxis } from "react-native-svg-charts"
import { Line, SvgXml } from "react-native-svg"
import { translate } from "../../i18n"
import PitchService from "../../middleware/services/pitch-service"
import { comparisonCoordinates2d, kinematic } from "../../models/data/pitch-model"
import NetworkValidator from "../../middleware/network-validator"
import Tooltip from "react-native-walkthrough-tooltip"
import Dash from "react-native-dash"
const { API_URL } = require("../../config/env")

export interface PitchCompareScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

export class FirstPitch {
  encodedPitchId: string
  // Angle Throwing Arm
  firstElbowExtensionThrowingArmAngle: number[] // 0 Angle
  firstShoulderHorizontalAbductionThrowingArmAngle: number[] // 1 Angle
  firstShoulderAbductionThrowingArmAngle: number[] //2 Angle
  firstExternalRotationThrowingArmAngle: number[] // 3 Angle

  //Velocity Throwing Arm
  firstElbowExtensionThrowingArmVelocity: number[] // 0 Velocity
  firstShoulderHorizontalAbductionThrowingArmVelocity: number[] // 1 Velocity
  firstShoulderAbductionThrowingArmVelocity: number[] // 2 Velocity
  firstExternalRotationThrowingArmVelocity: number[] // 3 Velocity

  // Angle Glove Arm
  firstElbowExtensionGloveArmAngle: number[] // 4 Angle
  firstShoulderHorizontalAbductionGloveArmAngle: number[] // 5 Velocity
  firstShoulderAbductionGloveArmAngle: number[] // 6 Angle
  firstExternalRotationGloveArmAngle: number[] // 7 Angle

  // Velocity Glove Arm
  firstElbowExtensionGloveArmVelocity: number[] // 4 Velocity
  firstShoulderHorizontalAbductionGloveArmVelocity: number[] // 5 Velocity
  firstShoulderAbductionGloveArmVelocity: number[] // 6 Velocity
  firstExternalRotationGloveArmVelocity: number[] // 7 Velocity

  // Angle Trunk and Legs
  firstTrunkFlexionAngle: number[] // 10 Angle
  firstTrunkRotationAngle: number[] // 12 Angle
  firstLeadKneeFlexionAngle: number[] // 8 Angle
  firstTrailLegKneeExtensionAngle: number[] // 9 Angle
  firstPelvisRotationAngle: number[] // 13 Angle
  firstHipShoulderSeparationAngle: number[] // 14 Angle

  // Velocity Trunck and Legs
  firstTrunkFlexionVelocity: number[] // 10 Velocity
  firstTrunkRotationVelocity: number[] // 12 Velocity
  firstLeadKneeFlexionVelocity: number[] // 8 Velocity
  firstTrailLegKneeExtensionVelocity: number[] // 9 Velocity
  firstPelvisRotationVelocity: number[] // 13 Velocity
  firstHipShoulderSeparationVelocity: number[] // 14 Velocity

  // SEQ
  firstPelvisRotationVelocitySEQ: number[] // 13 Velocity
  firstTorsoRotationAngleSEQ: number[] // 12 Velocity
  firstElbowExtensionVelocitySEQ: number[] // 0 Velocity
  firstShoulderInternalRotationVelocitySEQ: number[] // 3 Velocity
}

export class SecondPitch {
  encodedPitchId: string
  // Angle Throwing Arm
  secondElbowExtensionThrowingArmAngle: number[] // 0 Angle
  secondShoulderHorizontalAbductionThrowingArmAngle: number[] // 1 Angle
  secondShoulderAbductionThrowingArmAngle: number[] //2 Angle
  secondExternalRotationThrowingArmAngle: number[] // 3 Angle

  //Velocity Throwing Arm
  secondElbowExtensionThrowingArmVelocity: number[] // 0 Velocity
  secondShoulderHorizontalAbductionThrowingArmVelocity: number[] // 1 Velocity
  secondShoulderAbductionThrowingArmVelocity: number[] // 2 Velocity
  secondExternalRotationThrowingArmVelocity: number[] // 3 Velocity

  // Angle Glove Arm
  secondElbowExtensionGloveArmAngle: number[] // 4 Angle
  secondShoulderHorizontalAbductionGloveArmAngle: number[] // 5 Velocity
  secondShoulderAbductionGloveArmAngle: number[] // 6 Angle
  secondExternalRotationGloveArmAngle: number[] // 7 Angle

  // Velocity Glove Arm
  secondElbowExtensionGloveArmVelocity: number[] // 4 Velocity
  secondShoulderHorizontalAbductionGloveArmVelocity: number[] // 5 Velocity
  secondShoulderAbductionGloveArmVelocity: number[] // 6 Velocity
  secondExternalRotationGloveArmVelocity: number[] // 7 Velocity

  // Angle Trunk and Legs
  secondTrunkFlexionAngle: number[] // 10 Angle
  secondTrunkRotationAngle: number[] // 12 Angle
  secondLeadKneeFlexionAngle: number[] // 8 Angle
  secondTrailLegKneeExtensionAngle: number[] // 9 Angle
  secondPelvisRotationAngle: number[] // 13 Angle
  secondHipShoulderSeparationAngle: number[] // 14 Angle

  // Velocity Trunck and Legs
  secondTrunkFlexionVelocity: number[] // 10 Velocity
  secondTrunkRotationVelocity: number[] // 12 Velocity
  secondLeadKneeFlexionVelocity: number[] // 8 Velocity
  secondTrailLegKneeExtensionVelocity: number[] // 9 Velocity
  secondPelvisRotationVelocity: number[] // 13 Velocity
  secondHipShoulderSeparationVelocity: number[] // 14 Velocity

  // SEQ
  secondPelvisRotationVelocitySEQ: number[] // 13 Velocity
  secondTorsoRotationAngleSEQ: number[] // 12 Velocity
  secondElbowExtensionVelocitySEQ: number[] // 0 Velocity
  secondShoulderInternalRotationVelocitySEQ: number[] // 3 Velocity
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  share: boolean
  play: boolean
  currentTime: number
  duration: number
  selectedDataPointType: string
  firstPitchId: number
  secondPitchId: number
  frameNumber: number
  firstFrameData: any
  secondFrameData: any
  firstPlayerName: string
  secondPlayerName: string
  graphData: any
  toolTipVisible: boolean
  yAxisPoints: number[]

  elbowExtensionVisible: boolean
  shoulderHorizontalAbductionVisible: boolean
  shoulderAbductionVisible: boolean
  trunkFlexionVisible: boolean
  trunkRotationVisible: boolean
  leadKneeFlexionVisible: boolean
  trailLegKneeExtensionVisible: boolean
  externalRotationVisible: boolean
  pelvisRotationVisible: boolean
  hipShoulderSeparationVisible: boolean
  pelvisRotationSEQVisible: boolean
  torsoRotationSEQVisible: boolean
  elbowExtensionSEQVisible: boolean
  shoulderInternalRotationSEQVisible: boolean
  reportUrl: string

  firstPitchmarkerFootFall: number
  firstPitchmarkerBallRelease: number
  secondPitchmarkerFootFall: number
  secondPitchmarkerBallRelease: number
}

export const PitchCompareScreen: React.FunctionComponent<PitchCompareScreenProps> = props => {
  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    share: false,
    play: false,
    currentTime: 0,
    duration: 0,
    selectedDataPointType: "1",
    firstPitchId: props.route.params.pitch1 ? props.route.params.pitch1 : 0,
    secondPitchId: props.route.params.pitch2 ? props.route.params.pitch2 : 0,
    frameNumber: 0,
    firstFrameData: [],
    secondFrameData: [],
    firstPlayerName: "",
    secondPlayerName: "",
    graphData: [],
    toolTipVisible: false,
    yAxisPoints: [],

    elbowExtensionVisible: true,
    shoulderHorizontalAbductionVisible: true,
    shoulderAbductionVisible: true,
    trunkFlexionVisible: true,
    trunkRotationVisible: false,
    leadKneeFlexionVisible: true,
    trailLegKneeExtensionVisible: false,
    externalRotationVisible: true,
    pelvisRotationVisible: false,
    hipShoulderSeparationVisible: true,
    pelvisRotationSEQVisible: true,
    torsoRotationSEQVisible: true,
    elbowExtensionSEQVisible: true,
    shoulderInternalRotationSEQVisible: true,
    reportUrl: "",

    firstPitchmarkerFootFall: 0,
    firstPitchmarkerBallRelease: 0,
    secondPitchmarkerFootFall: 0,
    secondPitchmarkerBallRelease: 0,
  })

  const pitchService = new PitchService(props)
  let firstPitch = new FirstPitch()
  let secondPitch = new SecondPitch()
  const { height } = Dimensions.get("window")
  const firstPlayerColor = "#6ba4ff"
  const secondPlayerColor = "#ff6767"

  // Check network before fethcing values

  const checkNetworkStatus = async (): Promise<boolean> => {
    let isNetworkConnected = false
    const networkValidator = new NetworkValidator()
    isNetworkConnected = await networkValidator.CheckConnectivity()
    return isNetworkConnected
  }

  const changeGraphType = (value: string): void => {
    setState(s => ({
      ...s,
      loading: true,
    }))
    const selectedDataPointType = value !== undefined ? value : state.selectedDataPointType
    const tempData = []
    setFirstPitchDetails().then(async firstPitchData => {
      if (firstPitchData) {
        await setSecondPitchDetails().then(async secondPitchData => {
          if (secondPitchData) {
            firstPitch = firstPitchData
            secondPitch = secondPitchData
            setState(s => ({
              ...s,
              firstPitch: firstPitchData as FirstPitch,
              secondPitch: secondPitchData as SecondPitch,
            }))
            switch (+selectedDataPointType) {
              case 1:
                // Angles - Throwing Arm

                if (state.elbowExtensionVisible) {
                  tempData.push({
                    data: firstPitch.firstElbowExtensionThrowingArmAngle,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondElbowExtensionThrowingArmAngle,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
                  })
                }

                if (state.shoulderAbductionVisible) {
                  tempData.push({
                    data: firstPitch.firstShoulderAbductionThrowingArmAngle,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [4, 6], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondShoulderAbductionThrowingArmAngle,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [4, 6], strokeWidth: 2 },
                  })
                }
                if (state.externalRotationVisible) {
                  tempData.push({
                    data: firstPitch.firstExternalRotationThrowingArmAngle,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondExternalRotationThrowingArmAngle,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })
                }

                if (state.shoulderHorizontalAbductionVisible) {
                  tempData.push({
                    data: firstPitch.firstShoulderHorizontalAbductionThrowingArmAngle,
                    svg: { stroke: firstPlayerColor, strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondShoulderHorizontalAbductionThrowingArmAngle,
                    svg: { stroke: secondPlayerColor, strokeWidth: 2 },
                  })
                }
                setState(s => ({
                  ...s,
                  selectedDataPointType: "1",
                  graphData: tempData,
                }))
                break
              case 2:
                // Angles - Glove Arm
                if (state.elbowExtensionVisible) {
                  tempData.push({
                    data: firstPitch.firstElbowExtensionGloveArmAngle,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondElbowExtensionGloveArmAngle,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
                  })
                }

                if (state.shoulderAbductionVisible) {
                  tempData.push({
                    data: firstPitch.firstShoulderAbductionGloveArmAngle,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [4, 6], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondShoulderAbductionGloveArmAngle,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [4, 6], strokeWidth: 2 },
                  })
                }
                if (state.externalRotationVisible) {
                  tempData.push({
                    data: firstPitch.firstExternalRotationGloveArmAngle,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondExternalRotationGloveArmAngle,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })
                }
                if (state.shoulderHorizontalAbductionVisible) {
                  tempData.push({
                    data: firstPitch.firstShoulderHorizontalAbductionGloveArmAngle,
                    svg: { stroke: firstPlayerColor, strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondShoulderHorizontalAbductionGloveArmAngle,
                    svg: { stroke: secondPlayerColor, strokeWidth: 2 },
                  })
                }
                setState(s => ({
                  ...s,
                  selectedDataPointType: "2",
                  graphData: tempData,
                }))
                break
              case 3:
                // Angles - Trunk And Legs
                if (state.leadKneeFlexionVisible) {
                  tempData.push({
                    data: firstPitch.firstLeadKneeFlexionAngle,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondLeadKneeFlexionAngle,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
                  })
                }

                if (state.trunkFlexionVisible) {
                  tempData.push({
                    data: firstPitch.firstTrunkFlexionAngle,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [4, 6], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondTrunkFlexionAngle,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [4, 6], strokeWidth: 2 },
                  })
                }

                if (state.trunkRotationVisible) {
                  tempData.push({
                    data: firstPitch.firstTrunkRotationAngle,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondTrunkRotationAngle,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })
                }

                if (state.trailLegKneeExtensionVisible) {
                  tempData.push({
                    data: firstPitch.firstTrailLegKneeExtensionAngle,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [8, 10], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondTrailLegKneeExtensionAngle,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [8, 10], strokeWidth: 2 },
                  })
                }

                if (state.pelvisRotationVisible) {
                  tempData.push({
                    data: firstPitch.firstPelvisRotationAngle,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [10, 12], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondPelvisRotationAngle,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [10, 12], strokeWidth: 2 },
                  })
                }

                if (state.hipShoulderSeparationVisible) {
                  tempData.push({
                    data: firstPitch.firstHipShoulderSeparationAngle,
                    svg: { stroke: firstPlayerColor, strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondHipShoulderSeparationAngle,
                    svg: { stroke: secondPlayerColor, strokeWidth: 2 },
                  })
                }

                setState(s => ({
                  ...s,
                  selectedDataPointType: "3",
                  graphData: tempData,
                }))
                break
              case 4:
                // Velocity - Throwing Arm

                if (state.elbowExtensionVisible) {
                  tempData.push({
                    data: firstPitch.firstElbowExtensionThrowingArmVelocity,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondElbowExtensionThrowingArmVelocity,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
                  })
                }
                if (state.shoulderHorizontalAbductionVisible) {
                  tempData.push({
                    data: firstPitch.firstShoulderHorizontalAbductionThrowingArmVelocity,
                    svg: { stroke: firstPlayerColor, strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondShoulderHorizontalAbductionThrowingArmVelocity,
                    svg: { stroke: secondPlayerColor, strokeWidth: 2 },
                  })
                }
                if (state.shoulderAbductionVisible) {
                  tempData.push({
                    data: firstPitch.firstShoulderAbductionThrowingArmVelocity,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondShoulderAbductionThrowingArmVelocity,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })
                }
                if (state.externalRotationVisible) {
                  tempData.push({
                    data: firstPitch.firstExternalRotationGloveArmVelocity,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondExternalRotationThrowingArmVelocity,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })
                }

                setState(s => ({
                  ...s,
                  selectedDataPointType: "4",
                  graphData: tempData,
                }))
                break
              case 5:
                // Velocity - Glove Arm
                if (state.elbowExtensionVisible) {
                  tempData.push({
                    data: firstPitch.firstElbowExtensionGloveArmVelocity,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondElbowExtensionGloveArmVelocity,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
                  })
                }
                if (state.shoulderHorizontalAbductionVisible) {
                  tempData.push({
                    data: firstPitch.firstShoulderHorizontalAbductionGloveArmVelocity,
                    svg: { stroke: firstPlayerColor, strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondShoulderHorizontalAbductionGloveArmVelocity,
                    svg: { stroke: secondPlayerColor, strokeWidth: 2 },
                  })
                }
                if (state.shoulderAbductionVisible) {
                  tempData.push({
                    data: firstPitch.firstShoulderAbductionGloveArmVelocity,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondShoulderAbductionGloveArmVelocity,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })
                }
                if (state.externalRotationVisible) {
                  tempData.push({
                    data: firstPitch.firstExternalRotationGloveArmVelocity,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondExternalRotationGloveArmVelocity,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })
                }
                setState(s => ({
                  ...s,
                  selectedDataPointType: "5",
                  graphData: tempData,
                }))
                break
              case 6:
                // Velocity - Trunk And Legs
                if (state.trunkFlexionVisible) {
                  tempData.push({
                    data: firstPitch.firstTrunkFlexionVelocity,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondTrunkFlexionVelocity,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })
                }

                if (state.trunkRotationVisible) {
                  tempData.push({
                    data: firstPitch.firstTrunkRotationVelocity,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondTrunkRotationVelocity,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })
                }

                if (state.leadKneeFlexionVisible) {
                  tempData.push({
                    data: firstPitch.firstLeadKneeFlexionVelocity,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondLeadKneeFlexionVelocity,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
                  })
                }

                if (state.trailLegKneeExtensionVisible) {
                  tempData.push({
                    data: firstPitch.firstTrailLegKneeExtensionVelocity,
                    svg: { stroke: firstPlayerColor, strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondTrailLegKneeExtensionVelocity,
                    svg: { stroke: secondPlayerColor, strokeWidth: 2 },
                  })
                }

                if (state.pelvisRotationVisible) {
                  tempData.push({
                    data: firstPitch.firstPelvisRotationVelocity,
                    svg: { stroke: firstPlayerColor, strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondPelvisRotationVelocity,
                    svg: { stroke: secondPlayerColor, strokeWidth: 2 },
                  })
                }

                if (state.hipShoulderSeparationVisible) {
                  tempData.push({
                    data: firstPitch.firstHipShoulderSeparationVelocity,
                    svg: { stroke: firstPlayerColor, strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondHipShoulderSeparationVelocity,
                    svg: { stroke: secondPlayerColor, strokeWidth: 2 },
                  })
                }
                setState(s => ({
                  ...s,
                  selectedDataPointType: "6",
                  graphData: tempData,
                }))
                break
              case 7:
                // SEQ
                if (state.pelvisRotationSEQVisible) {
                  tempData.push({
                    data: firstPitch.firstPelvisRotationVelocitySEQ,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondPelvisRotationVelocitySEQ,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
                  })
                }
                if (state.torsoRotationSEQVisible) {
                  tempData.push({
                    data: firstPitch.firstTorsoRotationAngleSEQ,
                    svg: { stroke: firstPlayerColor, strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondTorsoRotationAngleSEQ,
                    svg: { stroke: secondPlayerColor, strokeWidth: 2 },
                  })
                }
                if (state.elbowExtensionSEQVisible) {
                  tempData.push({
                    data: firstPitch.firstElbowExtensionVelocitySEQ,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondElbowExtensionVelocitySEQ,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
                  })
                }
                if (state.shoulderInternalRotationSEQVisible) {
                  tempData.push({
                    data: firstPitch.firstShoulderInternalRotationVelocitySEQ,
                    svg: { stroke: firstPlayerColor, strokeDasharray: [8, 10], strokeWidth: 2 },
                  })

                  tempData.push({
                    data: secondPitch.secondShoulderInternalRotationVelocitySEQ,
                    svg: { stroke: secondPlayerColor, strokeDasharray: [8, 10], strokeWidth: 2 },
                  })
                }

                setState(s => ({
                  ...s,
                  selectedDataPointType: "7",
                  graphData: tempData,
                }))
                break
              default:
                break
            }
            const yAxixData: number[] = []
            for (let i = 0; i < tempData.length; i++) {
              yAxixData.push(...tempData[i].data)
            }
            const max = Math.max(...yAxixData)
            let min = Math.min(...yAxixData)

            const yAxisStep = Math.floor((max - min) / 10)
            const element: number[] = []
            for (let i = 0; i < 10; i++) {
              min = min + yAxisStep
              element.push(+min.toFixed(1))
            }
            setState(s => ({
              ...s,
              loading: false,
              yAxisPoints: element,
            }))
          }
        })
      }
    })
  }

  const setInitialGraphData = (): void => {
    const tempData = []
    if (state.elbowExtensionVisible) {
      tempData.push({
        data: firstPitch.firstElbowExtensionThrowingArmAngle,
        svg: { stroke: firstPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
      })

      tempData.push({
        data: secondPitch.secondElbowExtensionThrowingArmAngle,
        svg: { stroke: secondPlayerColor, strokeDasharray: [2, 4], strokeWidth: 2 },
      })
    }
    if (state.shoulderHorizontalAbductionVisible) {
      tempData.push({
        data: firstPitch.firstShoulderHorizontalAbductionThrowingArmAngle,
        svg: { stroke: firstPlayerColor, strokeWidth: 2 },
      })

      tempData.push({
        data: secondPitch.secondShoulderHorizontalAbductionThrowingArmAngle,
        svg: { stroke: secondPlayerColor, strokeWidth: 2 },
      })
    }
    if (state.shoulderAbductionVisible) {
      tempData.push({
        data: firstPitch.firstShoulderAbductionThrowingArmAngle,
        svg: { stroke: firstPlayerColor, strokeDasharray: [4, 6], strokeWidth: 2 },
      })

      tempData.push({
        data: secondPitch.secondShoulderAbductionThrowingArmAngle,
        svg: { stroke: secondPlayerColor, strokeDasharray: [4, 6], strokeWidth: 2 },
      })
    }
    if (state.externalRotationVisible) {
      tempData.push({
        data: firstPitch.firstExternalRotationThrowingArmAngle,
        svg: { stroke: firstPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
      })

      tempData.push({
        data: secondPitch.secondExternalRotationThrowingArmAngle,
        svg: { stroke: secondPlayerColor, strokeDasharray: [6, 8], strokeWidth: 2 },
      })
    }
    const yAxixData: number[] = []
    for (let i = 0; i < tempData.length; i++) {
      yAxixData.push(...tempData[i].data)
    }
    const max = Math.max(...yAxixData)
    let min = Math.min(...yAxixData)

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
      yAxisPoints: element,
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

  const setSecondPitchComparisonCoordinate = async (
    coordinates: comparisonCoordinates2d,
  ): Promise<boolean> => {
    const jointListCoordinates = []
    setState(s => ({
      ...s,
      secondPlayerName: coordinates.player,
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
    setState(s => ({ ...s, secondFrameData: tempFrameData }))
    return true
  }

  const setFirstPitchKinemeticCoordinates = async (coordinates: kinematic): Promise<FirstPitch> => {
    const tempElbowThrowingAngle = []
    const tempShoulderHorizontalAbductionThrowingArmAngle = []
    const tempShoulderAbductionThrowingArmAngle = []
    const tempElbowExtensionGloveArmAngle = []
    const tempShoulderHorizontalAbductionGloveArmAngle = []
    const tempShoulderAbductionGloveArmAngle = []

    const tempElbowThrowingArmVelocity = []
    const tempShoulderHorizontalAbductionThrowingArmVelocity = []
    const tempShoulderAbductionThrowingArmVelocity = []
    const tempElbowExtensionGloveArmVelocity = []
    const tempShoulderHorizontalAbductionGloveArmVelocity = []
    const tempShoulderAbductionGloveArmVelocity = []

    const tempTrunkFlexionAngle = []
    const tempTrunkRotationAngle = []
    const tempLeadKneeFlexionAngle = []
    const tempTrailLegKneeExtensionAngle = []

    const tempTrunkFlexionVelocity = []
    const tempTrunkRotationVelocity = []
    const tempLeadKneeFlexionVelocity = []
    const tempTrailLegKneeExtensionVelocity = []

    const tempExternalRotationThrowingArmAngle = []
    const tempExternalRotationThrowingArmVelocity = []
    const tempExternalRotationGloveArmAngle = []
    const tempExternalRotationGloveArmVelocity = []

    const tempPelvisRotationAngle = []
    const tempPelvisRotationVelocity = []
    const tempHipShoulderSeparationAngle = []
    const tempHipShoulderSeparationVelocity = []

    const tempPelvisRotationVelocitySEQ = []
    const tempTorsoRotationVelocitySEQ = []
    const tempElbowExtensionVelocitySEQ = []
    const tempshoulderInternalRotationVelocitySEQ = []

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
              tempElbowExtensionVelocitySEQ.push(obj * -1)
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
              tempshoulderInternalRotationVelocitySEQ.push(obj * -1)
            }
            break
          case 4:
            tempElbowExtensionGloveArmVelocity.push(obj)
            break
          case 5:
            tempShoulderHorizontalAbductionGloveArmVelocity.push(obj * -1)
            break
          case 6:
            tempShoulderAbductionGloveArmVelocity.push(obj)
            break
          case 7:
            tempExternalRotationThrowingArmVelocity.push(obj)
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
              tempTorsoRotationVelocitySEQ.push(obj)
            }
            break
          case 13:
            tempPelvisRotationVelocity.push(obj)
            if (mainIndex >= 700) {
              tempPelvisRotationVelocitySEQ.push(obj)
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
      firstPelvisRotationAngle: tempPelvisRotationAngle,
      firstPelvisRotationVelocity: tempPelvisRotationVelocity,
      firstHipShoulderSeparationAngle: tempHipShoulderSeparationAngle,
      firstHipShoulderSeparationVelocity: tempHipShoulderSeparationVelocity,
      firstPelvisRotationVelocitySEQ: tempPelvisRotationVelocitySEQ,
      firstTorsoRotationAngleSEQ: tempTorsoRotationVelocitySEQ,
      firstElbowExtensionVelocitySEQ: tempElbowExtensionVelocitySEQ,
      firstShoulderInternalRotationVelocitySEQ: tempshoulderInternalRotationVelocitySEQ,
      encodedPitchId: null,
    }
    return firstPitch
  }

  const setSecondPitchKinemeticCoordinates = async (
    coordinates: kinematic,
  ): Promise<SecondPitch> => {
    const tempElbowThrowingAngle = []
    const tempShoulderHorizontalAbductionThrowingArmAngle = []
    const tempShoulderAbductionThrowingArmAngle = []
    const tempElbowExtensionGloveArmAngle = []
    const tempShoulderHorizontalAbductionGloveArmAngle = []
    const tempShoulderAbductionGloveArmAngle = []

    const tempElbowThrowingArmVelocity = []
    const tempShoulderHorizontalAbductionThrowingArmVelocity = []
    const tempShoulderAbductionThrowingArmVelocity = []
    const tempElbowExtensionGloveArmVelocity = []
    const tempShoulderHorizontalAbductionGloveArmVelocity = []
    const tempShoulderAbductionGloveArmVelocity = []

    const tempTrunkFlexionAngle = []
    const tempTrunkRotationAngle = []
    const tempLeadKneeFlexionAngle = []
    const tempTrailLegKneeExtensionAngle = []

    const tempTrunkFlexionVelocity = []
    const tempTrunkRotationVelocity = []
    const tempLeadKneeFlexionVelocity = []
    const tempTrailLegKneeExtensionVelocity = []

    const tempExternalRotationThrowingArmAngle = []
    const tempExternalRotationThrowingArmVelocity = []
    const tempExternalRotationGloveArmAngle = []
    const tempExternalRotationGloveArmVelocity = []

    const tempPelvisRotationAngle = []
    const tempPelvisRotationVelocity = []
    const tempHipShoulderSeparationAngle = []
    const tempHipShoulderSeparationVelocity = []

    const tempPelvisRotationVelocitySEQ = []
    const tempTorsoRotationVelocitySEQ = []
    const tempElbowExtensionVelocitySEQ = []
    const tempshoulderInternalRotationVelocitySEQ = []

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
              tempElbowExtensionVelocitySEQ.push(obj * -1)
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
              tempshoulderInternalRotationVelocitySEQ.push(obj * -1)
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
              tempTorsoRotationVelocitySEQ.push(obj)
            }
            break
          case 13:
            tempPelvisRotationVelocity.push(obj)
            if (mainIndex >= 700) {
              tempPelvisRotationVelocitySEQ.push(obj)
            }
            break
          case 14:
            tempHipShoulderSeparationVelocity.push(obj)
          default:
            break
        }
      })
    })
    const secondPitch: SecondPitch = {
      secondElbowExtensionThrowingArmAngle: tempElbowThrowingAngle,
      secondShoulderHorizontalAbductionThrowingArmAngle: tempShoulderHorizontalAbductionThrowingArmAngle,
      secondShoulderAbductionThrowingArmAngle: tempShoulderAbductionThrowingArmAngle,
      secondElbowExtensionGloveArmAngle: tempElbowExtensionGloveArmAngle,
      secondShoulderHorizontalAbductionGloveArmAngle: tempShoulderHorizontalAbductionGloveArmAngle,
      secondShoulderAbductionGloveArmAngle: tempShoulderAbductionGloveArmAngle,
      secondElbowExtensionThrowingArmVelocity: tempElbowThrowingArmVelocity,
      secondShoulderAbductionThrowingArmVelocity: tempShoulderHorizontalAbductionThrowingArmVelocity,
      secondShoulderHorizontalAbductionThrowingArmVelocity: tempShoulderAbductionThrowingArmVelocity,
      secondElbowExtensionGloveArmVelocity: tempElbowExtensionGloveArmVelocity,
      secondShoulderHorizontalAbductionGloveArmVelocity: tempShoulderHorizontalAbductionGloveArmVelocity,
      secondShoulderAbductionGloveArmVelocity: tempShoulderAbductionGloveArmVelocity,
      secondLeadKneeFlexionAngle: tempLeadKneeFlexionAngle,
      secondTrailLegKneeExtensionAngle: tempTrailLegKneeExtensionAngle,
      secondTrunkFlexionAngle: tempTrunkFlexionAngle,
      secondTrunkRotationAngle: tempTrunkRotationAngle,
      secondLeadKneeFlexionVelocity: tempLeadKneeFlexionVelocity,
      secondTrailLegKneeExtensionVelocity: tempTrunkRotationVelocity,
      secondTrunkFlexionVelocity: tempTrunkFlexionVelocity,
      secondTrunkRotationVelocity: tempTrunkRotationVelocity,
      secondExternalRotationThrowingArmAngle: tempExternalRotationThrowingArmAngle,
      secondExternalRotationGloveArmAngle: tempExternalRotationGloveArmAngle,
      secondExternalRotationThrowingArmVelocity: tempExternalRotationThrowingArmVelocity,
      secondExternalRotationGloveArmVelocity: tempExternalRotationGloveArmVelocity,
      secondPelvisRotationAngle: tempPelvisRotationAngle,
      secondPelvisRotationVelocity: tempPelvisRotationVelocity,
      secondHipShoulderSeparationAngle: tempHipShoulderSeparationAngle,
      secondHipShoulderSeparationVelocity: tempHipShoulderSeparationVelocity,
      secondPelvisRotationVelocitySEQ: tempPelvisRotationVelocitySEQ,
      secondTorsoRotationAngleSEQ: tempTorsoRotationVelocitySEQ,
      secondElbowExtensionVelocitySEQ: tempElbowExtensionVelocitySEQ,
      secondShoulderInternalRotationVelocitySEQ: tempshoulderInternalRotationVelocitySEQ,
      encodedPitchId: null,
    }

    return secondPitch
  }

  const setFirstPitchDetails = async (): Promise<FirstPitch> => {
    return await pitchService.getPitchById(state.firstPitchId).then(async pitchDetails => {
      if (pitchDetails.kind === "NETWORK_ISSUE") {
        setState(s => ({
          ...s,
          loading: false,
          showErrorPanel: true,
          infoMessage: "Network not available.",
        }))
        return null
      } else if (pitchDetails.failureResponse != null) {
        setState(s => ({
          ...s,
          loading: false,
          showErrorPanel: true,
          infoMessage: pitchDetails.failureResponse.message,
        }))
        return null
      } else {
        if (
          pitchDetails.pitchResponse.comparisonCoordinates2d &&
          pitchDetails.pitchResponse.kinematics
        ) {
          const pitch2dCoordinates = JSON.parse(
            pitchDetails.pitchResponse.comparisonCoordinates2d,
          ) as comparisonCoordinates2d
          const setFirstPitch2dCoordinates = await setFirstPitchComparisonCoordinate(
            pitch2dCoordinates,
          )
          if (setFirstPitch2dCoordinates) {
            const pitchKinematic = JSON.parse(pitchDetails.pitchResponse.kinematics) as kinematic
            const firstPitch = await setFirstPitchKinemeticCoordinates(pitchKinematic)
            firstPitch.encodedPitchId = pitchDetails.pitchResponse.encodedPitchId
            var markers = pitchKinematic.markers
            setState(s => ({
              ...s,
              firstPitchmarkerFootFall: markers.FP,
              firstPitchmarkerBallRelease: markers.BR,
            }))
            return firstPitch
          } else {
            return null
          }
        } else {
          Alert.alert(
            "",
            translate("pitchCompare.analysisNotComplete"),
            [
              {
                text: "Close",
                onPress: goBack,
                style: "default",
              },
            ],
            { cancelable: false },
          )
          return null
        }
      }
    })
  }

  const setSecondPitchDetails = async (): Promise<SecondPitch> => {
    return await pitchService.getPitchById(state.secondPitchId).then(async pitchDetails => {
      if (pitchDetails.kind === "NETWORK_ISSUE") {
        setState(s => ({
          ...s,
          loading: false,
          showErrorPanel: true,
          infoMessage: "Network not available.",
        }))
        return null
      } else if (pitchDetails.failureResponse != null) {
        setState(s => ({
          ...s,
          loading: false,
          showErrorPanel: true,
          infoMessage: pitchDetails.failureResponse.message,
        }))
        return null
      } else {
        if (
          pitchDetails.pitchResponse.comparisonCoordinates2d &&
          pitchDetails.pitchResponse.kinematics
        ) {
          const pitch2dCoordinates = JSON.parse(
            pitchDetails.pitchResponse.comparisonCoordinates2d,
          ) as comparisonCoordinates2d
          const setSecondPitch2dCoordinates = await setSecondPitchComparisonCoordinate(
            pitch2dCoordinates,
          )
          if (setSecondPitch2dCoordinates) {
            const pitchKinematic = JSON.parse(pitchDetails.pitchResponse.kinematics) as kinematic
            const secondPitch = await setSecondPitchKinemeticCoordinates(pitchKinematic)
            secondPitch.encodedPitchId = pitchDetails.pitchResponse.encodedPitchId
            var markers = pitchKinematic.markers
            setState(s => ({
              ...s,
              secondPitchmarkerFootFall: markers.FP,
              secondPitchmarkerBallRelease: markers.BR,
            }))
            return secondPitch
          } else {
            return null
          }
        } else {
          Alert.alert(
            "",
            translate("pitchCompare.analysisNotComplete"),
            [
              {
                text: "Close",
                onPress: goBack,
                style: "default",
              },
            ],
            { cancelable: false },
          )
          return null
        }
      }
    })
  }

  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])

  React.useEffect(() => {
    const loadStartupResourcesAsync = async () => {
      setState(s => ({
        ...s,
        loading: true,
      }))
      let networkResult = await checkNetworkStatus()
      if (networkResult) {
        let firstPitchData = await setFirstPitchDetails()
        if (firstPitchData) {
          let secondPitchData = await setSecondPitchDetails()
          if (secondPitchData) {
            firstPitch = firstPitchData
            secondPitch = secondPitchData
            setState(s => ({
              ...s,
              firstPitch: firstPitchData as FirstPitch,
              secondPitch: secondPitchData as SecondPitch,
              reportUrl:
                API_URL.split("/api")[0] +
                "/Pitch/PitchCompare?value1=" +
                firstPitch.encodedPitchId +
                "&value2=" +
                secondPitch.encodedPitchId,
            }))
            setInitialGraphData()
            setState(s => ({
              ...s,
              loading: false,
            }))
          }
        } else {
          setState(s => ({
            ...s,
            loading: false,
          }))
        }
      } else {
        setState(s => ({
          ...s,
          loading: false,
        }))
        Alert.alert(
          "",
          translate("pitchCompare.networkNotAvailable"),
          [
            {
              text: "Close",
              onPress: goBack,
              style: "default",
            },
          ],
          { cancelable: false },
        )
      }
    }
    loadStartupResourcesAsync()
  }, [])

  const getGraphScrubberLocation = (): string => {
    return ((state.frameNumber / 1000) * 100).toString() + "%"
  }

  const getFirstPitchBallRelease = () => {
    return ((state.firstPitchmarkerBallRelease / 1000) * 100).toString() + "%"
  }

  const getFirstPitchFootFall = () => {
    return ((state.firstPitchmarkerFootFall / 1000) * 100).toString() + "%"
  }

  const getSecondPitchBallRelease = () => {
    return ((state.secondPitchmarkerBallRelease / 1000) * 100).toString() + "%"
  }

  const getSecondPitchFootFall = () => {
    return ((state.secondPitchmarkerFootFall / 1000) * 100).toString() + "%"
  }

  const getFirstPitchFootFallSEQ = (): string => {
    return (((state.firstPitchmarkerFootFall - 700) / 300) * 100).toString() + "%"
  }
  const getFirstPitchBallReleaseSEQ = (): string => {
    return (((state.firstPitchmarkerBallRelease - 700) / 300) * 100).toString() + "%"
  }

  const getSecondPitchFootFallSEQ = (): string => {
    return (((state.secondPitchmarkerFootFall - 700) / 300) * 100).toString() + "%"
  }
  const getsecondPitchBallReleaseSEQ = (): string => {
    return (((state.secondPitchmarkerBallRelease - 700) / 300) * 100).toString() + "%"
  }

  const FirstPitchBallReleaseSEQ = () => {
    return (
      <Line
        key={"zero-axis"}
        x1={getFirstPitchBallReleaseSEQ()}
        x2={getFirstPitchBallReleaseSEQ()}
        y1={"0%"}
        y2={"100%"}
        stroke={firstPlayerColor}
        strokeWidth={2}
        strokeDasharray={[8, 6]}
      />
    )
  }

  const FirstPitchFootFallSEQ = () => {
    return (
      <Line
        key={"zero-axis"}
        x1={getFirstPitchFootFallSEQ()}
        x2={getFirstPitchFootFallSEQ()}
        y1={"0%"}
        y2={"100%"}
        stroke={firstPlayerColor}
        strokeWidth={2}
      />
    )
  }

  const SecondPitchBallReleaseSEQ = () => {
    return (
      <Line
        key={"zero-axis"}
        x1={getsecondPitchBallReleaseSEQ()}
        x2={getsecondPitchBallReleaseSEQ()}
        y1={"0%"}
        y2={"100%"}
        stroke={secondPlayerColor}
        strokeWidth={2}
        strokeDasharray={[8, 6]}
      />
    )
  }

  const SecondPitchFootFallSEQ = () => {
    return (
      <Line
        key={"zero-axis"}
        x1={getSecondPitchFootFallSEQ()}
        x2={getSecondPitchFootFallSEQ()}
        y1={"0%"}
        y2={"100%"}
        stroke={secondPlayerColor}
        strokeWidth={2}
      />
    )
  }

  const FirstPitchBallRelease = () => {
    return (
      <Line
        key={"zero-axis"}
        x1={getFirstPitchBallRelease()}
        x2={getFirstPitchBallRelease()}
        y1={"0%"}
        y2={"100%"}
        stroke={firstPlayerColor}
        strokeWidth={2}
        strokeDasharray={[8, 6]}
      />
    )
  }

  const FirstPitchFootFall = () => {
    return (
      <Line
        key={"zero-axis"}
        x1={getFirstPitchFootFall()}
        x2={getFirstPitchFootFall()}
        y1={"0%"}
        y2={"100%"}
        stroke={firstPlayerColor}
        strokeWidth={2}
      />
    )
  }

  const SecondPitchBallRelease = () => {
    return (
      <Line
        key={"zero-axis"}
        x1={getSecondPitchBallRelease()}
        x2={getSecondPitchBallRelease()}
        y1={"0%"}
        y2={"100%"}
        stroke={secondPlayerColor}
        strokeDasharray={[8, 6]}
        strokeWidth={2}
      />
    )
  }

  const SecondPitchFootFall = () => {
    return (
      <Line
        key={"zero-axis"}
        x1={getSecondPitchFootFall()}
        x2={getSecondPitchFootFall()}
        y1={"0%"}
        y2={"100%"}
        stroke={secondPlayerColor}
        strokeWidth={2}
      />
    )
  }

  const VerticalLineScrubber = () => {
    return (
      <Line
        key={"zero-axis"}
        x1={getGraphScrubberLocation()}
        x2={getGraphScrubberLocation()}
        y1={"0%"}
        y2={"100%"}
        stroke={"yellow"}
        strokeWidth={2}
      />
    )
  }
  const axesSvg = {
    fontSize: 10,
    fill: "#FFFFFF",
    strokeWidth: 1,
  }
  const verticalContentInset = { top: 10, bottom: 10 }
  const xAxisHeight = 10

  const setFrameNumber = (value: React.ReactText) => {
    setState(s => ({
      ...s,
      frameNumber: +value,
    }))
  }

  const enabledLegend = {
    flexDirection: "row",
  }

  const disabledLegend = {
    flexDirection: "row",
    opacity: 0.25,
  }

  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Loader loading={state.loading} />
      <Header
        headerTx="pitchCompare.header"
        style={styles.SCREENHEADER}
        leftIcon="back"
        onLeftPress={goBack}
      />
      <View
        style={{
          backgroundColor: "black",
          height: 40,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesome name="circle" size={22} color={firstPlayerColor} style={{ marginRight: 5 }} />
        <Text style={{ marginRight: 10 }}>
          {state.firstPlayerName ? state.firstPlayerName : "Unknown Player"}
        </Text>
        <FontAwesome name="square" size={22} color={secondPlayerColor} style={{ marginRight: 5 }} />
        <Text>{state.secondPlayerName ? state.secondPlayerName : "Unknown Player"}</Text>
      </View>
      <View
        style={{
          height: 250,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: color.palette.darkGrey,
        }}
      >
        <TouchableWithoutFeedback>
          <View style={[styles.LAYOUT, { flexDirection: "row" }]}>
            <Skeleton
              id="firstSkeleton"
              strokeColor="#6ba4ff"
              data={state.firstFrameData[state.frameNumber]}
              style={{
                position: "absolute",
                height: 240,
                width: 240,
              }}
              showJoints={true}
            ></Skeleton>
            <Skeleton
              id="secondSkeleton"
              strokeColor="#ff6767"
              data={state.secondFrameData[state.frameNumber]}
              style={{
                position: "absolute",
                height: 240,
                width: 240,
              }}
              showJoints={true}
            ></Skeleton>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View>
        <ScrollView
          style={{
            height: height - 300,
            backgroundColor: "#323943",
          }}
        >
          <View style={{ marginTop: spacing[4], paddingHorizontal: "8%", marginBottom: 210 }}>
            <Button
              style={{
                backgroundColor: color.transparent,
                flexDirection: "row",
                alignSelf: "flex-start",
              }}
              onPress={() =>
                setState(s => ({
                  ...s,
                  share: true,
                }))
              }
            >
              <SvgXml xml={styles.ICON_SHARE} />
              <Text
                tx="pitchCompare.share"
                style={[styles.TEXT14, styles.FONTMEDIUM, { paddingLeft: 5 }]}
              ></Text>
            </Button>
            <Text tx="pitchCompare.dataPoint" style={{ fontSize: 20, fontWeight: "bold" }}></Text>
            <View
              style={{
                marginVertical: 10,
                borderBottomWidth: 2,
                borderBottomColor: "white",
                flexDirection: "row",
              }}
            >
              <Picker
                selectedValue={state.selectedDataPointType}
                mode="dropdown"
                style={styles.PICKER}
                itemStyle={styles.PICKER}
                onValueChange={value => {
                  setState(s => ({ ...s, selectedDataPointType: value.toString() }))
                  changeGraphType(value.toString())
                }}
              >
                <Picker.Item label={translate("pitchCompare.anglesThrowingArm")} value="1" />
                <Picker.Item label={translate("pitchCompare.anglesGloveArm")} value="2" />
                <Picker.Item label={translate("pitchCompare.anglesTrunkAndLegs")} value="3" />
                <Picker.Item label={translate("pitchCompare.velocityThrowingArm")} value="4" />
                <Picker.Item label={translate("pitchCompare.velocityGloveArm")} value="5" />
                <Picker.Item label={translate("pitchCompare.velocityTrunkAndLegs")} value="6" />
                <Picker.Item label={translate("pitchCompare.seq")} value="7" />
              </Picker>
              <FontAwesome
                name="caret-down"
                size={18}
                color="white"
                style={{ marginLeft: -20, marginTop: 15 }}
              ></FontAwesome>
            </View>
            <View></View>
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
                style={{ marginBottom: xAxisHeight }}
                contentInset={verticalContentInset}
                svg={axesSvg}
                formatLabel={value => `${value}º/s`}
              />

              <View style={{ flex: 1, marginLeft: 20 }}>
                <Tooltip
                  arrowSize={{ width: 16, height: 8 }}
                  backgroundColor="rgba(0,0,0,0.5)"
                  isVisible={state.toolTipVisible}
                  content={
                    <View>
                      <TouchableOpacity style={{ flexDirection: "row" }}>
                        <Dash
                          style={{
                            width: "15%",
                            paddingTop: 5,
                            paddingVertical: 0,
                            marginRight: 5,
                          }}
                          dashColor={"#323943"}
                          dashGap={0}
                          dashLength={6}
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
                            width: "15%",
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
                  onClose={() => setState(s => ({ ...s, toolTipVisible: false }))}
                ></Tooltip>
                <TouchableHighlight onPress={() => setState(s => ({ ...s, toolTipVisible: true }))}>
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={20}
                    color="white"
                    style={{ paddingLeft: "80%" }}
                  ></MaterialCommunityIcons>
                </TouchableHighlight>
                <LineChart
                  style={{ flex: 1, marginLeft: 10 }}
                  data={state.graphData}
                  contentInset={{ top: 20, bottom: 20 }}
                  svg={{ stroke: "#FFFFFF" }}
                >
                  {["1", "2", "3", "4", "5", "6"].includes(state.selectedDataPointType) && (
                    <View>
                      <FirstPitchBallRelease />
                      <FirstPitchFootFall />
                      <SecondPitchBallRelease />
                      <SecondPitchFootFall />
                    </View>
                  )}
                  {["7"].includes(state.selectedDataPointType) && (
                    <View>
                      <FirstPitchBallReleaseSEQ />
                      <FirstPitchFootFallSEQ />
                      <SecondPitchBallReleaseSEQ />
                      <SecondPitchFootFallSEQ />
                    </View>
                  )}
                  <VerticalLineScrubber />
                </LineChart>
              </View>
            </View>
            {["1", "2", "4", "5"].includes(state.selectedDataPointType) && (
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  style={state.elbowExtensionVisible ? enabledLegend : disabledLegend}
                  onPress={() => {
                    state.elbowExtensionVisible = !state.elbowExtensionVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "15%", paddingTop: 13 }}
                    dashColor="white"
                    dashGap={2}
                    dashLength={4}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchCompare.elbowExtension"
                    style={{ paddingTop: 5, marginLeft: 10 }}
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={state.shoulderHorizontalAbductionVisible ? enabledLegend : disabledLegend}
                  onPress={() => {
                    state.shoulderHorizontalAbductionVisible = !state.shoulderHorizontalAbductionVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "15%", paddingTop: 13 }}
                    dashColor="white"
                    dashGap={0}
                    dashLength={8}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchCompare.shoulderHorizontalAbduction"
                    style={{ paddingTop: 5, marginLeft: 10 }}
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={state.shoulderAbductionVisible ? enabledLegend : disabledLegend}
                  onPress={() => {
                    state.shoulderAbductionVisible = !state.shoulderAbductionVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "15%", paddingTop: 13 }}
                    dashColor="white"
                    dashGap={2}
                    dashLength={6}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchCompare.shoulderAbduction"
                    style={{ paddingTop: 5, marginLeft: 10 }}
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={state.externalRotationVisible ? enabledLegend : disabledLegend}
                  onPress={() => {
                    state.externalRotationVisible = !state.externalRotationVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "15%", paddingTop: 13 }}
                    dashColor="white"
                    dashGap={2}
                    dashLength={8}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchCompare.externalRotation"
                    style={{ paddingTop: 5, marginLeft: 10 }}
                  ></Text>
                </TouchableOpacity>
              </View>
            )}
            {["3", "6"].includes(state.selectedDataPointType) && (
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  style={state.trunkFlexionVisible ? enabledLegend : disabledLegend}
                  onPress={() => {
                    state.trunkFlexionVisible = !state.trunkFlexionVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "15%", paddingTop: 13 }}
                    dashColor="white"
                    dashGap={2}
                    dashLength={1}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchCompare.trunkFlexion"
                    style={{ paddingTop: 5, marginLeft: 10 }}
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={state.trunkRotationVisible ? enabledLegend : disabledLegend}
                  onPress={() => {
                    state.trunkRotationVisible = !state.trunkRotationVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "15%", paddingTop: 13 }}
                    dashColor="white"
                    dashGap={2}
                    dashLength={6}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchCompare.trunkRotation"
                    style={{ paddingTop: 5, marginLeft: 10 }}
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={state.leadKneeFlexionVisible ? enabledLegend : disabledLegend}
                  onPress={() => {
                    state.leadKneeFlexionVisible = !state.leadKneeFlexionVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "15%", paddingTop: 13 }}
                    dashColor="white"
                    dashGap={2}
                    dashLength={8}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchCompare.leadKneeFlexion"
                    style={{ paddingTop: 5, marginLeft: 10 }}
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={state.trailLegKneeExtensionVisible ? enabledLegend : disabledLegend}
                  onPress={() => {
                    state.trailLegKneeExtensionVisible = !state.trailLegKneeExtensionVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "15%", paddingTop: 13 }}
                    dashColor="white"
                    dashGap={2}
                    dashLength={10}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchCompare.trailLegKneeExtension"
                    style={{ paddingTop: 5, marginLeft: 10 }}
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={state.pelvisRotationVisible ? enabledLegend : disabledLegend}
                  onPress={() => {
                    state.pelvisRotationVisible = !state.pelvisRotationVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "15%", paddingTop: 13 }}
                    dashColor="white"
                    dashGap={2}
                    dashLength={12}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchCompare.pelvisRotation"
                    style={{ paddingTop: 5, marginLeft: 10 }}
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={state.hipShoulderSeparationVisible ? enabledLegend : disabledLegend}
                  onPress={() => {
                    state.hipShoulderSeparationVisible = !state.hipShoulderSeparationVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "15%", paddingTop: 13 }}
                    dashColor="white"
                    dashGap={0}
                    dashLength={8}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchCompare.hipShoulderSeparation"
                    style={{ paddingTop: 5, marginLeft: 10 }}
                  ></Text>
                </TouchableOpacity>
              </View>
            )}
            {["7"].includes(state.selectedDataPointType) && (
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  style={state.pelvisRotationSEQVisible ? enabledLegend : disabledLegend}
                  onPress={() => {
                    state.pelvisRotationSEQVisible = !state.pelvisRotationSEQVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "15%", paddingTop: 13 }}
                    dashColor="white"
                    dashGap={1}
                    dashLength={1}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchCompare.pelvisRotation"
                    style={{ paddingTop: 5, marginLeft: 10 }}
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={state.torsoRotationSEQVisible ? enabledLegend : disabledLegend}
                  onPress={() => {
                    state.torsoRotationSEQVisible = !state.torsoRotationSEQVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "15%", paddingTop: 13 }}
                    dashColor="white"
                    dashGap={0}
                    dashLength={6}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchCompare.torsoRotation"
                    style={{ paddingTop: 5, marginLeft: 10 }}
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={state.elbowExtensionSEQVisible ? enabledLegend : disabledLegend}
                  onPress={() => {
                    state.elbowExtensionSEQVisible = !state.elbowExtensionSEQVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "15%", paddingTop: 13 }}
                    dashColor="white"
                    dashGap={2}
                    dashLength={8}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchCompare.elbowExtension"
                    style={{ paddingTop: 5, marginLeft: 10 }}
                  ></Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    state.shoulderInternalRotationSEQVisible === true
                      ? enabledLegend
                      : state.shoulderInternalRotationSEQVisible
                  }
                  onPress={() => {
                    state.shoulderInternalRotationSEQVisible = !state.shoulderInternalRotationSEQVisible
                    changeGraphType(undefined)
                  }}
                >
                  <Dash
                    style={{ width: "15%", paddingTop: 13 }}
                    dashColor="white"
                    dashGap={2}
                    dashLength={10}
                    dashThickness={2}
                  />
                  <Text
                    tx="pitchCompare.shoulderInternalRotation"
                    style={{ paddingTop: 5, marginLeft: 10 }}
                  ></Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          backgroundColor: "black",
          height: 100,
          width: "100%",
          position: "absolute",
          bottom: 0,
          padding: 20,
        }}
      >
        <View style={{ borderRadius: 0, overflow: "hidden" }}>
          <View style={{ flexDirection: "row", position: "absolute" }}>
            <View
              style={{
                backgroundColor: "#d3d3d3",
                width: 300,
                height: 10,
                borderRadius: 0,
                position: "absolute",
              }}
            ></View>
            <View
              style={{
                backgroundColor: "#119EC2",
                width: "100%",
                height: 10,
              }}
            ></View>
          </View>
          <Slider
            style={{ width: "100%", height: 30, borderRadius: 50 }}
            minimumValue={0}
            maximumValue={999}
            maximumTrackTintColor="transparent"
            minimumTrackTintColor="transparent"
            onValueChange={value => setFrameNumber(value)}
            step={1}
            thumbStyle={styles.SLIDER_THUMB_STYLE}
          />
        </View>
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
      <SafeAreaView style={styles.FOOTER}>
        <View style={styles.FOOTER_CONTENT}></View>
      </SafeAreaView>
    </Screen>
  )
}
