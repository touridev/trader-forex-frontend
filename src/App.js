import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MarketHours from './pages/MarketHours';
import PositionCalculator from './pages/PositionCalculator';
import EconomicCalendar from './pages/EconomicCalendar';
import TrackRecord from './pages/TrackRecord';
import Sidebar from './components/Sidebar';
import GlobalStyle from './styles/global';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
`;

const Content = styled.div`
  margin-left: 250px; /* sidebar width */
  padding: 2rem;
  width: calc(100% - 250px);
  min-height: 100vh;
  background: #f5f6fa;
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Sidebar />
        <Content>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/market-hours" element={<MarketHours />} />
            <Route path="/position-calculator" element={<PositionCalculator />} />
            <Route path="/economic-calendar" element={<EconomicCalendar />} />
            <Route path="/track-record" element={<TrackRecord />} />
          </Routes>
        </Content>
      </AppContainer>
    </Router>
  );
}

export default App;
