import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
const screen = Dimensions.get("window");

const Loading = ({length, count}) => {
  return (
    <View style={style.container}>
      <View style={style.floatW}>
        <ActivityIndicator size={"large"} />
        <Text style={{color: "gray", marginLeft: 20}}>
          Mengecek {count} / {length} data
        </Text>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    zIndex: 10,
    minHeight: screen.height,
  },
  floatW: {
    elevation: 10,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    width: 300,
    height: 80,
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
  },
});

export default Loading;
