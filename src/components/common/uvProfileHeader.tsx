import React from "react";
import { Image, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet, TouchableOpacity, View } from "react-native";
import UvTypography from "./uvTypography";
import Colors from "../../theme/color";
import PenIcon from "../../assets/svg/penIcon.svg";

type UvProfileHeaderProps = {
  avatarSource: ImageSourcePropType;
  name: string;
  email: string;
  onEditPress?: () => void;
  editIcon?: React.ReactNode;
  avatarStyle?: StyleProp<ImageStyle>;
};

const UvProfileHeader: React.FC<UvProfileHeaderProps> = ({
  avatarSource,
  name,
  email,
  onEditPress,
  editIcon,
  avatarStyle,
}) => {
  return (
    <View style={styles.root}>
      <View style={styles.avatarWrapper}>
        <Image
          source={avatarSource}
          style={[styles.avatar,avatarStyle]}
          resizeMode="cover"
        />
        {editIcon && (
          <TouchableOpacity
          style={styles.editBadge}
          activeOpacity={0.8}
          onPress={onEditPress}
        >
          <PenIcon width={14} height={14} color={Colors.black} />
        </TouchableOpacity>
        )}
      </View>

      <View style={{ height: 24 }} />
      {name && (
        <UvTypography variant="h5" align="center" color={Colors.white} numberOfLines={1}>
          {name}
        </UvTypography>
      )}
      {email && (
        <>
          <View style={{ height: 8 }} />
          <UvTypography variant="body" align="center" color={Colors.base[300]}>
            {email}
          </UvTypography>
        </>
      )}
    </View>
  );
};

export default UvProfileHeader;

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    overflow: "hidden",
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  editBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});


