import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE_ICON_COLOR = "#FFFFFF";
const INACTIVE_ICON_COLOR = "#8FA8B3";

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 12) },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const iconColor = isFocused ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR;
        const iconSize = isFocused ? 26 : 22;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name as never);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const icon =
          typeof options.tabBarIcon === "function"
            ? options.tabBarIcon({
                focused: isFocused,
                color: iconColor,
                size: iconSize,
              })
            : null;

        return (
          <View key={route.key} style={styles.tabItem}>
            <TouchableOpacity
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.touchable}
            >
              {isFocused && (
                <LinearGradient
                  colors={["#3FE0FF", "rgba(63, 224, 255, 0.0)"]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.activeGlow}
                  pointerEvents="none"
                />
              )}
              <View
                style={[styles.iconWrapper, isFocused && styles.iconWrapperFocused]}
              >
                {icon}
              </View>
              <Text style={[styles.label, isFocused && styles.labelFocused]}>
                {label}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#01060D",
    paddingTop: 10,
    paddingHorizontal: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  touchable: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  activeGlow: {
    ...StyleSheet.absoluteFillObject,
    top: -28,
    bottom: undefined,
    height: 86,
    borderRadius: 32,
    opacity: 0.9,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapperFocused: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: INACTIVE_ICON_COLOR,
  },
  labelFocused: {
    color: ACTIVE_ICON_COLOR,
    fontWeight: "600",
  },
});

