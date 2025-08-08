import launchDataGenerator from './generator.js';
import express from 'express';
import expressWebSocket from 'express-ws';
import cors from 'cors';
import { argv } from 'node:process';

//! Define server port
const portRegex = /(?!^(--port|-p)=)[\d]+$/;
const argPort = argv.find(arg => portRegex.test(arg));
const port = argPort !== undefined ? parseInt(portRegex.exec(argPort)[0]) : 3000;

//! Web Server
const app = express();
const expressWs = expressWebSocket(app);
const clients = expressWs.getWss('/api/sensors/realtime').clients;

//! Middleware
app.use(cors());

//! Fake data generator
const db = await launchDataGenerator((sensor, data) => {

  //! Notification of new data via WebSocket
  clients.forEach(client => {
    client.send(JSON.stringify({ sensor, data }));
  });
});

//! Web Socket
app.ws('/api/sensors/realtime', function (ws, req) {
  console.log('Client connecté !');
  ws.on('close', () => {
    console.log('Client déconnecté.');
  });
});

//! Endpoints
//? - Last value of sensors
app.get('/api/sensors/current', async function (req, res) {
  await db.read();
  res.json({
    temperature: db.data.temperature.findLast(() => true),
    humidity: db.data.humidity.findLast(() => true),
  });
});

//? - History for one sensor
app.get('/api/sensors/history', async function (req, res) {
  const { start, end, sensor } = req.query;

  if (!sensor) {
    res.status(400).json({ message: 'Query "sensor" is required' });
    return;
  }

  const tempDate1 = end ? new Date(end) : new Date();
  const historyEnd = tempDate1.toISOString();

  tempDate1.setMinutes(tempDate1.getMinutes() - 10);

  const tempDate2 = start ? new Date(start) : tempDate1;
  const historyStart = tempDate2.toISOString();

  await db.read();
  res.json({
    start: historyStart,
    end: historyEnd,
    data: db.data[sensor]?.filter(d => d.timestamp >= historyStart && d.timestamp <= historyEnd)
  });
});

//! Server start
app.listen(port, () => {
  console.log(`Web server running on port ${port}`);
});