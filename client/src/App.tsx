import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';

import Menu from './components/Menu';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Python from './pages/Python';
import PHP from './pages/PHP';
import Typescript from './pages/Typescript';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          
          <Menu/>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/rest-api' element={<Python />} /> 
                <Route path='/php' element={<PHP />} />
                <Route path='/typescript' element={<Typescript />} /> 
                <Route path='/python' element={<Python />} /> 
            </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
