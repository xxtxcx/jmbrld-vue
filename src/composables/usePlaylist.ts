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
  
  initLocalPlaylist()

  const addSongToPlaylist = async (songId: string, playlistIndex: number = 0) => {
    if (playlistIndex >= 0 && playlistIndex < allPlaylists.value.length) {
      const playlist = allPlaylists.value[playlistIndex];
      
      // Перевіряємо чи пісня вже є в плейлисті
      if (!playlist.songIds.includes(songId)) {
        if (playlistIndex === 0) {
          // Локальний плейлист
          allPlaylists.value[playlistIndex] = {
            ...playlist,
            songIds: [...playlist.songIds, songId],
            updatedAt: new Date()
          };
          console.log(`Song added to local playlist`);
        } else {
          // Плейлист в базі даних
          try {
            const response = await axios.post('/api/playlists', {
              action: 'update',
              playlistId: playlist._id,
              data: {
                songIds: [...playlist.songIds, songId],
                updatedAt: new Date()
              }
            });
            
            if (response.data) {
              allPlaylists.value[playlistIndex] = response.data;
              console.log(`Song ${songId} added to database playlist ${playlistIndex}`);
            }
          } catch (error) {
            console.error('Error updating playlist:', error);
          }
        }
      } else {
        console.log(`Song ${songId} already exists in playlist ${playlist.name}`);
      }
    } else {
      console.error(`Invalid playlist index: ${playlistIndex}`);
    }
  }
  
  const removeSongFromPlaylist = async (songId: string, playlistIndex: number) => {
    if (playlistIndex >= 0 && playlistIndex < allPlaylists.value.length) {
      if (playlistIndex === 0) {
        // Локальний плейлист
        allPlaylists.value[playlistIndex] = {
          ...allPlaylists.value[playlistIndex],
          songIds: allPlaylists.value[playlistIndex].songIds.filter(id => id !== songId),
          updatedAt: new Date()
        }
      } else {
        // Плейлист в базі даних
        try {
          const playlist = allPlaylists.value[playlistIndex]
          const response = await axios.post('/api/playlists', {
            action: 'update',
            playlistId: playlist._id,
            songId: songId  // Додаємо songId для ідентифікації пісні, яку треба видалити
          })
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
      const response = await axios.post('/api/playlists', {
        action: 'create',
        data: localPlaylist
      })
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
        await axios.post('/api/playlists', {
          action: 'delete',
          playlistId: playlistToDelete._id
        })
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
          const response = await axios.post('/api/playlists', {
            action: 'update',
            playlistId: playlist._id,
            data: updatedPlaylist
          })
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