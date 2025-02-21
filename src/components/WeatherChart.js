import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 2rem;
  padding: 1rem;
  background: ${({ theme }) => theme.background};
  border-radius: 10px;
`;

const TooltipContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.shadow};
`;

const WeatherChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Simplifica os dados para o gráfico
  const chartData = data.map(item => ({
    hora: new Date(item.dt * 1000).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    temperatura: Math.round(item.main.temp)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <TooltipContainer>
        <p style={{ margin: 0 }}>{`${label}`}</p>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{`${payload[0].value}°C`}</p>
      </TooltipContainer>
    );
  };

  return (
    <ChartContainer>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="hora"
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="temperatura"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default WeatherChart; 