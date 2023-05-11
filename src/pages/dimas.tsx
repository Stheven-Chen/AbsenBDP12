import React, { useState, useEffect } from 'react';
import './style.css';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Dimas: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [data, setData] = useState<any>(null);

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
        const response = await fetch('/dimas.json');
        const jsonData = await response.json();
        console.log(jsonData);
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleTimeIn = () => {
    if (data) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      const newData = { ...data };
      const existingData = newData.absen.find((item: any) => item.date === formattedDate);

      if (existingData) {
        existingData.timeIn = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        newData.absen.push({
          date: formattedDate,
          timeIn: currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timeOut: ''
        });
      }

      setData(newData);
      console.log(newData);
      // Lakukan permintaan POST atau penyimpanan data ke server di sini
    }
  };

  const handleTimeOut = () => {
    if (data) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      const newData = { ...data };
      const existingData = newData.absen.find((item: any) => item.date === formattedDate);

      if (existingData) {
        existingData.timeOut = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        newData.absen.push({
          date: formattedDate,
          timeIn: '',
          timeOut: currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      setData(newData);
      console.log(newData);
      // Lakukan permintaan POST atau penyimpanan data ke server di sini
    }
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="Nav">
        <Container>
          <Navbar.Brand href="/">Dimas</Navbar.Brand>
          <Navbar.Text className="ml-auto">{formattedTime}</Navbar.Text>
        </Container>
      </Navbar>
      <div className="btnGroup">
        <button onClick={handleTimeIn}>Time In</button>
        <button onClick={handleTimeOut}>Time Out</button>
      </div>
      <button className='download'>Download All</button>
    </>
  );
};

export default Dimas;
