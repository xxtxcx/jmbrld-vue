import { connectToDatabase } from './dbConnect.js';

const { db } = await connectToDatabase();
const collection = db.collection('songs');

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const songs = await collection.find({}).toArray();
        res.status(200).json(songs);
      } catch (error) {
        console.error("Error in GET /api/songs:", error);
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const song = req.body;

        // Basic validation
        if (!song.title || !song.artist || !song.originalKey) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await collection.insertOne(song);
        
        if (result.acknowledged) {
          const insertedSong = await collection.findOne({ _id: result.insertedId });
          res.status(201).json(insertedSong);
        } else {
          throw new Error("Failed to insert the song");
        }
      } catch (error) {
        console.error("Error in POST /api/songs:", error);
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.status(405).end(); //Method Not Allowed
  }
}