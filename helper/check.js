import jsdom from "jsdom-jscore-rn";
let cancel;
const check = (data = [], setCount = () => {}, setNik = () => {}) =>
  new Promise(async (resolve, reject) => {
    if (cancel) cancel();
    let cancelMe = false;
    cancel = () => {
      cancelMe = true;
    };
    try {
      let dump = [];
      for (let i = 0; i < data.length; i++) {
        const uri = new URL(
          "https://myim3.indosatooredoo.com/ceknomor/checkForm",
        );
        if (cancelMe) {
          setNik([]);
          break;
        }
        setCount(i + 1);
        const [niks, kk] = Object.keys(data[i]);
        if (!(/^\d{16}$/.test(data[i][niks]) && /^\d{16}$/.test(data[i][kk]))) {
          continue;
        }
        uri.searchParams.append("nik", data[i][niks]);
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
          setNik(nik => [
            ...nik,
            {
              nik: data[i][niks],
              kk: data[i][kk],
              ket,
            },
          ]);
        });
      }
      resolve(dump);
    } catch (err) {
      reject(err);
    }
  });

export default check;
