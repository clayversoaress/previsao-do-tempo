import React from 'react';
import styled from 'styled-components';
import { 
  WiDaySunny,          // céu limpo
  WiDayCloudy,         // parcialmente nublado
  WiCloud,             // nublado
  WiCloudy,            // encoberto
  WiFog,               // neblina/nevoeiro
  WiRain,              // chuva
  WiRainMix,           // garoa
  WiThunderstorm,      // tempestade
  WiThermometer,       // temperatura
  WiHumidity,          // umidade
  WiStrongWind,        // vento
  WiBarometer,         // pressão
  WiSunrise,           // nascer do sol
  WiSunset             // pôr do sol
} from 'react-icons/wi';
import WeatherChart from './WeatherChart';

const Card = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 4px 15px ${({ theme }) => theme.shadow};
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0.5rem;
  }
`;

const MainInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.shadow};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
  }
`;

const CityInfo = styled.div`
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.text};
  }
`;

const Temperature = styled.div`
  font-size: 4.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    font-size: 2rem;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`;

const WeatherIcon = styled.div`
  font-size: 4rem;
  margin: 1rem 0;
  color: ${({ theme }) => theme.primary};
`;

const WeatherDescription = styled.div`
  text-align: center;
  font-size: 1.5rem;
  margin: 1rem 0;
  text-transform: capitalize;
  color: ${({ theme }) => theme.text};
  opacity: 0.9;
`;

const DetailsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  padding: 1rem;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.shadow};

  svg {
    color: ${({ theme }) => theme.primary};
    font-size: 2.5rem;
  }

  .detail-info {
    display: flex;
    flex-direction: column;
    
    .label {
      font-size: 0.9rem;
      opacity: 0.7;
    }
    
    .value {
      font-weight: 500;
    }
  }
`;

const SunTimes = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    
    .sun-item {
      justify-content: center;
    }
  }
`;

const StyledText = styled.span`
  color: ${({ theme }) => theme.text};
`;

function getWeatherIcon(code) {
  switch (code) {
    case '01d': return <WiDaySunny />;        // céu limpo
    case '02d': return <WiDayCloudy />;       // parcialmente nublado
    case '03d': return <WiCloud />;           // nublado
    case '04d': return <WiCloudy />;          // encoberto
    case '09d': return <WiRainMix />;         // garoa
    case '10d': return <WiRain />;            // chuva
    case '11d': return <WiThunderstorm />;    // tempestade
    case '50d': return <WiFog />;             // neblina
    default: return <WiCloud />;              // padrão
  }
}

const WeatherCard = ({ data }) => {
  if (!data) return null;

  return (
    <Card>
      <MainInfo>
        <CityInfo>
          <h2>{data.name}</h2>
          <Temperature>
            <StyledText>{Math.round(data.main.temp)}</StyledText>
            <span>°C</span>
          </Temperature>
          <WeatherDescription>
            <StyledText>{data.weather[0].description}</StyledText>
          </WeatherDescription>
        </CityInfo>
        <WeatherIcon>
          {getWeatherIcon(data.weather[0].icon)}
        </WeatherIcon>
      </MainInfo>

      <DetailsList>
        <DetailItem>
          <WiThermometer />
          <div className="detail-info">
            <StyledText className="label">Sensação Térmica</StyledText>
            <StyledText className="value">{Math.round(data.main.feels_like || data.main.temp)}°C</StyledText>
          </div>
        </DetailItem>
        <DetailItem>
          <WiHumidity />
          <div className="detail-info">
            <StyledText className="label">Umidade</StyledText>
            <StyledText className="value">{data.main.humidity}%</StyledText>
          </div>
        </DetailItem>
        <DetailItem>
          <WiStrongWind />
          <div className="detail-info">
            <StyledText className="label">Velocidade do Vento</StyledText>
            <StyledText className="value">{data.wind.speed} m/s</StyledText>
          </div>
        </DetailItem>
        <DetailItem>
          <WiBarometer />
          <div className="detail-info">
            <StyledText className="label">Pressão</StyledText>
            <StyledText className="value">{data.main.pressure} hPa</StyledText>
          </div>
        </DetailItem>
      </DetailsList>

      <SunTimes>
        <div className="sun-item">
          <WiSunrise />
          <div>
            <StyledText className="time">{data.sunrise}</StyledText>
            <StyledText className="label">Nascer do Sol</StyledText>
          </div>
        </div>
        <div className="sun-item">
          <WiSunset />
          <div>
            <StyledText className="time">{data.sunset}</StyledText>
            <StyledText className="label">Pôr do Sol</StyledText>
          </div>
        </div>
      </SunTimes>

      <WeatherChart data={data.forecast} />
    </Card>
  );
};

export default WeatherCard; 