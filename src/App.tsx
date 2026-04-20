import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Transportes from './pages/Transportes';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/transportes" element={<Transportes />} />
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
