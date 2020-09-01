import React, { useState, useEffect } from "react"
import { View, Image, Dimensions } from "react-native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import { Screen, Button, Text } from "../../components"
import { RNCamera } from "react-native-camera"
import * as styles from "../../theme/appStyle"
import { color } from "../../theme"
import PitchService from "../../middleware/services/pitch-service"
import { CreatePitchModel } from "../../models/data/pitch-model"
import * as MediaLibrary from "expo-media-library"
import { Video } from "expo-av"
import * as ScreenOrientation from "expo-screen-orientation"
import { FontAwesome5 } from "@expo/vector-icons"
import { CurrentLoginInfoModel } from "../../models/data/session-model"
import * as AsyncStorage from "../../utils/storage/storage"
import UserService from "../../middleware/services/user-service"

export interface PitchAnalyzeScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
  route: any
}

export const PitchAnalyzeScreen: React.FunctionComponent<PitchAnalyzeScreenProps> = props => {
  const pitchService = new PitchService(props)
  const userService = new UserService(props)
  const [pitchCreated, setPitchCreated] = useState<boolean>(false)
  const [pitchUploaded, setPitchUploaded] = useState<boolean>(false)
  const [pitch, setPitch] = useState<CreatePitchModel>(props.route.params.pitch)
  const [isUploaded] = useState<boolean>(props.route.params.isUploaded)
  const [isFocused, setIsFocused] = useState<boolean>(null)
  props.navigation.addListener("focus", () => {
    setIsFocused(true)
  })
  props.navigation.addListener("blur", () => {
    setIsFocused(false)
    ScreenOrientation.unlockAsync()
  })
  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
  }
  useEffect(() => {
    const fetchData = async () => {
      if (isUploaded) {
        await changeScreenOrientation()
      }
    }
    fetchData()
  }, [])

  const [type, setType] = useState(RNCamera.Constants.Type.back)

  const useScreenDimensions = () => {
    const [screenData, setScreenData] = useState(Dimensions.get("screen"))

    useEffect(() => {
      const onChange = result => {
        setScreenData(result.screen)
      }

      Dimensions.addEventListener("change", onChange)

      return () => Dimensions.removeEventListener("change", onChange)
    }, [])

    return screenData
  }

  const screenData = useScreenDimensions()
  const isLandscape = screenData.width > screenData.height

  const uploadPitch = async () => {
    await ScreenOrientation.unlockAsync()
    if (!isUploaded) {
      var status = await MediaLibrary.requestPermissionsAsync()

      if (status.status === "granted") {
        var localFilePath = await MediaLibrary.createAssetAsync(pitch.uploadFile.uri)
        pitchService.createPitch(pitch, localFilePath.uri).then(() => {
          setPitchUploaded(true)
        })
        setPitchCreated(true)
      }
    } else {
      pitchService.createPitch(pitch, pitch.uploadFile.uri).then(() => {
        setPitchUploaded(true)
      })
      setPitchCreated(true)
    }
  }

  return (
    <Screen style={styles.ROOT} preset="scroll">
      {isUploaded && !pitchCreated ? (
        <View style={{ flex: 1 }}>
          <Video
            source={{ uri: pitch.uploadFile.uri }}
            rate={1.0}
            volume={1.0}
            isMuted={true}
            resizeMode="cover"
            shouldPlay={false}
            style={{ width: "100%", height: "100%" }}
            useNativeControls={true}
          />
          <Button
            tx="createPitch.analyze"
            textStyle={styles.BLUEBUTTONTEXT}
            style={[
              styles.BLUEBUTTON,
              { position: "absolute", top: "3%", right: "3%", flexDirection: "row", width: 129 },
            ]}
            onPress={uploadPitch}
          >
            <Text style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]} tx="createPitch.analyze" />
            <FontAwesome5 name="arrow-right" size={16} color="black" />
          </Button>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              position: "absolute",
              bottom: "3%",
              left: "3%",
            }}
          >
            <Button
              style={[
                pitch.playerUser.isRightHanded ? styles.BLUEBUTTON : styles.WHITEBUTTON,
                { flexDirection: "row", width: 94, marginTop: 0 },
              ]}
              onPress={() =>
                setPitch(s => ({ ...s, playerUser: { ...pitch, isRightHanded: true } }))
              }
            >
              {pitch.playerUser.isRightHanded && (
                <FontAwesome5 name="check" size={14} color={color.palette.black} />
              )}
              <Text
                style={[
                  styles.TEXT14,
                  styles.TEXTALIGNCENTER,
                  pitch.playerUser.isRightHanded ? styles.BLUEBUTTONTEXT : styles.WHITEBUTTONTEXT,
                ]}
                tx="createPitch.right"
              ></Text>
            </Button>
            <Button
              style={[
                !pitch.playerUser.isRightHanded ? styles.BLUEBUTTON : styles.WHITEBUTTON,
                { flexDirection: "row", width: 94, marginLeft: 15, marginTop: 0 },
              ]}
              onPress={() =>
                setPitch(s => ({ ...s, playerUser: { ...pitch, isRightHanded: false } }))
              }
            >
              {!pitch.playerUser.isRightHanded && (
                <FontAwesome5 name="check" size={14} color={color.palette.black} />
              )}
              <Text
                style={[
                  styles.TEXT14,
                  styles.TEXTALIGNCENTER,
                  styles.FONTMEDIUM,
                  !pitch.playerUser.isRightHanded ? styles.BLUEBUTTONTEXT : styles.WHITEBUTTONTEXT,
                ]}
                tx="createPitch.left"
              ></Text>
            </Button>
          </View>
        </View>
      ) : !pitchCreated && isFocused ? (
        <View style={{ flex: 1 }}>
          <RNCamera style={[{ flex: 1 }, styles.ALIGNCENTER, styles.JUSTIFYCENTER]} type={type}>
            <View
              style={[
                {
                  backgroundColor: color.palette.transparentDarkGrey,
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  left: 0,
                },
                styles.ALIGNCENTER,
                styles.JUSTIFYCENTER,
              ]}
            >
              <Button
                tx="createPitch.uploadAndAnalyze"
                textStyle={styles.BLUEBUTTONTEXT}
                style={[styles.BLUEBUTTON]}
                onPress={uploadPitch}
              ></Button>
              <Button
                tx="createPitch.recordPitchAgain"
                textStyle={styles.WHITEBUTTONTEXT}
                style={[styles.WHITEBUTTON]}
                onPress={() => {
                  props.navigation.navigate("pitchVideoRecord", {
                    userId: pitch.playerUserId,
                  })
                }}
              ></Button>
            </View>
          </RNCamera>
        </View>
      ) : (
        <View style={[{ flex: 1 }, styles.ALIGNCENTER]}>
          <Text
            style={
              isLandscape
                ? [styles.TEXT24, styles.FONTMEDIUM, { marginTop: "2%" }]
                : [styles.TEXT24, styles.FONTMEDIUM, { marginTop: "35%" }]
            }
            tx={pitchUploaded ? "createPitch.pitchUploaded" : "createPitch.uploadingPitch"}
          ></Text>
          <Image
            style={[{ marginTop: 25 }, isLandscape && { height: 100, width: 100 }]}
            source={require("../../../assets/baseball-blue.png")}
          />
          <View style={[{ position: "absolute", bottom: "5%" }, styles.ALIGNCENTER]}>
            <View style={[{ flexDirection: "row", marginHorizontal: "15%" }, styles.ALIGNCENTER]}>
              <Image source={require("../../../assets/_Icons/icon-notifications.png")} />
              <Text
                style={[styles.TEXT14, styles.FONTREGULAR, { marginLeft: 15 }]}
                tx="createPitch.notification"
              ></Text>
            </View>
            <Button
              tx="createPitch.recordAnotherPitch"
              textStyle={styles.BLUEBUTTONTEXT}
              style={[styles.BLUEBUTTON, { marginVertical: 20 }]}
              onPress={() => {
                props.navigation.navigate("pitchVideoRecord", {
                  userId: pitch.playerUserId,
                  isRightHanded: pitch.playerUser.isRightHanded,
                })
              }}
            ></Button>
            <Text
              tx="createPitch.goToDashboard"
              style={[styles.TEXTUNDERLINE, styles.TEXT16, styles.FONTMEDIUM]}
              onPress={async () => {
                const userDetails = JSON.parse(
                  await AsyncStorage.loadString("UserDetails"),
                ) as CurrentLoginInfoModel
                const user = await userService.getUser(userDetails.user.id)
                props.navigation.replace("dashboard", {
                  user: user.userResponse,
                  session: userDetails,
                  reloadPitches: true,
                })
              }}
            ></Text>
          </View>
        </View>
      )}
    </Screen>
  )
}
