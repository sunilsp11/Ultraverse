import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import UvScreenWrapper from '../../components/common/uvScreenWrapper'

const ChatScreen = () => {
  return (
    <UvScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Chat</Text>
      </View>
    </UvScreenWrapper>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff'
  }
})


