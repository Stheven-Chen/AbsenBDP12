import React, { useState, useEffect } from "react";
import { Navbar, Container} from "react-bootstrap";
import {LoadingComponent} from '../component/ui'
import saveAs from "file-saver";
import {format, parse} from "date-fns" ;
import ExcelJS from 'exceljs';



const Admin: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const API_KEY = "$2b$10$Bynx9Y7mccbSvQ/Ipgsds.8PJSe.zROtgDguCsws.UhfoQVXPqoae";
  const [mergedData] = useState<{ [key: string]: any }>({});
  
    useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();

  const fetchData = async () => {
    try {
      const binIds = [
        "645cb66e9d312622a35c121c",
        "645cb64a8e4aa6225e9adcaa",
        "645cb6148e4aa6225e9adc82",
        "645cb5dc8e4aa6225e9adc4b",
        "645cb5b19d312622a35c1192",
        "645cb57f8e4aa6225e9adc06",
        "645cb3739d312622a35c1033",
        "645cacd59d312622a35c0cf6"
      ];
  
  
      for (const binId of binIds) {
        const response = await fetch(
          `https://api.jsonbin.io/v3/b/${binId}/latest?meta=false`,
          {
            headers: {
              "X-Master-Key": API_KEY
            }
          }
        );
  
        if (response.ok) {
          const jsonData = await response.json();
          const binData = {
            id: jsonData.ID,
            name: jsonData.name,
            absen: jsonData.absen
          };
          mergedData[jsonData.ID] = binData; // Gunakan ID sebagai kunci dalam objek mergedData
          console.log(`Bin ${binId} berhasil diambil`);
        } else {
          throw new Error(`Gagal mengambil file JSON dari JSONBin (${binId})`);
        }
      }
  
      console.log(JSON.stringify(mergedData,null,2));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const testFetch = async () =>{
  //   fetch('/test.json')
  //   .then(res=>res.json())
  //   .then(data=>{
  //     console.log(data)
  //     setMergedData(data);
  //     console.log(`ini data dari merged ${JSON.stringify(mergedData, null, 2)}`)
    
  //   })
  // }
  

const generateExcelFile = async () => {
  const template = `${process.env.PUBLIC_URL}/template.xlsx`;

  try {
    const response = await fetch(template);
    const templateData = await response.arrayBuffer();
    const templateWorkbook = new ExcelJS.Workbook();
    await templateWorkbook.xlsx.load(templateData);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    const startingRow = 8; // Baris awal untuk menulis data
    let rowIndex = startingRow;

     

    const absenTanggal = mergedData["22-101942"].absen; // Mengambil data absen dari "22-101942"
    const dates = absenTanggal.map((absen: { date: string | number | Date; }) => new Date(absen.date)); // Mengubah string tanggal menjadi objek Date
    const minDate = new Date(Math.min(...dates)); // Mengambil nilai tanggal terkecil
    const maxDate = new Date(Math.max(...dates)); // Mengambil nilai tanggal terbesar
    const minDateFormat = format(minDate, 'dd MMMM yyyy');
    const maxDateFormat = format(maxDate, 'dd MMMM yyyy');

    worksheet.getColumn('B').width = 15.71;
    worksheet.getColumn('C').width = 36;
    worksheet.getColumn('D').width = 15;
    worksheet.getColumn('E').width = 15;
    worksheet.getColumn('F').width = 15;
    worksheet.getColumn('G').width = 15;

    const title = worksheet.getCell('B1');
    title.value = "PT Asuransi Umum BCA";
    title.font = { name: 'Calibri', size: 11, bold: true };

    const subtitle = worksheet.getCell('B2');
    subtitle.value = "Format Absen Manual";
    subtitle.font = { name: 'Calibri', size: 11, bold: true };

    const period = worksheet.getCell('B3');
    period.value = `Period: ${minDateFormat} - ${maxDateFormat}`;
    period.font = { name: 'Calibri', size: 11, bold: true };

    const timezone = worksheet.getCell('B4');
    timezone.value = "Time zone format: +hh:mm or -hh:mm";
    timezone.font = { name: 'Calibri', size: 11, bold: true };


    // header
    const fontHeader={name:'Arial', size:10, bold:true}
    worksheet.getCell(`B7`).value = "Employee ID";
    worksheet.getCell(`C7`).value = "Employee Name";
    worksheet.getCell(`D7`).value = "Date";
    worksheet.getCell(`E7`).value = "Time In";
    worksheet.getCell(`F7`).value = "Time Out";
    worksheet.getCell(`G7`).value = "Time Zone";
    
    worksheet.getCell(`B7`).font = fontHeader;
    worksheet.getCell(`C7`).font = fontHeader;
    worksheet.getCell(`D7`).font = fontHeader;
    worksheet.getCell(`E7`).font = fontHeader;
    worksheet.getCell(`F7`).font = fontHeader;
    worksheet.getCell(`G7`).font = fontHeader;
    
    worksheet.getCell(`B7`).alignment = { vertical: 'bottom', horizontal: 'center' };
    worksheet.getCell(`C7`).alignment = { vertical: 'bottom', horizontal: 'center' };
    worksheet.getCell(`D7`).alignment = { vertical: 'bottom', horizontal: 'center' };
    worksheet.getCell(`E7`).alignment = { vertical: 'bottom', horizontal: 'center' };
    worksheet.getCell(`F7`).alignment = { vertical: 'bottom', horizontal: 'center' };
    worksheet.getCell(`G7`).alignment = { vertical: 'bottom', horizontal: 'center' };


    if (mergedData && typeof mergedData === 'object') {
      Object.keys(mergedData).forEach((key) => {
        const data = mergedData[key];
        const name = data.name;
        const id = data.id;
        const absenData = data.absen;
        const font = {name:'Calibri', size:10.5,};

        absenData.forEach((absen: { date: string; timeIn: string | number | boolean | Date | ExcelJS.CellErrorValue | ExcelJS.CellRichTextValue | ExcelJS.CellHyperlinkValue | ExcelJS.CellFormulaValue | ExcelJS.CellSharedFormulaValue | null | undefined; timeOut: string | number | boolean | Date | ExcelJS.CellErrorValue | ExcelJS.CellRichTextValue | ExcelJS.CellHyperlinkValue | ExcelJS.CellFormulaValue | ExcelJS.CellSharedFormulaValue | null | undefined; }, index: number) => {
          const row = rowIndex + index;
          const parsedDate = parse(absen.date, 'yyyy-MM-dd', new Date());
          const formattedDate = format(parsedDate, 'dd-MM-yyyy');

          worksheet.getCell(`B${row}`).value = id;
          worksheet.getCell(`B${row}`).font = font;
          worksheet.getCell(`C${row}`).value = name;
          worksheet.getCell(`C${row}`).font = font;
          worksheet.getCell(`D${row}`).value = formattedDate;
          worksheet.getCell(`D${row}`).font = font;
          worksheet.getCell(`E${row}`).value = absen.timeIn;
          worksheet.getCell(`E${row}`).font = font;
          worksheet.getCell(`F${row}`).value = absen.timeOut;
          worksheet.getCell(`F${row}`).font = font;
          worksheet.getCell(`G${row}`).value = "+07:00";
          worksheet.getCell(`G${row}`).font = font;
        });
        

        rowIndex += absenData.length;
        console.log(`ini panjang absenData : ${absenData.length}`);
      });
    } else {
      console.error('mergedData is undefined or null');
    }

    const excelBuffer = await workbook.xlsx.writeBuffer();
    const excelFile = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = `Absen BDP12 ${minDateFormat} - ${maxDateFormat}.xlsx`;
    saveAs(excelFile, fileName);
  } catch (error) {
    console.error('Error generating Excel file:', error);
  }
};

  
  const ambil = async () => {
    setIsLoading(true);
    await fetchData();
    // await testFetch()
    console.log(mergedData);
    await generateExcelFile();
    setIsLoading(false);
  };
  
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="Nav">
        <Container>
          <Navbar.Brand href="/">Admin</Navbar.Brand>
          <Navbar.Text className="ml-auto">{formattedTime}</Navbar.Text>
        </Container>
      </Navbar>
      <button
        className="w-200 h-24 rounded-20 bg-red-500 border-2 border-black text-white absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        onClick={ambil}
      >
        Ambil Semua Data
      </button>



      {isLoading && (
        <LoadingComponent/>
      )}



    </>
  );
};

export default Admin;
