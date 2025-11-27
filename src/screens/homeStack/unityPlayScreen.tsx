import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import { View, StatusBar, StyleSheet, Platform, BackHandler } from 'react-native'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Orientation from 'react-native-orientation-locker'
import UnityView from '@azesmway/react-native-unity'
import { NativeModules } from 'react-native'
import Colors from '../../theme/color'
import { RootStackParamList } from '../../types/navigationTypes'

const UnityModule = NativeModules.UnityModule

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

    return () => {
      // Close Unity when leaving screen
      try {
        UnityModule.stopUnity()
      } catch (error) {
        console.warn('Failed to unload Unity', error)
      }
      Orientation.lockToPortrait()
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

  // --- Lock orientation to landscape ---
  useEffect(() => {
    Orientation.lockToLandscape()
    return () => Orientation.lockToPortrait()
  }, [])

  // --- Handle back action for Android & iOS gesture ---
  const handleBack = useCallback(() => {
    try {
      UnityModule.stopUnity()
    } catch (error) {
      console.warn('Failed to unload Unity', error)
    }
    Orientation.lockToPortrait()
    navigation.goBack()
    return true
  }, [navigation])

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
