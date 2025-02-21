import React from 'react';
import styled from 'styled-components';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import { WiDaySunny } from 'react-icons/wi';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: ${({ theme }) => theme.gradient};
  box-shadow: 0 2px 10px ${({ theme }) => theme.shadow};
  margin-bottom: 2rem;
  border-radius: 15px;
  color: #fff;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    background: linear-gradient(to right, #fff, rgba(255,255,255,0.8));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  svg {
    font-size: 2.2rem;
    color: #fff;
  }
`;

const Header = ({ toggleTheme, isDarkTheme, onSearch }) => {
  return (
    <HeaderContainer>
      <Logo>
        <WiDaySunny />
        <h1>Clima Tempo</h1>
      </Logo>
      <SearchBar onSearch={onSearch} />
      <ThemeToggle toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
    </HeaderContainer>
  );
};

export default Header; 