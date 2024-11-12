import { connectToDatabase } from './dbConnect.js';
import { ObjectId } from 'mongodb';

const { db } = await connectToDatabase();
const playlistsCollection = db.collection('playlists');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

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
        const { action, playlistId, data, songId } = req.body;
        
        // Create operation
        if (action === 'create') {
          if (!data.name || !Array.isArray(data.songIds)) {
            return res.status(400).json({ error: "Invalid playlist data" });
          }
          const result = await playlistsCollection.insertOne({
            ...data,
            updatedAt: new Date()
          });
          if (result.acknowledged) {
            const insertedPlaylist = await playlistsCollection.findOne({ _id: result.insertedId });
            return res.status(201).json(insertedPlaylist);
          }
        }
        
        // Update operation
        else if (action === 'update') {
          if (!playlistId) {
            return res.status(400).json({ error: "Playlist ID is required" });
          }

          const playlist = await playlistsCollection.findOne({ _id: new ObjectId(playlistId) });
          if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
          }

          // Якщо це оновлення для видалення пісні
          if (songId) {
            const updatedSongIds = playlist.songIds.filter(id => id !== songId);
            const result = await playlistsCollection.updateOne(
              { _id: new ObjectId(playlistId) },
              { 
                $set: { 
                  songIds: updatedSongIds,
                  updatedAt: new Date() 
                } 
              }
            );

            if (result.modifiedCount === 0) {
              return res.status(500).json({ error: "Failed to update playlist" });
            }

            const updatedPlaylist = await playlistsCollection.findOne({ _id: new ObjectId(playlistId) });
            return res.status(200).json(updatedPlaylist);
          } 
          // Звичайне оновлення плейлиста
          else if (data) {
            const result = await playlistsCollection.updateOne(
              { _id: new ObjectId(playlistId) },
              { $set: { ...data, updatedAt: new Date() } }
            );
            if (result.matchedCount === 0) {
              return res.status(404).json({ error: "Playlist not found" });
            }
            const updatedPlaylist = await playlistsCollection.findOne({ _id: new ObjectId(playlistId) });
            return res.status(200).json(updatedPlaylist);
          }
        }
        
        // Delete operation
        else if (action === 'delete') {
          if (!playlistId) {
            return res.status(400).json({ error: "Playlist ID is required" });
          }
          const result = await playlistsCollection.deleteOne({ _id: new ObjectId(playlistId) });
          if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Playlist not found" });
          }
          return res.status(200).json({ message: "Playlist deleted successfully" });
        }
        
        else {
          return res.status(400).json({ error: "Invalid action" });
        }
      } catch (error) {
        console.error("Error in POST /api/playlists:", error);
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.status(405).end();
  }
}