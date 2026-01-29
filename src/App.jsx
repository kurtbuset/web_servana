// src/App.js
import './App.css';
import AppNavigation from './AppNavigation.jsx';
import { UserProvider } from "../src/context/UserContext.jsx";
import { ThemeProvider } from "../src/context/ThemeContext.jsx";
import { UnsavedChangesProvider } from "../src/context/UnsavedChangesContext.jsx";

function App() {
    return (
      <ThemeProvider>
        <UserProvider>
          <UnsavedChangesProvider>
            <AppNavigation />
          </UnsavedChangesProvider>
        </UserProvider>
      </ThemeProvider>
    );
}

export default App;
