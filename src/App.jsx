// src/App.js
import './App.css';
import './styles/Animations.css';
import AppNavigation from './AppNavigation.jsx';
import { UserProvider } from "../src/context/UserContext.jsx";
import { ThemeProvider } from "../src/context/ThemeContext.jsx";
import { UnsavedChangesProvider } from "../src/context/UnsavedChangesContext.jsx";
import { DepartmentPanelProvider } from "../src/context/DepartmentPanelContext.jsx";
import { AgentStatusProvider } from './context/AgentStatusContext.jsx'

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AgentStatusProvider>
          <UnsavedChangesProvider>
            <DepartmentPanelProvider>
              <AppNavigation />
            </DepartmentPanelProvider>
          </UnsavedChangesProvider>
        </AgentStatusProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
