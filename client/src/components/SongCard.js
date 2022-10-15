import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;

    function handleDeleteSong(event){
        store.markSongForDeletion(index);
    }

    function handleEditSong(event) {
        store.markSongToEdit(index);
    }

    function handleDragStart(event) {
        event.dataTransfer.setData("song", event.target.id);
        cardClass = "list-card selected-list-card";
    }
    function handleDragOver(event) {
        event.preventDefault();
    }
    function handleDragEnter(event){
        event.preventDefault();
    }
    function handleDragLeave(event) {
        event.preventDefault();
    }
    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = event.target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        store.moveSong(parseInt(sourceId.substring(0,1)),parseInt(targetId.substring(0,1)));
        

        // // ASK THE MODEL TO MOVE THE DATA
        // this.props.moveCallback(sourceId, targetId);
    }




    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDoubleClick={handleEditSong}
            draggable="true"
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                onClick={handleDeleteSong}
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;