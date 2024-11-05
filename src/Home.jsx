import { useContext, useState } from "react";
import { animeContext } from "./App";
import { Button } from "./App";
import { currentUserContext } from "./App";

export default function Home(){
    const {anime, collection, setCollection, setShowDetail} = useContext(animeContext);
    const {currentUser, currentID} = useContext(currentUserContext);

    const handleDetail = (i) => {
        setShowDetail(i);
    }

    const isAlreadyCollect = (id) => {
        const usercollection = collection.find((value, index) => value.uid === currentID);
        if(usercollection.animeID.includes(id)){
            return true;
        }else{
            return false;
        }
    }

    const handleAddCollection = (id) => {
        setCollection(collect => 
            collect.map(userIDs => 
                userIDs.uid === currentID && !userIDs.animeID.includes(id)
                ? {...userIDs, animeID: [...userIDs.animeID, id]}
                : userIDs
            )
        );
    }

    const handleRemoveCollection = (id) => {
        const usercollectionIndex = collection.findIndex(value => value.uid === currentID);

        if(usercollectionIndex !== -1){
            const userCollection = collection[usercollectionIndex];
            const updatedAnimeList = userCollection.animeID.includes(id)
            ? userCollection.animeID.filter(value => value !== id)
            : userCollection;

            const updateCollection = [
                ...collection.slice(0, usercollectionIndex),
                {...userCollection, animeID: updatedAnimeList},
                ...collection.slice(usercollectionIndex + 1)
            ]

            setCollection(updateCollection);
        }
    }

    const animeDiv = anime.map((value, index) =>
        <div key={value.aid} className="div-Anime">
            <img src={value.img}></img>
            <div className="subDiv-Anime">
                <h2>{value.title}</h2>
                <div className="genre label">
                    <span className="bold-Text">Genre: </span>
                    <span className="genre-text">{value.genre}</span>
                </div>
                <div className="score label">
                    <span className="bold-Text">Score: </span>
                    <span className="genre-text">{value.score}</span>
                </div>
                <div className="description label">
                    <span className="bold-Text">Description: </span>
                    <span className="genre-text">{value.description}</span>
                </div>
                <div className="btn-Group">
                    <Button onClick={() => handleDetail(value.aid)}>Detail</Button>
                    {!currentUser ? null : isAlreadyCollect(value.aid) 
                    ? <Button onClick={() => handleRemoveCollection(value.aid)}>Remove From WatchList</Button> 
                    : <Button onClick={() => handleAddCollection(value.aid)}>Add To WatchList</Button>}
                </div>
            </div>
        </div>
    );

    return(animeDiv);
}