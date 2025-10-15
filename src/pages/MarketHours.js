import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import axios from 'axios';
import styled from 'styled-components';
import { DateTime } from 'luxon';

const Container = styled.div`
  padding: 2rem;
`;

const MarketCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1rem 2rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  @media(max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Card = styled.div`
  background: ${(props) => (props.isOpen ? '#e0f7e9' : '#777')};
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  color: #000;
  margin-bottom: 0.5rem;
`;

const CardContent = styled.p`
  font-size: 1rem;
  color: #111;
`;


const TimelineContainer = styled.div`
  padding: 2rem;
  background: #f7f7f7;
  border-radius: 16px;
`;

const MarketRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
`;

const MarketLabel = styled.div`
  width: 120px;
  font-weight: 600;
`;

const MarketBarWrapper = styled.div`
  flex: 1;
  position: relative;
  height: 24px;
  background: #ddd;
  border-radius: 12px;
  overflow: hidden;
`;

const MarketBar = styled.div`
  position: absolute;
  height: 100%;
  background: ${(props) => props.color || '#4caf50'};
  left: ${(props) => props.start}%;
  width: ${(props) => props.width}%;
  transition: all 0.3s;
`;

const CurrentTimeIndicator = styled.div`
  position: absolute;
  height: 100%;
  width: 2px;
  background: red;
  left: ${(props) => props.left}%;
`;

const Impact = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  color: #fff;
  float: right;
  width: 60px;
  text-align: center;
  background-color: ${({ impact }) => 
    impact === false ? '#dc3545' : '#28a745'};
`;


const MarketHours = () => {
  const [markets, setMarkets] = useState([]);
  const [currentHour, setCurrentHour] = useState(new Date().getUTCHours());

  useEffect(() => {
    const fetchMarkets = async () => {
      const res = await axios.get('http://localhost:5000/api/live-market-hours');
      const allMarkets = res.data.markets;
      setMarkets(allMarkets);
    };
    fetchMarkets();

    const interval = setInterval(() => {
        setCurrentHour(new Date().getUTCHours());
      }, 60000); // update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      {markets.map((market, idx) => (
        <Card key={idx} isOpen={market.isOpen}>
        <CardTitle>{market.name}</CardTitle>
        <CardContent>Timezone: {market.timezone}</CardContent>
        <CardContent>Open: {market.open} | Close: {market.close}</CardContent>
        <Impact impact={market.isOpen}>{market.isOpen ? 'Open' : 'Closed'}</Impact>
        {/* <CardContent>Status: {market.isOpen ? 'Open' : 'Closed'}</CardContent> */}
        </Card>
      ))}

    <TimelineContainer>
      {markets.map((market, idx) => {

        const openHour = DateTime.fromISO(market.openUtc, { zone: 'utc' });
        const closeHour = DateTime.fromISO(market.closeUtc, { zone: 'utc' });
        const open = openHour.hour + openHour.minute / 60;
        const close = closeHour.hour + closeHour.minute / 60;

        const startPercent = (open / 24) * 100;
        const widthPercent = ((close - open) / 24) * 100;

        return close>open?(
          <MarketRow key={idx}>
            <MarketLabel>{market.name}</MarketLabel>
            <MarketBarWrapper>
              <MarketBar start={startPercent} width={widthPercent} color={market.color} />
              <CurrentTimeIndicator left={(currentHour / 24) * 100} />
            </MarketBarWrapper>
          </MarketRow>
        ):
        (
          <MarketRow key={idx}>
            <MarketLabel>{market.name}</MarketLabel>
            <MarketBarWrapper>
              <MarketBar start={0} width={(close / 24) * 100} color={market.color} />
              <MarketBar start={(open / 24) * 100} width={(24 - open) / 24 * 100} color={market.color} />
              <CurrentTimeIndicator left={(currentHour / 24) * 100} />
            </MarketBarWrapper>
          </MarketRow>
        );
      })}
    </TimelineContainer>

    </Container>
    
  );
};

export default MarketHours;
