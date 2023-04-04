import React, {useState} from "react";
import {TouchableOpacity, View, Text, StyleSheet} from "react-native";

const Nav = ({onPress, title, isActive = false}) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <Text style={{...style.title, borderBottomWidth: isActive ? 1 : 0}}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  title: {
    fontFamily: "SourceSansPro-SemiBold",
    fontSize: 20,
    color: "gray",
    borderBottomColor: "gray",
  },
});

export default Nav;
