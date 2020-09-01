import * as React from "react"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import { View, TouchableOpacity } from "react-native"
import { FontAwesome5, FontAwesome, Feather } from "@expo/vector-icons"
import { CheckBox } from "react-native-elements"
import Dash from "react-native-dash"

import * as styles from "../../theme/appStyle"
import { Screen, Header, TextField, Text } from "../../components"
import Loader from "../../components/spinner/loader"
import { spacing } from "../../theme"

export interface PlayerSetUpStepOneProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  fullName: string
  handedness: string
}

export const PlayerSetUpStepOne: React.FunctionComponent<PlayerSetUpStepOneProps> = props => {
  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    fullName: "",
    handedness: "Right",
  })

  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])

  const goToNextStep = async () => {
    if (!state.fullName) {
      setState((s: State) => ({
        ...s,
        showErrorPanel: true,
        infoMessage: "Full Name required",
      }))
    } else {
      setState((s: State) => ({
        ...s,
        showErrorPanel: false,
        infoMessage: "",
      }))
      props.navigation.navigate("playersetupsteptwo", {
        fullName: state.fullName,
        handedness: state.handedness,
      })
    }
  }

  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Loader loading={state.loading} />
      <Header
        headerTx="playerSetUpScreen.header"
        style={styles.SCREENHEADER}
        leftIcon="back"
        onLeftPress={goBack}
      />
      {state.showErrorPanel && (
        <View style={styles.ERROR_PANEL}>
          <Feather name="info" style={styles.INFOICON} size={20} />
          <Text style={styles.ERROR_PANEL_TEXT}>{state.infoMessage}</Text>
        </View>
      )}
      <Text
        tx="playerSetUpScreen.setupYourAccountToGetStarted"
        style={{ ...styles.TEXT18, marginTop: spacing[4] }}
      ></Text>
      <View style={styles.PROGRESS_STEP_VIEW}>
        <FontAwesome name="dot-circle-o" size={32} color="#6ba4ff" />
        <Dash
          style={styles.WIDTH_38}
          dashColor="white"
          dashGap={4}
          dashLength={6}
          dashThickness={2}
        />
        <FontAwesome name="circle-thin" size={32} color="white" />
        <Dash
          style={styles.WIDTH_38}
          dashColor="white"
          dashGap={4}
          dashLength={6}
          dashThickness={2}
        />
        <FontAwesome name="circle-thin" size={32} color="white" />
      </View>
      <View style={styles.MAIN_VIEW_CONTAINER}>
        <TextField
          style={styles.TEXTBOX_CONTAINER}
          inputStyle={styles.TEXTBOXSTYLE}
          placeholderTx="playerSetUpScreen.FullNamePlaceHolder"
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={text => setState(s => ({ ...s, fullName: text }))}
          value={state.fullName}
        />
        <Text style={styles.WIDTH_100}>
          <Text style={styles.TEXT16} tx="playerSetUpScreen.handedness" />
        </Text>
        <View style={styles.RADIO_BUTTON_VIEW}>
          <CheckBox
            title="Right"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={state.handedness === "Right"}
            onPress={() => setState(s => ({ ...s, handedness: "Right" }))}
            containerStyle={styles.RADIO_BUTTON_CONTAINER}
            textStyle={[styles.TEXT16]}
          />
          <CheckBox
            title="Left"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={state.handedness === "Left"}
            onPress={() => setState(s => ({ ...s, handedness: "Left" }))}
            containerStyle={styles.RADIO_BUTTON_CONTAINER}
            textStyle={[styles.TEXT16]}
          />
        </View>
        <TouchableOpacity
          style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE]}
          onPress={goToNextStep}
        >
          <Text
            style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]}
            tx="playerSetUpScreen.nextButtonText"
          />
          <FontAwesome5 name="arrow-right" size={16} color="black" />
        </TouchableOpacity>
      </View>
    </Screen>
  )
}
