import React from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Container = styled.div`
  padding: 2rem;
`;

const StatsCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
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


const DashboardContainer = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; `;

const Dashboard = () => {
  // Mock data
  const stats = [
    { title: 'Total Trades', value: 120 },
    { title: 'Win Rate', value: '72%' },
    { title: 'Monthly P/L', value: '$4,500' },
    { title: 'Risk per Trade', value: '2%' },
  ];

  return (
    <DashboardContainer>
        <Container>
        {stats.map((stat, idx) => (
            <Card key={idx} col={6}>
            <CardTitle>{stat.title}</CardTitle>
            <ResponsiveContainer width="100%" height={100}>
                <LineChart data={stats.value}>
                <XAxis dataKey="day" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="pL" stroke="#28a745" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
            </Card>
        ))}
        </Container>
    </DashboardContainer>
  );
};

export default Dashboard;
