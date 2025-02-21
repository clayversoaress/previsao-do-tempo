import axios from 'axios';

const BASE_URL = 'https://apiprevmet3.inmet.gov.br/previsao';
const IBGE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';

export const getWeather = async (cityName) => {
  try {
    // Normaliza o nome da cidade
    const normalizedSearch = cityName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

    // Primeiro, verifica se é um estado
    const estadosResponse = await axios.get(`${IBGE_URL}/estados`);
    const isEstado = estadosResponse.data.some(estado => 
      estado.nome.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .includes(normalizedSearch) ||
      estado.sigla.toLowerCase() === normalizedSearch
    );

    if (isEstado) {
      throw new Error('Por favor, digite o nome de uma cidade, não de um estado.');
    }

    // Busca cidades que contenham o termo pesquisado
    const citiesResponse = await axios.get(`${IBGE_URL}/municipios`, {
      params: {
        nome: normalizedSearch
      }
    });

    if (!citiesResponse.data || citiesResponse.data.length === 0) {
      throw new Error('Cidade não encontrada. Verifique o nome e tente novamente.');
    }

    // Procura por correspondência exata primeiro
    let cityMatch = citiesResponse.data.find(city => 
      city.nome.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim() === normalizedSearch
    );

    // Se não encontrar correspondência exata, usa a primeira cidade da lista
    if (!cityMatch) {
      cityMatch = citiesResponse.data[0];
    }

    const cityCode = cityMatch.id;

    // Busca previsão do tempo
    const weatherResponse = await axios.get(`${BASE_URL}/${cityCode}`);
    
    if (!weatherResponse.data || !weatherResponse.data[cityCode]) {
      throw new Error(`Dados meteorológicos não disponíveis para ${cityMatch.nome}`);
    }

    const data = weatherResponse.data[cityCode];
    const today = Object.values(data)[0];

    if (!today || !today.manha) {
      throw new Error(`Dados meteorológicos incompletos para ${cityMatch.nome}`);
    }

    // Formatando os dados para nosso formato
    return {
      name: `${cityMatch.nome} - ${cityMatch.microrregiao.mesorregiao.UF.sigla}`,
      main: {
        temp: parseInt(today.manha.temp_max),
        feels_like: parseInt(today.manha.temp_max),
        humidity: parseInt(today.manha.umidade_max),
        pressure: 1010
      },
      weather: [{
        description: today.manha.resumo || 'Céu limpo',
        icon: getWeatherIcon(today.manha.icone)
      }],
      wind: {
        speed: parseInt(today.manha.int_vento || '0')
      },
      sys: {
        sunrise: "06:00",
        sunset: "18:00"
      },
      forecast: generateHourlyForecast(today)
    };
  } catch (error) {
    console.error('Erro original:', error);
    if (error.message.includes('Por favor, digite')) {
      throw new Error(error.message);
    } else if (error.message.includes('Cidade não encontrada')) {
      throw new Error('Cidade não encontrada. Verifique o nome e tente novamente.');
    } else if (error.message.includes('Dados meteorológicos')) {
      throw new Error(error.message);
    }
    throw new Error('Erro ao buscar dados do clima. Tente novamente mais tarde.');
  }
};

// Função para gerar previsão por hora (simulada com base nos dados diários)
const generateHourlyForecast = (dayData) => {
  const hours = [];
  const now = new Date();
  const startHour = now.getHours();
  
  // Gera dados para as próximas 24 horas
  for (let i = 0; i < 24; i++) {
    const hour = (startHour + i) % 24;
    let temp;
    
    // Define a temperatura com base no período do dia
    if (hour >= 6 && hour < 12) { // Manhã
      temp = parseInt(dayData.manha?.temp_max || 25);
    } else if (hour >= 12 && hour < 18) { // Tarde
      temp = parseInt(dayData.tarde?.temp_max || 27);
    } else { // Noite
      temp = parseInt(dayData.noite?.temp_max || 22);
    }
    
    // Adiciona uma pequena variação aleatória
    const variation = Math.random() * 2 - 1;
    
    const forecastDate = new Date(now);
    forecastDate.setHours(hour, 0, 0, 0);
    
    hours.push({
      dt: Math.floor(forecastDate.getTime() / 1000),
      main: {
        temp: temp + variation
      }
    });
  }

  return hours.sort((a, b) => a.dt - b.dt);
};

// Função para mapear ícones do INMET para nossas URLs
const getWeatherIcon = (inmetIcon) => {
  const hour = new Date().getHours();
  const isDayTime = hour >= 6 && hour < 18;
  const isEvening = hour >= 16 && hour < 18;
  const isMorning = hour >= 6 && hour < 10;

  // Base URL para ícones mais claros
  const baseUrl = 'https://openweathermap.org/img/wn/';

  const iconMap = {
    // Tempo limpo
    'ps': isDayTime 
      ? (isMorning 
          ? `${baseUrl}01d@4x.png` // Sol nascendo (amarelo claro)
          : isEvening 
            ? `${baseUrl}01d@4x.png` // Sol se pondo (laranja)
            : `${baseUrl}01d@4x.png`) // Sol pleno (amarelo)
      : `${baseUrl}01n@4x.png`, // Lua clara

    // Parcialmente nublado
    'pc': isDayTime
      ? `${baseUrl}02d@4x.png` // Sol com nuvens
      : `${baseUrl}02n@4x.png`, // Lua com nuvens

    // Nublado
    'nb': isDayTime
      ? `${baseUrl}03d@4x.png` // Nublado dia
      : `${baseUrl}03n@4x.png`, // Nublado noite

    // Muito nublado
    'nc': isDayTime
      ? `${baseUrl}04d@4x.png`
      : `${baseUrl}04n@4x.png`,

    // Chuvas
    'cm': isDayTime
      ? `${baseUrl}10d@4x.png` // Chuva de dia
      : `${baseUrl}10n@4x.png`, // Chuva de noite
    'cn': `${baseUrl}10n@4x.png`, // Chuva noturna
    'ct': `${baseUrl}10d@4x.png`, // Chuva tarde
    
    // Pancadas de chuva
    'pp': isDayTime
      ? `${baseUrl}09d@4x.png`
      : `${baseUrl}09n@4x.png`,
    'cv': isDayTime
      ? `${baseUrl}09d@4x.png`
      : `${baseUrl}09n@4x.png`,
    'ch': isDayTime
      ? `${baseUrl}09d@4x.png`
      : `${baseUrl}09n@4x.png`,

    // Condições especiais
    'nv': isDayTime
      ? `${baseUrl}50d@4x.png` // Neblina dia
      : `${baseUrl}50n@4x.png`, // Neblina noite
    'np': isDayTime
      ? `${baseUrl}09d@4x.png`
      : `${baseUrl}09n@4x.png`,

    // Variações noturnas específicas
    'pn': `${baseUrl}01n@4x.png`, // Noite limpa (lua)
    'pnt': `${baseUrl}02n@4x.png`, // Noite parcialmente nublada
    'pcn': `${baseUrl}10n@4x.png`, // Noite com chuva

    // Variações com chuva
    'pcm': `${baseUrl}10d@4x.png`, // Chuva manhã
    'pct': `${baseUrl}10d@4x.png`, // Chuva tarde
  };
  
  // Ícone padrão mais apropriado para o horário
  const defaultIcon = isDayTime 
    ? `${baseUrl}01d@4x.png` // Sol por padrão durante o dia
    : `${baseUrl}01n@4x.png`; // Lua por padrão durante a noite

  return iconMap[inmetIcon] || defaultIcon;
};

// Não precisamos mais do getForecast separado
export const getForecast = async (city) => {
  const response = await getWeather(city);
  return {
    list: response.forecast
  };
}; 