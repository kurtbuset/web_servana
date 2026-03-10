// src/App.js
import './App.css';
import './styles/Animations.css';
import AppNavigation from './AppNavigation.jsx';
import { UserProvider } from "../src/context/UserContext.jsx";
import { ThemeProvider } from "../src/context/ThemeContext.jsx";
import { UnsavedChangesProvider } from "../src/context/UnsavedChangesContext.jsx";
import { DepartmentPanelProvider } from "../src/context/DepartmentPanelContext.jsx";
import { UserStatusProvider } from './context/UserStatusContext.jsx';
import { RolePreviewProvider } from './context/RolePreviewContext.jsx';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <RolePreviewProvider>
          <UserStatusProvider>
            <UnsavedChangesProvider>
              <DepartmentPanelProvider>
                <AppNavigation />
              </DepartmentPanelProvider>
            </UnsavedChangesProvider>
          </UserStatusProvider>
        </RolePreviewProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
