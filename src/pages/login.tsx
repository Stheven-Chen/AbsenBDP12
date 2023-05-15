import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

interface LoginProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State untuk mengontrol overlay loading
  const navigate = useNavigate();
  const BIN_ID = "64618e958e4aa6225e9d13e5";
  const API_KEY = "$2b$10$Bynx9Y7mccbSvQ/Ipgsds.8PJSe.zROtgDguCsws.UhfoQVXPqoae";


  const handleLogin = async () => {
    setIsLoading(true); // Menampilkan overlay loading
  
    // Mengambil data pengguna dari API
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?meta=false`, {
        headers: {
          "X-Master-Key": API_KEY
        },
      });
      const data = await response.json();
  
      // Memeriksa apakah nama pengguna cocok dengan data dari API
      const users = data.nama;
      const user = users.find((item: string) => item.toLowerCase() === username.toLowerCase());
      
      if (user) {
        setIsLoggedIn(true); // Set nilai isLoggedIn menjadi true
        navigate(`/${user}`);
      } else {
        alert("Nama pengguna tidak valid");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  
    setIsLoading(false); // Menyembunyikan overlay loading setelah selesai fetch data
  };
  

  return (
    <div className="login-container">
      <h2 className="judul">Halaman Login</h2>
      <img src="/login.svg" alt="" />
      <div className="login-box">
        <input
          type="text"
          placeholder="Masukkan Nama"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
        />
        <button onClick={handleLogin}>Masuk</button>
      </div>
      {isLoading && <div className="overlay">Loading...</div>} {/* Tampilan overlay loading */}
    </div>
  );
};

export default Login;
