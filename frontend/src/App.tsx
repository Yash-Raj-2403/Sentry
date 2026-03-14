import { Routes, Route } from 'react-router-dom';
import Home      from './pages/Home';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import Agents    from './pages/Agents';
import Reports   from './pages/Reports';

function App() {
  return (
    <Routes>
      <Route path="/"          element={<Home />}      />
      <Route path="/login"     element={<Login />}     />
      <Route path="/register"  element={<Register />}  />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/incidents" element={<Incidents />} />
      <Route path="/agents"    element={<Agents />}    />
      <Route path="/reports"   element={<Reports />}   />
    </Routes>
  );
}

export default App;
