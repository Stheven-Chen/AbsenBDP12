import React from 'react';
import {Spinner } from "react-bootstrap"

interface buttonProp {
  onClick?: () => void;
  type?: String;
  buttonText: string;
  className?: string; 
}
interface navProp {
  className?: string;  
}

interface modalAlert{
    errorText?:string;
    onClick?: () => void;
    title?:string

}
interface OverlayProp{
    text?:string;

}

const Button: React.FC<buttonProp> = ({ type, onClick, buttonText, className }) => {
  const buttonClassName = `bg-sky-500 h-10 w-20 m-4 py-2 text-white font-medium hover:bg-sky-600 rounded-xl shadow-sm ${className}`;

  return (
    <button className={buttonClassName} onClick={onClick}>
      {buttonText}
    </button>
  );
};

const Navbar: React.FC<navProp> = ({ className }) => {
  const navbarClassName = `${className}`;

  return (
    <nav className={navbarClassName}>

    </nav>
  );
};

const Alert: React.FC<modalAlert> = ({errorText, onClick, title})=>{
    return(
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-600 bg-opacity-50">
        <div className="bg-white w-80 h-48 rounded-lg overflow-hidden flex flex-col justify-center items-center">
          <div className="py-2">
            <h3 className="text-black text-center font-bold text-2xl">{title}</h3>
          </div>
          <p className="text-center text-black py-2">{errorText}</p>
          <button className="bg-sky-600 text-white  font-bold text-lg w-28 h-8 rounded-xl mb-3" onClick={onClick}>
            OK
          </button>
        </div>
      </div>
    );
};


const Overlay: React.FC<OverlayProp> = ({text})=>{
    return(
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
          <div className="loader text-white">{text}</div>
        </div>
    );
};

const LoadingComponent = () => {
  return (
    <div className="loading flex items-center justify-center fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <Spinner animation="border" role="status" className="mb-2">
          <span className="sr-only">Loading...</span>
        </Spinner>
        <p className="text-white">Mengambil data dari bins...</p>
      </div>
    </div>
  );
};

export { Button, Navbar, Alert, Overlay, LoadingComponent };
