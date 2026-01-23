// src/App.js
import React from 'react';
import './App.css';
import AppNavigation from './AppNavigation.jsx'; // ✅ import the navigation component
import { UserProvider } from "../src/context/UserContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

function App() {
    return (
    <ThemeProvider>
      <UserProvider>
        <AppNavigation /> {/* Your routes/screens */}
      </UserProvider>
    </ThemeProvider>
    );
}

export default App;
