import * as React from "react"
import { observer } from "mobx-react-lite"
import { TouchableOpacity } from "react-native"
import { ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"
import { Screen, Text, Header, TextField } from "../../components"
import { color } from "../../theme"
import * as styles from "../../theme/appStyle"
import { spacing } from "../../theme"
import { View, ScrollView } from "react-native"
import { FontAwesome5, FontAwesome, Ionicons } from "@expo/vector-icons"
import { TeamSetupData } from "./team-setup-screen1"
import TenantService from "../../middleware/services/tenant-service"
import UserService from "../../middleware/services/user-service"
import Loader from "../../components/spinner/loader"
import Dash from "react-native-dash"
import * as AsyncStorage from "../../utils/storage/storage"
import BlobService from "../../middleware/services/blob-service"

export interface TeamSetupScreen3Props {
  navigation: NativeStackNavigationProp<ParamListBase>
  route: any
}

interface State {
  loading: boolean
  showErrorPanel: boolean
  infoMessage: string
  formFilled: boolean
}

export const TeamSetupScreen3: React.FunctionComponent<TeamSetupScreen3Props> = observer(props => {
  const blobService = new BlobService(props)
  const tenantService = new TenantService(props)
  const userService = new UserService(props)
  const goBack = React.useMemo(
    () => () => {
      props.navigation.goBack()
    },
    [props],
  )
  const gotoNext = async () => {
    var list = data.players
    var allValid = true
    list.forEach(player => {
      player.valid = true
      if (player.email.trim() != "" && player.name.trim() == "") {
        player.valid = false
        setData(s => ({ ...s, players: list }))
        allValid = false
      }
    })

    if (allValid) {
      setState(s => ({ ...s, loading: true }))

      if (data.logo && data.logo !== null && data.logo.uri != "") {        
        await blobService.uploadTeamLogo(data.logo).then(async uploadFileResult => {
          await tenantService.getTenant(props.route.params.session.tenant.id).then(async result => {
            if (result.kind === "NETWORK_ISSUE") {
              setState(s => ({
                ...s,
                loading: false,
                showErrorPanel: true,
                infoMessage: "Network not available.",
              }))
            } else if (result.failureResponse != null) {
              setState(s => ({
                ...s,
                loading: false,
                showErrorPanel: true,
                infoMessage: result.failureResponse.message,
              }))
            } else {
              setState(s => ({ ...s, loading: false }))
              const tenant = result.tenantResponse
              if (tenant != null) {
                tenant.coachFullName = data.coachName
                tenant.name = data.teamName
                tenant.teamLogoUrl = uploadFileResult.blobResponse.fileUri
                tenant.city = data.city
                tenant.country = null
                tenant.countryId = data.country
                tenant.isAccountSetup = true
                props.route.params.session.user.isAccountSetup = true
                await tenantService.updateTenant(tenant)
              }
            }
          })
        })
      } else {        
          await tenantService.getTenant(props.route.params.session.tenant.id).then(async result => {          
          if (result.kind === "NETWORK_ISSUE") {
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: "Network not available.",
            }))
          } else if (result.failureResponse != null) {
            setState(s => ({
              ...s,
              loading: false,
              showErrorPanel: true,
              infoMessage: result.failureResponse.message,
            }))
          } else {
            const tenant = result.tenantResponse
            if (tenant != null) {
              tenant.name = data.teamName
              tenant.city = data.city
              tenant.coachFullName = data.coachName
              tenant.countryId = data.country
              tenant.country = null
              tenant.isAccountSetup = true
              props.route.params.session.user.isAccountSetup = true
              await tenantService.updateTenant(tenant)
            }
          }
        })
      }

      list = data.players
      var filledList = []
      list.forEach(player => {
        if (player.name.trim() != "") {
          filledList.push({ fullName: player.name, emailAddress: player.email })
        }
      })

      await userService.addPlayers(filledList)
      setState(s => ({ ...s, loading: false }))

      await AsyncStorage.save("UserDetails", props.route.params.session)
      props.navigation.navigate("teamSetup4", {
        teamData: data,
        session: props.route.params.session,
      })
    }
  }

  const [state, setState] = React.useState<State>({
    loading: false,
    showErrorPanel: false,
    infoMessage: "",
    formFilled: false,
  })

  const [data, setData] = React.useState<TeamSetupData>({
    teamName: props.route.params.teamData.teamName,
    coachName: props.route.params.teamData.coachName,
    city: props.route.params.teamData.city,
    country: props.route.params.teamData.country,
    logo: props.route.params.teamData.logo,
    players: props.route.params.teamData.players,
  })

  const addPlayer = () => {
    var list = data.players
    list.push({ name: "", email: "", valid: true })
    setData(s => ({ ...s, players: list }))
  }

  const checkFormFilled = () => {
    setState(s => ({ ...s, formFilled: false }))
    for (var i = 0; i < data.players.length; i++) {
      if (data.players[i].name.trim() !== "" || data.players[i].email.trim() !== "") {
        setState(s => ({ ...s, formFilled: true }))
        break
      }
    }
  }

  const changePlayerName = (index, value) => {
    var list = data.players
    list[index].name = value
    setData(s => ({ ...s, players: list }))
    checkFormFilled()
  }
  const changePlayerEmail = (index, value) => {
    var list = data.players
    list[index].email = value
    setData(s => ({ ...s, players: list }))
    checkFormFilled()
  }

  return (
    <ScrollView>
      <Screen style={styles.ROOT} preset="scroll">
        <Loader loading={state.loading} />
        <Header
          headerTx="teamSetupScreen.header"
          style={styles.SCREENHEADER}
          leftIcon="back"
          onLeftPress={goBack}
        />
        <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[6], width: "100%" }]}>
          <Text
            style={[styles.TEXT18, styles.FONTREGULAR, { textAlign: "left" }]}
            tx="teamSetupScreen.subHeader"
          ></Text>
          <View style={[styles.PROGRESS_STEP_VIEW, { paddingHorizontal: 0 }]}>
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
            <Dash
              style={styles.WIDTH_19}
              dashColor="white"
              dashGap={4}
              dashLength={6}
              dashThickness={2}
            />
            <FontAwesome name="circle-thin" size={32} color="white" />
          </View>
          <Text
            style={[
              styles.TEXT18,
              styles.FONTMEDIUM,
              styles.TEXTALIGNLEFT,
              { marginTop: spacing[6] },
            ]}
            tx="teamSetupScreen.addPlayersToTeam"
          ></Text>

          {data.players &&
            data.players.map((key, index) => (
              <View
                key={"k" + index}
                style={[
                  {
                    marginTop: spacing[5],
                    borderTopColor: color.palette.darkGrey,
                    borderTopWidth: 1,
                    width: "100%",
                  },
                ]}
              >
                <View style={{ flexDirection: "row" }}>
                  <TextField
                    style={styles.TEXTBOX_CONTAINER}
                    inputStyle={
                      !data.players[index].valid
                        ? styles.TEXTBOXSTYLEWITHERROR
                        : styles.TEXTBOXSTYLE
                    }
                    placeholderTx="teamSetupScreen.playerFullName"
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={data.players[index].name}
                    onChangeText={text => changePlayerName(index, text)}
                  />
                  {!data.players[index].valid && (
                    <FontAwesome5
                      style={{ position: "relative", top: 30, right: 30 }}
                      name="exclamation-circle"
                      size={20}
                      color={color.palette.red}
                    />
                  )}
                </View>
                {!data.players[index].valid && (
                  <Text style={styles.ERROR_TEXT} tx="teamSetupScreen.playerNameRequired"></Text>
                )}
                <TextField
                  style={styles.TEXTBOX_CONTAINER}
                  inputStyle={styles.TEXTBOXSTYLE}
                  placeholderTx="teamSetupScreen.playerEmail"
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={data.players[index].email}
                  onChangeText={text => changePlayerEmail(index, text)}
                />
              </View>
            ))}
          <TouchableOpacity
            style={[
              styles.IMAGE_PICKER,
              styles.JUSTIFYCENTER,
              styles.ALIGNCENTER,
              { marginTop: spacing[5], width: "100%", height: 45 },
            ]}
            onPress={addPlayer}
          >
            <View style={[{ flexDirection: "row" }]}>
              <FontAwesome5 name="plus" size={16} color="white" />
              <Text
                style={[styles.WHITEBUTTONTEXT, { marginRight: 10, marginLeft: 10 }]}
                tx="teamSetupScreen.addAnotherPlayer"
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE, { marginVertical: spacing[6] }]}
            onPress={gotoNext}
          >
            {!state.formFilled && (
              <Text
                style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]}
                tx="teamSetupScreen.skip"
              />
            )}
            {state.formFilled && (
              <Text
                style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]}
                tx="teamSetupScreen.next"
              />
            )}
            <FontAwesome5 name="arrow-right" size={16} color="black" />
          </TouchableOpacity>
        </View>
      </Screen>
    </ScrollView>
  )
})
