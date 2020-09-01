import {StyleSheet} from 'react-native';


export const playercontrolStyles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 3,
    zIndex:1000
  },
  touchable: {
    padding: 5,
  },
  touchableDisabled: {
    opacity: 0.3,
  },
  iconStyle:{
    width:50,
    height:50
  },
});