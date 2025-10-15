import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div` padding: 2rem; `;
const Form = styled.form` display:flex; flex-direction: column; gap:1rem; max-width:400px; margin-bottom:2rem; `;
const Input = styled.input` padding:0.5rem 1rem; border-radius:8px; border:1px solid #ccc; `;
const TextArea = styled.textarea` padding:0.5rem 1rem; border-radius:8px; border:1px solid #ccc; resize: vertical; `;
const Button = styled.button` background:#007bff; color:white; padding:0.75rem; border:none; border-radius:8px; cursor:pointer; &:hover{background:#0069d9;} `;
const TradeCard = styled.div` background:#fff; border-radius:12px; padding:1rem; margin-bottom:1rem; box-shadow:0 4px 10px rgba(0,0,0,0.1); `;

const TrackRecord = () => {
  const [trades, setTrades] = useState([]);
  const [note, setNote] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  const fetchTrades = async () => {
    const res = await axios.get('http://localhost:5000/api/track-record');
    setTrades(res.data);
  };

  useEffect(() => { fetchTrades(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('note', note);
    formData.append('date', new Date().toISOString());
    if (screenshot) formData.append('screenshot', screenshot);

    await axios.post('http://localhost:5000/api/track-record', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setNote('');
    setScreenshot(null);
    fetchTrades();
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <TextArea placeholder="Trade note" value={note} onChange={e=>setNote(e.target.value)} rows={3} />
        <Input type="file" onChange={e=>setScreenshot(e.target.files[0])} />
        <Button type="submit">Save Trade</Button>
      </Form>

      {trades.map(trade => (
        <motion.div key={trade.id} whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
        <TradeCard key={trade.id}>
          <p>{trade.note.length>100 ? trade.note.substring(0,100)+'...' : trade.note}</p>
          {trade.screenshotUrl && <img src={trade.screenshotUrl} alt="screenshot" style={{width:'100%',marginTop:'0.5rem',borderRadius:'6px'}} />}
          <small>{new Date(trade.date).toLocaleString()}</small>
        </TradeCard>
        </motion.div>
      ))}
    </Container>
  );
};

export default TrackRecord;
