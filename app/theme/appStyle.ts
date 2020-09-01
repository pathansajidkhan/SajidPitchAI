import { TextStyle, ViewStyle, ImageStyle, StyleSheet } from "react-native"
import { color } from "./color"
import { spacing } from "./spacing"

//Padding style
export const padding = {
  sm: 10,
  md: 20,
  lg: 30,
  xl: 40,
}

//Layout styles
export const ROOT: ViewStyle = {
  backgroundColor: color.palette.charcoalGrey,
  flex: 1,
}
export const HORIZONTAL_PADDING: ViewStyle = {
  paddingHorizontal: "8%",
  width: "100%",
}
export const MAIN_VIEW_CONTAINER: ViewStyle = {
  ...HORIZONTAL_PADDING,
  alignItems: "center",
}

export const LAYOUT: ViewStyle = {
  alignItems: "center",
  position: "absolute",
  width: "100%",
  height: "100%",
  justifyContent: "center",
}
export const WELCOME_LAYOUT: ViewStyle = {
  alignItems: "center",
  position: "absolute",
  width: "100%",
  height: "50%",
  justifyContent: "center",
  bottom: 0,
}

//Footer styles
export const FOOTER: ViewStyle = {}

export const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[5],
  paddingHorizontal: spacing[4],
}

// WELCOME SCREEN STYLE & Swiper styles
export const WELCOMETITLEVIEW: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  marginTop: 30,
}

export const SWIPERDOT: ViewStyle = {
  width: 12,
  height: 12,
  borderRadius: 8,
  borderStyle: "solid",
  borderWidth: 1,
  marginLeft: 8,
  marginRight: 8,
  borderColor: color.palette.white,
}

export const SWIPERACTIVEDOT: ViewStyle = {
  backgroundColor: color.palette.white,
  width: 12,
  height: 12,
  borderRadius: 8,
  marginLeft: 8,
  marginRight: 8,
}

export const ALIGNCENTER: ViewStyle = {
  alignItems: "center",
}
export const ALIGNLEFT: ViewStyle = {
  alignItems: "flex-start",
  alignContent: "flex-start",
}
export const ALIGNRIGHT: ViewStyle = {
  alignItems: "flex-end",
  alignContent: "flex-end",
}
export const JUSTIFYCENTER: ViewStyle = {
  justifyContent: "center",
}
export const CONTAINER: ViewStyle = {
  width: "100%",
}

//Button styles
export const BUTTON: ViewStyle = {
  width: 296,
  borderRadius: 3,
  height: 45,
}

export const BLUEBUTTON: ViewStyle = {
  ...BUTTON,
  backgroundColor: "#6BA4FF",
  //marginBottom: spacing[5]
}
export const DISABLEDBUTTON: ViewStyle = {
  ...BUTTON,
  backgroundColor: "rgba(255, 255, 255, 0.32)",
  //marginBottom: spacing[5]
}

export const WHITEBUTTON: ViewStyle = {
  ...BUTTON,
  backgroundColor: "transparent",
  borderColor: color.palette.white,
  borderStyle: "solid",
  borderWidth: 1,
  marginTop: spacing[3],
}
export const PROVIDERBUTTON: ViewStyle = {
  ...BUTTON,
  width: "100%",
  borderStyle: "solid",
  borderWidth: 1,
  backgroundColor: color.palette.white,
  flexDirection: "row",
  marginBottom: 32,
}

export const PROVIDERICON: ViewStyle = {
  position: "absolute",
  left: 25,
}

export const ICON_TEXT_SPLITTER: TextStyle = {
  position: "absolute",
  left: 60,
  width: 1,
  height: 29,
  borderWidth: 1,
  borderColor: "#e0e0e0",
  borderStyle: "solid",
}

//Text styles

export const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: "Roboto",
}
export const TEXTFIELD = {
  ...TEXT,
  backgroundColor: "#3c424d",
}

export const FONTREGULAR: TextStyle = {
  ...TEXT,
  fontWeight: "400",
}
export const FONTMEDIUM: TextStyle = {
  ...TEXT,
  fontWeight: "500",
}

export const FONTBOLD: TextStyle = {
  ...TEXT,
  fontWeight: "700",
}
export const TEXTALIGNCENTER: TextStyle = {
  textAlign: "center",
}
export const TEXTALIGNLEFT: TextStyle = {
  textAlign: "left",
}
export const TEXTALIGNRIGHT: TextStyle = {
  textAlign: "right",
}
export const SCREENHEADER: TextStyle = {
  color: "white",
  fontFamily: "RobotoSlab",
  fontSize: 20,
  fontWeight: "normal",
  fontStyle: "normal",
  letterSpacing: 0.67,
  lineHeight: 1.2,
  backgroundColor: color.palette.darkGrey,
  // marginBottom: spacing[4],
}
export const MARGINBOTTOM0: TextStyle = {
  ...FONTREGULAR,
  marginBottom: 0,
}

export const BLUEBUTTONTEXT: TextStyle = {
  ...TEXT,
  ...FONTMEDIUM,
  fontSize: 16,
  color: color.palette.black,
  fontWeight: "bold",
}
export const WHITEBUTTONTEXT: TextStyle = {
  ...TEXT,
  ...FONTMEDIUM,
  fontSize: 16,
  color: color.palette.white,
}
export const DISABLEDUTTONTEXT: TextStyle = {
  ...TEXT,
  ...FONTMEDIUM,
  fontSize: 16,
  color: color.palette.buttonBlack,
  fontWeight: "bold",
}
export const UPLOAD_VIDEO_BUTTON: ViewStyle = {
  ...BUTTON,
  width: "100%",
  borderStyle: "solid",
  borderRadius: 3,
  borderColor: "white",
  borderWidth: 1,
  backgroundColor: color.transparent,
  flexDirection: "row",
  position: "absolute",
  bottom: 0,
  marginHorizontal: "30%",
}

export const MOVEBOTTOM: ViewStyle = {
  justifyContent: "flex-end",
  alignItems: "center",
  alignSelf: "center",
  bottom: "10%",
}

export const UPLOAD_VIDEO_BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...FONTMEDIUM,
  fontSize: 16,
  color: color.palette.white,
  position: "absolute",
  left: 60,
}

export const BLACKBUTTONTEXT: TextStyle = {
  ...TEXT,
  ...FONTMEDIUM,
  fontSize: 16,
  color: "#3a3f43",
  letterSpacing: 0.45,
  position: "absolute",
  fontWeight: "bold",
  left: 74,
}
//Header Styles
export const HEADER: ViewStyle = {
  width: "auto",
  height: 58,
  backgroundColor: color.palette.darkGrey,
}

export const HEADERTEXTSTYLE: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
  width: 85,
  height: 24,
  fontFamily: "Roboto",
  fontSize: 20,
  fontWeight: "normal",
  fontStyle: "normal",
  lineHeight: 1.2,
  letterSpacing: 0.67,
  textAlign: "center",
  color: "#ffffff",
}

export const TEXT22: TextStyle = {
  ...TEXT,
  fontSize: 22,
  textAlign: "center",
  letterSpacing: 1.5,
  color: color.palette.white,
}
export const TEXT20: TextStyle = {
  ...TEXT,
  fontSize: 20,
  textAlign: "center",
  letterSpacing: 1.5,
  color: color.palette.white,
}
export const TEXT18: TextStyle = {
  ...TEXT,
  fontSize: 18,
  textAlign: "center",
  letterSpacing: 1.5,
  color: color.palette.white,
}

export const TEXT16: TextStyle = {
  ...TEXT,
  fontSize: 16,
  textAlign: "center",
  fontWeight: "normal",
  fontStyle: "normal",
  letterSpacing: 0.51,
  color: color.palette.white,
}
export const TEXT14: TextStyle = {
  ...TEXT,
  fontSize: 14,
  fontWeight: "normal",
  fontStyle: "normal",
  letterSpacing: 0.44,
  color: color.palette.white,
}
export const TEXT24: TextStyle = {
  ...TEXT,
  fontSize: 24,
  fontWeight: "normal",
  fontStyle: "normal",
  letterSpacing: 0.68,
  color: color.palette.white,
}
export const TEXTUNDERLINE: TextStyle = {
  textDecorationLine: "underline",
}

//TextInput Styles
export const TextInput: TextStyle = {
  borderBottomWidth: 1,
  borderBottomColor: color.palette.white,
  backgroundColor: color.palette.charcoalGrey,
  width: "100%",
}

//Image Styles
export const LOGO: ImageStyle = {
  flex: 1,
  marginTop: 220,
  alignItems: "center",
}

export const LOGO_TOP: ViewStyle = {
  height: "50%",
}

export const IMAGE_PICKER: ViewStyle = {
  width: 200,
  height: 200,
  borderStyle: "dashed",
  borderWidth: 1,
  borderColor: "#676E72",
  borderRadius: 1,
}
//Textbox styles
export const TEXTBOX_CONTAINER: ViewStyle = {
  width: "100%",
}

export const TEXTBOXSTYLE: TextStyle = {
  ...TEXT,
  height: 45,
  borderRadius: 3,
  backgroundColor: color.palette.transparentGrey,
  fontSize: 16,
  letterSpacing: 0.5,
  color: color.palette.white,
  paddingTop: 12,
  paddingBottom: 12,
  paddingLeft: 16,
  marginBottom: 12,
  borderBottomColor: color.palette.white,
  borderBottomWidth: 1,
}
export const TEXTBOXSTYLEPAPER: TextStyle = {
  ...TEXT,
  height: 55,
  borderRadius: 3,
  backgroundColor: "rgba(255, 255, 255, 0.06)",
  fontSize: 16,
  letterSpacing: 0.5,
  color: color.palette.red,
  borderBottomColor: color.palette.white,
  width: "100%",
  paddingBottom: 15,
  marginBottom: 15,
}

export const TEXTBOXSTYLEPAPER_THEME = {
  colors: {
    placeholder: "white",
    text: "white",
    primary: "white",
  },
}

export const TEXTBOXSTYLEWITHERROR: TextStyle = {
  ...TEXTBOXSTYLE,
  borderBottomColor: color.palette.red,
}

export const ERROR_TEXT: TextStyle = {
  fontSize: 14,
  letterSpacing: 0.44,
  color: color.palette.red,
}
//Login Screen Login Button
export const LoginButton: ViewStyle = {
  width: "100%",
  height: 45,
  borderRadius: 3,
  backgroundColor: "#6ba4ff",
}
//Pitch Report Screen Button
export const PitchReportButton: ViewStyle = {
  width: "100%",
  height: 45,
  borderRadius: 0,
  backgroundColor: "#10151b",
}
//Pitch Report Screen button underline
export const PitchReportButtonUnderline: ViewStyle = {
  borderBottomColor: "#6ba4ff",
  borderBottomWidth: 1
}
//Pitch Report Screen Text
export const PITCHREPORTBUTTONTEXT: TextStyle = {
  ...TEXT,
  ...FONTMEDIUM,
  fontSize: 16,
  color: "#6ba4ff",
  fontWeight: "bold",
}
export const EYEICON: TextStyle = {
  paddingTop: 10,
  color: color.palette.white,
}

export const PASSWORDCONTAINER: ViewStyle = {
  flexDirection: "row",
  width: "100%",
  height: 45,
  borderRadius: 3,
  backgroundColor: color.palette.transparentGrey,
  borderBottomWidth: 1,
  borderBottomColor: color.palette.white,
  paddingRight: 10,
  marginBottom: 20,
}

export const FEATHERINPUTSTYLE: TextStyle = {
  ...TEXT,
  flex: 1,
  fontSize: 16,
  letterSpacing: 0.5,
  color: color.palette.white,
  paddingLeft: 16,
  paddingTop: 12,
  paddingBottom: 12,
}
//SETTING SCREEN
export const SETTINGHEADERSTYLE: TextStyle = {
  ...TEXT,
  fontSize: 16,
  letterSpacing: 0.45,
  color: color.palette.white,
  paddingLeft: 16,
  paddingTop: 5,
  paddingBottom: 5,
  textTransform: "uppercase",
  fontFamily: "RobotoMedium",
}

export const SETTING_LISTITEM_VIEW: ViewStyle = {
  backgroundColor: color.palette.darkGrey,
  borderBottomColor: "#323943",
  borderBottomWidth: 1,
  paddingTop: 5,
  paddingBottom: 5,
}

export const SETTINGITEMSTYLE: TextStyle = {
  ...TEXT,
  flex: 1,
  fontSize: 16,
  letterSpacing: 0.45,
  color: color.palette.white,
  paddingLeft: 16,
  paddingBottom: 2,
}

export const SETTING_LISTITEM_TITLE: TextStyle = {
  color: "#ffffff",
  fontSize: 14,
  fontFamily: "Roboto",
}

export const SETTING_LISTITEM_TITLE_BOLD: TextStyle = {
  color: "#ffffff",
  fontSize: 14,
  fontFamily: "RobotoBold",
}

export const OVERVIEW_LISTITEM_TITLE_BOLD: TextStyle = {
  color: "#ffffff",
  fontSize: 14,
  fontFamily: "RobotoBold",
  letterSpacing: 0.44,
}

export const OVERVIEW_HEADER_UNTAGGED_PITCHES: TextStyle = {
  height: 45,
  width: "100%",
  backgroundColor: "#fff8d7",
  color: "#131415",
  textAlign: "center",
  textAlignVertical: "center",
  fontWeight: "bold",
  fontFamily: "RobotoBold",
  fontSize: 14,
  lineHeight: 20,
  letterSpacing: 0.44,
  padding: 5,
}

export const OVERVIEW_HEADER_LEFT: TextStyle = {
  width: 20,
  height: 20,
  backgroundColor: "#946f00",
  textAlign: "center",
  textAlignVertical: "center",
  fontSize: 14,
  fontWeight: "bold",
  borderRadius: 15,
  marginLeft: 20,
}

export const SETTING_HEADER_TITLE_BOLD: TextStyle = {
  color: "#ffffff",
  fontSize: 20,
  fontFamily: "RobotoBold",
  letterSpacing: 0.67,
  textAlign: "center",
  lineHeight: 1.2,
}

//SETTING ENDS

export const BLACKBACKGROUND: ViewStyle = {
  backgroundColor: "#6ba4ff",
}

// ERROR PANEL
export const ERROR_PANEL: ViewStyle = {
  width: "100%",
  backgroundColor: "#75787b",
  flexDirection: "row",
  justifyContent: "center",
}

export const ERROR_PANEL_TEXT: TextStyle = {
  fontSize: 14,
  letterSpacing: 0.5,
  color: color.palette.white,
  width: "90%",
  padding: 10,
  textAlignVertical: "center",
}

export const INFOICON: TextStyle = {
  justifyContent: "center",
  color: color.palette.white,
  backgroundColor: "#ff7878",
  width: "10%",
  paddingHorizontal: 10,
  textAlignVertical: "center",
}

export const TOUCHABLE_OPACITY_STYLE: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
}

// LOADER STYLE
export const MODAL_BACKGROUND: ViewStyle = {
  flex: 1,
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "space-around",
  backgroundColor: "#00000040",
}

export const ACTIVITY_INDICATOR_WRAPPER: ViewStyle = {
  backgroundColor: color.transparent,
  height: 100,
  width: 100,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
}
//Dropdown Styles
export const PICKER: ViewStyle = {
  width: "100%",
  height: 45,
  borderRadius: 3,
  backgroundColor: color.palette.transparentGrey,
  borderWidth: 0,
  borderBottomWidth: 1,
  borderBottomColor: color.palette.white,
  borderStyle: "solid",
}
export const PICKERCONTAINER: ViewStyle = {
  width: "100%",
  height: 45,
  margin: 0,
  padding: 0,
}
export const PICKERERROR: ViewStyle = {
  width: "100%",
  height: 45,
  borderRadius: 3,
  backgroundColor: color.palette.transparentGrey,
  borderWidth: 0,
  borderBottomWidth: 1,
  borderBottomColor: color.palette.red,
  borderStyle: "solid",
}
export const PICKERDROPDOWN: ViewStyle = {
  backgroundColor: color.palette.charcoalGrey,
  height: 100,
  width: "100%",
  borderWidth: 0,
  margin: 0,
  padding: 0,
}
export const PICKERLABEL: TextStyle = {
  ...TEXT16,
  textAlign: "left",
}
// static styles
export const HEADER_ROOT: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingTop: spacing[5],
  paddingBottom: spacing[5],
  justifyContent: "flex-start",
  paddingRight: spacing[4],
  height: 58,
}
export const HEADER_TITLE: TextStyle = {
  textAlign: "center",
  fontSize: 20,
  fontWeight: "normal",
  fontStyle: "normal",
  letterSpacing: 0.67,
  fontFamily: "Roboto",
  marginVertical: -11
}

export const HEADER_BACK_BUTTON: ViewStyle = {
  height: 58,
  width: "15%",
  left: 0,
  alignItems: "center",
}

export const HEADER_TITLE_MIDDLE: ViewStyle = { flex: 1, justifyContent: "center" }
export const HEADER_LEFT: ViewStyle = { width: 32, paddingHorizontal: 12.5, paddingVertical: 12.5 }
export const HEADER_RIGHT: ViewStyle = { width: 32, paddingHorizontal: 12.5, paddingVertical: 12.5 }

export const GOOGLE_SVG = `<svg width="18px" height="17px" viewBox="0 0 18 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>svgexport-31</title>
<g id="Phase-3---Coach" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="PitchAI---Register-With" transform="translate(-56.000000, -104.000000)" fill-rule="nonzero">
        <g id="Group-2" transform="translate(32.000000, 90.000000)">
            <g id="svgexport-31" transform="translate(24.500000, 14.000000)">
                <path d="M16.66,8.7 C16.66,8.09 16.61,7.51 16.51,6.96 L8.5,6.96 L8.5,10.24 L13.08,10.24 C12.8890136,11.2932528 12.2745674,12.2221509 11.38,12.81 L11.38,14.94 L14.12,14.94 C15.8139278,13.3147716 16.7373422,11.0462261 16.66,8.7 L16.66,8.7 Z" id="Path" fill="#4285F4"></path>
                <path d="M8.5,17 C10.571062,17.0586515 12.5858637,16.3214416 14.13,14.94 L11.38,12.81 C10.5214442,13.3583176 9.51835343,13.636954 8.5,13.61 C6.32622648,13.5869659 4.41009082,12.1780426 3.74,10.11 L0.9,10.11 L0.9,12.31 C2.34183064,15.1854429 5.2833174,17.0006499 8.5,17 L8.5,17 Z" id="Path" fill="#34A853"></path>
                <path d="M3.74,10.12 C3.39077269,9.07165215 3.39077269,7.93834785 3.74,6.89 L3.74,4.69 L0.9,4.69 C0.307290938,5.87254725 -0.000901769265,7.17722972 -1.97322982e-06,8.5 C-1.97322982e-06,9.87 0.33,11.17 0.9,12.32 L3.74,10.12 L3.74,10.12 Z" id="Path" fill="#FBBC05"></path>
                <path d="M8.5,3.38 C9.7080822,3.36007855 10.8754989,3.81626907 11.75,4.65 L14.19,2.21 C12.6501005,0.765854502 10.6109626,-0.0261480847 8.5,-2.16840434e-19 C5.28553926,-0.00254830686 2.34461592,1.80844133 0.9,4.68 L3.74,6.88 C4.41009082,4.8119574 6.32622648,3.40303413 8.5,3.38 Z" id="Path" fill="#EA4335"></path>
            </g>
        </g>
    </g>
</g>
</svg>`

export const TWITTER_SVG = `<svg width="18px" height="14px" viewBox="0 0 18 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>Path</title>
<g id="Phase-3---Coach" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="PitchAI---Register-With" transform="translate(-56.000000, -183.000000)" fill="#55ACEE" fill-rule="nonzero">
        <g id="Group" transform="translate(32.000000, 167.000000)">
            <g id="svgexport-33" transform="translate(24.500000, 15.000000)">
                <path d="M16.5,1.25 C15.83,1.66 15.1,1.95 14.32,2.12 C13.6820353,1.41559583 12.7817527,1.00555343 11.8315812,0.986625715 C10.8814097,0.967697996 9.96551133,1.34156149 9.3,2.02 C8.64576505,2.6754001 8.27883411,3.56394855 8.28,4.49 C8.28,4.76 8.31,5.03 8.35,5.29 C5.54820852,5.13691074 2.94264792,3.80324165 1.18,1.62 C0.879156415,2.15275113 0.707875219,2.74880969 0.68,3.36 C0.695071888,4.52888351 1.27675489,5.61767478 2.24,6.28 C1.69529393,6.26121783 1.16333312,6.1102096 0.69,5.84 L0.69,5.9 C0.69,7.57 1.89,8.98 3.49,9.32 C3.19,9.38 2.89,9.42 2.55,9.44 L1.93,9.38 C2.38410024,10.7960568 3.68343739,11.7705597 5.17,11.81 C3.91551603,12.7653448 2.38672578,13.2913047 0.81,13.31 L0,13.24 C1.60143402,14.2603026 3.46115669,14.8015652 5.36,14.8000034 C11.76,14.8000034 15.27,9.48 15.26,4.9 L15.26,4.4 C15.95,3.92 16.54,3.3 17,2.6 C16.37,2.89 15.7,3.08 15,3.15 C15.7265762,2.72007203 16.2627315,2.03021888 16.5,1.22" id="Path"></path>
            </g>
        </g>
    </g>
</g>
</svg>`

export const FACEBOOK_SVG = `<svg width="18px" height="17px" viewBox="0 0 18 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>Path</title>
<g id="Phase-3---Coach" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="PitchAI---Register-With" transform="translate(-56.000000, -258.000000)" fill="#3B5998">
        <g id="Group-4" transform="translate(32.000000, 244.000000)">
            <g id="svgexport-32" transform="translate(24.000000, 14.000000)">
                <path d="M16.3,0 L0.7,0 C0.313400675,0 0,0.313400675 0,0.7 L0,16.3 C0,16.68 0.32,17.0000715 0.7,17.0000715 L9.03,17.0000715 L9.03,10.62 L6.91,10.62 L6.91,7.97 L9.03,7.97 L9.03,5.84 C9.03,3.64 10.43,2.57 12.38,2.57 C13.32,2.57 14.13,2.64 14.36,2.67 L14.36,4.97 L13,4.97 C11.94,4.97 11.69,5.47 11.69,6.21 L11.69,7.97 L14.34,7.97 L13.81,10.62 L11.7,10.62 L11.74,17.0000715 L16.3,17.0000715 C16.4873781,17.0026771 16.6680057,16.9301108 16.8014519,16.7985441 C16.9348982,16.6669774 17.01,16.4873972 17.01,16.3 L17.01,0.7 C17.01,0.313400675 16.6965993,0 16.31,0" id="Path"></path>
            </g>
        </g>
    </g>
</g>
</svg>`

export const EMAIL_SVG = `<svg width="21px" height="17px" viewBox="0 0 21 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>Shape Copy</title>
<g id="Phase-3---Coach" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="PitchAI---Register-With" transform="translate(-54.000000, -335.000000)" fill="#6BA4FF" fill-rule="nonzero">
        <g id="Group" transform="translate(32.000000, 321.000000)">
            <path d="M40.995,14.5 L24.995,14.5 C23.895,14.5 23.005,15.4 23.005,16.5 L22.995,28.5 C22.995,29.6 23.895,30.5 24.995,30.5 L40.995,30.5 C42.095,30.5 42.995,29.6 42.995,28.5 L42.995,16.5 C42.995,15.4 42.095,14.5 40.995,14.5 Z M40.995,18.5 L32.995,23.5 L24.995,18.5 L24.995,16.5 L32.995,21.5 L40.995,16.5 L40.995,18.5 Z" id="Shape-Copy"></path>
        </g>
    </g>
</g>
</svg>`

export const VISIBILITY_OFF_SVG = `<svg width="22px" height="19px" viewBox="0 0 22 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>Shape Copy</title>
<g id="Phase-3---Coach" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.65">
    <g id="PitchAI---Register---Password" transform="translate(-290.000000, -103.000000)" fill="#FFFFFF">
        <path d="M301.01,107 C303.77,107 306.01,109.24 306.01,112 C306.01,112.65 305.88,113.26 305.65,113.83 L308.57,116.75 C310.08,115.49 311.27,113.86 312,112 C310.27,107.61 306,104.5 301,104.5 C299.6,104.5 298.26,104.75 297.02,105.2 L299.18,107.36 C299.75,107.13 300.36,107 301.01,107 L301.01,107 Z M291.01,104.27 L293.29,106.55 L293.75,107.01 C292.09,108.3 290.79,110.02 290.01,112 C291.74,116.39 296.01,119.5 301.01,119.5 C302.56,119.5 304.04,119.2 305.39,118.66 L305.81,119.08 L308.74,122 L310.01,120.73 L292.28,103 L291.01,104.27 L291.01,104.27 Z M296.54,109.8 L298.09,111.35 C298.04,111.56 298.01,111.78 298.01,112 C298.01,113.66 299.35,115 301.01,115 C301.23,115 301.45,114.97 301.66,114.92 L303.21,116.47 C302.54,116.8 301.8,117 301.01,117 C298.25,117 296.01,114.76 296.01,112 C296.01,111.21 296.21,110.47 296.54,109.8 L296.54,109.8 Z M300.85,109.02 L304,112.17 L304.02,112.01 C304.02,110.35 302.68,109.01 301.02,109.01 L300.85,109.02 L300.85,109.02 Z" id="Shape-Copy"></path>
    </g>
</g>
</svg>`

export const VISIBILITY_ON_SVG = `<svg width="22px" height="16px" viewBox="0 0 22 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>Shape</title>
<g id="Phase-3---Coach" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="PitchAI---Login---Email" transform="translate(-227.000000, -182.000000)" fill="#BBBDC1">
        <path d="M238,182.5 C233,182.5 228.73,185.61 227,190 C228.73,194.39 233,197.5 238,197.5 C243,197.5 247.27,194.39 249,190 C247.27,185.61 243,182.5 238,182.5 L238,182.5 Z M238,195 C235.24,195 233,192.76 233,190 C233,187.24 235.24,185 238,185 C240.76,185 243,187.24 243,190 C243,192.76 240.76,195 238,195 L238,195 Z M238,187 C236.34,187 235,188.34 235,190 C235,191.66 236.34,193 238,193 C239.66,193 241,191.66 241,190 C241,188.34 239.66,187 238,187 L238,187 Z" id="Shape"></path>
    </g>
</g>
</svg>`

export const UPLOAD_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="20px" height="21px" viewBox="0 0 20 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Shape</title>
    <g id="Phase-3---Coach" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="PitchAI---New-Pitch---Pre-record" transform="translate(-686.000000, -292.000000)" fill="#FFFFFF">
            <g id="Group-5" transform="translate(667.000000, 292.000000)">
                <path d="M21,4.5 L19,4.5 L19,18.5 C19,19.6 19.9,20.5 21,20.5 L35,20.5 L35,18.5 L21,18.5 L21,4.5 L21,4.5 Z M37,0.5 L25,0.5 C23.9,0.5 23,1.4 23,2.5 L23,14.5 C23,15.6 23.9,16.5 25,16.5 L37,16.5 C38.1,16.5 39,15.6 39,14.5 L39,2.5 C39,1.4 38.1,0.5 37,0.5 L37,0.5 Z M29,13 L29,4 L35,8.5 L29,13 L29,13 Z" id="Shape"></path>
            </g>
        </g>
    </g>
</svg>`

export const RADIO_BUTTON_VIEW: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  marginBottom: 24,
}

export const RADIO_BUTTON_CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  borderWidth: 0,
  left: 0,
}

export const PROGRESS_STEP_VIEW: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: "8%",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  marginTop: 16,
}

export const WIDTH_38: ViewStyle = {
  width: "38%",
}
export const WIDTH_19: ViewStyle = {
  width: "19%",
}
export const WIDTH_100: ViewStyle = {
  width: "100%",
}

export const MARGIN_1: ViewStyle = {
  marginTop: -30,
}

export const OVERVIEW_SVG = `<svg width="23px" height="12px" viewBox="0 0 23 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>Shape</title>
<g id="Symbols" stroke="none" stroke-width="1" fill-rule="evenodd">
    <g id="Menu/Player---Overview" transform="translate(-49.000000, -14.000000)">
        <g id="Icon-24px" transform="translate(48.500000, 8.000000)">
            <path d="M23,8 C23,9.1 22.1,10 21,10 C20.82,10 20.65,9.98 20.49,9.93 L16.93,13.48 C16.98,13.64 17,13.82 17,14 C17,15.1 16.1,16 15,16 C13.9,16 13,15.1 13,14 C13,13.82 13.02,13.64 13.07,13.48 L10.52,10.93 C10.36,10.98 10.18,11 10,11 C9.82,11 9.64,10.98 9.48,10.93 L4.93,15.49 C4.98,15.65 5,15.82 5,16 C5,17.1 4.1,18 3,18 C1.9,18 1,17.1 1,16 C1,14.9 1.9,14 3,14 C3.18,14 3.35,14.02 3.51,14.07 L8.07,9.52 C8.02,9.36 8,9.18 8,9 C8,7.9 8.9,7 10,7 C11.1,7 12,7.9 12,9 C12,9.18 11.98,9.36 11.93,9.52 L14.48,12.07 C14.64,12.02 14.82,12 15,12 C15.18,12 15.36,12.02 15.52,12.07 L19.07,8.51 C19.02,8.35 19,8.18 19,8 C19,6.9 19.9,6 21,6 C22.1,6 23,6.9 23,8 L23,8 Z" id="Shape"></path>
        </g>
    </g>
</g>
</svg>`

export const NEWPITCHES_SVG = `<svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>Shape</title>
<g id="Symbols" stroke="none" stroke-width="1" fill-rule="evenodd">
    <g id="Menu/Player---Overview" transform="translate(-173.000000, -13.000000)" >
        <g id="Group" transform="translate(135.000000, 8.000000)">
            <g id="ic_add" transform="translate(33.000000, 0.000000)">
                <g id="Icon-24px">
                    <polygon id="Shape" points="19 13 13 13 13 19 11 19 11 13 5 13 5 11 11 11 11 5 13 5 13 11 19 11"></polygon>
                </g>
            </g>
        </g>
    </g>
</g>
</svg>`

export const PLAYERS_SVG = `<svg width="22px" height="14px" viewBox="0 0 22 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>Shape</title>
<g id="Symbols" stroke="none" stroke-width="1" fill-rule="evenodd">
    <g id="Menu/Team---Overview" transform="translate(-214.000000, -13.000000)" >
        <g id="Group-2" transform="translate(180.000000, 8.000000)">
            <g id="ic_people" transform="translate(33.000000, 0.000000)">
                <g id="Icon-24px">
                    <path d="M16,11 C17.66,11 18.99,9.66 18.99,8 C18.99,6.34 17.66,5 16,5 C14.34,5 13,6.34 13,8 C13,9.66 14.34,11 16,11 L16,11 Z M8,11 C9.66,11 10.99,9.66 10.99,8 C10.99,6.34 9.66,5 8,5 C6.34,5 5,6.34 5,8 C5,9.66 6.34,11 8,11 L8,11 Z M8,13 C5.67,13 1,14.17 1,16.5 L1,19 L15,19 L15,16.5 C15,14.17 10.33,13 8,13 L8,13 Z M16,13 C15.71,13 15.38,13.02 15.03,13.05 C16.19,13.89 17,15.02 17,16.5 L17,19 L23,19 L23,16.5 C23,14.17 18.33,13 16,13 L16,13 Z" id="Shape"></path>
                </g>
            </g>
        </g>
    </g>
</g>
</svg>`

export const COMPARE_SVG = `<svg width="21px" height="14px" viewBox="0 0 21 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>Shape</title>
<g id="Symbols" stroke="none" stroke-width="1"  fill-rule="evenodd">
    <g id="Menu/Team---Overview" transform="translate(-305.000000, -13.000000)">
        <g id="ic_compare_arrows" transform="translate(303.125000, 8.000000)">
            <g id="Icon-24px">
                <path d="M9.01,14 L2,14 L2,16 L9.01,16 L9.01,19 L13,15 L9.01,11 L9.01,14 L9.01,14 Z M14.99,13 L14.99,10 L22,10 L22,8 L14.99,8 L14.99,5 L11,9 L14.99,13 L14.99,13 Z" id="Shape"></path>
            </g>
        </g>
    </g>
</g>
</svg>`

export const PITCHES_SVG = `<svg width="19px" height="20px" viewBox="0 0 19 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>Shape Copy</title>
<g id="Symbols" stroke="none" stroke-width="1"  fill-rule="evenodd">
    <g id="Menu/Player---Overview" transform="translate(-291.000000, -10.000000)" fill-rule="nonzero">
        <path d="M300.75,10.75 C305.848271,10.75 310,14.9017288 310,20 C310,25.0982712 305.848271,29.25 300.75,29.25 C295.651729,29.25 291.5,25.0982712 291.5,20 C291.5,14.9017288 295.651729,10.75 300.75,10.75 Z M300.75004,12.050264 C298.858769,12.050264 297.062273,12.713935 295.607998,13.8965225 L295.544,13.95 L295.586829,13.9980569 C295.792318,14.2421299 295.981536,14.4920706 296.162345,14.7575468 L296.211,14.831 L296.350742,14.7549743 C296.629058,14.5686103 297.009507,14.6404569 297.189671,14.8849934 L297.23741,14.9634496 C297.423774,15.2417658 297.351927,15.6222154 297.094071,15.8105181 L297.011206,15.8609502 L296.863,15.942 L296.963442,16.1518311 C297.031253,16.3002853 297.095991,16.4551343 297.159288,16.6193282 L297.271,16.923 L297.443503,16.8808973 C297.764937,16.7931271 298.089135,16.9488039 298.217944,17.2434396 L298.250527,17.3358946 C298.338297,17.6573295 298.18262,17.9815266 297.884063,18.1113612 L297.79031,18.1442836 L297.618,18.187 L297.630341,18.2543693 C297.681174,18.5453917 297.71906,18.8115331 297.744622,19.0678894 L297.767,19.331 L297.929676,19.331428 C298.255479,19.331428 298.526103,19.5724336 298.572615,19.8855114 L298.579676,19.981428 C298.579676,20.3072327 298.338675,20.5778553 298.025594,20.6243668 L297.929676,20.631428 L297.766,20.631 L297.761041,20.7344857 C297.737204,21.0723339 297.696994,21.3936717 297.638251,21.7067703 L297.623,21.776 L297.795752,21.819998 C298.116464,21.9078885 298.309632,22.2109099 298.271809,22.5218957 L298.253429,22.6152232 C298.188464,22.9082292 297.927895,23.111108 297.629676,23.111108 L297.58484,23.1077146 L297.469042,23.0833316 L297.289,23.038 L297.243086,23.168489 C297.155111,23.4015663 297.056285,23.6359456 296.94648,23.8734985 L296.877,24.016 L297.031728,24.1020262 C297.302367,24.2526422 297.409777,24.5809261 297.313351,24.87548 L297.273604,24.9721253 C297.170589,25.1781405 296.943903,25.310316 296.71016,25.310316 C296.625581,25.310316 296.533142,25.2898043 296.457677,25.2562911 L296.232,25.131 L296.199063,25.1828735 C296.038699,25.4228241 295.882056,25.6378169 295.721204,25.835932 L295.565,26.02 L295.613299,26.0624755 C296.959819,27.2057913 298.640042,27.8733142 300.432486,27.9439547 L300.74992,27.9502 C302.645984,27.9502 304.442494,27.2829998 305.856345,26.1052907 L305.916,26.053 L305.872531,26.0024071 C305.667042,25.7583341 305.477824,25.5083934 305.297015,25.2429172 L305.248,25.168 L305.107571,25.2461874 C305.03367,25.2951349 304.943901,25.3278835 304.85606,25.3411986 L304.76952,25.347916 C304.545761,25.347916 304.348427,25.2279733 304.22195,25.0370144 C304.035586,24.7586982 304.107433,24.3782486 304.365289,24.1899459 L304.448154,24.1395138 L304.596,24.057 L304.49592,23.8486419 C304.42811,23.7001899 304.363373,23.5453421 304.300075,23.3811472 L304.187,23.072 L304.063548,23.101124 L304.003205,23.1270016 L303.941622,23.1426805 L303.875736,23.1487032 C303.86862,23.1488901 303.861173,23.1488172 303.850004,23.148708 C303.551793,23.148708 303.291222,22.9458297 303.229153,22.6645614 C303.141383,22.3431265 303.29706,22.0189294 303.595617,21.8890948 L303.68937,21.8561724 L303.861,21.813 L303.849339,21.7460867 C303.798506,21.4550643 303.76062,21.1889229 303.735058,20.9325666 L303.713,20.669 L303.550004,20.669028 C303.224201,20.669028 302.953577,20.4280224 302.907065,20.1149446 L302.900004,20.019028 C302.900004,19.6932233 303.141005,19.4226007 303.454086,19.3760892 L303.550004,19.369028 L303.713,19.369 L303.718639,19.2659703 C303.742476,18.9281221 303.782686,18.6067843 303.841429,18.2936857 L303.856,18.223 L303.683928,18.180458 C303.363216,18.0925675 303.170048,17.7895461 303.210097,17.4695743 L303.229214,17.3732724 C303.317105,17.0525598 303.620126,16.8593918 303.936009,16.8983699 L304.030958,16.9171324 L304.21,16.962 L304.256914,16.831975 C304.344889,16.5988977 304.443715,16.3645184 304.55352,16.1269655 L304.622,15.983 L304.468272,15.8984378 C304.197554,15.7477779 304.087018,15.3988549 304.189447,15.1116637 L304.23155,15.0185763 C304.382166,14.7479373 304.71045,14.640527 305.011973,14.7406283 L305.11121,14.7817418 L305.267,14.868 L305.300937,14.8175905 C305.461301,14.5776399 305.617944,14.3626471 305.778796,14.164532 L305.934,13.979 L305.886704,13.9379976 C304.540177,12.7947154 302.859811,12.1271545 301.067455,12.0565097 L300.75004,12.050264 Z M306.851,14.924 L306.821578,14.9596156 C306.683373,15.1281918 306.555969,15.2967958 306.436041,15.4701709 L306.404,15.519 L306.511392,15.5824402 C306.782031,15.7330562 306.889441,16.0613401 306.793015,16.355894 L306.753268,16.4525393 C306.650253,16.6585545 306.423567,16.79073 306.189824,16.79073 C306.105245,16.79073 306.012806,16.7702183 305.935051,16.7353953 L305.863025,16.6960315 L305.753,16.632 L305.66844,16.8183453 L305.572429,17.0457552 L305.477,17.288 L305.59574,17.319144 C305.916452,17.4070345 306.10962,17.7100559 306.071797,18.0210417 L306.053417,18.1143692 C305.988452,18.4073752 305.727883,18.610254 305.429664,18.610254 C305.39903,18.610254 305.368742,18.6049547 305.345645,18.5990049 L305.294181,18.5861713 L305.265991,18.5816974 L305.142,18.549 L305.12919,18.6144206 C305.090793,18.8298986 305.06173,19.0505414 305.042192,19.2740357 L305.037,19.35 L305.170296,19.350102 C305.496099,19.350102 305.766723,19.5911076 305.813235,19.9041854 L305.820296,20.000102 C305.820296,20.3259067 305.579295,20.5965293 305.266214,20.6430408 L305.170296,20.650102 L305.036,20.65 L305.041724,20.7245644 C305.061065,20.9471694 305.090175,21.1678231 305.128776,21.3840727 L305.144,21.462 L305.243511,21.4401853 C305.564945,21.3524151 305.889143,21.5080919 306.017952,21.8027276 L306.050535,21.8951826 C306.138305,22.2166175 305.982628,22.5408146 305.686355,22.6700631 L305.593357,22.7027914 L305.477,22.732 C305.540665,22.9000971 305.603482,23.0554332 305.668452,23.2029306 L305.754,23.389 L305.850746,23.3329863 C306.129062,23.1466223 306.509511,23.2184689 306.689675,23.4630054 L306.737414,23.5414616 C306.923778,23.8197778 306.851931,24.2002274 306.598154,24.3861975 L306.401,24.503 L306.532328,24.689664 L306.687791,24.8950594 L306.85,25.095 L306.875045,25.0660697 C307.975944,23.7269937 308.621114,22.0752742 308.693207,20.3286759 L308.69998,20.00013 C308.69998,18.1304031 308.043079,16.3548897 306.875738,14.9519664 L306.851,14.924 Z M294.679224,14.9401724 L294.649,14.905 L294.641652,14.9140734 C293.459664,16.3430057 292.80008,18.1258867 292.80008,20.000136 C292.80008,21.8659209 293.454563,23.6422493 294.606843,25.0307499 L294.628,25.055 L294.658082,25.0202504 C294.796287,24.8516742 294.923691,24.6830702 295.043619,24.5096951 L295.075,24.46 L294.968268,24.3974258 C294.697629,24.2468098 294.590219,23.9185259 294.690402,23.6168553 L294.731546,23.5175643 C294.882162,23.2469253 295.210446,23.139515 295.515928,23.2418797 L295.616635,23.2838345 L295.725,23.347 L295.81122,23.1615207 L295.907231,22.9341108 L296.002,22.691 L295.88392,22.660722 C295.563208,22.5728315 295.37004,22.2698101 295.410089,21.9498383 L295.429206,21.8535364 C295.517097,21.5328238 295.820118,21.3396558 296.138285,21.3792201 L296.233989,21.3981766 L296.357,21.431 L296.37079,21.3654534 C296.409187,21.1499754 296.43825,20.9293326 296.457788,20.7058383 L296.462,20.629 L296.329684,20.629772 C296.003879,20.629772 295.733257,20.3887713 295.686745,20.0756899 L295.679684,19.979772 C295.679684,19.6539673 295.920685,19.3833447 296.233766,19.3368332 L296.329684,19.329772 L296.463,19.329 L296.458256,19.2553096 C296.438915,19.0327046 296.409805,18.8120509 296.371204,18.5958013 L296.357,18.528 L296.283,18.548 L296.252412,18.566429 C296.221111,18.5802638 296.187521,18.5860944 296.144001,18.5884443 L296.070316,18.589924 C295.772105,18.589924 295.511534,18.3870457 295.449465,18.1057774 C295.361695,17.7843425 295.517372,17.4601454 295.813645,17.3308969 L295.906643,17.2981686 L296.022,17.268 C295.959335,17.1008629 295.896518,16.9455268 295.831548,16.7980294 L295.745,16.611 L295.648207,16.6686714 C295.574306,16.7176189 295.484537,16.7503675 295.396696,16.7636826 L295.310156,16.7704 C295.086397,16.7704 294.889063,16.6504573 294.762586,16.4594984 C294.576222,16.1811822 294.648069,15.8007326 294.901846,15.6147625 L295.096,15.498 L295.064529,15.4503558 C294.944983,15.2774004 294.817731,15.1090411 294.679224,14.9401724 Z" id="Shape-Copy"></path>
    </g>
</g>
</svg>`

export const DELETE_SVG = `<svg width="14px" height="18px" viewBox="0 0 14 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>Shape</title>
<g id="Phase-3---Coach" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="Player-Profile-Copy-4" transform="translate(-315.000000, -97.000000)" fill="#FFFFFF">
        <path d="M316,113 C316,114.1 316.9,115 318,115 L326,115 C327.1,115 328,114.1 328,113 L328,101 L316,101 L316,113 L316,113 Z M329,98 L325.5,98 L324.5,97 L319.5,97 L318.5,98 L315,98 L315,100 L329,100 L329,98 L329,98 Z" id="Shape"></path>
    </g>
</g>
</svg>`

export const USER_PROFILE_LARGE = `<svg width="150px" height="150px" viewBox="0 0 101 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>default-image-player-profile</title>
<defs>
    <circle id="path-1" cx="40" cy="40" r="40"></circle>
    <circle id="path-3" cx="50" cy="50" r="50"></circle>
    <mask id="mask-4" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="100" height="100" fill="white">
        <use xlink:href="#path-3"></use>
    </mask>
</defs>
<g id="Coach" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="PitchAI---Player-Profile" transform="translate(-130.000000, -82.000000)">
        <g id="default-image-player-profile" transform="translate(130.500000, 82.000000)">
            <g id="Combined-Shape" transform="translate(10.000000, 10.000000)">
                <mask id="mask-2" fill="white">
                    <use xlink:href="#path-1"></use>
                </mask>
                <use id="Mask" fill="#676E72" xlink:href="#path-1"></use>
                <path d="M39.7359715,50.198655 C55.8300958,50.198655 68.8773135,59.2404581 68.8800988,72.7831966 C68.8800988,83.6269426 10.5946965,83.6269426 10.5946965,72.7831966 C10.5946965,59.2404581 23.6418472,50.198655 39.7359715,50.198655 Z M39.7361141,19 C46.8613829,19 52.6356581,25.5597283 52.6356581,33.6515716 C52.6356581,41.7435575 46.8613829,48.3031432 39.7361141,48.3031432 C32.6108452,48.3031432 26.8365701,41.7434149 26.8365701,33.6515716 C26.8365701,25.5597283 32.6108452,19 39.7361141,19 Z" fill="#3A3F43" fill-rule="nonzero" mask="url(#mask-2)"></path>
            </g>
            <use id="Oval" stroke="#6BA4FF" mask="url(#mask-4)" stroke-width="2" stroke-dasharray="6,9" xlink:href="#path-3"></use>
        </g>
    </g>
</g>
</svg>`

export const USER_PROFILE_SMALL = `<svg width="80px" height="80px" viewBox="0 0 80 80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>default-image-player</title>
<defs>
    <rect id="path-1" x="0" y="0" width="80" height="80"></rect>
</defs>
<g id="Player" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="PitchAI-Player---Overview-Empty" transform="translate(-32.000000, -83.000000)">
        <g id="default-image-player" transform="translate(32.000000, 83.000000)">
            <mask id="mask-2" fill="white">
                <use xlink:href="#path-1"></use>
            </mask>
            <use id="Mask" fill="#808892" xlink:href="#path-1"></use>
            <path d="M39.9982056,55.2534198 C60.2474573,55.2534198 76.6631623,66.6296055 76.6666667,83.6687632 C76.6666667,97.3121114 3.33333333,97.3121114 3.33333333,83.6687632 C3.33333333,66.6296055 19.748954,55.2534198 39.9982056,55.2534198 Z M39.9983851,16 C48.9632321,16 56.2282904,24.2532971 56.2282904,34.4342656 C56.2282904,44.6154135 48.9632321,52.8685312 39.9983851,52.8685312 C31.0335381,52.8685312 23.7684798,44.615234 23.7684798,34.4342656 C23.7684798,24.2532971 31.0335381,16 39.9983851,16 Z" id="Combined-Shape" fill="#20252B" fill-rule="nonzero" mask="url(#mask-2)"></path>
        </g>
    </g>
</g>
</svg>`

export const LISTITEM_TITLE: TextStyle = {
  color: "#ffffff",
  fontSize: 14,
}

export const LISTITEM_CONTAINER: ViewStyle = {
  backgroundColor: "#20252b",
  borderBottomColor: color.transparent,
  borderBottomWidth: 1
}

export const VIDEO_PLAY = `<svg width="51px" height="51px" viewBox="0 0 51 51" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>Group 8</title>
<g id="Phase-3---Coach" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="Player-Profile-Copy-4" transform="translate(-155.000000, -319.000000)">
        <g id="Group-8" transform="translate(155.500000, 319.322835)">
            <circle id="Oval" fill="#131415" cx="25" cy="25" r="15.3462055"></circle>
            <path d="M25,0 C11.2,0 0,11.2 0,25 C0,38.8 11.2,50 25,50 C38.8,50 50,38.8 50,25 C50,11.2 38.8,0 25,0 L25,0 Z M20,36.25 L20,13.75 L35,25 L20,36.25 L20,36.25 Z" id="Shape" fill="#6BA4FF"></path>
        </g>
    </g>
</g>
</svg>`

export const VIDEO_PAUSE =`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="60pt" height="60pt" viewBox="0 0 25 25" version="1.1">
<g id="surface1">
<path style="fill:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke:#FFFFFF;stroke-opacity:1;stroke-miterlimit:4;" d="M 34.92 18 C 34.92 27.343125 27.343125 34.92 18 34.92 C 8.656875 34.92 1.08 27.343125 1.08 18 C 1.08 8.656875 8.656875 1.08 18 1.08 C 27.343125 1.08 34.92 8.656875 34.92 18 Z M 34.92 18 " transform="matrix(0.694444,0,0,0.694444,0,0)"/>
<path style="fill-rule:evenodd;fill:#FFFFFF;fill-opacity:1;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke:#FFFFFF;stroke-opacity:1;stroke-miterlimit:4;" d="M 13.359375 10.783125 L 14.92875 10.783125 L 14.92875 25.216875 L 13.359375 25.216875 Z M 21.07125 10.783125 L 22.640625 10.783125 L 22.640625 25.216875 L 21.07125 25.216875 Z M 21.07125 10.783125 " transform="matrix(0.694444,0,0,0.694444,0,0)"/>
</g>
</svg>`


export const VIDEO_PAUSE_LIST =`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="60pt" height="60pt" viewBox="0 0 25 25" version="1.1">
<g id="surface1">
<path style="fill:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke:#FFFFFF;stroke-opacity:0;stroke-miterlimit:4;" d="M 34.92 18 C 34.92 27.343125 27.343125 34.92 18 34.92 C 8.656875 34.92 1.08 27.343125 1.08 18 C 1.08 8.656875 8.656875 1.08 18 1.08 C 27.343125 1.08 34.92 8.656875 34.92 18 Z M 34.92 18 " transform="matrix(0.694444,0,0,0.694444,0,0)"/>
<path style="fill-rule:evenodd;fill:#FFFFFF;fill-opacity:0;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke:#FFFFFF;stroke-opacity:0;stroke-miterlimit:4;" d="M 13.359375 10.783125 L 14.92875 10.783125 L 14.92875 25.216875 L 13.359375 25.216875 Z M 21.07125 10.783125 L 22.640625 10.783125 L 22.640625 25.216875 L 21.07125 25.216875 Z M 21.07125 10.783125 " transform="matrix(0.694444,0,0,0.694444,0,0)"/>
</g>
</svg>`

export const VIDEO_FULLSCREEN = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M24 9h-2v-4h-4v-2h6v6zm-6 12v-2h4v-4h2v6h-6zm-18-6h2v4h4v2h-6v-6zm6-12v2h-4v4h-2v-6h6z"/></svg>`

export const ICON_EDIT = `<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>Shape</title>
<g id="Phase-3---Coach" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="PitchAI---Player-Profile-+-Details-Expanded" transform="translate(-113.000000, -381.000000)" fill="#FFFFFF">
        <g id="Group-7" transform="translate(31.500000, 138.000000)">
            <g id="Group-6" transform="translate(16.500000, 229.500000)">
                <g id="Group-5" transform="translate(65.000000, 12.000000)">
                    <path d="M2.54019028e-13,15.75125 L2.54019028e-13,19.50125 L3.75,19.50125 L14.81,8.44125 L11.06,4.69125 L2.54019028e-13,15.75125 L2.54019028e-13,15.75125 Z M17.71,5.54125 C18.1,5.15125 18.1,4.52125 17.71,4.13125 L15.37,1.79125 C14.98,1.40125 14.35,1.40125 13.96,1.79125 L12.13,3.62125 L15.88,7.37125 L17.71,5.54125 L17.71,5.54125 Z" id="Shape"></path>
                </g>
            </g>
        </g>
    </g>
</g>
</svg>`

export const Icon_ArrowDown = `
<svg width="12px" height="9px" viewBox="0 0 12 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Shape</title>
    <g id="Phase-3---Coach" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Player-Profile-Copy-4" transform="translate(-301.000000, -156.000000)" fill="#FFFFFF">
            <polygon id="Shape" points="311.59 156.795 307 161.375 302.41 156.795 301 158.205 307 164.205 313 158.205"></polygon>
        </g>
    </g>
</svg>`

export const BUTTON_TRANSPARENT_DASHED: ViewStyle = {
  ...BUTTON,
  backgroundColor: "transparent",
  borderColor: color.palette.white,
  borderStyle: "dashed",
  borderWidth: 1,
  marginTop: spacing[3],
  width: "100%",
}

export const EXPANDABLEBUTTONCONTAINER: ViewStyle = {
  flexDirection: "row",
  width: "100%",
  height: 45,
  borderRadius: 3,
  backgroundColor: "#323943",
  paddingRight: 10,
  marginBottom: 32,
}

export const magnifyingGlass: ViewStyle = {}

export const magnifyingGlassCircle: ViewStyle = {
  width: 100,
  height: 100,
  borderWidth: 15,
  borderColor: "red",
}

export const magnifyingGlassStick: ViewStyle = {
  position: "absolute",
  right: -20,
  bottom: -10,
  backgroundColor: "red",
  width: 50,
  height: 10,
  transform: [{ rotate: "45deg" }],
}
export const cameraSideBar: ViewStyle = {
  flex: 1,
  position: "absolute",
  right: 0,
  width: "12%",
  height: "100%",
  backgroundColor: color.palette.darkGrey,
  justifyContent: "center",
}
export const cameraRecordButton: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 40,
  backgroundColor: color.palette.darkRed,
  borderStyle: "solid",
  borderWidth: 3,
  borderColor: color.palette.white,
  alignSelf: "center",
}

export const cameraStopButton: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 40,
  backgroundColor: color.transparent,
  borderStyle: "solid",
  borderWidth: 3,
  borderColor: color.palette.white,
  alignItems: "center",
  justifyContent: "center",
}

export const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderColor: "gray",
    borderRadius: 3,
    color: "white",
    paddingRight: 30, // to ensure the text is never behind the icon
    width: "100%",
    height: 45,
    backgroundColor: color.palette.transparentGrey,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: color.palette.white,
    borderStyle: "solid",
  },
  inputAndroid: {
    fontSize: 16,
    fontFamily: "Roboto",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 3,
    color: "white",
    paddingRight: 30, // to ensure the text is never behind the icon
    width: "100%",
    height: 45,
    backgroundColor: color.palette.transparentGrey,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: color.palette.white,
    borderStyle: "solid",
  },
})

export const VIDEO_THUMBNAIL: ViewStyle = {
  backgroundColor: "rgba(255,255,255,0.2)",
  width: 100,
  height: 56,
  alignItems: "center",
  justifyContent: "center"

}

export const checkboxContainer: ViewStyle ={
  flexDirection: "row",
  marginBottom: 20,
}

export const checkbox: TextStyle ={
  alignSelf: "center",
}

export const  label: TextStyle ={
  margin: 8,
}

export const elbowExtension: TextStyle = { 
    width: 3,
    height: 1,
    borderColor: "#619bf6",
    borderWidth: 1,
    
}
export const PLAY_BUTTON = `
 <svg width="51px" height="51px" viewBox="0 0 51 51" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Group 8</title>
    <g id="Phase-3---Coach" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Player-Profile-Copy-4" transform="translate(-155.000000, -319.000000)">
            <g id="Group-8" transform="translate(155.500000, 319.322835)">
                <circle id="Oval" fill="#131415" cx="25" cy="25" r="15.3462055"></circle>
                <path d="M25,0 C11.2,0 0,11.2 0,25 C0,38.8 11.2,50 25,50 C38.8,50 50,38.8 50,25 C50,11.2 38.8,0 25,0 L25,0 Z M20,36.25 L20,13.75 L35,25 L20,36.25 L20,36.25 Z" id="Shape" fill="#6BA4FF"></path>
            </g>
        </g>
    </g>
</svg>`
export const EDIT_ICON = `
<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Shape</title>
    <g id="Phase-3---Coach" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="PitchAI---Player-Profile-+-Details-Expanded" transform="translate(-113.000000, -381.000000)" fill="#FFFFFF">
            <g id="Group-7" transform="translate(31.500000, 138.000000)">
                <g id="Group-6" transform="translate(16.500000, 229.500000)">
                    <g id="Group-5" transform="translate(65.000000, 12.000000)">
                        <path d="M2.54019028e-13,15.75125 L2.54019028e-13,19.50125 L3.75,19.50125 L14.81,8.44125 L11.06,4.69125 L2.54019028e-13,15.75125 L2.54019028e-13,15.75125 Z M17.71,5.54125 C18.1,5.15125 18.1,4.52125 17.71,4.13125 L15.37,1.79125 C14.98,1.40125 14.35,1.40125 13.96,1.79125 L12.13,3.62125 L15.88,7.37125 L17.71,5.54125 L17.71,5.54125 Z" id="Shape"></path>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>`
export const EDIT_ICON_BLACK = `
<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Shape</title>
    <g id="Phase-3---Coach" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="PitchAI---Player-Profile-+-Details-Expanded" transform="translate(-113.000000, -381.000000)" fill="#000000">
            <g id="Group-7" transform="translate(31.500000, 138.000000)">
                <g id="Group-6" transform="translate(16.500000, 229.500000)">
                    <g id="Group-5" transform="translate(65.000000, 12.000000)">
                        <path d="M2.54019028e-13,15.75125 L2.54019028e-13,19.50125 L3.75,19.50125 L14.81,8.44125 L11.06,4.69125 L2.54019028e-13,15.75125 L2.54019028e-13,15.75125 Z M17.71,5.54125 C18.1,5.15125 18.1,4.52125 17.71,4.13125 L15.37,1.79125 C14.98,1.40125 14.35,1.40125 13.96,1.79125 L12.13,3.62125 L15.88,7.37125 L17.71,5.54125 L17.71,5.54125 Z" id="Shape"></path>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>`



export const SLIDER_THUMB_STYLE: ViewStyle = {
  backgroundColor: color.palette.lighterGrey
}


export const ICON_SHARE=`<svg width="20px" height="11px" viewBox="0 0 20 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>Shape Copy 9</title>
<g id="Phase-4---Player" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="PitchAI---Report-Angles-+-Add-Player-Info-Copy-2" transform="translate(-32.000000, -581.000000)" fill="#FFFFFF">
        <g id="Group-22" transform="translate(-0.500000, 509.000000)">
            <path d="M34.4,77.5 C34.4,75.79 35.79,74.4 37.5,74.4 L41.5,74.4 L41.5,72.5 L37.5,72.5 C34.74,72.5 32.5,74.74 32.5,77.5 C32.5,80.26 34.74,82.5 37.5,82.5 L41.5,82.5 L41.5,80.6 L37.5,80.6 C35.79,80.6 34.4,79.21 34.4,77.5 L34.4,77.5 Z M38.5,78.5 L46.5,78.5 L46.5,76.5 L38.5,76.5 L38.5,78.5 L38.5,78.5 Z M47.5,72.5 L43.5,72.5 L43.5,74.4 L47.5,74.4 C49.21,74.4 50.6,75.79 50.6,77.5 C50.6,79.21 49.21,80.6 47.5,80.6 L43.5,80.6 L43.5,82.5 L47.5,82.5 C50.26,82.5 52.5,80.26 52.5,77.5 C52.5,74.74 50.26,72.5 47.5,72.5 L47.5,72.5 Z" id="Shape-Copy-9"></path>
        </g>
    </g>
</g>
</svg>`