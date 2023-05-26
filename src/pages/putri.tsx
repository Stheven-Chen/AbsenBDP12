import React, { useState, useEffect } from 'react';
import './style.css';
import AttendanceComponent from '../component/mainUi'
 import {Alert} from '../component/ui'
import * as XLSX from "xlsx";
import saveAs from "file-saver";


const Putri: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [data, setData] = useState<any>(null);
 const [alert, setAlert] = useState<string>("");
  const BIN_ID = "645cb5dc8e4aa6225e9adc4b";
  const API_KEY='$2b$10$Bynx9Y7mccbSvQ/Ipgsds.8PJSe.zROtgDguCsws.UhfoQVXPqoae';
  const options = {
    hour12: false, // Setel ke false untuk format 24 jam
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedTime = currentTime.toLocaleTimeString(); // Format waktu

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?meta=false`, {
          headers: {
            'X-Master-Key': API_KEY
          }
        });
  
        if (response.ok) {
          const jsonData = await response.json();
          console.log('File JSON berhasil diambil dari JSONBin:', jsonData);
          setData(jsonData);
        } else {
          throw new Error('Gagal mengambil file JSON dari JSONBin');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleTimeIn = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const existingData = data.absen.find((item: { date: string }) => item.date === currentDate);

    if (existingData) {
      setAlert("Anda sudah melakukan absen masuk.");
    } else {
      const newData = {
        ...data,
        absen: [
          ...data.absen,
          { date: currentDate, timeIn: new Date().toLocaleTimeString(undefined, options), timeOut: '' },
        ],
      };
      setData(newData);
      console.log(newData);
      updateData(newData);
    }
  };

  const handleTimeOut = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const existingData = data.absen.find((item: { date: string; }) => item.date === currentDate);
  
    if (!existingData) {
      setAlert("Belum melakukan absen masuk.");
    } else if (!existingData.timeOut) {
      const newData = {
        ...data,
        absen: data.absen.map((item: { date: string; }) =>
          item.date === currentDate ? { ...item, timeOut: new Date().toLocaleTimeString(undefined, options) } : item
        ),
      };
      setData(newData);
      console.log(newData);
      updateData(newData);
    } else {
      setAlert("Sudah melakukan absen keluar.");
    }
  };

  const handleReset = () => {
    const newData = {
      ...data,
      absen: [],
    };
    setData(newData);
    console.log(newData);
    setAlert('Berhasil Reset');
    updateData(newData);
  };
  
  

  const updateData = async (newData: any[]) => {
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        const message = `Data berhasil diperbarui di JSONBin pada tanggal ${currentDate} pukul ${currentTime}.`;
        console.log(message);
        setAlert(`Udah Ok, tanggal ${currentDate}, jam ${currentTime}` )
      } else {
        throw new Error("Gagal memperbarui data di JSONBin");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const generateExcelFile = async () => {
    const template = `${process.env.PUBLIC_URL}/template.xlsx`;
    try {
      const response = await fetch(template);
      const templateData = await response.arrayBuffer();
      const templateWorkbook = XLSX.read(templateData, { type: 'array' });
  
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, templateWorkbook.Sheets[templateWorkbook.SheetNames[0]], 'Sheet1');
  
      const worksheet = workbook.Sheets['Sheet1'];
  
      // Mengisi data ID dan Nama pada kolom B8 dan C8
      worksheet['B8'] = { t: 's', v: data.name };
      worksheet['C8'] = { t: 's', v: data.ID.toString() };
  
      // Mengisi periode pada sel B3
      const minDate = new Date(data.absen[0].date);
      const maxDate = new Date(data.absen[data.absen.length - 1].date);
  
      const minDateFormat = minDate.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const maxDateFormat = maxDate.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
      worksheet['B3'] = { t: 's', v: `Periode: ${minDateFormat} - ${maxDateFormat}` };
  
      // Mengisi data absen pada kolom B, C, D, E, F dimulai dari baris 8
      let rowIndex = 8;
      data.absen.forEach((item: { date: string; timeIn: string; timeOut: string; }) => {
        worksheet[`B${rowIndex}`] = { t: 's', v: data.name };
        worksheet[`C${rowIndex}`] = { t: 's', v: data.ID.toString() };
        worksheet[`D${rowIndex}`] = { t: 's', v: item.date };
        worksheet[`E${rowIndex}`] = { t: 's', v: item.timeIn };
        worksheet[`F${rowIndex}`] = { t: 's', v: item.timeOut };
        worksheet[`G${rowIndex}`] = { t: 's', v: "+07:00" };
  
        rowIndex++;
      });
  
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelFile = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = `absen ${data.name} ${data.ID}.xlsx`;
      saveAs(excelFile, fileName);
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  };
  

  return (

<>
<AttendanceComponent 
    formattedTime={formattedTime} 
    data={data} 
    handleTimeIn={handleTimeIn}
    handleTimeOut={handleTimeOut} 
    generateExcelFile={generateExcelFile}
    handleReset={handleReset}
    nama="Putri"/>
{alert && <Alert onClick={()=>setAlert("")} errorText={alert} />}
</>
    
  );
};

export default Putri;