import React from 'react';
import {View, Text, StyleSheet,Slider} from 'react-native';

interface Props {
  currentTime: number;
  duration: number;
  onSlideCapture: (data: {seekTime: number}) => void;
  onSlideStart: () => void;
  onSlideComplete: () => void;
}

export const ProgressBar: React.FunctionComponent<Props> = ({
  currentTime,
  duration,
  onSlideCapture,
  onSlideStart,
  onSlideComplete,
}) => {
  const position = getMinutesFromMilliSeconds(currentTime);
  const fullDuration = getMinutesFromMilliSeconds(duration);

  return (
    <View style={styles.wrapper}>
      <Slider
        value={currentTime}
        minimumValue={0}
        maximumValue={duration/1000}
        step={1}
        onValueChange={handleOnSlide}
        onSlidingComplete={onSlideComplete}
        minimumTrackTintColor={'#F44336'}
        maximumTrackTintColor={'#FFFFFF'}
        thumbTintColor={'#F44336'}
      />
      <View style={styles.timeWrapper}>
        <Text style={styles.timeLeft}>{position}</Text>
        <Text style={styles.timeRight}>{fullDuration}</Text>
      </View>
    </View>
  );

  function getMinutesFromMilliSeconds(time: number) {
    time = time/1000;
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : '0' + minutes}:${
      seconds >= 10 ? seconds : '0' + seconds
    }`;
  }

  function handleOnSlide(time: number) {
    onSlideCapture({seekTime: time});
  }
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  timeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  timeLeft: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingLeft: 10,
  },
  timeRight: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'right',
    paddingRight: 10,
  },
});
