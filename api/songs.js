// api/songs.js
import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from './dbConnect.js';

const { db } = await connectToDatabase();
const songs1 = db.collection('songs');
const collection = db.collection('songs');

// let songs = [
//   {
//     id: '1',
//     title: "Nothing is impossible",
//     artist: "Planetshakers",
//     bpm: "128",
//     originalKey: "C",
//     chords: "Chorus: C G Am F // Interlude: F C Dm F // Verse: C Dm F Am G F // Pre-Chorus: Am G F Am G Dm F // Bridge: F C Dm F //"
//   }
// ];

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
        const songs = await collection.find({}).toArray();
       res.status(200).json(songs);
      break;
    case 'POST':
        const song = req.body;
                const result = await collection.insertOne(song);
                res.status(201).json(result.ops[0]);
      break;
    // case 'PUT':
    //   const { id } = req.query;
    //   const index = songs.findIndex(song => song.id === id);
    //   if (index > -1) {
    //     songs[index] = { ...songs[index], ...req.body };
    //     res.status(200).json(songs[index]);
    //   } else {
    //     res.status(404).json({ message: 'Song not found' });
    //   }
    //   break;
    // case 'DELETE':
    //   const songId = req.query.id;
    //   songs = songs.filter(song => song.id !== songId);
    //   res.status(200).json({ message: 'Song deleted' });
    //   break;
    default:
      res.status(405).end(); //Method Not Allowed
  }
}

// import { connectToDatabase } from './dbConnect.js';

// export default async function handler(req, res) {
//   const { method } = req;

//   const { db } = await connectToDatabase();
//   const collection = db.collection('songs');

//   switch (method) {
//     case 'GET':
//       try {
//         const songs = await collection.find({}).toArray();
//         res.status(200).json(songs);
//       } catch (error) {
//         res.status(500).json({ error: 'Error fetching songs' });
//       }
//       break;

//     case 'POST':
//       try {
//         const song = req.body;
//         const result = await collection.insertOne(song);
//         res.status(201).json(result.ops[0]);
//       } catch (error) {
//         res.status(500).json({ error: 'Error adding song' });
//       }
//       break;

//     default:
//       res.setHeader('Allow', ['GET', 'POST']);
//       res.status(405).end(`Method ${method} Not Allowed`);
//   }
// }

// const { MongoClient } = require('mongodb');

// let cachedDb = null;

// async function connectToDatabase(uri) {
//   if (cachedDb) {
//     return cachedDb;
//   }
//   const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//   const db = await client.db(process.env.MONGODB_DB);
//   cachedDb = db;
//   return db;
// }

// module.exports = async (req, res) => {
//   const db = await connectToDatabase('mongodb+srv://atata426:qhqfN8Ai0Qrr0hm@jmbrld.zbxwy.mongodb.net/?retryWrites=true&w=majority');
//   const collection = await db.collection('songs');

//   if (req.method === 'GET') {
//     const songs = await collection.find({}).toArray();
//     res.status(200).json(songs);
//   } else if (req.method === 'POST') {
//     const newSong = req.body;
//     const result = await collection.insertOne(newSong);
//     res.status(201).json(result.ops[0]);
//   } else {
//     res.setHeader('Allow', ['GET', 'POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// };


// const { MongoClient, ObjectId } = require('mongodb');

// const uri = 'mongodb+srv://atata426:qhqfN8Ai0Qrr0hm@jmbrld.zbxwy.mongodb.net/?retryWrites=true&w=majority';
// console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Module.exports = async (req, res) => {
//     console.log('API request received:', req.method, req.url);
    
//     res.setHeader('Content-Type', 'application/json');
    
//     try {
//       const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//       console.log('Connected to MongoDB');
      
//       const db = client.db('jmbrld');
//       const songs = db.collection('songs');
  
//       switch (req.method) {
//         case 'GET':
//           const allSongs = await songs.find({}).toArray();
//           console.log('Fetched songs:', allSongs);
//           res.status(200).json(allSongs);
//           break;
//         // ... інші case залишаються без змін
//         default:
//           res.status(405).json({ error: 'Method Not Allowed' });
//       }
  
//       await client.close();
//     } catch (error) {
//       console.error('API Error:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };

// module.exports = async (req, res) => {
//   try {
//     const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     const db = client.db('jmbrld');
//     const songs = db.collection('songs');

//     switch (req.method) {
//       case 'GET':
//         const allSongs = await songs.find({}).toArray();
//         res.status(200).json(allSongs);
//         break;

//     case 'POST':
//       const newSong = JSON.parse(req.body);
//       const result = await songs.insertOne(newSong);
//       res.status(201).json(result.ops[0]);
//       break;

//     case 'PUT':
//       const { id } = req.query;
//       const updatedSong = JSON.parse(req.body);
//       delete updatedSong._id;  // Видаляємо _id, щоб уникнути помилки оновлення
//       await songs.updateOne({ _id: ObjectId(id) }, { $set: updatedSong });
//       res.status(200).json({ message: 'Song updated successfully' });
//       break;

//     case 'DELETE':
//       const songId = req.query.id;
//       await songs.deleteOne({ _id: ObjectId(songId) });
//       res.status(200).json({ message: 'Song deleted successfully' });
//       break;

//     default:
//       res.status(405).end(); //Method Not Allowed
//     }

//     await client.close();
//   } catch (error) {
//     console.error('API Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };