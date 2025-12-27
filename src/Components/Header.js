// header.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, parameters } from '../global/styles';
import { Icon } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function Header({ title, type }) {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <View>
        <Icon
          type="material-community"
          name={type}
          color={colors.headerText}
          size={28}
          onPress={() => {
            navigation.goBack();
          }}
        />
        {/* <AntDesign name='left' style={{ color: 'black', marginLeft: 5 }} /> */}
      </View>
      <Text style={styles.headerText}>{title}</Text>
      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    // flexDirection: "row",
    // backgroundColor: colors.buttons,
    // height: parameters.headerHeight,
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2948FF',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    color: colors.cardbackground,
    fontSize: 24,
    fontWeight: '700',
  },
});
