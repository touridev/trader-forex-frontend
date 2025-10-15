import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background: #1e1e2f;
  color: white;
`;

const Navbar = () => {
  return (
    <Nav>
      <Link to="/">Dashboard</Link>
      <Link to="/market-hours">Market Hours</Link>
      <Link to="/position-calculator">Position Size</Link>
      <Link to="/economic-calendar">Economic Calendar</Link>
      <Link to="/track-record">Track Record</Link>
    </Nav>
  );
};

export default Navbar;
