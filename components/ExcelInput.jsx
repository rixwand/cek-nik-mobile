import React, {useEffect, useState} from "react";
import Clipboard from "@react-native-clipboard/clipboard";
import {pickSingle, types} from "react-native-document-picker";
import XLSX from "xlsx";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../svgs/upload.svg";
import Xls from "../svgs/xls.svg";
import Copy from "../svgs/copy.svg";
import Close from "../svgs/close.svg";
import MyButton from "./utils/MyButton";
import RNFS from "react-native-fs";
import check from "../helper/check";
import formatBytes from "../helper/formatBytes";
import {
  Table,
  Row,
  Rows,
  TableWrapper,
  Cell,
} from "react-native-table-component";
import {useNetInfo} from "@react-native-community/netinfo";

const ExcelInput = () => {
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [files, setFiles] = useState();
  const [nik, setNik] = useState([]);
  const [tableHead, setTableHead] = useState(["nik", "kk", "ket"]);
  const [tableRow, setTableRow] = useState([]);
  const netInfo = useNetInfo();
  const elementButton = (value, rowData) => (
    <TouchableOpacity onPress={() => copy(rowData)}>
      <View style={{flexDirection: "row", justifyContent: "center"}}>
        <Text
          style={{
            justifyContent: "center",
            marginRight: 2,
            color: rowData[2] >= 3 ? "white" : "gray",
          }}>
          {value}
        </Text>
        <View style={{justifyContent: "center"}}>
          {rowData[2] >= 3 ? (
            <Copy width={15} height={15} stroke={"white"} fill={"white"} />
          ) : (
            <Copy width={15} height={15} stroke={"blue"} fill={"blue"} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  const buttonWrapper = (value, rowData) => (
    <TouchableOpacity onPress={() => copy(value)}>
      <View style={{flexDirection: "row", justifyContent: "center"}}>
        <Text
          style={{
            justifyContent: "center",
            marginRight: 2,
            color: rowData[2] >= 3 ? "white" : "gray",
          }}>
          {value}
        </Text>
        <View style={{justifyContent: "center"}}>
          {rowData[2] >= 3 ? (
            <Copy width={15} height={15} stroke={"white"} fill={"white"} />
          ) : (
            <Copy width={15} height={15} stroke={"blue"} fill={"blue"} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
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
      setTotal(json.length);
      await check(json, setCount, setNik);
    } catch (err) {
      console.log("ceknik error", err);
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
        `${RNFS.ExternalStorageDirectoryPath}/Documents/cek-nik/${title} ${files.name}`,
        bstr,
        "ascii",
      );
      Alert.alert(
        `Berhasil menyimpan File`,
        `Folder : Documents/cek-nik \nFile : ${title} ${files.name}`,
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

  function copy(data) {
    Array.isArray(data)
      ? Clipboard.setString(`${data[0]}#${data[1]}#`)
      : Clipboard.setString(data);
  }

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
      {nik.length > 0 && (
        <View style={style.result}>
          <MyButton
            title={"Back"}
            onPress={() => {
              check(
                [],
                () => {},
                () => {},
              );
              setNik([]);
              setTableRow([]);
            }}
          />
          <TouchableOpacity onPress={saveExcel}>
            {count == total && (
              <Text style={{textAlign: "center", color: "#1773FF"}}>
                Save as Excel
              </Text>
            )}
            <Text style={{color: "gray", textAlign: "center"}}>
              {count}/{total}
            </Text>
          </TouchableOpacity>
          {/* c8e1ff */}
          <Table borderStyle={{borderWidth: 2, borderColor: "#c8e1ff"}}>
            <Row data={tableHead} textStyle={style.text} flexArr={[5, 5, 1]} />
            {/* <Rows data={tableRow} textStyle={style.text} flexArr={[5, 5, 1]} /> */}
            {tableRow.map((rowData, index) => (
              <TableWrapper
                key={index}
                style={{
                  flexDirection: "row",
                  backgroundColor: rowData[2] >= 3 ? "red" : "transparent",
                }}>
                {rowData.map((cellData, cellIndex) => (
                  <Cell
                    key={cellIndex}
                    data={
                      cellIndex === 2
                        ? elementButton(cellData, rowData)
                        : buttonWrapper(cellData, rowData)
                    }
                    textStyle={{color: rowData[2] >= 3 ? "white" : "gray"}}
                    flex={cellIndex == 2 ? 1 : 5}
                  />
                ))}
              </TableWrapper>
            ))}
          </Table>
          <View style={{height: 20}}></View>
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
