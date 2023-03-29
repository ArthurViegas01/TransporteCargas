import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Transporte from './pages/Transportes'

function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/Transporte' element={<Transporte/>}></Route>
      </Routes>
    </Router>
  );

}

export default App;