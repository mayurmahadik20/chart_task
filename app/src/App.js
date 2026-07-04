import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { LineChart, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, Bar, ResponsiveContainer, Brush } from 'recharts';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const socket = socketIOClient('http://127.0.0.1:4001/');
      socket.on('message', (data) => {
        setData(data);
      });
      return () => socket.disconnect();
    } else {
      // Simulate backend for deployed environment
      let counter = 0;
      const getRandomValue = () => Math.floor(Math.random() * 100);
      let simulatedData = [
        { name: `${counter}`, value: getRandomValue() },
        { name: `${counter+1}`, value: getRandomValue() },
        { name: `${counter+2}`, value: getRandomValue() },
        { name: `${counter+3}`, value: getRandomValue() },
        { name: `${counter+4}`, value: getRandomValue() },
      ];
      setData([...simulatedData]);

      const interval = setInterval(() => {
        counter++;
        simulatedData.push({ name: String(counter + 4), value: getRandomValue() });
        if (simulatedData.length > 20) simulatedData.shift();
        setData([...simulatedData]);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div>
      <h1>Live Students Marcks Updates with Interactive Charts</h1>
      
      <div>
        <h2>Line Chart</h2>
        <ResponsiveContainer width="80%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="name" label={{ value: 'Roll Number', position: 'insideBottom'}} />
            <YAxis label={{ value: 'Marks', angle: -90, position: 'insideLeft', }} />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line type="monotone" dataKey="value" stroke="#ff7300" yAxisId={0} />
            <Brush dataKey="name" height={30} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h2>Bar Chart</h2>
        <ResponsiveContainer width="80%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" label={{ value: 'Roll Number', position: 'insideBottom' }} />
            <YAxis label={{ value: 'Marks', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Bar dataKey="value" fill="#387908" />
            <Brush dataKey="name" height={30} stroke="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
