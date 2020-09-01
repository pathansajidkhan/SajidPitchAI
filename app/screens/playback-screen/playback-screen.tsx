import React, { useState }  from "react"
import { observer } from "mobx-react-lite"
import {PlayerControls} from '../../components/playercontrol/playercontrol';
import { StyleSheet,Dimensions,View,StatusBar,TouchableWithoutFeedback} from "react-native"
import { ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Screen } from "../../components"
import { color } from "../../theme"
import { Header } from "../../components"
import { Video } from 'expo-av';
import {framedata} from "../../models/skeleton"
import {Skeleton} from '../../components/skeleton/skeleton'
//import Orientation from 'react-native-orientation-locker';

export interface PlaybackScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>,
  framedata: any
}

interface State {
  fullscreen: boolean;
  play: boolean;
  currentTime: number;
  duration: number;
  showControls: boolean;
}
export const PlaybackScreen: React.FunctionComponent<PlaybackScreenProps> = observer((props) => {
  // const { someStore } = useStores()
  //var [frame, setFrame] = useState(framedata[0])
  var [frameNum, setFrameNum] = useState(0)
  const [state, setState] = useState<State>({
    fullscreen: false,
    play: false,
    currentTime: 0,
    duration: 0,
    showControls: true,
  });

  // useEffect(() => {
  //   Orientation.addOrientationListener(handleOrientation);

  //   return () => {
  //     Orientation.removeOrientationListener(handleOrientation);
  //   };
  // }, []);
  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])
  


  async function handlePlayPause() {
    // If playing, pause and show controls immediately.
    if (state.play) {
      if(videoRef && videoRef.current){
        await videoRef.current.pauseAsync();
        setState({...state, play: false, showControls: true});
      }
      return;
    }
    if(videoRef && videoRef.current){
      await videoRef.current.playAsync();
      setState({...state, play: true});
    setTimeout(() => setState(s => ({...s, showControls: false})), 1000);
    return;
    }
  }


 

  async function onProgress(data: any) {
    if(data.durationMillis)
    setState(s => ({
      ...s,
      duration: data.durationMillis,
    }));
    if(data.positionMillis)
    setState(s => ({
      ...s,
      currentTime: data.positionMillis,
    }));

    if (data.didJustFinish) {
      // The player has just finished playing and will stop. Maybe you want to play something else?
      await onEnd()
    }
    if(data.isPlaying && data.isLoaded)
    {
      var totalFrames = framedata.length;
      var num =parseInt((data.positionMillis/data.durationMillis*totalFrames).toString())
      setFrameNum(num);
    }
  }

  async function onEnd() {
    setState({...state, play: false});
    if(videoRef && videoRef.current){
      await videoRef.current.setPositionAsync(0).then(()=>{
      
          setFrameNum(0);
      });
      
    }
  }

  function showControls() {
    state.showControls
      ? setState({...state, showControls: false})
      : setState({...state, showControls: true});
  }
  


  const videoRef = React.createRef<Video>();
  
  return (
    <Screen style={styles.container} preset="scroll">
      <Header
          headerTx="demoScreen.howTo"
          leftIcon="back"
          onLeftPress={goBack}
        />
       
       <TouchableWithoutFeedback onPress={showControls}>
        <View  style={styles.LAYOUT}>
            <Video ref={videoRef}
            source={{
              uri:"https://myabilitiesdev.blob.core.windows.net/pitchai/munozC11.MP4"}}
              rate={1}
              volume={0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay={state.play }
              isLooping={false}
              style={state.fullscreen ? styles.fullscreenVideo : styles.video}
              useNativeControls={false}
              onPlaybackStatusUpdate = {onProgress}
              progressUpdateIntervalMillis ={100}
              shouldCorrectPitch={true}
          /> 
             <Skeleton id="skeleton" data={framedata[frameNum]} style={state.fullscreen ? styles.fullscreenSkeleton : styles.skeleton}></Skeleton> 
            
           {state.showControls && (
            <View style={styles.controlOverlay}>
               
              <PlayerControls
                onPlay={ handlePlayPause}
                onPause={handlePlayPause}
                playing={state.play}
                showPreviousAndNext={false}
                showSkip={false}
                
              />
                {/* <ProgressBar
                currentTime={state.currentTime}
                duration={state.duration > 0 ? state.duration : 0}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
              />    */}
            </View>
          )}
        
        </View>
      </TouchableWithoutFeedback>
    </Screen>
  )
})



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.palette.black,
  },
  video: {
    height: Dimensions.get('window').width * (9 / 16),
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
    position:"absolute",
  },
  fullscreenVideo: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').height,
    backgroundColor: 'black',
    position:"absolute",
  },
  skeleton: {
    height: Dimensions.get('window').width * (9 / 16),
    width: Dimensions.get('window').width,
    position:"relative",
  },
  fullscreenSkeleton: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').height,
    position:"relative",
  },
  fullscreenButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center'
  },
  controlOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000c4',
    justifyContent: 'space-between'
  },
  LAYOUT: {
    justifyContent:"center",
    alignItems:"center",
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (9 / 16),
  },
  iconStyle:{
    width:50,
    height:50
  },
});