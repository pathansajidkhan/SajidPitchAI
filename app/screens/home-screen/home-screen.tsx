import * as React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Screen, Text } from "../../components"
// import { useStores } from "../models/root-store"
import { color } from "../../theme"

export interface HomeScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>
}


const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}

export const HomeScreen: React.FunctionComponent<HomeScreenProps> = observer((props) => {
  // const { someStore } = useStores()
  return (
    <Screen style={ROOT} preset="scroll">
      <Text preset="header" tx="homeScreen.header" />
    </Screen>
  )
})
