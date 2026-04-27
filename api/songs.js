import { connectToDatabase } from './dbConnect.js';

function normalizeSongPayload(song) {
  return {
    title: String(song.title ?? '').trim(),
    artist: String(song.artist ?? '').trim(),
    album: String(song.album ?? '').trim(),
    cover: String(song.cover ?? '').trim(),
    youtube: String(song.youtube ?? '').trim(),
    text: String(song.text ?? '').trim(),
    chords: String(song.chords ?? '').trim(),
    chordLines: Array.isArray(song.chordLines)
      ? song.chordLines.map((line) => String(line).trim()).filter(Boolean)
      : [],
    sourceUrl: String(song.sourceUrl ?? '').trim(),
    sourceSongId: String(song.sourceSongId ?? song.songId ?? '').trim(),
    originalKey: String(song.originalKey ?? '').trim(),
    bpm: song.bpm ?? '',
    updatedAt: new Date(),
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { db } = await connectToDatabase();
  const collection = db.collection('songs');

  switch (req.method) {
    case 'GET':
      try {
        const query = String(req.query.q ?? '').trim();
        const limit = Math.min(Number(req.query.limit ?? 200) || 200, 1000);
        const page = Math.max(Number(req.query.page ?? 1) || 1, 1);
        const skip = (page - 1) * limit;
        const filter = query
          ? {
              $or: [
                { title: { $regex: query, $options: 'i' } },
                { artist: { $regex: query, $options: 'i' } },
                { album: { $regex: query, $options: 'i' } },
              ],
            }
          : {};

        const songs = await collection
          .find(filter)
          .sort({ artist: 1, title: 1 })
          .skip(skip)
          .limit(limit)
          .toArray();
        res.status(200).json(songs);
      } catch (error) {
        console.error("Error in GET /api/songs:", error);
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const song = normalizeSongPayload(req.body ?? {});

        if (!song.title || !song.artist) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        if (!song.createdAt) {
          song.createdAt = new Date();
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