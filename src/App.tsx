import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stheven from './pages/stheven';
import Ivana from './pages/ivana';
import Putri from './pages/putri';
import Bela from './pages/bela';
import Dika from './pages/dika';
import Yoga from './pages/yoga';
import Dimas from './pages/dimas';
import Kevin from './pages/kevin';
import Login from './pages/login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* Rute-rute yang memerlukan autentikasi */}
        <Route
          path="/stheven"
          element={isLoggedIn ? <Stheven /> : <Navigate to="/login" />}
        />
        <Route
          path="/ivana"
          element={isLoggedIn ? <Ivana /> : <Navigate to="/login" />}
        />
        <Route
          path="/putri"
          element={isLoggedIn ? <Putri /> : <Navigate to="/login" />}
        />
        <Route
          path="/bela"
          element={isLoggedIn ? <Bela /> : <Navigate to="/login" />}
        />
        <Route
          path="/dika"
          element={isLoggedIn ? <Dika /> : <Navigate to="/login" />}
        />
        <Route
          path="/yoga"
          element={isLoggedIn ? <Yoga /> : <Navigate to="/login" />}
        />
        <Route
          path="/dimas"
          element={isLoggedIn ? <Dimas /> : <Navigate to="/login" />}
        />
        <Route
          path="/kevin"
          element={isLoggedIn ? <Kevin /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
