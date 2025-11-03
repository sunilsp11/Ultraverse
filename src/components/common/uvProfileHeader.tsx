import React from "react";
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from "react-native";
import UvTypography from "./uvTypography";
import Colors from "../../theme/color";
import PenIcon from "../../assets/svg/penIcon.svg";

type UvProfileHeaderProps = {
  avatarSource: ImageSourcePropType;
  name: string;
  email: string;
  onEditPress?: () => void;
  editIcon?: React.ReactNode;
};

const UvProfileHeader: React.FC<UvProfileHeaderProps> = ({
  avatarSource,
  name,
  email,
  onEditPress,
  editIcon,
}) => {
  return (
    <View style={styles.root}>
      <View style={styles.avatarWrapper}>
        <Image
          source={avatarSource}
          style={styles.avatar}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.editBadge}
          activeOpacity={0.8}
          onPress={onEditPress}
        >
          {editIcon ?? <PenIcon width={14} height={14} color={Colors.black} />}
        </TouchableOpacity>
      </View>

      <View style={{ height: 24 }} />

      <UvTypography variant="h5" align="center" color={Colors.white} numberOfLines={1}>
        {name}
      </UvTypography>
      <View style={{ height: 8 }} />
      <UvTypography variant="body" align="center" color={Colors.base[300]}>
        {email}
      </UvTypography>
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


