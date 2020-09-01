import React from 'react';
import { View, Modal, ActivityIndicator } from 'react-native';
import * as styles from "../../theme/appStyle";

const Loader = props => {
  const { loading, ...attributes } = props;

  return (
    <Modal transparent={true} animationType={'none'} visible={loading} onRequestClose={() => {console.log('close modal')}}>
      <View style={styles.MODAL_BACKGROUND}>
        <View style={styles.ACTIVITY_INDICATOR_WRAPPER}>
          <ActivityIndicator size={75} color="#6BA4FF" animating={loading} />
        </View>
      </View>
    </Modal>
  )
}
export default Loader;