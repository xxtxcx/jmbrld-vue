export default function handler(req, res) {
  console.log('API request received');
  res.status(200).json([{ title: 'Test Song', artist: 'Test Artist' }]);
}
// import { v4 as uuidv4 } from 'uuid';
// import { connectToDatabase } from './dbConnect.js';

// const { db } = await connectToDatabase();
// const songs1 = db.collection('songs');
// const collection = db.collection('songs');

// export default async function handler(req, res) {
//   switch (req.method) {
//     case 'GET':

//        try {
//         const songs = await collection.find({}).toArray();
//         res.status(200).json(songs);
//         console.log("Songs fetched successfully:", songs);
//       } catch (error) {
//         console.error("Error in /api/songs:", error);
//         res.status(500).json({ error: error.message });
//       }
//       break;
//     case 'POST':
//         const song = req.body;
//                 const result = await collection.insertOne(song);
//                 res.status(201).json(result.ops[0]);
//       break;
//     default:
//       res.status(405).end(); //Method Not Allowed
//   }
// }