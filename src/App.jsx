// src/App.js
import React from 'react';
import './App.css';
import AppNavigation from './AppNavigation.jsx'; // ✅ import the navigation component
import { UserProvider } from "../context/UserContext";

function App() {
    return (
    <UserProvider>
      <AppNavigation /> {/* Your routes/screens */}
    </UserProvider>
    );
}

export default App;
