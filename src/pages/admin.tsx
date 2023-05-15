import React, { useState, useEffect } from "react";
import { Navbar, Container, Spinner } from "react-bootstrap";
  import * as XLSX from "xlsx";
  import saveAs from "file-saver";


const Admin: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const API_KEY = "$2b$10$Bynx9Y7mccbSvQ/Ipgsds.8PJSe.zROtgDguCsws.UhfoQVXPqoae";
  const [mergedData, setMergedData] = useState<{ [key: string]: any }>({});
  
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
  
      console.log(mergedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const generateExcelFile = async () => {
    const template = `${process.env.PUBLIC_URL}/template.xlsx`;
    try {
      const response = await fetch(template);
      const templateData = await response.arrayBuffer();
      const templateWorkbook = XLSX.read(templateData, { type: 'array' });
  
      const workbook = XLSX.utils.book_new();
      let worksheet = templateWorkbook.Sheets[templateWorkbook.SheetNames[0]];
      const startingRow = 8; // Baris awal untuk menulis data
  
      let rowIndex = startingRow;
      let worksheetName = 'Sheet1';

      worksheet['!cols'] = [
        { wpx: 30 }, // Column A (not visible)
        { wpx: 113 }, // Column B width: 260px
        { wpx: 260 }, // Column C width: 113px
        { wpx: 110 }, // Column D width: 110px
        { wpx: 110 }, // Column E width: 110px
        { wpx: 110 }, // Column F width: 110px
        { wpx: 75 }, // Column G width: 75px
      ];

      const absenTanggal = mergedData["22-101942"].absen; // Mengambil data absen dari "22-101942"
      const dates = absenTanggal.map((absen: { date: string | number | Date; }) => new Date(absen.date)); // Mengubah string tanggal menjadi objek Date
      const minDate = new Date(Math.min(...dates)); // Mengambil nilai tanggal terkecil
      const maxDate = new Date(Math.max(...dates)); // Mengambil nilai tanggal terbesar

      const minDateFormat = minDate.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const maxDateFormat = maxDate.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });

      worksheet['B3'] = { t: 's', v: `Period: ${minDateFormat} - ${maxDateFormat}` };



 
  
      if (mergedData && typeof mergedData === 'object') {
        Object.keys(mergedData).forEach((key) => {
          const data = mergedData[key];
          const name = data.name;
          const id = data.id;
          const absenData = data.absen;
      
          absenData.forEach((absen: {date: any, timeIn: any, timeOut: any}, index: number) => {
            const row = rowIndex + index;
      
            // Mengisi data ID dan Nama pada kolom B dan C di setiap baris
            worksheet['B' + row] = { t: 's', v: id };
            worksheet['C' + row] = { t: 's', v: name };
      
            worksheet['D' + row] = { t: 's', v: absen.date };
            worksheet['E' + row] = { t: 's', v: absen.timeIn };
            worksheet['F' + row] = { t: 's', v: absen.timeOut };
            worksheet['G' + row] = { t: 's', v: "+7:00" };
          });
      
          rowIndex += absenData.length; // Hanya menambahkan jumlah baris untuk data absen
        });
      } else {
        console.error('mergedData is undefined or null');
      }
      
      
  
      XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
  
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelFile = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = `absen BDP12 ${minDateFormat} - ${maxDateFormat}.xlsx`;
      saveAs(excelFile, fileName);
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  };
  
  const ambil = async () => {
    setIsLoading(true);
    await fetchData();
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
      <button className="all" onClick={ambil}>
        Ambil Semua Data
      </button>

      {isLoading && (
        <div className="loading">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Mengambil data dari bins...</p>
        </div>
      )}



    </>
  );
};

export default Admin;
