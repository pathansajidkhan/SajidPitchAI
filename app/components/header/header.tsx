import * as React from "react"
import { View, Image } from "react-native"
import { HeaderProps } from "./header.props"
import { Button } from "../button/button"
import { Text } from "../text/text"
import { Icon } from "../icon/icon"
import { translate } from "../../i18n/"
import * as styles from "../../theme/appStyle"


/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export const Header: React.FunctionComponent<HeaderProps> = props => {
  const {
    onLeftPress,
    onRightPress,
    rightIcon,
    leftIcon,
    headerText,
    headerTx,
    style,
    titleStyle,
    showBackground
  } = props
  const header = headerText || (headerTx && translate(headerTx)) || ""

  return (
    <View style={{ ...styles.HEADER_ROOT, ...style }}>
      {leftIcon ? (
        <Button preset="link" onPress={onLeftPress} style={styles.HEADER_BACK_BUTTON}>
          <Icon icon={leftIcon} />
        </Button>
      ) : (
          <View style={styles.HEADER_LEFT} />
        )}
      <View style={styles.HEADER_TITLE_MIDDLE}>
        <Text style={{ ...styles.HEADER_TITLE, ...titleStyle }} text={header} />
      </View>
      {showBackground && (
        <Image style={{ position: "absolute", left: '30%' }} source={require("../../../assets/baseball.png")} />
      )}
      {showBackground && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 }}>
          <Image style={{ position: "absolute" }} source={require("../../../assets/pitchai-logo-horizontal.png")} />
        </View>
      )}
      {rightIcon ? (
        <Button preset="link" onPress={onRightPress}>
          <Icon icon={rightIcon} />
        </Button>
      ) : (
          <View style={styles.HEADER_RIGHT} />
        )}
    </View>
  )
}
