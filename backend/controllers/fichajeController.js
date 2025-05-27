import Fichaje from '../models/Fichaje.js';
import mongoose from 'mongoose';

export const createFichaje = async (req, res) => {
  const { type } = req.body;
  const userId = req.session.userId;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  try {
    let fichaje = await Fichaje.findOne({ userId, date: today });

    if (!fichaje) {
      if (type === 'salida') {
        return res.status(400).json({ message: 'No hay fichaje de entrada previo' });
      }
      fichaje = new Fichaje({
        userId,
        date: today,
        records: []
      });
    }

    const lastRecord = fichaje.records[fichaje.records.length - 1];

    // Validate same type consecutive fichajes
    if (lastRecord && lastRecord.type === type) {
      return res.status(400).json({ 
        message: type === 'entrada' ? 
          'Ya existe un fichaje de entrada activo' : 
          'No hay fichaje de entrada previo'
      });
    }

    const record = {
      type,
      timestamp: now
    };

    if (type === 'salida') {
      const lastEntry = fichaje.records
        .filter(r => r.type === 'entrada')
        .sort((a, b) => b.timestamp - a.timestamp)[0];

      if (lastEntry) {
        const duration = Math.floor((now - lastEntry.timestamp) / 1000);
        record.duration = duration;
        fichaje.totalDailyDuration += duration;
      }
    }

    fichaje.records.push(record);
    await fichaje.save();
    res.status(201).json(fichaje);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodayFichajes = async (req, res) => {
  try {
    const userId = req.session.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fichaje = await Fichaje.findOne({ 
      userId, 
      date: { $gte: today } 
    });

    if (!fichaje) {
      return res.status(200).json({ records: [] });
    }

    res.status(200).json(fichaje);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};