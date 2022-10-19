import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "playlister-button";
    let disabledButtonClass = "playlister-button disabled";

    let canAdd = store.currentList !== null;
    let canClose = store.currentList !== null;

    if(store.currentList === null){
        if(document.getElementById("undo-button") && document.getElementById("redo-button")){
        document.getElementById("undo-button").classList.add("disabled");
        document.getElementById("redo-button").classList.add("disabled");
        }
    }

    function handleAddSong() {
        store.addSongTransaction();
        // store.refreshCurrentList();
    }
    function handleUndo(event) {
        console.log('trying to undo')
        store.undo();
    }
    function handleRedo(event) {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    let editStatus = false;
    if (store.listNameActive) {
        editStatus = true;
    }
    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                value="+"
                className={enabledButtonClass}
                onClick={handleAddSong}
                disabled={!canAdd}
            />
            <input
                type="button"
                id='undo-button'
                value="⟲"
                className={disabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                value="⟳"
                className={disabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
                disabled={!canClose}
            />
        </span>);
}

export default EditToolbar;