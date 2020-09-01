import * as Font from "expo-font"

export const initFonts = async () => {
  await Font.loadAsync({
    Montserrat: require("./Montserrat-Regular.ttf"),
    "Montserrat-Regular": require("./Montserrat-Regular.ttf"),
    Roboto: require("./Roboto/Roboto-Regular.ttf"),
    RobotoBold: require("./Roboto/Roboto-Bold.ttf"),
    RobotoMedium: require("./Roboto/Roboto-Medium.ttf"),
  })
}
