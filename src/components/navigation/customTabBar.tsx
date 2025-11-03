import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ButtomTabfludLigtingIcon from '../../assets/svg/buttomTabfludLigting.svg';
import GameIcon from '../../assets/svg/gameIcon.svg';
import HomeIcon from '../../assets/svg/home.svg';
import ProfileIcon from '../../assets/svg/profile.svg';
import SearchIcon from '../../assets/svg/search.svg';

const CustomTabBar = (props: BottomTabBarProps) => {
  const { state, descriptors, navigation } = props;
  const insets = useSafeAreaInsets();

  const getIcon = (routeName: string, focused: boolean) => {
    const iconSize = 20;
    const iconColor = focused ? '#FFFFFF' : '#A8B0B8';

    switch (routeName) {
      case 'HomeStack':
        return <HomeIcon width={iconSize} height={iconSize} color={iconColor} />;
      case 'SearchScreen':
        return <SearchIcon width={iconSize} height={iconSize} color={iconColor} />;
      case 'GamesScreen':
        return <GameIcon width={iconSize} height={iconSize} color={iconColor} />;
      case 'ProfileScreen':
        return <ProfileIcon width={iconSize} height={iconSize} color={iconColor} />;
      default:
        return null;
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case 'HomeStack':
        return 'Home';
      case 'SearchScreen':
        return 'Search';
      case 'GamesScreen':
        return 'Games';
      case 'ProfileScreen':
        return 'Profile';
      default:
        return '';
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const label = getLabel(route.name);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            {isFocused && (
              <View style={styles.activeIndicatorContainer}>
                <View style={styles.whiteLine} />
                <View style={styles.glowContainer}> 
                <ButtomTabfludLigtingIcon width={100} />
                </View>
              </View>
            )}
            <View style={styles.iconContainer}>
              {getIcon(route.name, isFocused)}
            </View>
            <Text style={[styles.label, isFocused && styles.labelFocused]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0A0A0A',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  activeIndicatorContainer: {
    position: 'absolute',
    top: -8,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  whiteLine: {
    width: 40,
    height: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  iconContainer: {
    marginBottom: 4,
    zIndex: 2,
  },
  label: {
    fontSize: 12,
    color: '#A8B0B8',
    fontWeight: '500',
    zIndex: 2,
  },
  labelFocused: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  glowContainer: {
    position: 'absolute',
    top: -4,
    zIndex: 1,
    marginLeft: 7,
  },
});