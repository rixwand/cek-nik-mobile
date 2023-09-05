import React, {useState} from "react";
import {Alert, StyleSheet, Text, TextInput, View} from "react-native";
import jsdom from "jsdom-jscore-rn";
import MyButton from "./utils/MyButton";
import {useNetInfo} from "@react-native-community/netinfo";

const FormInput = () => {
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
    try {
      const result = await cekNik(nik, kk);
      Alert.alert(
        "Success",
        `\
nik : ${result.nik} 
kk :  ${result.kk} 
ket :  ${result.ket}`,
      );
    } catch (e) {
      Alert.alert("Oops!!!, something error :(");
      console.log(e);
    }
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

const cekNik = (nik, kk) => {
  return new Promise(async (resolve, reject) => {
    const uri = new URL("https://myim3.indosatooredoo.com/ceknomor/checkForm");
    uri.searchParams.append("nik", nik);
    uri.searchParams.append("kk", kk);
    uri.searchParams.append("send", "PERIKSA");
    const response = await fetch(uri, {
      method: "get",
      headers: {
        // Cookie: "69C404B2C96EA3BB8583EFE8AF2713E7",
        Connection: "keep-alive",
      },
    });
    const result = await response.text();
    jsdom.env(result, (err, window) => {
      if (err) reject(err);
      const title = window.document.querySelector("title").textContent;
      let ket;
      if (title == "Registration") {
        ket = window.document.querySelectorAll("ul li").length;
      } else {
        ket = 0;
      }
      resolve({nik, kk, ket});
    });
  });
};
