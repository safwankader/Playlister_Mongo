import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
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
    MARK_LIST_FOR_DELETION : "MARK_LIST_FOR_DELETION"
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
        deleteSongId : null,
        deleteSongName : null
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
                    deleteSongId : null,
                    deleteSongName : null
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
                    deleteSongId : null,
                    deleteSongName : null
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
                    deleteSongId : null,
                    deleteSongName : null
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
                    deleteSongId : null,
                    deleteSongName : null
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
                    deleteSongId : null,
                    deleteSongName : null
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
                    deleteSongId : payload._id,
                    deleteSongName : payload.title

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
                    deleteSongId : null,
                    deleteSongName : null
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
                    deleteSongId : null,
                    deleteSongName : null
                });
            }
            default:
                return store;
        }
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
                    store.updateCurrentList();
                    }
                }
            }
            asyncAddSong(id);
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
                    store.history.push("/playlist" + newPlaylist._id);
                    store.updateCurrentList();
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
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }
    store.hideDeleteListModal = function() {
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
                    let playlist = response.data.playlist;
                    let songToDelete = playlist.songs[index];
                     storeReducer({
                    type: GlobalStoreActionType.MARK_SONG_FOR_DELETION,
                    payload: songToDelete
                });

                store.showDeleteSongModal();
            }

        }

        asyncSetSongforDeletion(index);
        
    }

    store.deleteSong = function() {
        async function processDeleteSong(){
            let response = await api.getPlaylistById(store.currentList._id)
            if(response.data.success){
                let playlist = response.data.playlist;
                console.log(playlist)
                let newSongs = playlist.songs.filter(song => song._id !== store.deleteSongId)
                console.log(newSongs)
                playlist.songs = newSongs
                response = await api.updatePlaylistById(store.currentList._id,playlist)
                if(response.data.success){
                    store.updateCurrentList();
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
        modal.classList.add("is-visible");
    }
    store.hideDeleteSongModal = function() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
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
                }
            }
        }
        asyncSetCurrentList(id);
    }



    
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
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

    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
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
        asyncUpdateCurrentList();
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}