import React, {useEffect, useState} from "react";
import {pickSingle, types} from "react-native-document-picker";
import XLSX from "xlsx";
import {
  Alert,
  PermissionsAndroid,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../svgs/upload.svg";
import Xls from "../svgs/xls.svg";
import Close from "../svgs/close.svg";
import MyButton from "./utils/MyButton";
import RNFS from "react-native-fs";
import check from "../helper/check";
import formatBytes from "../helper/formatBytes";
import {Table, Row, Rows} from "react-native-table-component";
import {useNetInfo} from "@react-native-community/netinfo";

const ExcelInput = ({setLength, setCount, setLoading}) => {
  const [files, setFiles] = useState();
  const [nik, setNik] = useState([]);
  const [tableHead, setTableHead] = useState(["nik", "kk", "ket"]);
  const [tableRow, setTableRow] = useState([]);
  const netInfo = useNetInfo();

  useEffect(() => {
    if (nik.length != 0) {
      const row = nik.map(({nik: NIK, kk, ket}) => [NIK, kk, ket]);
      setTableRow(row);
    }
  }, [nik]);

  const cekNik = async () => {
    if (!files) return;
    if (!netInfo.isConnected)
      return Alert.alert("Error", "No internet connection");

    try {
      const bstr = await RNFS.readFile(files.fileCopyUri, "ascii");
      const wb = XLSX.read(bstr, {type: "binary"});
      const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      setLoading(true);
      const res = await check(json, setCount, setLength);
      setLoading(false);
      setNik(res);
    } catch (err) {
      console.log(err);
    }
  };
  const saveExcel = async () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(nik);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "sheet1");
      const bstr = XLSX.write(workbook, {type: "binary", bookType: "xlsx"});
      await RNFS.mkdir(
        `${RNFS.ExternalStorageDirectoryPath}/Documents/cek-nik`,
      );
      const title = new Date()
        .toLocaleString()
        .split("/")
        .join(".")
        .split(":")
        .join(".");
      await RNFS.writeFile(
        `${RNFS.ExternalStorageDirectoryPath}/Documents/cek-nik/checked ${title}.xlsx`,
        bstr,
        "ascii",
      );
      console.log(RNFS.ExternalStorageDirectoryPath);
      Alert.alert(
        `Berhasil menyimpan File`,
        `Folder : Documents/cek-nik \nFile : checked ${title}.xlsx`,
      );
    } catch (error) {
      Alert.alert("Gagal Menyimpan", error);
      console.log(error);
    }
  };
  const pickFile = async () => {
    try {
      const f = await pickSingle({
        allowMultiSelection: false,
        copyTo: "cachesDirectory",
        mode: "open",
        type: [types.xlsx, types.xls],
      });
      setFiles(f);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View>
      {nik.length == 0 && (
        <View>
          <Text style={style.title}>
            Silahkan Upload File Excel Berisikan data yang digunakan saat
            registrasi
          </Text>

          {files ? (
            <View style={style.file}>
              <Xls width={40} height={40} fill={"#Afb0b0"} />
              <View>
                <Text style={{...style.ft, fontSize: 18}}>
                  {files.name.length > 12
                    ? files.name.substring(0, 10) + "..."
                    : files.name}
                </Text>
                <Text style={{...style.ft, marginTop: 2}}>
                  {formatBytes(files.size)}
                </Text>
              </View>
              <TouchableOpacity
                style={style.btn}
                onPress={() => {
                  setFiles();
                }}>
                <Close width={35} height={35} fill={"#Afb0b0"} />
              </TouchableOpacity>
            </View>
          ) : (
            <SafeAreaView>
              <TouchableOpacity style={style.box} onPress={pickFile}>
                <Logo width={70} height={70} fill={"#Afb0b0"} />
              </TouchableOpacity>
            </SafeAreaView>
          )}
          <View style={{marginHorizontal: 25}}>
            <MyButton title={"Periksa"} bgColor={"#00D556"} onPress={cekNik} />
          </View>
        </View>
      )}
      {tableRow.length > 0 && (
        <View style={style.result}>
          <TouchableOpacity onPress={saveExcel}>
            <Text
              style={{color: "gray", textAlign: "center", color: "#1773FF"}}>
              Save as Excel
            </Text>
          </TouchableOpacity>
          <Table borderStyle={{borderWidth: 2, borderColor: "#c8e1ff"}}>
            <Row data={tableHead} textStyle={style.text} flexArr={[5, 5, 1]} />
            <Rows data={tableRow} textStyle={style.text} flexArr={[5, 5, 1]} />
          </Table>
          <MyButton
            title={"Back"}
            onPress={() => {
              setNik([]);
              setTableRow([]);
            }}
          />
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  title: {
    textAlign: "center",
    fontFamily: "SourceSansPro-Regular",
    paddingHorizontal: 10,
    fontSize: 18,
    lineHeight: 24,
    color: "gray",
    marginBottom: 8,
  },
  box: {
    borderWidth: 2,
    borderColor: "#Afb0b0",
    borderStyle: "dashed",
    marginHorizontal: 40,
    height: 200,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 20,
  },
  resultContainer: {
    paddingBottom: 30,
  },
  result: {
    marginTop: -15,
    display: "flex",
    gap: 10,
    flex: 1,
    marginBottom: 40,
    color: "gray",
    minWidth: "93%",
  },
  file: {
    marginHorizontal: 40,
    backgroundColor: "rgb(243, 244, 246)",
    display: "flex",
    padding: 10,
    elevation: 2,
    borderRadius: 6,
    flexDirection: "row",
    marginBottom: 10,
  },
  ft: {
    fontFamily: "SourceSansPro-Regular",
    marginLeft: 10,
    color: "gray",
  },
  btn: {
    position: "absolute",
    top: 13,
    right: 5,
  },
  text: {
    margin: 2,
    color: "gray",
  },
});

export default ExcelInput;
