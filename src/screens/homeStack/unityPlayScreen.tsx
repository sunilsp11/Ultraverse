import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native'
import Orientation from 'react-native-orientation-locker'
import UnityView from '@azesmway/react-native-unity'
import Colors from '../../theme/color'
import { RootStackParamList } from '../../types/navigationTypes'

type UnityPlayScreenRouteProp = RouteProp<RootStackParamList, 'UnityPlayScreen'>
type UnityPlayScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'UnityPlayScreen'
>

const UnityPlayScreen = () => {
  const route = useRoute<UnityPlayScreenRouteProp>()
  const navigation = useNavigation<UnityPlayScreenNavigationProp>()
  const unityRef = useRef<any>(null)

  const resolvedPayload = useMemo(() => {
    const payload = route.params?.unityPayload
    if (!payload) {
      return null
    }

    if (typeof payload === 'string') {
      return payload
    }

    try {
      return JSON.stringify(payload)
    } catch (error) {
      console.warn('Failed to stringify Unity payload', error)
      return null
    }
  }, [route.params?.unityPayload])

  const delay = useCallback(
    (ms: number) =>
      new Promise(resolve => {
        const timeout = setTimeout(() => {
          clearTimeout(timeout)
          resolve(undefined)
        }, ms)
      }),
    [],
  )

  const sendDataToUnity = useCallback(
    async (payload: string) => {
      await delay(500)
      unityRef.current?.postMessage?.('ReactToUnity', 'GetDatas', payload)
    },
    [delay],
  )

  useEffect(() => {
    if (resolvedPayload) {
      sendDataToUnity(resolvedPayload)
    }
  }, [resolvedPayload, sendDataToUnity])


  useFocusEffect(
    useCallback(() => {
      Orientation.lockToLandscape()
      return () => {
        Orientation.lockToPortrait()
      }
    }, [])
  )

  useEffect(
    () => () => {
      if (unityRef.current?.unloadUnity) {
        try {
          unityRef.current.unloadUnity()
        } catch (error) {
          console.warn('Failed to unload Unity', error)
        }
      }
      Orientation.lockToPortrait()
    },
    [],
  )

  const handleBackPress = useCallback(() => {
    Orientation.lockToPortrait()
    navigation.goBack()
    return true
  }, [navigation])
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress)
    return () => backHandler.remove()
  }, [handleBackPress])

  return (
    <>
      <StatusBar hidden />
      <View style={styles.fullScreenContainer}>
        <UnityView
          ref={unityRef}
          style={styles.unityView}
          onUnityMessage={(event: any) => {
            const message = event?.nativeEvent?.message
            if (message) {
              console.log('Message from Unity:', message)
            }
          }}
        />
      </View>
    </>
  )
}

export default UnityPlayScreen

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: Colors.base[950],
  },
  unityView: {
    flex: 1,
  },
})

