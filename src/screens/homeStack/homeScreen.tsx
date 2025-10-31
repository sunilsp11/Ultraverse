import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import UvScreenWrapper from '../../components/common/uvScreenWrapper'

const HomeScreen = () => {
  return (
    <UvScreenWrapper>
      <View style={styles.container}>
        <Text>HomeScreen</Text>
      </View>
    </UvScreenWrapper>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,    
        justifyContent: 'center',
        alignItems: 'center',
    }
})