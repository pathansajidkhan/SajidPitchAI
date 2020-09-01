import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/native-stack";
import { Screen, Text, Header, TextField } from "../../components"
import * as styles from "../../theme/appStyle";
import { useState } from "react";
import * as EmailValidator from 'email-validator';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import Loader from "../../components/spinner/loader";
import { spacing } from "../../theme";

export interface RegisterEmailScreenProps extends React.Component {
    navigation: NativeStackNavigationProp<ParamListBase>
}

interface State {
    showErrorPanel: boolean;
    infoMessage: string;
    loading: boolean;
    userOrEmail: string;
}

export const RegisterEmailScreen: React.FunctionComponent<RegisterEmailScreenProps> = props => {
    const [state, setState] = useState<State>({
        showErrorPanel: false,
        infoMessage: "",
        loading: false,
        userOrEmail: ''
    });

    const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation]);
    const nextButtonClick = async () => {
        setState(s => ({ ...s, loading: true, showErrorPanel: false, infoMessage: "" }));
        if (!!(state.userOrEmail)) {
            state.userOrEmail = state.userOrEmail.trim();
            if (EmailValidator.validate(state.userOrEmail)) {
                setState(s => ({ ...s, loading: false, showErrorPanel: false, infoMessage: "" }));
                props.navigation.navigate("registerpassword", { userOrEmail: state.userOrEmail });
            } else {
                setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: "Invalid Email." }));
            }
        } else {
            setState(s => ({ ...s, loading: false, showErrorPanel: true, infoMessage: "Email is required." }));
        }
    };

    return (
        <Screen style={styles.ROOT} preset="scroll" >
            <Loader loading={state.loading} />
            <Header headerTx="registerScreen.header" style={styles.SCREENHEADER} leftIcon="back" onLeftPress={goBack} />
            {
                state.showErrorPanel && <View style={styles.ERROR_PANEL}>
                    <Feather name="info" style={styles.INFOICON} size={20} />
                    <Text style={styles.ERROR_PANEL_TEXT} >{state.infoMessage}</Text>
                </View>
            }
            <View style={[styles.MAIN_VIEW_CONTAINER, { marginTop: spacing[1] }]}>
                <TextField style={styles.TEXTBOX_CONTAINER} inputStyle={styles.TEXTBOXSTYLE} placeholderTx="registerScreen.emailPlaceHolder" autoCorrect={false} autoCapitalize="none"
                    onChangeText={text => setState(s => ({ ...s, userOrEmail: text }))} value={state.userOrEmail} />
                <TouchableOpacity style={[styles.LoginButton, styles.TOUCHABLE_OPACITY_STYLE]} onPress={nextButtonClick}>
                    <Text style={[styles.BLUEBUTTONTEXT, { marginRight: 10 }]} tx="registerEmailScreen.nextButtonText" />
                    <FontAwesome5 name="arrow-right" size={16} color="black" />
                </TouchableOpacity>
            </View>
        </Screen>
    )
}
