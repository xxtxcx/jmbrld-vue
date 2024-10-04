import { connectToDatabase } from './dbConnect.js';
import { ObjectId } from 'mongodb';

const { db } = await connectToDatabase();
const playlistsCollection = db.collection('playlists');

export default async function handler(req, res) {
  // Додаємо базові CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');


  // Обробка preflight запитів
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  switch (req.method) {
    case 'GET':
      try {
        const playlists = await playlistsCollection.find({}).toArray();
        res.status(200).json(playlists);
      } catch (error) {
        console.error("Error in GET /api/playlists:", error);
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const playlist = req.body;
        if (!playlist.name || !Array.isArray(playlist.songIds)) {
          return res.status(400).json({ error: "Invalid playlist data" });
        }
        const result = await playlistsCollection.insertOne({
          ...playlist,
          updatedAt: new Date()
        });
        if (result.acknowledged) {
          const insertedPlaylist = await playlistsCollection.findOne({ _id: result.insertedId });
          res.status(201).json(insertedPlaylist);
        } else {
          throw new Error("Failed to insert the playlist");
        }
      } catch (error) {
        console.error("Error in POST /api/playlists:", error);
        res.status(500).json({ error: error.message });
      }
      break;

      case 'PUT':
        case 'DELETE':
          console.log(`Received ${req.method} request for playlist ${req.query.id}`);
          res.status(200).json({ message: `${req.method} request received` });
          break;

    default:
      res.status(405).end(); // Method Not Allowed
  }
}