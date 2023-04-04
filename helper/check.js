import jsdom from "jsdom-jscore-rn";
const check = (data = [], setCount = () => {}, setLength = () => {}) =>
  new Promise(async (resolve, reject) => {
    try {
      let dump = [];
      setLength(data.length);
      for (let i = 0; i < data.length; i++) {
        const uri = new URL(
          "https://myim3.indosatooredoo.com/ceknomor/checkForm",
        );
        setCount(i + 1);
        const [nik, kk] = Object.keys(data[i]);
        uri.searchParams.append("nik", data[i][nik]);
        uri.searchParams.append("kk", data[i][kk]);
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
          dump.push({
            nik: data[i][nik],
            kk: data[i][kk],
            ket,
          });
        });
      }
      resolve(dump);
    } catch (err) {
      reject(err);
    }
  });

export default check;
