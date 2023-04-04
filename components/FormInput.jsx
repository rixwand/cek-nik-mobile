import React, {useState} from "react";
import {Alert, StyleSheet, Text, TextInput, View} from "react-native";
import check from "../helper/check";
import MyButton from "./utils/MyButton";
import {useNetInfo} from "@react-native-community/netinfo";

const FormInput = ({children, setLength, setCount, setLoading}) => {
  const [nik, setNik] = useState();
  const [kk, setKk] = useState();
  const [notValid, setnotValid] = useState();

  const netInfo = useNetInfo();

  const submitHandler = async () => {
    if (!nik && !kk) return;
    if (nik.length < 16) return setnotValid("nik");
    if (kk.length < 16) return setnotValid("kk");
    if (!netInfo.isConnected)
      return Alert.alert("Error", "No internet connection");

    const data = [{nik, kk}];
    setLoading(true);
    const result = await check(data, setCount, setLength);
    Alert.alert(
      "Success",
      `nik : ${result.at(0).nik} \nkk: ${result.at(0).kk} \nket: ${
        result.at(0).ket
      }`,
    );
    setLoading(false);
  };
  return (
    <View>
      <Text style={style.title}>
        Mohon masukkan data yang anda gunakan saat mendaftarkan nomor indosat
      </Text>
      <View style={style.layout}>
        <TextInput
          keyboardType="numeric"
          value={nik}
          onChangeText={text => setNik(text.replace(/[^0-9]/g, ""))}
          style={style.input}
          placeholder={"Masukkan Nik"}
          placeholderTextColor={"#6A6A6A"}
          maxLength={16}
        />
        {notValid == "nik" && (
          <Text style={style.notValid}>*nik tidak valid</Text>
        )}
        <TextInput
          value={kk}
          keyboardType="numeric"
          onChangeText={text => setKk(text.replace(/[^0-9]/g, ""))}
          style={style.input}
          placeholder={"Masukkan KK"}
          maxLength={16}
          placeholderTextColor={"#6A6A6A"}
        />
        {notValid == "kk" && (
          <Text style={style.notValid}>*kk tidak valid</Text>
        )}
      </View>
      <MyButton title={"Cek"} bgColor={"#00D556"} onPress={submitHandler} />
    </View>
  );
};

const style = StyleSheet.create({
  input: {
    backgroundColor: "white",
    borderColor: "#E7E7E7",
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16,
    color: "#6A6A6A",
    paddingHorizontal: 15,
    marginTop: 5,
    height: 45,
  },
  layout: {
    display: "flex",
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontFamily: "SourceSansPro-Regular",
    paddingHorizontal: 10,
    fontSize: 18,
    lineHeight: 24,
    color: "gray",
    marginBottom: 5,
  },
  notValid: {
    color: "red",
    marginLeft: 10,
    fontFamily: "SourceSansPro-Regular",
    marginBottom: 2,
  },
});

export default FormInput;
