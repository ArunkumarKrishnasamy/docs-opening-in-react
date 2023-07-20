import "./App.css";
// import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useState } from "react";
import { OutTable, ExcelRenderer } from "react-excel-renderer";

// import { read, utils, writeFile } from "xlsx";

function App() {
  const docs = [
    // { uri: "../src/assets/test.pdf", fileType: "pdf", fileName: "test.pdf" },

    {
      uri: "../src/assets//xls.xls",
      fileType: "xls",
      fileName: "practice.xls",
    },
  ];
  const [header, setHeaders] = useState([]);
  const [Data, setData] = useState([]);
  const HandleChange = (e) => {
    const file = e.target.files[0];
    ExcelRenderer(file, (err, res) => {
      if (err) {
        console.log(err);
      }
      setHeaders(res.rows[0]);
      setData(res.rows);
    });

    // const reader = new FileReader();
    // reader.onload = (event) => {
    //   const data = event.target.result;
    //   const workbook = read(data, { type: "binary" });
    //   const sheetname = workbook.SheetNames[0];
    //   const worksheet = workbook.Sheets[sheetname];
    //   const excelData = utils.sheet_to_json(worksheet, { header: "1" });
    //   // console.log(excelData);
    //   setHeaders(Object.keys(excelData[0]));
    //   setData(Object.values(excelData));
    // };
    // reader.readAsBinaryString(file);
  };

  return (
    <>
      <div className="container content">
        <h1>React Editor</h1>
        {/* <DocViewer pluginRenderers={DocViewerRenderers} documents={file1} /> */}
        {/* <DocViewer
          documents={docs}
          pluginRenderers={DocViewerRenderers}
          style={{ height: 1000 }}
        /> */}

        <input type="file" onChange={HandleChange} />

        {Data.length > 0 && (
          <table>
            <thead>
              <tr>
                {header.map((cell, index) => {
                  return <th key={index}>{cell}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {Data.slice(1).map((row, rowIndex) => {
                return (
                  <tr key={rowIndex}>
                    {row.map((cell, cellindex) => {
                      return <td key={cellindex}>{cell}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default App;
