import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getWeatherData } from './services/weather';

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: ${({ theme }) => theme.background};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.cardBg};
  border-radius: 15px;
  box-shadow: 0 4px 15px ${({ theme }) => theme.shadow};
`;

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleSearch = async (cityName) => {
    try {
      const weatherData = await getWeatherData(cityName);
      setWeatherData(weatherData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    }
  };

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <GlobalStyles />
      <AppContainer>
        <MainContent>
          <Header 
            toggleTheme={toggleTheme} 
            isDarkTheme={isDarkTheme} 
            onSearch={handleSearch}
          />
          {loading ? (
            <LoadingContainer>Carregando dados do clima...</LoadingContainer>
          ) : (
            weatherData && <WeatherCard data={weatherData} />
          )}
        </MainContent>
        <ToastContainer
          position="bottom-right"
          theme={isDarkTheme ? 'dark' : 'light'}
        />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App; 