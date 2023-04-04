import React from "react";
import {TouchableOpacity, View, Text, StyleSheet} from "react-native";

const MyButton = ({title, onPress, bgColor = "#1773FF"}) => {
  return (
    <View>
      <TouchableOpacity
        style={{...style.button, backgroundColor: bgColor}}
        onPress={onPress}>
        <Text style={style.title}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 8,
    display: "flex",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 8,
  },
  title: {
    color: "white",
    fontFamily: "Viga-Regular",
    fontSize: 18,
  },
});

export default MyButton;
