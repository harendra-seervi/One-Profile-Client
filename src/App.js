import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/navBar/navBar';
import Ratings from './pages/ratings/ratings'
import Contests from './pages/Contests/contests';
import UserComparator from './pages/userComparator/userComparator';
import ProblemRecommendation from './pages/problemRecommendation/problemRecommendation';
import Login from './pages/login/login';
import Register from './pages/register/register';
import Profile from './pages/profile/profile';
import Help from './pages/help/help';
import AiRoadmap from './pages/aiRoadmap/aiRoadmap';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar className="nav-bar"></NavBar>
        <Routes>
          <Route path="/" element={<Ratings></Ratings>}></Route>
          <Route path="/ratings" element={<Ratings></Ratings>}></Route>
          <Route path="/contests" element={<Contests></Contests>}></Route>
          <Route path="/user-comparator" element={<UserComparator></UserComparator>}></Route>
          <Route path="/problem-recommendation" element={<ProblemRecommendation></ProblemRecommendation>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route path="/profile/:username" element={<Profile></Profile>}></Route>
          <Route path="/help" element={<Help></Help>}></Route>
          <Route path="/ai-roadmap" element={<AiRoadmap></AiRoadmap>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
