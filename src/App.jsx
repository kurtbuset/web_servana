// src/App.js
import './App.css';
import './styles/Animations.css';
import AppNavigation from './AppNavigation.jsx';
import { UserProvider } from "../src/context/UserContext.jsx";
import { ThemeProvider } from "../src/context/ThemeContext.jsx";
import { UnsavedChangesProvider } from "../src/context/UnsavedChangesContext.jsx";
import { DepartmentPanelProvider } from "../src/context/DepartmentPanelContext.jsx";
import { RolePreviewProvider } from './context/RolePreviewContext.jsx';
import { PresenceProvider } from './context/PresenceContext.jsx';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <PresenceProvider>
        <RolePreviewProvider>
            <UnsavedChangesProvider>
              <DepartmentPanelProvider>
                <AppNavigation />
              </DepartmentPanelProvider>
            </UnsavedChangesProvider>
        </RolePreviewProvider>
        </PresenceProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
