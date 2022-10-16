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
    constructor(initStore) {
        super();
        this.store = initStore;

    }

    doTransaction() {
        this.store.addSong();
    }
    
    undoTransaction() {
        let newSongs = JSON.parse(JSON.stringify(this.store.currentList.songs));
        this.store.deleteSongIndex = this.store.currentList.songs.length;
        newSongs.pop();
        this.store.deleteSong();

    }
}