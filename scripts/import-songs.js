import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { MongoClient } from 'mongodb';

const DEFAULT_INPUT = path.resolve(
  process.cwd(),
  '..',
  'script-text-chords',
  'output_jmbrld',
  'songs.jmbrld.json',
);

function normalizeSong(song) {
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
    sourceSongId: String(song.sourceSongId ?? song.songId ?? song._id ?? '').trim(),
    originalKey: String(song.originalKey ?? '').trim(),
    bpm: song.bpm ?? '',
    updatedAt: new Date(),
  };
}

async function main() {
  const inputArg = process.argv[2];
  const inputPath = inputArg ? path.resolve(process.cwd(), inputArg) : DEFAULT_INPUT;
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set in environment variables.');
  }

  const raw = await readFile(inputPath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected array in ${inputPath}`);
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db();
  const songs = db.collection('songs');

  let upserts = 0;
  let inserts = 0;
  let updates = 0;
  let skipped = 0;

  for (const item of parsed) {
    const song = normalizeSong(item);
    if (!song.title || !song.artist) {
      skipped += 1;
      continue;
    }

    const filter = song.sourceSongId
      ? { sourceSongId: song.sourceSongId }
      : song.sourceUrl
      ? { sourceUrl: song.sourceUrl }
      : { title: song.title, artist: song.artist };

    const existing = await songs.findOne(filter, { projection: { _id: 1 } });
    const now = new Date();

    const result = await songs.updateOne(
      filter,
      {
        $set: { ...song, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );

    upserts += 1;
    if (existing) {
      updates += 1;
    } else if (result.upsertedCount > 0) {
      inserts += 1;
    }
  }

  await client.close();
  console.log(`Import completed. processed=${upserts}, inserted=${inserts}, updated=${updates}, skipped=${skipped}`);
}

main().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
