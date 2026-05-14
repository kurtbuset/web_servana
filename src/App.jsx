// src/App.js
import "./App.css";
import "./styles/Animations.css";
import AppNavigation from "./AppNavigation.jsx";
import StoreInitializer from "./components/StoreInitializer.jsx";

function App() {
  return (
    <StoreInitializer>
      <AppNavigation />
    </StoreInitializer>
  );
}

export default App;
