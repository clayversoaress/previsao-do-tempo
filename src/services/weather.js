export const getWeatherData = async (city) => {
  try {
    // Primeiro, precisamos converter a cidade em coordenadas
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&language=pt&count=1`;
    const geocodingResponse = await fetch(geocodingUrl);
    const geocodingData = await geocodingResponse.json();

    if (!geocodingData.results || geocodingData.results.length === 0) {
      throw new Error('Cidade não encontrada');
    }

    const location = geocodingData.results[0];
    
    // Agora buscamos o clima usando as coordenadas
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,pressure_msl&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    // Formatando os dados para manter compatibilidade com o componente existente
    return {
      name: location.name,
      main: {
        temp: weatherData.current.temperature_2m,
        humidity: weatherData.current.relative_humidity_2m,
        pressure: weatherData.current.pressure_msl
      },
      wind: {
        speed: weatherData.current.wind_speed_10m
      },
      weather: [{
        description: getWeatherDescription(weatherData.current.weather_code),
        icon: getWeatherIcon(weatherData.current.weather_code)
      }]
    };
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

// Função para converter os códigos de clima em descrições em português
function getWeatherDescription(code) {
  const descriptions = {
    0: 'Céu limpo',
    1: 'Parcialmente nublado',
    2: 'Algumas nuvens',
    3: 'Nuvens dispersas',
    45: 'Neblina',
    48: 'Nevoeiro com formação de gelo',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa intensa',
    61: 'Chuva fraca',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    80: 'Pancadas de chuva',
    95: 'Tempestade com raios'
  };
  return descriptions[code] || 'Indisponível';
}

// Função para converter códigos de clima em ícones
function getWeatherIcon(code) {
  if (code === 0) return '01d';  // céu limpo
  if (code === 1) return '02d';  // parcialmente nublado
  if (code === 2) return '03d';  // nublado
  if (code === 3) return '04d';  // encoberto
  if (code >= 45 && code <= 48) return '50d';  // neblina
  if (code >= 51 && code <= 55) return '09d';  // garoa
  if (code >= 61 && code <= 65) return '10d';  // chuva
  if (code === 80) return '09d';  // pancadas de chuva
  if (code === 95) return '11d';  // tempestade
  return '03d';  // padrão: nublado
} 