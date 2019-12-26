import React from 'react';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  return (
/*     <Ionicons
      name={props.name}
      size={26}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    /> */
    (props.name == 'navicon')?
      <FontAwesome
      name={props.name}
      size={26}
      style={{ marginBottom: -3 }}
      color={Colors.topMenu}
      />
    :
      <FontAwesome
      name={props.name}
      size={26}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
  );
}
