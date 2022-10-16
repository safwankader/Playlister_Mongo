import { useCallback, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import { GlobalStoreContext } from '../store'
import DeleteSongModal from './DeleteSongModal'
import EditSongModal from './EditSongModal'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function PlaylistCards() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();
    

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown',handleKeyPress);
        }

    },[store]);

    const handleKeyPress = useCallback((event) => {
        let undoButton = document.getElementById('undo-button');
        let redoButton = document.getElementById('redo-button')
            if ( event.ctrlKey && (event.key === 'z' || event.key === 'Z')) {
                undoButton.click(); 
              }
            else if ( event.ctrlKey && (event.key === 'y' || event.key === 'Y')) {
                redoButton.click();
              }
    }, []);

    

    if(store.currentList === null){
        store.history.push("/");
        return null;
    }
    return (
        <div id="playlist-cards">
        {
            store.currentList.songs.map((song, index) => (
                <SongCard
                    id={'playlist-song-' + (index)}
                    key={'playlist-song-' + (index)}
                    index={index}
                    song={song}
                />
            ))
        }
        <EditSongModal />
        <DeleteSongModal />
        </div>
    )
}

export default PlaylistCards;