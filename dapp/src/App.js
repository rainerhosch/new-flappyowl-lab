import { Home, MintPage, Dashboard, Api } from "./pages";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import backgroundImage from "./assets/img/bg/Blue-color-abstract-background-lines-triangle-geometric-background-4k-wallpaper.jpg";
function App() {
  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vault" element={<MintPage />} />
          <Route path="/owner-dashboard" element={<Dashboard />} />
          <Route path="/v1/api/user" element={<Api />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
