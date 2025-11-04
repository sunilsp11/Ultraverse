import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import UvTypography from '../../components/common/uvTypography';
import UvButton from '../../components/common/uvButton';
import Colors from '../../theme/color';
import { RootStackParamList, MainTabParamList } from '../../types/navigationTypes';

type GameFeedbackThankYouScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'GameFeedbackThankYouScreen'
>;

const GameFeedbackThankYouScreen = () => {
  const navigation = useNavigation<GameFeedbackThankYouScreenNavigationProp>();

  const handleReturnToHome = () => {
    const mainTabsParams: NavigatorScreenParams<MainTabParamList> = {
      screen: 'HomeScreen',
    };
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'MainTabs',
          params: mainTabsParams,
        },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <UvTypography
            variant="h4"
            color={Colors.white}
            align="center"
          >
            THANKS FOR YOUR FEEDBACK!
          </UvTypography>
        </View>

        <View style={styles.messageContainer}>
          <UvTypography
            variant="p"
            color={Colors.white}
            align="center"
          >
            Your thoughts help us level up the Ultraverse experience.
          </UvTypography>
        </View>

        <View style={styles.buttonContainer}>
          <UvButton
            title="Return to Home"
            onPress={handleReturnToHome}
            variant="primary"
            style={styles.returnButton}
          />
        </View>
      </View>
    </View>
  );
};

export default GameFeedbackThankYouScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 25,
    alignItems: 'center',
    gap: 32,
  },
  titleContainer: {
    alignItems: 'center',
    gap: 8,
  },

  messageContainer: {
    marginTop: 16,
  },
  buttonContainer: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  returnButton: {
    marginTop: 0,
  },
});

