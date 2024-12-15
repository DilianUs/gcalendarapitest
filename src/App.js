import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/loginPage';
import Success from './pages/successPage';
import EventForm from './pages/calendarEventsPage';



function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/success" element={<Success/>}></Route>
        <Route path="/events_form" element={<EventForm/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
