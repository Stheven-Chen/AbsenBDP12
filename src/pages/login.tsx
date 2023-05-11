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

  const handleLogin = async () => {
    setIsLoading(true); // Menampilkan overlay loading

    // Mengambil data pengguna dari API
    try {
      const response = await fetch("http://stheven.000webhostapp.com/api/bdp.php");
      const data = await response.json();

      // Memeriksa apakah nama pengguna cocok dengan data dari API
      const user = data.find((item: { nama: string }) => item.nama.toLowerCase() === username.toLowerCase());
      if (user) {
        setIsLoggedIn(true); // Set nilai isLoggedIn menjadi true
        navigate(`/${user.nama}`);
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
