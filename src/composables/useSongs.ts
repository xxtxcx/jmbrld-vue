import { ref, computed } from 'vue'
import axios from 'axios'

interface Song {
  _id: number;
  title: string;
  artist: string;
  originalKey: string;
  chords: string;
  bpm: string;
}

export function useSongs() {
  const songs = ref<Song[]>([])
  const selectedSong = ref<Song | null>(null)
  const expandedSong = ref<number | null>(null)
  const searchTerm = ref("")

  const fetchSongs = async () => {
    try {
      console.log('Fetching songs...')
      const response = await axios.get('/api/songs')
      console.log('Raw response:', response)
      console.log('Response data:', response.data)
      if (Array.isArray(response.data)) {
        songs.value = response.data
        console.log('Songs updated:', songs.value)
      } else {
        console.error('Unexpected response format:', response.data)
      }
    } catch (error) {
      console.error('Error fetching songs:', error)
    }
  }

  const addNewSong = async (newSong: Omit<Song, '_id'>) => {
    try {
      const response = await axios.post('/api/songs', newSong)
      songs.value.push(response.data)
      return true
    } catch (error) {
      console.error('Error adding new song:', error)
      return false
    }
  }

  const searchSongs = (items: Song[], term: string) => {
    if (term.length === 0) {
      return items
    }
    return items.filter(item => 
      item.title.toLowerCase().includes(term.toLowerCase()) ||
      item.artist.toLowerCase().includes(term.toLowerCase())
    )
  }

  const visibleSongList = computed(() => searchSongs(songs.value, searchTerm.value))

  const selectSong = (song: Song, isWideScreen: boolean) => {
    if (isWideScreen) {
      selectedSong.value = song
    } else {
      expandedSong.value = expandedSong.value === song._id ? null : song._id
    }
  }

  return {
    songs,
    selectedSong,
    expandedSong,
    searchTerm,
    visibleSongList,
    fetchSongs,
    addNewSong,
    selectSong,
  }
}