import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteSongModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = store.deleteSongName;
    function handleDeleteSong(event) {
        store.deleteMarkedSong();
    }
    function handleCloseModal(event) {
        store.hideDeleteSongModal();
    }
    return (
        <div
            className="modal"
            id="delete-song-modal"
            data-animation="slideInOutLeft">
            <div className="modal-dialog">
                <header className="dialog-header">
                    Delete {name} from the Playlist?
                </header>
                <div id="confirm-cancel-container">
                    <button
                        id="dialog-yes-button"
                        className="modal-button"
                        onClick={handleDeleteSong}
                    >Confirm</button>
                    <button
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handleCloseModal}
                    >Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteSongModal;