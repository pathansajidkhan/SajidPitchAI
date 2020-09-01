import React, { useState, useEffect } from "react"
import { View, Dimensions, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import { Text, Screen, Button } from "../../components"
import { RNCamera } from "react-native-camera"
import * as styles from "../../theme/appStyle"
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { SvgXml } from "react-native-svg";
import { color } from "../../theme";
import Dash from "react-native-dash";
import { FontAwesome5 } from "@expo/vector-icons";
import { CreatePitchModel } from "../../models/data/pitch-model";
import moment from "moment";

export interface PitchVideoRecordScreenProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>,
  route: any
}

interface State {
  videoData: ImageInfo,
  screen: any,
  isOrientationLandscape: boolean,
  hasCameraPermission?: boolean,
  hasAudioPermission?: boolean,
  isRecording: boolean,
  isOn: boolean,
  time: number,
  start: number,
  isCancelled: boolean,
  isCameraReady:boolean,
}

export const PitchVideoRecordScreen: React.FunctionComponent<PitchVideoRecordScreenProps> = props => {
  const userId = props.route.params?props.route.params.userId?props.route.params.userId:null:null;
  const isRightHanded = props.route.params&&props.route.params.isRightHanded!==undefined?props.route.params.isRightHanded:true;
  const [isFocused,setIsFocused]  = useState<boolean>(null)
  props.navigation.addListener("focus",()=>{
    setIsFocused(true);
  })
  props.navigation.addListener("blur",()=>{
    setIsFocused(false);
  })
  const [state, setState] = useState<State>({
    videoData: null,
    screen: Dimensions.get("window"),
    isOrientationLandscape: false,
    hasCameraPermission: null,
    hasAudioPermission: null,
    isRecording: false,
    time: 0,
    isOn: false,
    start: 0,
    isCancelled: false,
    isCameraReady:false,
  });

    const goBack = React.useMemo(() => async () => {
      isLandscape = false;
      props.navigation.goBack();
    }, [props.navigation]);
 
  const [pitch,setPitch] = useState<CreatePitchModel>({
    playerUser: {
      id: userId,
      isRightHanded: isRightHanded,
    },
    uploadFile: null,
    playerUserId: userId,
    filmSource:"mobile",
  });

  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(RNCamera.Constants.Type.back);


  const useScreenDimensions = () => {
    const [screenData, setScreenData] = useState(Dimensions.get('screen'));
  
    useEffect(() => {
      const onChange = result => {
        setScreenData(result.screen);
      };
  
      Dimensions.addEventListener('change', onChange);
  
      return () => Dimensions.removeEventListener('change', onChange);
    });
  
    return screenData;
  };
  
  const screenData = useScreenDimensions();
  let isLandscape = screenData.width > screenData.height;
 
 
  useEffect(() => {
    (async () => {
      if (Constants.platform.ios) {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);
  
  // useEffect(() => {
  //   (async () => {
  //     //console.log("request permission")
  //     const { status } = await RNCamera.requestPermissionsAsync();
  //     //console.log(status)
  //     setState(s => ({ ...s, hasCameraPermission: (status === 'granted') }));
  //   })();
  // }, []);
  // useEffect(() => {
  //   (async () => {
  //    // console.log("request permission")
  //     const { status }  = await Audio.requestPermissionsAsync()
  //    // console.log(status)
  //     setState(s => ({ ...s, hasAudioPermission: (status === 'granted') }));
  //   })();
  // }, []);
  
  

  const pickVideo = async () => {
    let result: any;
    try {
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

  } catch (E) {
    console.log(E);
  }
    if (!result.cancelled) {
      setState(s => ({ ...s, videoData: result }));
      await setPitch(s=> ({...s, uploadFile: {uri: result.uri}}));
      pitch.uploadFile = {uri:result.uri};
     
       setCameraRef(null);
         props.navigation.navigate("pitchAnalyze",{pitch:pitch,isUploaded:true})
    }
  };
  let timer: any;
  const startTimer = ()=> {
    timer = setInterval(() => setState(s => ({ ...s,
      time: Date.now() - state.start
    })), 1000);
  }
  const stopTimer = () => {
    setState(s => ({ ...s, isOn: false,time: 0, start:0 }))
    clearInterval(timer)
  }
  const startRecording = async()=>{
     await setPitch(s=> ({...s, uploadFile: null}));
     await setState(s => ({ ...s, isRecording: true,isOn: true,
      time: state.time,
      start: Date.now() }))
      state.start = Date.now();
      startTimer();
      if (Platform.OS === 'android') {
        const previewRange = await cameraRef.getSupportedPreviewFpsRange();
        console.log(previewRange);
      }
     var response = await cameraRef.recordAsync({maxDuration:15,fps:240}); 
     stopTimer();
     await setPitch(s=> ({...s, uploadFile: {uri: response.uri}}));
     pitch.uploadFile = {uri:response.uri};
     await setState(s => ({ ...s, isRecording: false }))
     if(isLandscape && !state.isCancelled)
     {
        props.navigation.navigate("pitchAnalyze",{pitch:pitch,isUploaded:false})
     }    
     
  }

  const getTime=()=>{
    var durationValue = moment.duration(state.time, 'milliseconds');
    var mins = Math.floor(durationValue.asMinutes());
    var sec = Math.floor(durationValue.asSeconds()) - mins * 60;
    return (mins.toString().length<2?"0"+mins:mins)+":"+(sec.toString().length<2?"0"+sec:sec);
  }
 
  if(isFocused ) {
    return (
    <Screen style={styles.ROOT} preset="scroll">

      {
        isLandscape ?
          <View style={{ flex: 1 }}>
           
            <RNCamera style={{ flex: 1 }} type={type}  ref={ref => { setCameraRef(ref); } }
             onCameraReady={()=>{ setState(s => ({ ...s, isCameraReady: true }));}}
             androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
             >
           
              
        
            <View style={[styles.cameraSideBar,{alignItems:"center"}]}>
                {state.isRecording &&
                 <View>
                    <TouchableOpacity style={[styles.cameraStopButton]} onPress={async () => { await cameraRef.stopRecording() }}>  
                    <View style={{width:20,height:20,backgroundColor:color.palette.darkRed}}></View>
                    </TouchableOpacity>
                    <Text >{(getTime())}</Text>
                  </View>
                }
                {!state.isRecording &&  <Button style={{backgroundColor:color.transparent,position:"absolute",bottom:"5%",alignItems:"center" }} onPress={pickVideo}>
                    <SvgXml xml={styles.UPLOAD_SVG} style={styles.PROVIDERICON} />
                    <Text style={[styles.TEXT14,styles.FONTMEDIUM,{marginTop:40}]} tx="createPitch.upload"/>
                  </Button>}
              </View>
           
              {!state.isRecording && (
              pitch.playerUser.isRightHanded ?( 
                <View>
                  <View style={[styles.cameraSideBar,{alignItems:"center"}]}>
                      {!state.isRecording&&<TouchableOpacity style={styles.cameraRecordButton}  onPress={async ()=>{await startRecording();}}>  
                      </TouchableOpacity>
                      }
                      
                        <Button style={{backgroundColor:color.transparent,position:"absolute",bottom:"5%",alignItems:"center" }} onPress={pickVideo}>
                          <SvgXml xml={styles.UPLOAD_SVG} style={styles.PROVIDERICON} />
                          <Text style={[styles.TEXT14,styles.FONTMEDIUM,{marginTop:40}]} tx="createPitch.upload"/>
                        </Button>
                    </View>
              
              
              
                <View style={{backgroundColor:color.palette.transparentDarkGrey, width:"17%",height:"100%"}}>
                  <TouchableOpacity style={{position:"relative",flexDirection:"row",top:25,left:"5%"}} onPress={goBack}>
                      <Image  source={require("../../../assets/_Icons/icon-arrow-back.png")} /> 
                      <Text tx="createPitch.cancel" style={[styles.TEXT14,styles.FONTMEDIUM,{paddingLeft:10}]}></Text>
                  </TouchableOpacity>
                </View>
                <View style={{backgroundColor:color.palette.transparentDarkGrey, width:"23%",height:"7%",position:"absolute",left:"17%"}}></View>
                <View style={{backgroundColor:color.palette.transparentDarkGrey, width:"23%",height:"7%",position:"absolute",left:"17%",bottom:0}}></View>
                <View style={{backgroundColor:color.palette.transparentDarkGrey, width:"48%",height:"100%", position:"absolute",left:"40%"}}>
                  <Text style={[styles.TEXT14, styles.TEXTALIGNLEFT, styles.HORIZONTAL_PADDING,{paddingTop:"20%"}]} tx="createPitch.captureMessage1"></Text>
                  <Text style={[styles.TEXT14, styles.TEXTALIGNLEFT, styles.HORIZONTAL_PADDING,{paddingTop:"5%"}]} tx="createPitch.captureMessage2"></Text>

                  <View style={[{position:"absolute",top:"60%"},styles.HORIZONTAL_PADDING]}>
                    <Text tx="createPitch.handedness" style={[styles.TEXT14, styles.TEXTALIGNLEFT,{paddingBottom:10}]}></Text>
                    <View style={{flex:1,flexDirection:"row"}}>
                     
                      <Button style={[pitch.playerUser.isRightHanded?styles.BLUEBUTTON:styles.WHITEBUTTON,{flexDirection:"row",width:"35%"}]} onPress={() => setPitch(s => ({ ...s, playerUser: {...pitch, isRightHanded:true} }))}>
                      {pitch.playerUser.isRightHanded&& <FontAwesome5 name="check" size={14} color={color.palette.black} />}
                        <Text style={[styles.TEXT14, styles.TEXTALIGNCENTER,pitch.playerUser.isRightHanded?styles.BLUEBUTTONTEXT:styles.WHITEBUTTONTEXT]} tx="createPitch.right"></Text>
                      </Button>
                      <Button style={[!pitch.playerUser.isRightHanded?styles.BLUEBUTTON:styles.WHITEBUTTON,{flexDirection:"row",width:"35%",marginTop:0,marginLeft:15}]} onPress={() => setPitch(s => ({ ...s, playerUser: {...pitch, isRightHanded:false} }))}>
                      {!pitch.playerUser.isRightHanded&& <FontAwesome5 name="check" size={14} color={color.palette.black} />}
                        <Text style={[styles.TEXT14, styles.TEXTALIGNCENTER,styles.FONTMEDIUM,!pitch.playerUser.isRightHanded?styles.BLUEBUTTONTEXT:styles.WHITEBUTTONTEXT]} tx="createPitch.left"></Text>
                      </Button>
                    </View>
                  </View>
                </View>
                <Dash
                  style={{position:"absolute",top:"50%",left:"2.5%",width:"83%"}}
                  dashColor={color.palette.darkRed}
                  dashGap={8}
                  dashLength={10}
                  dashThickness={2}
                />
                        
              </View>
              ):(
                <View style={{flex:1}}>
              <View style={[styles.cameraSideBar,{alignItems:"center"}]}>
              {!state.isRecording&&<TouchableOpacity style={styles.cameraRecordButton}  onPress={async ()=>{await startRecording();}}>  
                </TouchableOpacity>
                }
                  
                    <Button style={{backgroundColor:color.transparent,position:"absolute",bottom:"5%",alignItems:"center" }} onPress={pickVideo}>
                      <SvgXml xml={styles.UPLOAD_SVG} style={styles.PROVIDERICON} />
                      <Text style={[styles.TEXT14,styles.FONTMEDIUM,{marginTop:40}]} tx="createPitch.upload"/>
                    </Button>
                </View>

                <View style={{backgroundColor:color.palette.transparentDarkGrey, width:"48%",height:"100%"}}>
                <TouchableOpacity style={{position:"relative",flexDirection:"row",top:25,left:"5%"}} onPress={goBack}>
                      <Image  source={require("../../../assets/_Icons/icon-arrow-back.png")} /> 
                      <Text tx="createPitch.cancel" style={[styles.TEXT14,styles.FONTMEDIUM,{paddingLeft:10}]}></Text>
                  </TouchableOpacity>
                  <Text style={[styles.TEXT14, styles.TEXTALIGNLEFT, styles.HORIZONTAL_PADDING,{paddingTop:"15%"}]} tx="createPitch.captureMessage1"></Text>
                  <Text style={[styles.TEXT14, styles.TEXTALIGNLEFT, styles.HORIZONTAL_PADDING,{paddingTop:"5%"}]} tx="createPitch.captureMessage2"></Text>

                  <View style={[{position:"absolute",top:"60%"},styles.HORIZONTAL_PADDING]}>
                    <Text tx="createPitch.handedness" style={[styles.TEXT14, styles.TEXTALIGNLEFT,{paddingBottom:10}]}></Text>
                    <View style={{flex:1,flexDirection:"row"}}>
                    
                      <Button style={[pitch.playerUser.isRightHanded?styles.BLUEBUTTON:styles.WHITEBUTTON,{flexDirection:"row",width:"35%",marginTop:0}]} onPress={() => setPitch(s => ({ ...s, playerUser: {...pitch, isRightHanded:true} }))}>
                      {pitch.playerUser.isRightHanded&& <FontAwesome5 name="check" size={14} color={color.palette.black} />}
                        <Text style={[styles.TEXT14, styles.TEXTALIGNCENTER,pitch.playerUser.isRightHanded?styles.BLUEBUTTONTEXT:styles.WHITEBUTTONTEXT]} tx="createPitch.right"></Text>
                      </Button>
                      <Button style={[!pitch.playerUser.isRightHanded?styles.BLUEBUTTON:styles.WHITEBUTTON,{flexDirection:"row",width:"35%",marginTop:0,marginLeft:15}]} onPress={() => setPitch(s => ({ ...s, playerUser: {...pitch, isRightHanded:false} }))}>
                      {!pitch.playerUser.isRightHanded&& <FontAwesome5 name="check" size={14} color={color.palette.black} />}
                        <Text style={[styles.TEXT14, styles.TEXTALIGNCENTER,styles.FONTMEDIUM,!pitch.playerUser.isRightHanded?styles.BLUEBUTTONTEXT:styles.WHITEBUTTONTEXT]} tx="createPitch.left"></Text>
                      </Button>
                    </View>
                  </View>
                </View>
                <View style={{backgroundColor:color.palette.transparentDarkGrey, width:"17%",height:"100%",position:"absolute",left:"71%"}}></View>
                <View style={{backgroundColor:color.palette.transparentDarkGrey, width:"23%",height:"7%",position:"absolute",left:"48%"}}></View>
                <View style={{backgroundColor:color.palette.transparentDarkGrey, width:"23%",height:"7%",position:"absolute",left:"48%",bottom:0}}></View>
                <Dash
                  style={{position:"absolute",top:"50%",left:"2.5%",width:"83%"}}
                  dashColor={color.palette.darkRed}
                  dashGap={8}
                  dashLength={10}
                  dashThickness={2}
                />
                        
              </View>
              ))
              }
            </RNCamera>
          </View> :
          <RNCamera style={{ flex: 1 }} type={type} onCameraReady={()=>{ setState(s => ({ ...s, isCameraReady: true }));}}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          <View style={[styles.MAIN_VIEW_CONTAINER,{height:"100%",backgroundColor:"rgba(50, 57, 67, 0.9)"}]}>
          <TouchableOpacity style={{position:"absolute",flexDirection:"row",top:"2%",left:"5%"}} onPress={goBack}>
                <Image  source={require("../../../assets/_Icons/icon-arrow-back.png")} /> 
                <Text tx="createPitch.cancel" style={[styles.TEXT14,styles.FONTMEDIUM,{paddingLeft:10}]}></Text>
            </TouchableOpacity>
            <View style={[{ flex: 1, marginVertical: "70%",paddingHorizontal:"15%" },styles.ALIGNCENTER]}>
              <Text style={[styles.TEXT16, styles.FONTMEDIUM]} tx="createPitch.recordView" />
              <Image style={{marginTop:20}}  source={require("../../../assets/portrait-to-landscape.png")} />
            </View>
            <View style={styles.MOVEBOTTOM}>
              <Button style={styles.UPLOAD_VIDEO_BUTTON} onPress={pickVideo}>
                <SvgXml xml={styles.UPLOAD_SVG} style={styles.PROVIDERICON} />
                <Text style={styles.UPLOAD_VIDEO_BUTTON_TEXT} tx="createPitch.uploadVideo"/>
              </Button>
            </View>
            
          </View>
          </RNCamera>
      }
    </Screen>
  );
    }
    else {
      return <Text>No access to camera</Text>;
    }
}
