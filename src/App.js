import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/navBar/navBar';
import Home from './pages/home/home.js';
import Ratings from './pages/ratings/ratings'
import Contests from './pages/Contests/contests';
import Problemset from './pages/problemset/problemset';
import Login from './pages/login/login';
import Register from './pages/register/register';
import Messaging from './pages/Messaging/messaging';
import Profile from './pages/profile/profile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar className="nav-bar"></NavBar>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/ratings" element={<Ratings></Ratings>}></Route>
          <Route path="/contests" element={<Contests></Contests>}></Route>
          <Route path="/problemset" element={<Problemset></Problemset>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route path="/messaging" element={<Messaging></Messaging>}></Route>
          <Route path="/profile/:username" element={<Profile></Profile>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
