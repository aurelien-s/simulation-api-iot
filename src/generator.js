import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { round } from './helper/tools.js';
import ms from 'ms';

const TEMP_DELTA = 3;
const TEMP_TIME = '2m';

const HUMIDITY_DELTA = 5;
const HUMIDITY_TIME = '30s';


export default async function launchDataGenerator(dataCallback) {

  //! Init database
  const defaultData = {
    temperature: [],
    humidity: []
  };
  const db = new Low(new JSONFile(import.meta.dirname + '/data/db.json'), defaultData);
  await db.read();

  //! Generate temperature
  async function temperatureGenerator () {
    await db.update(({ temperature }) => {
      const lastData = temperature.findLast(() => true)?.value ?? 42;

      const offset = (Math.random() * TEMP_DELTA * 2) - TEMP_DELTA;
      const data = {
        value: round(lastData + offset),
        timestamp: new Date().toISOString()
      };

      temperature.push(data);
      dataCallback('temperature', data);
    });
  }
  setInterval(temperatureGenerator, ms(TEMP_TIME));
  temperatureGenerator()

  //! Generate humidity
  async function humidityGenerator() {
    await db.update(({ humidity }) => {
      const lastData = humidity.findLast(() => true)?.value ?? 80;

      let offset = (Math.random() * HUMIDITY_DELTA);
      if (lastData > 90) {
        offset *= -1;
      }
      else if (lastData > 50) {
        offset = (offset * 2) - HUMIDITY_DELTA;
      }

      const data = {
        value: Math.min(round(lastData + offset), 100),
        timestamp: new Date().toISOString()
      };

      humidity.push(data);
      dataCallback('humidity', data);
    });
  }
  setInterval(humidityGenerator, ms(HUMIDITY_TIME));
  humidityGenerator();

  return db;
} 