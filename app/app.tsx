// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import "./i18n"
import React, { useState, useEffect, useRef } from "react"
import { YellowBox } from "react-native"
import { NavigationContainerRef, ParamListBase } from "@react-navigation/native"
import { initFonts } from "./theme/fonts"
import { contains } from "ramda"
import { enableScreens } from "react-native-screens"
import { SafeAreaProvider, initialWindowSafeAreaInsets } from "react-native-safe-area-context"
import { RootNavigator, exitRoutes, setRootNavigation } from "./navigation"
import { useBackButtonHandler } from "./navigation/use-back-button-handler"
import { RootStore, RootStoreProvider, setupRootStore } from "./models/root-store"
import * as storage from "./utils/storage"
import getActiveRouteName from "./navigation/get-active-routename"
import * as SplashScreen from 'expo-splash-screen';
import NetworkValidator from "./middleware/network-validator"
import SessionService from "./middleware/services/session-service"
import DatabaseSync from "./middleware/db/db-sync"
import { UserSessionModel, CurrentLoginInfoModel } from "./models/data/session-model"
import UserDBService from "./middleware/database_services/user-db-service"
import * as AsyncStorage from "./utils/storage/storage"
import { NativeStackNavigationProp } from "react-native-screens/native-stack"

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
enableScreens()

/**
 * Ignore some yellowbox warnings. Some of these are for deprecated functions
 * that we haven't gotten around to replacing yet.
 */
YellowBox.ignoreWarnings([
  "componentWillMount is deprecated",
  "componentWillReceiveProps is deprecated",
  "Require cycle:",
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.",
])

export interface AppProps {
  navigation: NativeStackNavigationProp<ParamListBase>
}

/**
 * Are we allowed to exit the app?  This is called when the back button
 * is pressed on android.
 *
 * @param routeName The currently active route name.
 */
const canExit = (routeName: string) => contains(routeName, exitRoutes)

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

/**
 * This is the root component of our app.
 */
const App: React.FunctionComponent<AppProps> = () => {
  const navigationRef = useRef<NavigationContainerRef>()
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  const [initialNavigationState] = useState()
  const [isRestoringNavigationState, setIsRestoringNavigationState] = useState(true)

  useEffect(() => {
    const loadResourcesAndDataAsync = async () => {
      try {
        await SplashScreen.preventAutoHideAsync().then(() => {
          const networkValidator = new NetworkValidator();

          networkValidator.CheckConnectivity().then(async isNetworkConnected => {
            const token = await AsyncStorage.loadString("token");
            if (isNetworkConnected && !!token) {
              const sessionService = new SessionService();
              await sessionService.getCurrentLoginInformation().then(async currentSessionResult => {
                if (currentSessionResult.failureResponse != null) {
                  console.log("Session Response: " + currentSessionResult.failureResponse.message);
                } else if (currentSessionResult.kind == "ok") {
                  if (!(await validateToken(token))) {
                    new DatabaseSync();
                  }
                  await SplashScreen.hideAsync().then(() => { console.log("App Started") });
                }
              })
              
            } else {
              await validateToken(token);
              await SplashScreen.hideAsync().then(() => { console.log("App Started") });
            }
          });

          const validateToken = async (token: string): Promise<boolean> => {
            let isTokenExpired: boolean = true;
            if (token != null) {
              let expiryTime = await AsyncStorage.loadString("expiryTimeStamp");
              if (expiryTime != null) {
                const currentTime = new Date().getTime()
                if (currentTime > parseInt(expiryTime)) {
                  console.log("Token Expired")
                  isTokenExpired = true;
                } else {
                  var session = (await AsyncStorage.load('UserDetails')) as CurrentLoginInfoModel;
                  let user: UserSessionModel = session.user;
                  if (user && user.id) {
                    const userDBService = new UserDBService();
                    await userDBService.getUserById(user.id).then(async userDetails => {
                      navigationRef.current?.navigate("dashboard", { user: userDetails, session: session });
                    });
                  }
                  isTokenExpired = false;
                }
              }
            }
            return isTokenExpired;
          }
        });
      } catch (e) {
        console.warn(e);
      }
    }
    
    loadResourcesAndDataAsync();
  }, [])

  setRootNavigation(navigationRef)
  useBackButtonHandler(navigationRef, canExit)

  /**
   * Keep track of state changes
   * Track Screens
   * Persist State
   */
  const routeNameRef = useRef()
  const onNavigationStateChange = state => {
    const previousRouteName = routeNameRef.current
    const currentRouteName = getActiveRouteName(state)

    if (previousRouteName !== currentRouteName) {
      // track screens.
      __DEV__ && console.tron.log(currentRouteName)
    }

    // Save the current route name for later comparision
    routeNameRef.current = currentRouteName

    // Persist state to storage
    storage.save(NAVIGATION_PERSISTENCE_KEY, state)
  }

  useEffect(() => {
    (async () => {
      await initFonts()
      setupRootStore().then(setRootStore)
    })()
  }, [])

  useEffect(() => {
    const restoreState = async () => {
      try {
        // if (state) {
        //   setInitialNavigationState(state)
        // }
      } finally {
        setIsRestoringNavigationState(false)
      }
    }

    if (isRestoringNavigationState) {
      restoreState()
    }
  }, [isRestoringNavigationState])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  //
  // This step should be completely covered over by the splash screen though.
  //
  // You're welcome to swap in your own component to render if your boot up
  // sequence is too slow though.
  if (!rootStore) {
    return null
  }

  // otherwise, we're ready to render the app
  return (
    <RootStoreProvider value={rootStore}>
      <SafeAreaProvider initialSafeAreaInsets={initialWindowSafeAreaInsets}>
        <RootNavigator
          ref={navigationRef}
          initialState={initialNavigationState}
          onStateChange={onNavigationStateChange}
        />
      </SafeAreaProvider>
    </RootStoreProvider>
  )
}

export default App