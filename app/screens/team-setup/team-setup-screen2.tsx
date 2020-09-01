import * as React from "react"
import { observer } from "mobx-react-lite"
import { TouchableOpacity, Alert } from "react-native"
import { ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Screen, Text, Header } from "../../components"
import * as styles from "../../theme/appStyle";
import { spacing } from "../../theme";
import { View, Image } from "react-native";
import { FontAwesome5, FontAwesome, Ionicons } from "@expo/vector-icons"
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import {TeamSetupData} from "./team-setup-screen1"
import Dash from "react-native-dash"

export interface TeamSetupScreen2Props {
  navigation: NativeStackNavigationProp<ParamListBase>,
  route: any
}


export const TeamSetupScreen2: React.FunctionComponent<TeamSetupScreen2Props> = observer((props) => {
  const goBack = React.useMemo(() => () =>{ props.navigation.goBack()}, [props]);
  const gotoNext =  () => { props.navigation.navigate("teamSetup3", { teamData: data, session:props.route.params.session   }); };
  
  const [data, setData] = React.useState<TeamSetupData>({
    teamName:props.route.params.teamData.teamName,
    coachName:props.route.params.teamData.coachName,
    city:props.route.params.teamData.city,
    country:props.route.params.teamData.country,
    logo:props.route.params.teamData.logo,
    players:props.route.params.teamData.players
  });



  React.useEffect(() => {
    (async () => {
      if (Constants.platform.ios) {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result:any;
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setData(s => ({ ...s, logo: result }));
      data.logo =result;
      props.route.params.teamData.logo = result;
    }
    
  };
  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Header headerTx="teamSetupScreen.header" style={styles.SCREENHEADER} leftIcon="back" onLeftPress={goBack} />
      
      <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[6] }]}>
      <View style={[styles.ALIGNLEFT,{width:"100%"}]}>
        <Text style={[styles.TEXT18,styles.FONTREGULAR,{textAlign:"left"}]} tx="teamSetupScreen.subHeader"></Text>

        <View style={[styles.PROGRESS_STEP_VIEW,{paddingHorizontal:0,paddingTop:spacing[4]}]}>
        <Ionicons name="ios-checkmark-circle" size={32} color="#6ba4ff" />
        <Dash
          style={styles.WIDTH_19}
          dashColor="#6ba4ff"
          dashGap={0}
          dashLength={15}
          dashThickness={2}
        />
        <FontAwesome name="dot-circle-o" size={32} color="#6ba4ff" />
        <Dash
          style={styles.WIDTH_19}
          dashColor="white"
          dashGap={4}
          dashLength={6}
          dashThickness={2}
        />
        <FontAwesome name="circle-thin" size={32} color="white" />
        <Dash
          style={styles.WIDTH_19}
          dashColor="white"
          dashGap={4}
          dashLength={6}
          dashThickness={2}
        />
        <FontAwesome name="circle-thin" size={32} color="white" />
      </View>
        <Text style={[styles.TEXT18,styles.FONTMEDIUM,{ marginTop: spacing[6] }]} tx="teamSetupScreen.teamLogo"></Text>
       
        <TouchableOpacity style={[styles.IMAGE_PICKER,styles.JUSTIFYCENTER,styles.ALIGNCENTER,{ marginTop: spacing[5] }]} onPress={pickImage}>
          {(!data.logo || data.logo==null || data.logo.uri=="") && 
          <View style={[{flexDirection: "row"}]}>
            <FontAwesome5 name="plus" size={16} color="white" />
            <Text style={[styles.WHITEBUTTONTEXT, { marginRight: 10, marginLeft: 10 }]} tx="teamSetupScreen.addLogo" /> 
          </View>
          }
          {(data.logo && data.logo.uri && data.logo.uri!="") && 
          <Image source={{ uri: data.logo.uri }} style={{ width: 200, height: 200 }} />
          }
        </TouchableOpacity>

        <TouchableOpacity style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE,{ marginTop: spacing[6] }]} onPress={gotoNext}>
        {(!data.logo || data.logo==null || data.logo.uri=="") && <Text style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]} tx="teamSetupScreen.skip" />}
        {(data.logo && data.logo.uri && data.logo.uri!="") && <Text style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]} tx="teamSetupScreen.next" />}
          <FontAwesome5 name="arrow-right" size={16} color="black" />
        </TouchableOpacity>
      </View>
      </View>
    </Screen>
  )
})
