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
    constructor(initStore, songIndex, newTitle, newArtist, newLink) {
        super();
        this.store = initStore;
        this.index = songIndex;
        this.title = newTitle;
        this.artist = newArtist;
        this.link = newLink;
        this.oldSong = JSON.parse(JSON.stringify(initStore.currentList.songs[songIndex]));

    }

    doTransaction() {
        this.store.editSong(this.index,this.title,this.artist,this.link);
    }
    
    undoTransaction() {
        this.store.editSong(this.index,this.oldSong.title,this.oldSong.artist,this.oldSong.youTubeId);

    }
}