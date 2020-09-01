import * as React from "react";
import { View, SafeAreaView, Image } from "react-native";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { Screen, Text, Header } from "../../components";
import * as styles from "../../theme/appStyle";
import { spacing } from "../../theme";
import Loader from "../../components/spinner/loader";
import { Feather } from "@expo/vector-icons";

interface State {
    showErrorPanel: boolean;
    loading: boolean;
    infoMessage: string;
}

export interface AccountSetupScreenProps extends React.Component {
    navigation: NativeStackNavigationProp<ParamListBase>
}

export const AccountSetupScreen: React.FunctionComponent<AccountSetupScreenProps> = props => {
    
    const [state, setState] = React.useState<State>({
        showErrorPanel: false,
        loading: false,
        infoMessage: ""
    });
    
    const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation]);
    
    return (
        <Screen style={styles.ROOT} preset="scroll" >
            <Loader loading={state.loading} />
            <Header headerTx="accountSetupScreen.header" style={styles.SCREENHEADER} leftIcon="back" onLeftPress={goBack} />
            {
                state.showErrorPanel && <View style={styles.ERROR_PANEL}>
                    <Feather name="info" style={styles.INFOICON} size={20} />
                    <Text style={styles.ERROR_PANEL_TEXT} >{state.infoMessage}</Text>
                </View>
            }
            <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[6] }]}>
            </View>
            <SafeAreaView style={styles.FOOTER}>
                <View style={styles.FOOTER_CONTENT}>
                </View>
            </SafeAreaView>
        </Screen>
    )
}
