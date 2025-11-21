import React from 'react'
import { StyleSheet, View } from 'react-native'
import UvScreenWrapper from '../../components/common/uvScreenWrapper'
import UvTypography from '../../components/common/uvTypography'

const TechaidsScreen = () => {
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

export default TechaidsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})


