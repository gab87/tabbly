import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TableDetail from './pages/TableDetail';
import TableHistory from './pages/TableHistory';
import GlobalHistory from './pages/GlobalHistory';
import Config from './pages/Config';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="table/:id" element={<TableDetail />} />
          <Route path="table/:id/history" element={<TableHistory />} />
          <Route path="history" element={<GlobalHistory />} />
          <Route path="config" element={<Config />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
