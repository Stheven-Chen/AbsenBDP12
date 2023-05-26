import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Alert, Overlay } from '../component/ui';


interface LoginProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State untuk mengontrol overlay loading
  const [error, setError] = useState<string>('');

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
      const user = users.find((item: string) => item.trim().toLowerCase() === username.trim().toLowerCase());
      
      if (user) {
        setIsLoggedIn(true); // Set nilai isLoggedIn menjadi true
        navigate(`/${user}`);
      } else {
        setError("Nama pengguna tidak valid")
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  
    setIsLoading(false); // Menyembunyikan overlay loading setelah selesai fetch data
  };  

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-center font-bold text-2xl mb-4">Halaman Login</h2>
      <img src="/login.svg" alt="Login" className="mx-auto mb-4 max-w-full w-full lg:w-1/3 h-auto" />

      <div className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Masukkan Nama"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-64 px-4 py-2 border border-gray-300 rounded-md mb-4"
          name="user"
        />

        <Button onClick={handleLogin} buttonText="Masuk" className="w-48" />
      </div>

      {isLoading && <Overlay text="Loading..." />}

      {error && <Alert title="Gagal Login" onClick={()=>setError("")} errorText={error} />}
    </div>
  );
};

export default Login;
