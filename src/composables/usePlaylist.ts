import { ref, watchEffect } from 'vue'
import axios from 'axios'

interface Playlist {
  _id?: string;
  name: string;
  songIds: string[];
  updatedAt: Date;
}

export function usePlaylist() {
  const allPlaylists = ref<Playlist[]>([
    { name: 'Local Playlist', songIds: [], updatedAt: new Date() }
  ])
  const selectedPlaylistIndex = ref(0)

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('/api/playlists')
      console.log('Fetched playlists:', response.data)
      allPlaylists.value = [allPlaylists.value[0], ...response.data]
    } catch (error) {
      console.error('Error fetching playlists:', error)
    }
  }

  const initLocalPlaylist = () => {
    const savedPlaylist = localStorage.getItem('localPlaylist')
    if (savedPlaylist) {
      allPlaylists.value[0] = JSON.parse(savedPlaylist)
    }
  }
  
  // Викликайте цю функцію при створенні composable
  initLocalPlaylist()

  const addSongToPlaylist = (songId: string, playlistIndex: number = 0) => {
    if (playlistIndex >= 0 && playlistIndex < allPlaylists.value.length) {
      if (!allPlaylists.value[playlistIndex].songIds.includes(songId)) {
        allPlaylists.value[playlistIndex] = {
          ...allPlaylists.value[playlistIndex],
          songIds: [...allPlaylists.value[playlistIndex].songIds, songId],
          updatedAt: new Date()
        }
        console.log(`Song ${songId} added to playlist ${playlistIndex}`)
        console.log('Updated playlist:', allPlaylists.value[playlistIndex])
      }
    } else {
      console.error(`Invalid playlist index: ${playlistIndex}`)
    }
  }

  const removeSongFromPlaylist = async (songId: string, playlistIndex: number) => {
    if (playlistIndex >= 0 && playlistIndex < allPlaylists.value.length) {
      const updatedPlaylist = {
        ...allPlaylists.value[playlistIndex],
        songIds: allPlaylists.value[playlistIndex].songIds.filter(id => id !== songId),
        updatedAt: new Date()
      }
      
      if (playlistIndex === 0) {
        // Локальний плейлист
        allPlaylists.value[playlistIndex] = updatedPlaylist
      } else {
        // Плейлист в базі даних
        try {
          const response = await axios.put(`/api/playlists/${updatedPlaylist._id}`, updatedPlaylist)
          allPlaylists.value[playlistIndex] = response.data
        } catch (error) {
          console.error('Error updating playlist:', error)
        }
      }
    }
  }

  const saveLocalPlaylist = async (name: string) => {
    try {
      const localPlaylist = { ...allPlaylists.value[0], name }
      const response = await axios.post('/api/playlists', localPlaylist)
      allPlaylists.value = [
        { name: 'Local Playlist', songIds: [], updatedAt: new Date() },
        response.data,
        ...allPlaylists.value.slice(1)
      ]
      console.log('Local playlist saved to database')
    } catch (error) {
      console.error('Error saving local playlist:', error)
    }
  }

  const clearLocalPlaylist = () => {
    allPlaylists.value[0] = { name: 'Local Playlist', songIds: [], updatedAt: new Date() }
  }

  const deletePlaylist = async (playlistIndex: number) => {
    if (playlistIndex === 0) return // Can't delete local playlist
    try {
      const playlistToDelete = allPlaylists.value[playlistIndex]
      if (playlistToDelete._id) {
        await axios.delete(`/api/playlists/${playlistToDelete._id}`)
        allPlaylists.value.splice(playlistIndex, 1)
        if (selectedPlaylistIndex.value >= playlistIndex) {
          selectedPlaylistIndex.value--
        }
        console.log(`Playlist ${playlistToDelete.name} deleted`)
      }
    } catch (error) {
      console.error('Error deleting playlist:', error)
    }
  }

  const selectPlaylist = (index: number) => {
    selectedPlaylistIndex.value = index
    console.log('Selected playlist index:', selectedPlaylistIndex.value)
  }

  const updatePlaylist = async (playlistIndex: number, updatedPlaylist: Partial<Playlist>) => {
    if (playlistIndex === 0) {
      // Оновлення локального плейлиста
      allPlaylists.value[0] = { ...allPlaylists.value[0], ...updatedPlaylist }
    } else if (playlistIndex < allPlaylists.value.length) {
      try {
        const playlist = allPlaylists.value[playlistIndex]
        if (playlist._id) {
          const response = await axios.put(`/api/playlists/${playlist._id}`, updatedPlaylist)
          allPlaylists.value[playlistIndex] = response.data
        }
      } catch (error) {
        console.error('Error updating playlist:', error)
      }
    }
  }

  // Fetch playlists on component mount
  fetchPlaylists()

  // Save local playlist to localStorage
  watchEffect(() => {
    console.log('Saving to localStorage:', allPlaylists.value[0])
    localStorage.setItem('localPlaylist', JSON.stringify(allPlaylists.value[0]))
  })

  watchEffect(() => {
    console.log('All playlists:', allPlaylists.value)
    console.log('Selected playlist index:', selectedPlaylistIndex.value)
    console.log('Selected playlist:', allPlaylists.value[selectedPlaylistIndex.value])
  })

  return {
    allPlaylists,
    selectedPlaylistIndex,
    addSongToPlaylist,
    removeSongFromPlaylist,
    saveLocalPlaylist,
    deletePlaylist,
    selectPlaylist,
    clearLocalPlaylist,
    fetchPlaylists,
    updatePlaylist
  }
}