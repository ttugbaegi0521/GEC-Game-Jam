import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './Main';
import Login from './Components/Login/Login';
import Admin from './Components/Admin/Admin';

function App() {
  return (
    <div className="App">
      <BrowserRouter basename={`/${process.env.PUBLIC_URL}`}>
        <Routes>
          <Route>
            <Route path='/' element={<Main />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/admin' element={<Admin />}></Route>
            <Route path='*' element={<h1>404</h1>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App; 
