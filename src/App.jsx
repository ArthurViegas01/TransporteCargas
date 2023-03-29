import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Consulta from './pages/Consulta'

function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/Consulta' element={<Consulta/>}></Route>
      </Routes>
    </Router>
  );

}

export default App;