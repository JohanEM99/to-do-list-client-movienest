import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/login";
import Register from "./pages/register";
import AboutUs from "./pages/AboutUs";
import HomeMovies from "./pages/HomeMovies";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/homemovies" element={<HomeMovies />} />
      </Routes>
    </Router>
  );
}

export default App;