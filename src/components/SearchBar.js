import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.background};
  border-radius: 25px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 5px ${({ theme }) => theme.shadow};
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
  }
`;

const Input = styled.input`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.text}80;
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    try {
      const formattedCity = encodeURIComponent(city.trim());
      
      await onSearch(formattedCity);
      setCity('');
      setError('');
    } catch (err) {
      setError('Cidade não encontrada. Tente novamente.');
      console.error('Erro ao buscar dados do clima:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SearchContainer>
        <Input
          type="text"
          placeholder="Digite o nome da cidade..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={isSearching}
        />
        <SearchButton type="submit" disabled={!city.trim() || isSearching}>
          <FaSearch />
        </SearchButton>
      </SearchContainer>
      {error && <p>{error}</p>}
    </form>
  );
};

export default SearchBar; 