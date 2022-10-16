import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import AddSong_Transaction from '../transactions/AddSong_Transaction';
import MoveSong_Transaction from '../transactions/MoveSong_Transaction';
import EditSong_Transaction from '../transactions/EditSong_Transaction';
import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION : "MARK_LIST_FOR_DELETION",
    MARK_SONG_FOR_DELETION : "MARK_SONG_FOR_DELETION",
    MARK_SONG_TO_EDIT : "MARK_SONG_TO_EDIT"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        listMarkedForDeletion: null,
        deleteListName : null,
        deleteSongIndex : null,
        deleteSongName : null,
        songEditIndex : null,


    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    deleteListName : null,
                    deleteSongIndex : null,
                    deleteSongName : null,
                    songEditIndex: null,


                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    deleteListName : null,
                    deleteSongIndex: null,
                    deleteSongName : null,
                    songEditIndex : null,


                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    deleteListName : null,
                    deleteSongIndex : null,
                    deleteSongName : null,
                    songEditIndex : null,


                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    deleteListName : null,
                    deleteSongIndex : null,
                    deleteSongName : null,
                    songEditIndex : null,


                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: payload._id,
                    deleteListName : payload.name,
                    deleteSongIndex : null,
                    deleteSongName : null,
                    songEditIndex : null,


                });
            }
            // EDIT A SONG
            case GlobalStoreActionType.MARK_SONG_TO_EDIT: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    deleteListName : null,
                    deleteSongIndex : null,
                    deleteSongName : null,
                    songEditIndex : payload,


                });
            }
            // PREPARE A SONG FOR DELETION
            case GlobalStoreActionType.MARK_SONG_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    deleteListName : null,
                    deleteSongIndex : payload,
                    deleteSongName : store.currentList.songs[payload].title,
                    songEditIndex : null,
                    
 

                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    deleteListName : null,
                    deleteSongIndex : null,
                    deleteSongName : null,
                    songEditIndex : null,


                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listMarkedForDeletion: null,
                    deleteListName : null,
                    deleteSongIndex : null,
                    deleteSongName : null,
                    songEditIndex : null,


                });
            }
            default:
                return store;
        }
    }

    // TRANSACTIONS 
    

    store.addSongTransaction = function() {
        let transaction = new AddSong_Transaction(store);
        tps.addTransaction(transaction);
        store.refreshCurrentList();
        store.checkUndoRedo();
    }

    store.addMoveSongTransaction = function(start,end) {
        let transaction = new MoveSong_Transaction(store,start,end);
        tps.addTransaction(transaction);
        store.checkUndoRedo();
    }

    store.addDeleteSongTransaction = function() {
        let transaction = new DeleteSong_Transaction(store,store.deleteSongIndex)
        tps.addTransaction(transaction);
        store.checkUndoRedo();
    }

    store.addEditSongTransaction = function (index,title,artist,link) {
        let transaction = new EditSong_Transaction(store,index, title, artist, link);
        tps.addTransaction(transaction);
        store.checkUndoRedo();
    }






    store.addSong = function() {
        let id = store.currentList._id;
        async function asyncAddSong(id) {
            const response = await api.getPlaylistById(id);
            
            if(response.data.success){
                let playlist = response.data.playlist;
                let newPlaylist = JSON.parse(JSON.stringify(playlist));
                newPlaylist.songs.push({
                    title: "Untitled",
                    artist: "Unknown",
                    youTubeId: "dQw4w9WgXcQ"
                });
                const addedSong = await api.updatePlaylistById(id,newPlaylist);
                if (addedSong.data.success){
                    store.refreshCurrentList();
                    }
                }
            }
            asyncAddSong(id);
        }

    // THIS FUNCTION ADDS A SONG AT AN INDEX

    store.addSongAtIndex = function(index,song){
        let id = store.currentList._id;
        async function asyncAddSongAtIndex(id) {
            const response = await api.getPlaylistById(id);
            
            if(response.data.success){
                let playlist = response.data.playlist;
                let newPlaylist = JSON.parse(JSON.stringify(playlist));
                newPlaylist.songs.splice(index,0,song);
                const addedSong = await api.updatePlaylistById(id,newPlaylist);
                if (addedSong.data.success){
                    store.refreshCurrentList();
                    }
                }
            }
            asyncAddSongAtIndex(id);
        }

    // THIS FUNCTION MOVES THE SONGS

    store.moveSong = function(start,end) {
        async function asyncMoveSong(start,end){
            let response = await api.getPlaylistById(store.currentList._id);
            if(response.data.success){
                let list = response.data.playlist;

                if (start < end) {
                    let temp = list.songs[start];
                    for (let i = start; i < end; i++) {
                        list.songs[i] = list.songs[i + 1];
                    }
                    list.songs[end] = temp;
                }
                else if (start > end) {
                    let temp = list.songs[start];
                    for (let i = start; i > end; i--) {
                        list.songs[i] = list.songs[i - 1];
                    }
                    list.songs[end] = temp;
                }

                const updatedList = await api.updatePlaylistById(store.currentList._id,list);
                if (updatedList.data.success){
                    store.refreshCurrentList();
                }
            }
    
        }
        asyncMoveSong(start,end);
      


    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = function() {
        async function asyncCreateNewList(){
            const response = await api.createPlaylist();
            if(response.data.success){
                let newPlaylist = response.data.playlist;
                if(response.data.success){
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: newPlaylist
                    });
                    store.setCurrentList(newPlaylist._id)
                    // store.history.push("/playlist" + newPlaylist._id);
                    // store.setNewList(newPlaylist._id);
                }
            }
        }

        asyncCreateNewList();

    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        store.checkUndoRedo();
        document.getElementById("add-song-button").disabled = true;
        document.getElementById("close-button").disabled = true;
    }



     // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function asyncSetDeleteList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                        payload: playlist
                    });
                    store.showDeleteListModal();
                }
            }
        }
        asyncSetDeleteList(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            console.log(id);
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                store.loadIdNamePairs();
                store.history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listMarkedForDeletion);
        store.hideDeleteListModal();
    }
    store.showDeleteListModal = function() {
        document.getElementById("add-list-button").classList.add("disabled");
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }
    store.hideDeleteListModal = function() {
        document.getElementById("add-list-button").classList.remove("disabled");
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
       
    }





    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }






    store.markSongForDeletion = function(index) {
            async function asyncSetSongforDeletion(index){
                const response = await api.getPlaylistById(store.currentList._id)
                if(response.data.success){
                     storeReducer({
                    type: GlobalStoreActionType.MARK_SONG_FOR_DELETION,
                    payload: index
                });

                store.showDeleteSongModal();
            }

        }

        asyncSetSongforDeletion(index);
        
    }

    store.deleteSong = function() {
        console.log(store.deleteSongIndex);
        async function processDeleteSong(){
            let response = await api.getPlaylistById(store.currentList._id)
            if(response.data.success){
                let playlist = response.data.playlist;
                let valueToRemove = [playlist.songs[store.deleteSongIndex]];
                let newSongs = playlist.songs.filter(song => !valueToRemove.includes(song));
                console.log(newSongs);
                playlist.songs = newSongs
                response = await api.updatePlaylistById(store.currentList._id,playlist)
                if(response.data.success){
                    
                    store.refreshCurrentList();
                }
            }
        }
        processDeleteSong();
    }

    store.deleteMarkedSong = function() {
        store.deleteSong();
        store.hideDeleteSongModal();
    }



    store.showDeleteSongModal = function() {
        let modal = document.getElementById("delete-song-modal");
        document.getElementById("add-song-button").disabled = true;
        document.getElementById("close-button").disabled = true;
        document.getElementById("undo-button").classList.add("disabled");
        document.getElementById("redo-button").classList.add("disabled");
        modal.classList.add("is-visible");
    }
    store.hideDeleteSongModal = function() {
        let modal = document.getElementById("delete-song-modal");
        document.getElementById("add-song-button").disabled = false;
        document.getElementById("close-button").disabled = false;
        modal.classList.remove("is-visible");
        store.checkUndoRedo();
    }




    // PROCESS FOR EDITING A SONG

    store.markSongToEdit = function (index) {
        async function asyncSetSongToEdit(index){
            const response = await api.getPlaylistById(store.currentList._id)
            if(response.data.success){
                 storeReducer({
                    type: GlobalStoreActionType.MARK_SONG_TO_EDIT,
                    payload: index
            });

            store.setEditInnerText(index);

            store.showEditSongModal();
        }

    }

    asyncSetSongToEdit(index);
}

    store.editSong = function(index, title, artist, link){
        async function asyncSetSongToEdit(index){
            const response = await api.getPlaylistById(store.currentList._id)
            if(response.data.success){
                let playlist = response.data.playlist;
                let editedSong = playlist.songs[index];
                editedSong.title = title;
                editedSong.artist = artist;
                editedSong.youTubeId = link;
                playlist.songs[index] = editedSong;

                let updatedPlaylist = await api.updatePlaylistById(store.currentList._id,playlist);

                if(updatedPlaylist.data.success){
                    store.refreshCurrentList();
                }
        }
    }
    asyncSetSongToEdit(index);
}

    store.editMarkedSong = function (title, artist, link) {
        store.addEditSongTransaction(store.songEditIndex, title, artist, link);
        store.hideEditSongModal();
    }


    store.setEditInnerText = function(index) {
        let curSong = store.currentList.songs[index];
        document.getElementById('edit-song-modal-title-textfield').value = curSong.title;
        document.getElementById('edit-song-modal-artist-textfield').value = curSong.artist;
        document.getElementById('edit-song-modal-youTubeId-textfield').value = curSong.youTubeId;
    }


    store.showEditSongModal = function() {
        let modal = document.getElementById("edit-song-modal");
        document.getElementById("add-song-button").disabled = true;
        document.getElementById("close-button").disabled = true;
        document.getElementById("undo-button").classList.add("disabled");
        document.getElementById("redo-button").classList.add("disabled");
        modal.classList.add("is-visible");
    }

    store.hideEditSongModal = function() {
        let modal = document.getElementById("edit-song-modal");
        document.getElementById("add-song-button").disabled = false;
        document.getElementById("close-button").disabled = false;
        modal.classList.remove("is-visible");
        store.checkUndoRedo();
    }



    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                    tps.clearAllTransactions();
                }
            }
        }
        asyncSetCurrentList(id);
        document.getElementById("add-song-button").disabled = false;
        document.getElementById("close-button").disabled = false;
        store.checkUndoRedo();
    }




    
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
        store.checkUndoRedo();
    }
    store.redo = function () {
        tps.doTransaction();
        store.checkUndoRedo();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.setIsListNameEditActive = function() {
        store.setlistNameActive();
    }

    store.refreshCurrentList = function() {
        async function asyncRefreshCurrentList() {
            let response = await api.getPlaylistById(store.currentList._id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                }
            }
        }
        asyncRefreshCurrentList();
    }

    store.checkUndoRedo = function() {
        let undoButton = document.getElementById('undo-button');
        let redoButton = document.getElementById('redo-button');
        console.log(undoButton.classList);
        if(tps.hasTransactionToUndo() && undoButton.classList.contains("disabled"))
            undoButton.classList.remove("disabled");
        else if(!tps.hasTransactionToUndo())
            undoButton.classList.add("disabled");
        if(tps.hasTransactionToRedo() && redoButton.classList.contains("disabled"))
            redoButton.classList.remove("disabled");
        else if(!tps.hasTransactionToRedo())
            redoButton.classList.add("disabled");
    }

    

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}