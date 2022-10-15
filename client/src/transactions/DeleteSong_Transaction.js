import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * MoveSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author safwankader
 */
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initStore,deleteIndex) {
        super();
        this.store = initStore;
        this.index = deleteIndex;
        this.oldSong = JSON.parse(JSON.stringify(initStore.currentList.songs[deleteIndex]));
        delete this.oldSong._id;

    }

    doTransaction() { 
        this.store.deleteSongIndex = this.index;
        this.store.deleteSongName = this.store.currentList.songs[this.index].name;
        this.store.deleteMarkedSong();
    }
    
    undoTransaction() {
        this.store.addSongAtIndex(this.index,this.oldSong)
    }
}