import * as React from "react"
import { observer } from "mobx-react-lite"
import { TouchableOpacity, Modal } from "react-native"
import { ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Screen, Text, Header, TextField } from "../../components"
import { color } from "../../theme"
import * as styles from "../../theme/appStyle"
import { spacing } from "../../theme"
import { View } from "react-native"
import { FontAwesome5, FontAwesome } from "@expo/vector-icons"
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types"
import CommonService from "../../middleware/services/common-service"
import Loader from "../../components/spinner/loader"
import { DropdownModel } from "../../models/data/common-model"
import Dash from "react-native-dash"
export interface TeamSetupScreen1Props {
  navigation: NativeStackNavigationProp<ParamListBase>
  route: any
}

interface State {
  teamNameError: boolean
  coachNameError: boolean
  cityError: boolean
  countryError: boolean
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  showCountryDropDown: boolean
  countryName: string
}

export interface TeamSetupPlayer {
  name: string
  email: string
  valid: boolean
}
export interface TeamSetupData {
  teamName: string
  coachName: string
  city: string
  country: number
  logo: ImageInfo
  players: Array<TeamSetupPlayer>
}

export const TeamSetupScreen1: React.FunctionComponent<TeamSetupScreen1Props> = observer(props => {
  const commonService = new CommonService(props)
  const [countries, setCountries] = React.useState<DropdownModel[]>([])

  const [state, setState] = React.useState<State>({
    teamNameError: false,
    coachNameError: false,
    cityError: false,
    countryError: false,
    showErrorPanel: false,
    loading: false,
    infoMessage: "",
    showCountryDropDown: false,
    countryName: "Country",
  })
  const [data, setData] = React.useState<TeamSetupData>({
    teamName: "",
    coachName: "",
    city: "",
    country: null,
    logo: null,
    players: [
      { name: "", email: "", valid: true },
      { name: "", email: "", valid: true },
      { name: "", email: "", valid: true },
    ],
  })
  if (
    props.route &&
    !props.route.params &&
    props.route.params != null &&
    props.route.params.teamData
  ) {
    setData({
      teamName: props.route.params.teamData.teamName,
      coachName: props.route.params.teamData.coachName,
      city: props.route.params.teamData.city,
      country: props.route.params.teamData.country,
      logo: props.route.params.teamData.logo,
      players: props.route.params.teamData.players,
    })
  }

  const gotoNext = () => {
    setState(s => ({
      ...s,
      teamNameError: false,
      coachNameError: false,
      cityError: false,
      countryError: false,
    }))
    if (data.teamName.trim() == "") {
      setState(s => ({ ...s, teamNameError: true }))
    } else if (data.coachName.trim() == "") {
      setState(s => ({ ...s, coachNameError: true }))
    } else if (data.city.trim() == "") {
      setState(s => ({ ...s, cityError: true }))
    } else if (!data.country || data.country == null) {
      setState(s => ({ ...s, countryError: true }))
    } else {
      props.navigation.navigate("teamSetup2", {
        teamData: data,
        session: props.route.params.session,
      })
    }
  }

  React.useEffect(() => {
    const getCountries = async () => {
      setState(s => ({ ...s, loading: true }))
      await commonService.getCommonValueByTypeCode("CTR").then(country => {
        var dropdownMap = country.CommonValueByTypeCodeResponse.map(obj => {
          return ({
            label: obj.description,
            value: obj.id,
          } as unknown) as DropdownModel
        }).sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1))
        setCountries(dropdownMap)
        setState(s => ({ ...s, loading: false }))
      })
    }
    getCountries()
  }, [])
  const openDropDown = () => {
    if (countries.length > 0) {
      setState(s => ({
        ...s,
        showCountryDropDown: true,
      }))
    }
  }
  const selectCountry = (item): void => {    
    closeDropDown()
    setData(s => ({ ...s, country: Number(item.value) }))
    setState(s => ({ ...s, countryName: item.label, countryError: false }))
  }

  const closeDropDown = () => {
    setState(s => ({
      ...s,
      showCountryDropDown: false,
    }))
  }

  return (
    <Screen style={styles.ROOT} preset="scroll">
      <Loader loading={state.loading} />
      <Header headerTx="teamSetupScreen.header" style={styles.SCREENHEADER} />

      <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[6] }]}>
        <View style={{ width: "100%", height: "100%" }}>
          <Text style={styles.TEXT18} tx="teamSetupScreen.subHeader"></Text>
          <View style={[styles.PROGRESS_STEP_VIEW, { paddingHorizontal: 0 }]}>
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
            <Dash
              style={styles.WIDTH_19}
              dashColor="white"
              dashGap={4}
              dashLength={6}
              dashThickness={2}
            />
            <FontAwesome name="circle-thin" size={32} color="white" />
          </View>
          <View style={{ flexDirection: "row" }}>
            <TextField
              style={styles.TEXTBOX_CONTAINER}
              inputStyle={state.teamNameError ? styles.TEXTBOXSTYLEWITHERROR : styles.TEXTBOXSTYLE}
              placeholderTx="teamSetupScreen.teamName"
              autoCorrect={false}
              autoCapitalize="none"
              value={data.teamName}
              onChangeText={text => setData(s => ({ ...s, teamName: text }))}
            />
            {state.teamNameError && (
              <FontAwesome5
                style={{ position: "relative", top: 30, right: 30 }}
                name="exclamation-circle"
                size={20}
                color={color.palette.red}
              />
            )}
          </View>
          {state.teamNameError && (
            <Text style={styles.ERROR_TEXT} tx="teamSetupScreen.teamNameRequired"></Text>
          )}
          <View style={{ flexDirection: "row" }}>
            <TextField
              style={[styles.TEXTBOX_CONTAINER]}
              inputStyle={state.coachNameError ? styles.TEXTBOXSTYLEWITHERROR : styles.TEXTBOXSTYLE}
              placeholderTx="teamSetupScreen.coachFullName"
              autoCorrect={false}
              autoCapitalize="none"
              value={data.coachName}
              onChangeText={text => setData(s => ({ ...s, coachName: text }))}
            />
            {state.coachNameError && (
              <FontAwesome5
                style={{ position: "relative", top: 30, right: 30 }}
                name="exclamation-circle"
                size={20}
                color={color.palette.red}
              />
            )}
          </View>
          {state.coachNameError && (
            <Text style={styles.ERROR_TEXT} tx="teamSetupScreen.coachNameRequired"></Text>
          )}
          <View style={{ flexDirection: "row" }}>
            <TextField
              style={styles.TEXTBOX_CONTAINER}
              inputStyle={state.cityError ? styles.TEXTBOXSTYLEWITHERROR : styles.TEXTBOXSTYLE}
              placeholderTx="teamSetupScreen.city"
              autoCorrect={false}
              autoCapitalize="none"
              value={data.city}
              onChangeText={text => setData(s => ({ ...s, city: text }))}
            />
            {state.cityError && (
              <FontAwesome5
                style={{ position: "relative", top: 30, right: 30 }}
                name="exclamation-circle"
                size={20}
                color={color.palette.red}
              />
            )}
          </View>
          {state.cityError && (
            <Text style={styles.ERROR_TEXT} tx="teamSetupScreen.cityRequired"></Text>
          )}
          <View style={{ paddingTop: 20 }}>
            <TouchableOpacity
              style={[styles.PICKER, { flexDirection: "row" }]}
              onPress={openDropDown}
            >
              <Text
                style={{
                  width: "95%",
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  paddingLeft: 15,
                  fontSize: 16,
                  fontFamily: "Roboto",
                }}
              >
                {state.countryName}
              </Text>
              <FontAwesome
                name="caret-down"
                size={18}
                color="white"
                style={{ marginRight: 0, marginTop: 15, paddingRight: 0 }}
              ></FontAwesome>
              {state.countryError && (
                <FontAwesome5
                  style={{ position: "relative", top: 10, right: 30 }}
                  name="exclamation-circle"
                  size={20}
                  color={color.palette.red}
                />
              )}
            </TouchableOpacity>
            {state.countryError && (
              <Text style={styles.ERROR_TEXT} tx="teamSetupScreen.countryRequired"></Text>
            )}
            <Modal
              transparent={true}
              visible={state.showCountryDropDown}
              onRequestClose={() => (state.showCountryDropDown = !state.showCountryDropDown)}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "90%",
                    height: countries.length > 0 ? countries.length * 35 : 180,
                    backgroundColor: "white",
                    borderRadius: 5,
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                  }}
                >
                  {countries.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => selectCountry(item)}
                        style={{
                          padding: 5,
                        }}
                      >
                        <Text style={[styles.FONTMEDIUM, { color: "black" }]}>{item.label}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            </Modal>
          </View>
          <TouchableOpacity
            style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE, { marginTop: 20 }]}
            onPress={gotoNext}
          >
            <Text style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]} tx="teamSetupScreen.next" />
            <FontAwesome5 name="arrow-right" size={16} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
})
