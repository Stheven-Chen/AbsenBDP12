import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import '../pages/style.css';

interface AttendanceComponentProps {
  formattedTime: string;
  data: any;
  handleTimeIn: () => void;
  handleTimeOut: () => void;
  generateExcelFile: () => void;
  handleReset: () => void;
  nama: string;
}

const AttendanceComponent: React.FC<AttendanceComponentProps> = ({
  formattedTime,
  data,
  handleTimeIn,
  handleTimeOut,
  generateExcelFile,
  handleReset,
  nama
}) => {
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" className="Nav">
        <Container>
          <Navbar.Brand href="/">{nama}</Navbar.Brand>
          <Navbar.Text className="ml-auto">{formattedTime}</Navbar.Text>
        </Container>
      </Navbar>
      <div className="overflow-x-auto">
  <table className="table-fixed border-b border-black mx-auto">
    <thead>
      <tr>
        <th className="w-1/3 px-4 py-2 text-gray-800">Tanggal</th>
        <th className="w-1/3 px-4 py-2 text-gray-800">Time In</th>
        <th className="w-1/3 px-4 py-2 text-gray-800">Time Out</th>
      </tr>
    </thead>
    <tbody>
      {data && data.absen.map((item: any, index: number) => (
        <tr key={index} className="border-b text-sm border-gray-200 hover:bg-gray-100">
          <td className="px-4 py-2 text-gray-600">{item.date}</td>
          <td className="px-4 py-2 text-gray-600">{item.timeIn}</td>
          <td className="px-4 py-2 text-gray-600">{item.timeOut}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      <div className="flex justify-center p-4 mt-4 gap-5 lg:gap-72">
      <button
        className="bg-white w-29 h-10 rounded-20 border-2 border-black px-4 py-2"
        onClick={handleTimeIn}
        >
        Time In
        </button>
        <button
        className="bg-white w-29 h-10 rounded-20 border-2 border-black px-4 py-2"
        onClick={handleTimeOut}
        >
        Time Out
        </button>
      </div>
      <div className="flex justify-center gap-4 mt-4 flex-col items-center">
        <button
          className="bg-white w-200 h-10 rounded-20 border-2 border-black "
          onClick={generateExcelFile}
        >
          Download All
        </button>
     
        <button
          className="bg-white w-200 h-10 rounded-20 border-2 border-black "
          onClick={handleReset}
        >
          Reset Attendance
        </button>
      </div>
      
    </div>
  );
};

export default AttendanceComponent;
