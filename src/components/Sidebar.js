import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaTachometerAlt, FaClock, FaCalculator, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background: #1f1f2e;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  position: fixed;
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
  color: #28a745;
`;

const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  color: #ccc;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;

  &.active {
    background: #28a745;
    color: #fff;
  }

  &:hover {
    background: rgba(40, 167, 69, 0.2);
    color: #fff;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <Logo>
        <img src="/logo.png" alt="Logo" style={{ width: '100px', marginRight: '10px' }} />
      </Logo>
      <MenuItem to="/">
        <FaTachometerAlt /> Dashboard
      </MenuItem>
      <MenuItem to="/market-hours">
        <FaClock /> Market Hours
      </MenuItem>
      <MenuItem to="/position-calculator">
        <FaCalculator /> Position Calculator
      </MenuItem>
      <MenuItem to="/economic-calendar">
        <FaCalendarAlt /> Economic Calendar
      </MenuItem>
      <MenuItem to="/track-record">
        <FaClipboardList /> Track Record
      </MenuItem>
    </SidebarContainer>
  );
};

export default Sidebar;
