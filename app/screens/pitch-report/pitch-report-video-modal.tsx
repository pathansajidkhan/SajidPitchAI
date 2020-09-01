import React from "react"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Text, Screen, Header, Button } from "../../components"
import {
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Dimensions,
  Picker,
  Alert,
  TouchableHighlight,
  CheckBox,
} from "react-native"
import Loader from "../../components/spinner/loader"
import * as styles from "../../theme/appStyle"
import { ParamListBase } from "@react-navigation/native"
import { Video } from "expo-av"
import VideoPlayer from "expo-video-player"

export interface PitchReportVideoModalProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  pitchVideoUrlLocal: string
  videoHeight: number
  videoWidth: number
}

export const PitchReportVideoModal: React.FunctionComponent<PitchReportVideoModalProps> = props => {
  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    pitchVideoUrlLocal: props.route.params.pitchVideoUrlLocal
      ? props.route.params.pitchVideoUrlLocal
      : "",
    videoHeight: Dimensions.get("window").height,
    videoWidth: Dimensions.get("window").width,
  })
  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])

  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Loader loading={state.loading} />
      <View
        style={{
          height: state.videoHeight - 10,
          backgroundColor: "#000000",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: state.videoHeight,
          margin: 0,
        }}
      >
        <VideoPlayer
          videoProps={{
            shouldPlay: false,
            resizeMode: Video.RESIZE_MODE_CONTAIN,
            source: {
              uri: state.pitchVideoUrlLocal,
            },
            isMuted: false,
          }}
          inFullscreen={true}
          showControlsOnLoad={true}
          showFullscreenButton={true}
          videoBackground="transparent"
          switchToPortrait={goBack}
          height={state.videoHeight - 20}
          width={state.videoWidth - 20}
        />
      </View>
    </Screen>
  )
}
