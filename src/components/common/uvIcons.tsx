import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Zocial from 'react-native-vector-icons/Zocial';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ViewStyle} from 'react-native';

type IconType =
  | 'Fontisto'
  | 'MaterialIcons'
  | 'EvilIcons'
  | 'Feather'
  | 'AntDesign'
  | 'Zocial'
  | 'SimpleLineIcon'
  | 'Foundation'
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'Entypo'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'Octicons';

type IconProps = {
  type: IconType;
  name: String;
  size?: Number;
  color?: String;
  style?: ViewStyle;
  onPress?: () => void;
};

const getIcon = (type: IconType) => {
  switch (type) {
    case 'Fontisto':
      return Fontisto;
    case 'MaterialIcons':
      return MaterialIcons;
    case 'EvilIcons':
      return EvilIcons;
    case 'Feather':
      return Feather;
    case 'AntDesign':
      return AntDesign;
    case 'Zocial':
      return Zocial;
    case 'SimpleLineIcon':
      return SimpleLineIcon;
    case 'Foundation':
      return Foundation;
    case 'Ionicons':
      return Ionicons;
    case 'MaterialCommunityIcons':
      return MaterialCommunityIcons;
    case 'Entypo':
      return Entypo;
    case 'FontAwesome':
      return FontAwesome;
    case 'FontAwesome5':
      return FontAwesome5;
    case 'Octicons':
      return Octicons;
    default:
      return FontAwesome;
  }
};

export const Icons: React.FC<IconProps> = ({type, ...props}) => {
  const FontIcon: React.ComponentType<any> = getIcon(type);

  return <FontIcon {...props} />;
};
