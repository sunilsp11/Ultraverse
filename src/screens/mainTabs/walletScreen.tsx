import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import UvScreenWrapper from '../../components/common/uvScreenWrapper'

const WalletScreen = () => {
  return (
    <UvScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Wallet</Text>
      </View>
    </UvScreenWrapper>
  )
}

export default WalletScreen

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


