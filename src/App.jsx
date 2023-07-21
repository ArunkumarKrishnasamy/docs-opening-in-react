import "./App.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useState } from "react";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import PizZip from "pizzip";
import { DOMParser } from "@xmldom/xmldom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

// import { read, utils, writeFile } from "xlsx";

function App() {
  const pdfref = useRef();
  const docs = [
    { uri: "../src/assets/test.pdf", fileType: "pdf", fileName: "test.pdf" },

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

  const [paragraphText, setParagraphText] = useState([]);
  const HandleWord = (event) => {
    const reader = new FileReader();
    let file = event.target.files[0];
    reader.onload = (e) => {
      const content = e.target.result;
      const paragraphs = getParagraphs(content);
      setParagraphText(paragraphs);
    };
    reader.onerror = (err) => {
      console.error(err);
    };
    reader.readAsBinaryString(file);
  };
  // Get paragraphs as javascript array
  const getParagraphs = (content) => {
    let zip = new PizZip(content);
    const xml = str2xml(zip.files["word/document.xml"].asText());
    const paragraphsXml = xml.getElementsByTagName("w:p");
    // const paragraphs = [];

    for (let i = 2; i < paragraphsXml.length; i++) {
      let fullText = "";
      const textsXml = paragraphsXml[i].getElementsByTagName("w:t");

      for (let j = 0; j < textsXml.length; j++) {
        const textXml = textsXml[j];
        if (textXml.childNodes) {
          fullText += textXml.childNodes[0].nodeValue;
        }
        if (fullText) {
          paragraphText.push(fullText);
          console.log(paragraphText);
        }
      }
    }
    return paragraphText;
  };

  const str2xml = (str) => {
    if (str.charCodeAt(0) === 65279) {
      // remove BOM
      // str = str.substr(1);
    }
    return new DOMParser().parseFromString(str, "text/xml");
  };
  const DownloaPdf = () => {
    const input = pdfref.current;
    html2canvas(input).then((canvas) => {
      const ImgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [210, 297],
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ImgWidth = canvas.width;
      const ImgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / ImgWidth, pdfHeight / ImgHeight);
      const ImgX = (pdfWidth - ImgWidth * ratio) / 2;
      const ImgY = 30;
      pdf.addImage(
        ImgData,
        "PNG",
        ImgX,
        ImgY,
        ImgWidth * ratio,
        ImgHeight * ratio
      );
      pdf.save("File.pdf");
    });
    try {
      html2canvas((input) => {
        const ImgData = canvas.toDataURL("img/png");
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="container content" ref={pdfref}>
        <h1>React Editor</h1>
        {/* <DocViewer pluginRenderers={DocViewerRenderers} documents={file1} /> */}
        <DocViewer
          documents={docs}
          pluginRenderers={DocViewerRenderers}
          style={{ height: 1000 }}
        />

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

        <div className="word">
          <input type="file" onChange={HandleWord} name="docx-reader" />
          <div className="d-flex justify-content-center">
            <p className="text-wrap m-3 p-2">{paragraphText}</p>
          </div>
        </div>
        <button className="btn btn-lg btn-primary" onClick={DownloaPdf}>
          {" "}
          Download
        </button>
      </div>
    </>
  );
}

export default App;
