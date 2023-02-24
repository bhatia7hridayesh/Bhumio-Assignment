import { useState } from 'react';
import Navbar from './scenes/Navbar';
import HomePage from './scenes/HomePage';
import { Box } from '@mui/system';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ReportPage from './scenes/ReportPage';
function App() {
  const [isHomePage, setSelectedpage] = useState(true);
  return (
    <Box sx={{backgroundColor: "#cceeff"}}>
      <Navbar/>
      <BrowserRouter>
      <Routes>
          <Route exact path="/" element={<HomePage />} />
          {<Route path="/report" element={<ReportPage />} />}
      </Routes>
    </BrowserRouter>
    </Box>
  );
}

export default App;
