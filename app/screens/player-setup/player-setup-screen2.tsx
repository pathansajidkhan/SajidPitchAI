import * as React from "react"
import { View, TouchableOpacity, TextInput } from "react-native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { ParamListBase } from "@react-navigation/native"
import DateTimePicker, { AndroidEvent } from "@react-native-community/datetimepicker"
import Dash from "react-native-dash"

import Loader from "../../components/spinner/loader"
import { Text, Screen, Header } from "../../components"
import * as styles from "../../theme/appStyle"
import { Feather, FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons"
import { spacing, color } from "../../theme"

export interface PlayerSetUpStepTwoProps extends React.Component {
  navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  dateOfBirth: Date
  dateOfBirthStr: string
  height: string
  weight: string
  showCalender: boolean
  showSkip: boolean
  fullName: string
  handedness: string
}

export const PlayerSetUpStepTwo: React.FunctionComponent<PlayerSetUpStepTwoProps> = props => {
  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    dateOfBirth: null,
    dateOfBirthStr: "",
    height: "",
    weight: "",
    showCalender: false,
    showSkip: true,
    fullName: props.route.params.fullName,
    handedness: props.route.params.handedness,
  })

  const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])

  const checkHeightValidation = (): boolean => {
    let result = false
    const ht = state.height
    if (!ht) {
      result = true
      return result
    } else {
      const regex = new RegExp(
        "^(?!$|.*'[^\x22]+$)(?:([0-9]+)(?:'|w|\\s|-|ft|ft |feet|feet | feet))?(?:([0-9]+)(?:\"|w||in|inch|inches| in| inch| inches)\x22?)?$",
      )
      result = regex.test(ht)
      if (!result) {
        setState((s: State) => ({
          ...s,
          showErrorPanel: true,
          infoMessage: "Height is not in correct format, eg. 6'6\"",
        }))
      }
      return result
    }
  }

  const goToNextStep = async () => {
    if (checkHeightValidation()) {
      const wt = parseInt(state.weight)
      props.navigation.navigate("playersetupstepthree", {
        fullName: state.fullName,
        handedness: state.handedness,
        dateOfBirth: state.dateOfBirth,
        height: state.height,
        weight: wt,
      })
    }
  }

  const setDateOfBirth = (event: AndroidEvent, selectedDate: Date) => {
    if (selectedDate) {
      const date = (
        selectedDate.getFullYear() +
        "/" +
        (selectedDate.getMonth() + 1) +
        "/" +
        selectedDate.getDate()
      ).toString()
      setState((s: State) => ({
        ...s,
        showCalender: false,
        dateOfBirth: selectedDate,
        dateOfBirthStr: date,
        showSkip: false,
      }))
    }
  }

  const openCalender = () => {
    setState((s: State) => ({ ...s, showCalender: true, dateOfBirth: new Date() }))
  }

  const hideCalender = () => {
    setState((s: State) => ({ ...s, showCalender: false }))
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
        <Ionicons name="ios-checkmark-circle" size={32} color="#6ba4ff" />
        <Dash
          style={styles.WIDTH_38}
          dashColor="#6ba4ff"
          dashGap={0}
          dashLength={18}
          dashThickness={2}
        />
        <FontAwesome name="dot-circle-o" size={32} color="#6ba4ff" />
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
        <View style={[styles.PASSWORDCONTAINER, { marginTop: 50 }]}>
          <TextInput
            style={styles.FEATHERINPUTSTYLE}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Date of birth (optional) (yyyy/mm/dd)"
            onChangeText={text => setState(s => ({ ...s, dateOfBirthStr: text, showSkip: false }))}
            value={state.dateOfBirthStr}
            placeholderTextColor={color.palette.offWhite}
          />
          <Feather name="calendar" style={styles.EYEICON} size={20} onPress={openCalender} />
        </View>
        <View style={styles.PASSWORDCONTAINER}>
          <TextInput
            style={styles.FEATHERINPUTSTYLE}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Height (optional)"
            onChangeText={text => setState(s => ({ ...s, height: text, showSkip: false }))}
            value={state.height}
            placeholderTextColor={color.palette.offWhite}
          />
          <FontAwesome5 name="caret-down" size={20} style={styles.EYEICON} />
        </View>
        <View style={styles.PASSWORDCONTAINER}>
          <TextInput
            style={styles.FEATHERINPUTSTYLE}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Weight (optional)"
            onChangeText={text => setState(s => ({ ...s, weight: text, showSkip: false }))}
            value={state.weight}
            keyboardType="numeric"
            placeholderTextColor={color.palette.offWhite}
          />
          <Text tx="playerSetUpScreen.lbs" style={styles.EYEICON}></Text>
        </View>
        <TouchableOpacity
          style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE]}
          onPress={goToNextStep}
        >
          {state.showSkip && (
            <Text
              style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]}
              tx="playerSetUpScreen.skipButtonText"
            />
          )}
          {!state.showSkip && (
            <Text
              style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]}
              tx="playerSetUpScreen.nextButtonText"
            />
          )}
          <FontAwesome5 name="arrow-right" size={16} color="black" />
        </TouchableOpacity>
      </View>
      {state.showCalender && (
        <DateTimePicker
          testID="dateTimePicker"
          value={state.dateOfBirth}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={setDateOfBirth}
          maximumDate={new Date()}
        />
      )}
    </Screen>
  )
}
