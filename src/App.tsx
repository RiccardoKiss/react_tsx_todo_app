import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddList from './pages/AddList';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="todoList" element={<AddList />} />
        <Route path="*" element={<p>not found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
