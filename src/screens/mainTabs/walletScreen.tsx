import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import UvScreenWrapper from '../../components/common/uvScreenWrapper'
import UvTypography from '../../components/common/uvTypography'

const WalletScreen = () => {
  return (
    <UvScreenWrapper>
      <View style={styles.container}>
        <UvTypography variant="h6" >
          Coming Soon
        </UvTypography>
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
})


