import { ref, computed } from 'vue'
import axios from 'axios'

interface Song {
  _id: string;
  title: string;
  artist: string;
  originalKey: string;
  chords: string;
  bpm: string;
}

export function useSongs() {
  const songs = ref<Song[]>([])
  const originalSongs = ref<Song[]>([])
  const selectedSong = ref<Song | null>(null)
  const expandedSong = ref<string | null>(null)
  const searchTerm = ref("")

  const setSongs = (newSongs: Song[]) => {
    songs.value = newSongs;
  }

  const fetchSongs = async () => {
    try {
      console.log('Fetching songs...')
      const response = await axios.get('/api/songs')
      console.log('Raw response:', response)
      console.log('Response data:', response.data)
      if (Array.isArray(response.data)) {
        songs.value = response.data.filter(song => 
          typeof song.title === 'string' && 
          typeof song.artist === 'string'
        )
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
      console.log('Sending new song data:', newSong);
      const response = await axios.post('/api/songs', newSong);
      console.log('Server response:', response);
      songs.value.push(response.data);
      return true;
    } catch (error) {
      console.error('Error adding new song:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        console.error('Response headers:', error.response?.headers);
      }
      return false;
    }
  };

  const searchSongs = (items: Song[], term: string) => {
    if (term.length === 0) {
      return items
    }
    return items.filter(item => 
      (item.title?.toLowerCase().includes(term.toLowerCase()) ?? false) ||
      (item.artist?.toLowerCase().includes(term.toLowerCase()) ?? false)
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

  const updateSearch = (term: string) => {
    searchTerm.value = term
  }

  return {
    songs,
    originalSongs,
    selectedSong,
    expandedSong,
    searchTerm,
    visibleSongList,
    fetchSongs,
    addNewSong,
    selectSong,
    updateSearch,
    setSongs,
  }
}