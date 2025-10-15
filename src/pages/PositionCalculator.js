import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// ===================== Styled Components =====================

const Page = styled.div`
  min-height: 100vh;
  background: #f4f6fa;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 3rem 1rem;
  font-family: 'Segoe UI', Roboto, sans-serif;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 2rem 2.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  max-width: 700px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  margin-bottom: 1.8rem;

  &::before {
    content: '📊';
    font-size: 1.8rem;
    margin-right: 0.6rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.3rem;
`;

const Input = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0.6rem 0.8rem;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15);
  }
`;

const Select = styled.select`
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0.6rem 0.8rem;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #43a047, #66bb6a);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultsTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
`;

const ResultCard = styled.div`
  background: ${(p) => p.bg || '#f9fafb'};
  border: 1px solid ${(p) => p.border || '#e5e7eb'};
  border-radius: 14px;
  text-align: center;
  padding: 1rem;

  h3 {
    font-size: 0.9rem;
    color: #6b7280;
  }

  p {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${(p) => p.color || '#111827'};
    margin-top: 0.3rem;
  }
`;

// ===================== Main Component =====================

const PositionCalculator = () => {
  const [accountBalance, setAccountBalance] = useState(0);
  const [riskPercent, setRiskPercent] = useState(0);
  const [entryPrice, setEntryPrice] = useState(0);
  const [stopLoss, setStopLoss] = useState(0);
  const [takeProfit, setTakeProfit] = useState(0);
  const [symbol, setSymbol] = useState('EUR/USD');

  const [result, setResult] = useState({
    positionSize: '0.0',
    riskAmount: 0,
    rrRatio: '1:1',
    stopDistance: '0.0'
  });
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    if (accountBalance <= 0 || riskPercent <= 0 || stopLoss <= 0 || entryPrice <= 0 || takeProfit <= 0) {
      alert('Please enter valid positive numbers for all fields.');
    }
    else {
      setLoading(true);
      try {
        const res = await axios.post('http://localhost:5000/api/position-calculator/calculate', {
          accountBalance: parseFloat(accountBalance),
          riskPercent: parseFloat(riskPercent),
          entryPrice: parseFloat(entryPrice),
          stopLoss: parseFloat(stopLoss),
          takeProfit: parseFloat(takeProfit),
          symbol,
        });
        setResult(res.data);
      } catch (err) {
        console.error(err);
        alert('Calculation failed.');
      }
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <Title>Position Size Calculator</Title>

        <FormGrid>
          <InputGroup>
            <Label>Account Balance (USD)</Label>
            <Input
              type="number"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
              placeholder="0"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Risk per Trade (%)</Label>
            <Input
              type="number"
              value={riskPercent}
              onChange={(e) => setRiskPercent(e.target.value)}
              placeholder="0"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Entry Price</Label>
            <Input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              placeholder="1.00"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Stop Loss</Label>
            <Input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="1.00"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Take Profit</Label>
            <Input
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder="1.00"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Symbol</Label>
            <Select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
              <option value="EUR/USD">EUR/USD</option>
              <option value="GBP/USD">GBP/USD</option>
              <option value="USD/JPY">USD/JPY</option>
              <option value="AUD/USD">AUD/USD</option>
            </Select>
          </InputGroup>
        </FormGrid>

        <Button onClick={handleCalculate} disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate'}
        </Button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ResultsTitle>Results</ResultsTitle>
              <ResultsGrid>
                <ResultCard bg="#e8f5e9" border="#c8e6c9" color="#2e7d32">
                  <h3>Position Size</h3>
                  <p>{result.positionSize} lots</p>
                </ResultCard>

                <ResultCard bg="#e3f2fd" border="#bbdefb" color="#1565c0">
                  <h3>Risk Amount</h3>
                  <p>${result.riskAmount?.toFixed(2) || '200.00'}</p>
                </ResultCard>

                <ResultCard bg="#f3e5f5" border="#e1bee7" color="#7b1fa2">
                  <h3>R:R Ratio</h3>
                  <p>{result.rrRatio || '1:2.00'}</p>
                </ResultCard>

                <ResultCard bg="#fff8e1" border="#ffe082" color="#f9a825">
                  <h3>Stop Distance</h3>
                  <p>{result.stopDistance} pips</p>
                </ResultCard>
              </ResultsGrid>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </Page>
  );
};

export default PositionCalculator;
