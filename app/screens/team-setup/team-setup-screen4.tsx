import * as React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, Image, TouchableOpacity } from "react-native"
import { ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Screen, Text,Header } from "../../components"
// import { useStores } from "../models/root-store"
import { color, spacing } from "../../theme"
import * as styles from "../../theme/appStyle";
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import Dash from "react-native-dash"

export interface TeamSetupScreen4Props {
  navigation: NativeStackNavigationProp<ParamListBase>
}


const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}

export const TeamSetupScreen4: React.FunctionComponent<TeamSetupScreen4Props> = observer((props) => {
  const goBack = React.useMemo(() => () =>{ props.navigation.goBack()}, [props]);
  const gotoDashboard = ()=>{props.navigation.replace("dashboard", { user: props.route.params.session.user, session:props.route.params.session }); }
  // const { someStore } = useStores()
  return (
  <Screen style={styles.ROOT} preset="scroll" >
      <Header headerTx="teamSetupScreen.header" style={styles.SCREENHEADER} leftIcon="back" onLeftPress={goBack} />
      
      <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[6],width:"100%" }]}>
          <Text style={[styles.TEXT18,styles.FONTREGULAR,{textAlign:"left"}]} tx="teamSetupScreen.subHeader"></Text>
        <View style={[styles.PROGRESS_STEP_VIEW,{paddingHorizontal:0,paddingBottom:spacing[5]}]}>
        <Ionicons name="ios-checkmark-circle" size={32} color="#6ba4ff" />
        <Dash
          style={styles.WIDTH_19}
          dashColor="#6ba4ff"
          dashGap={0}
          dashLength={15}
          dashThickness={2}
        />
        <Ionicons name="ios-checkmark-circle" size={32} color="#6ba4ff" />
        <Dash
          style={styles.WIDTH_19}
          dashColor="#6ba4ff"
          dashGap={0}
          dashLength={15}
          dashThickness={2}
        />
        <Ionicons name="ios-checkmark-circle" size={32} color="#6ba4ff" />
        <Dash
          style={styles.WIDTH_19}
          dashColor="#6ba4ff"
          dashGap={0}
          dashLength={15}
          dashThickness={2}
        />
        <FontAwesome name="dot-circle-o" size={32} color="#6ba4ff" />
      </View>
        <View style={[{paddingHorizontal:0,paddingBottom:spacing[5]}]}>
          <Image source={require("../../../assets/confirmation-email.png")} />
        </View>
        <Text style={[styles.TEXT20,styles.FONTREGULAR,{textAlign:"center",paddingBottom:spacing[5]}]} tx="teamSetupScreen.setupComplete"></Text>
        <Text style={[styles.TEXT16,styles.FONTREGULAR,{textAlign:"center"}]} tx="teamSetupScreen.setupCompleteMessage"></Text>

        <TouchableOpacity style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE,{ marginTop: spacing[6] }]} onPress={gotoDashboard}>
           <Text style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]} tx="teamSetupScreen.finish" />  
        </TouchableOpacity>
      </View>
    </Screen>

  )
})
