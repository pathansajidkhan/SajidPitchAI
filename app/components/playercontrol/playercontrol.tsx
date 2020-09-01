import * as React from "react"
import { View,TouchableOpacity, Image } from "react-native"
import { playercontrolStyles as styles } from "./playercontrol.styles"
import {Icon} from '../../components/icon/icon'


interface Props {
  playing: boolean;
  showPreviousAndNext: boolean;
  showSkip: boolean;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  onPlay: () => Promise<void>;
  onPause: () => Promise<void>;
  skipForwards?: () => void;
  skipBackwards?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const PlayerControls: React.FunctionComponent<Props> = ({
  playing,
  showPreviousAndNext,
  showSkip,
  previousDisabled,
  nextDisabled,
  onPlay,
  onPause,
  skipForwards,
  skipBackwards,
  onNext,
  onPrevious,
}) => (
  <View style={styles.wrapper}>
     {showPreviousAndNext && (
      <TouchableOpacity
        style={[styles.touchable, previousDisabled && styles.touchableDisabled]}
        onPress={onPrevious}
        disabled={previousDisabled}>
           <Image style={styles.iconStyle} source={require("../../../assets/_Icons/video-previous.png")} /> 
      </TouchableOpacity>
    )}

    {showSkip && (
      <TouchableOpacity style={styles.touchable} onPress={skipBackwards}>
              <Image style={styles.iconStyle} source={require("../../../assets/_Icons/video-backward.png")} /> 
      </TouchableOpacity>
    )}

    <TouchableOpacity
      style={styles.touchable}
      onPress={playing ? onPause : onPlay}>
      {playing ?      <Image style={styles.iconStyle} source={require("../../../assets/_Icons/video-pause.png")} /> :      <Image style={styles.iconStyle} source={require("../../../assets/_Icons/video-play.png")} />}
    </TouchableOpacity>

    {showSkip && (
      <TouchableOpacity style={styles.touchable} onPress={skipForwards}>
             <Image style={styles.iconStyle} source={require("../../../assets/_Icons/video-forward.png")} /> 
      </TouchableOpacity>
    )}

    {showPreviousAndNext && (
      <TouchableOpacity
        style={[styles.touchable, nextDisabled && styles.touchableDisabled]}
        onPress={onNext}
        disabled={nextDisabled}>
              <Image style={styles.iconStyle} source={require("../../../assets/_Icons/video-next.png")} /> 
      </TouchableOpacity>
    )} 
  </View>
);


