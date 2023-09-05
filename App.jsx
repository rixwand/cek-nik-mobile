import React, {useState} from "react";
import {Dimensions, ScrollView, StyleSheet, Text, View} from "react-native";
import Nav from "./components/utils/Nav";
import FormInput from "./components/FormInput";
import ExcelInput from "./components/ExcelInput";

const screen = Dimensions.get("screen");

const App = () => {
  const [active, setActive] = useState("Form");
  const excel = () => {
    active == "Form" && setActive("Excel");
  };
  const form = () => {
    active == "Excel" && setActive("Form");
  };
  return (
    <View>
      <ScrollView
        style={{backgroundColor: "rgb(243, 244, 246)", height: screen.height}}>
        <View
          style={{
            backgroundColor: "rgb(241, 202, 0)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 30,
          }}>
          <Text
            style={{
              fontFamily: "Viga-Regular",
              fontSize: 24,
              color: "black",
            }}>
            Pengecekan MSISDN
          </Text>
          <Text
            style={{
              fontFamily: "Viga-Regular",
              fontSize: 24,
              color: "black",
            }}>
            Berdasarkan NIK&KK
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            paddingVertical: 30,
          }}>
          <Text
            style={{
              fontFamily: "Nordique-Pro-Bold",
              fontSize: 40,
              color: "black",
            }}>
            indosat
          </Text>
        </View>
        <View style={style.layout}>
          <View style={style.nav}>
            <Nav
              title={"Form"}
              isActive={active == "Form" && true}
              onPress={form}
            />
            <Nav
              title={"Excel"}
              isActive={active == "Excel" && true}
              onPress={excel}
            />
          </View>
          <View style={style.input}>
            {active == "Form" ? <FormInput /> : <ExcelInput />}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  layout: {
    paddingBottom: 30,
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 20,
    overflow: "hidden",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowColor: "gray",
  },
  nav: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 30,
  },
  input: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
  },
});

export default App;
