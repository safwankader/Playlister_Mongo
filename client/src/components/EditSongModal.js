import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function EditSongModal () {
    const { store } = useContext(GlobalStoreContext);

    

    
    function handleEditSong(event) {
        let title = document.getElementById("edit-song-modal-title-textfield").value;
        let artist = document.getElementById("edit-song-modal-artist-textfield").value;
        let link = document.getElementById("edit-song-modal-youTubeId-textfield").value;

        store.editMarkedSong(title,artist,link)
    }

    function handleCloseModal(event) {
        store.hideEditSongModal();
    }

    return (
            
        <div
        className="modal"
        id="edit-song-modal"
        data-animation="slideInOutLeft">
        <div className="modal-dialog">
            <header className="dialog-header">
                Edit Song
            </header>
                <label class="modal-label" for="edit-song-modal-title-textfield" id="title-prompt"><b>Title:</b></label>
                <input class="modal-textfield"id="edit-song-modal-title-textfield" type="text" />
                <br />
                <label class="modal-label" for="edit-song-modal-artist-textfield" id="artist-prompt"><b>Artist:</b></label>
                <input class="modal-textfield" id="edit-song-modal-artist-textfield" type="text" />
                <br />
                <label class="modal-label" for="edit-song-modal-youTubeId-textfield" id="you-tube-id-prompt"><b> Youtube Id:</b></label>
                <input class="modal-textfield" id="edit-song-modal-youTubeId-textfield" type="text" />
            <div class="confirm-cancel-box" id="confirm-cancel-container">
                <button
                    id="dialog-yes-button"
                    className="modal-button"
                    onClick={handleEditSong}
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

export default EditSongModal;