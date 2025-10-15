import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  padding: 2rem;
`;

const EventCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1rem 2rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Impact = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  color: #fff;
  background-color: ${({ impact }) => 
    impact === 3 ? '#dc3545' : impact === 2 ? '#ffc107' : '#28a745'};
`;

const Input = styled.input`
  padding: 0.6rem 1rem;
  border-radius: 12px;
  border: 1px solid #444;
  background: rgba(255,255,255,0.05);
  color: #black;
  outline: none;
  font-size: 1rem;
  transition: border 0.3s;
  width: 100%;

  &:focus {
    border: 1px solid #28a745;
  }
`;

const impacts = ['Low', 'Medium', 'High'];


const EconomicCalendar = () => {
  const [events, setEvents] = useState([]);
  const [filterCountry, setFilterCountry] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get('http://localhost:5000/api/economic-calendar');
      console.log(res.data);
      setEvents(res.data);
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => 
    !filterCountry || e.Country.toLowerCase().includes(filterCountry.toLowerCase())
  );

  return (
    <Container>
      <Input
        type="text"
        color='black'
        placeholder="Filter by country"
        value={filterCountry}
        onChange={e => setFilterCountry(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ccc'}}
      />

      {filteredEvents.map((event, idx) => (
        <EventCard key={idx}>
          <div>
            <h3>{event.event}</h3>
            <p>{event.Country} | {event.Date}</p>
          </div>
          <Impact impact={event.Importance}>{impacts[event.Importance - 1]}</Impact>
        </EventCard>
      ))}
    </Container>
  );
};

export default EconomicCalendar;
