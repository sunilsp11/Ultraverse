import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import { View, StatusBar, StyleSheet, Platform, BackHandler } from 'react-native'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { NativeModules } from 'react-native'
import Colors from '../../theme/color'
import { RootStackParamList } from '../../types/navigationTypes'
import UnityView from '@azesmway/react-native-unity';
import Orientation from 'react-native-orientation-locker'


// const UnityModule = NativeModules.UnityModule
const UnityModule = NativeModules.UnityNativeModule

type UnityPlayScreenRouteProp = RouteProp<RootStackParamList, 'UnityPlayScreen'>
type UnityPlayScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UnityPlayScreen'>

const UnityPlayScreen = () => {
  const route = useRoute<UnityPlayScreenRouteProp>()
  const navigation = useNavigation<UnityPlayScreenNavigationProp>()
  const unityRef = useRef<any>(null)

  const resolvedPayload = useMemo(() => {
    const payload = route.params?.unityPayload
    if (!payload) return null
    if (typeof payload === 'string') return payload
    try {
      return JSON.stringify(payload)
    } catch (error) {
      console.warn('Failed to stringify Unity payload', error)
      return null
    }
  }, [route.params?.unityPayload])

  // --- Start Unity for iOS ---
  useEffect(() => {
    if (Platform.OS === 'ios') {
      UnityModule.startUnity()
    }    
  }, [])

  // --- Send payload to Unity ---
  useEffect(() => {
    if (!resolvedPayload) return
    const timeout = setTimeout(() => {
      unityRef.current?.postMessage?.('ReactToUnity', 'GetDatas', resolvedPayload)
    }, 500)
    return () => clearTimeout(timeout)
  }, [resolvedPayload])

  // --- Handle back action for Android & iOS gesture ---
  const handleBack = useCallback(() => {
    try {
      console.log("Closing Unity...");
      navigation.goBack();
      setTimeout(() => {
        Orientation.lockToPortrait(); 
      }, 2000);
    } catch (error) {
      console.warn('Failed to unload Unity', error)
    }
    return true;
  }, [navigation]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack)
      return () => backHandler.remove()
    }
    // For iOS swipe back gestures, we can use navigation listener
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault() // prevent default
      handleBack()
    })
    return unsubscribe
  }, [handleBack, navigation])

  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        {Platform.OS ===  "android" ? (
          <UnityView
            ref={unityRef}
            style={styles.unityView}
            onUnityMessage={(event: any) => {
              const message = event?.nativeEvent?.message
              if (message) console.log('Message from Unity:', message)
            }}
            unloadOnUnmount={true}
            unloadPlayer={true}
          />
        ) : ""}
      </View>
    </>
  )
}

export default UnityPlayScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base[950],
  },
  unityView: {
    flex: 1,
  },
})
