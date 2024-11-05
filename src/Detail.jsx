import { useContext } from "react";
import { animeContext, Button } from "./App";
import { currentUserContext } from "./App";

export default function Detail(){
    const {anime, collection, setCollection, showDetail} = useContext(animeContext);
    const {currentUser, currentID} = useContext(currentUserContext);

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

    const animeDetailPage = anime.filter((value, index) => value.aid === showDetail);
    const DetailPage = animeDetailPage.map((value, index) => 
        <div key={value.aid} className="div-Detail">
            <img src={value.img}/>
            
            <div className="descriptions">
                <div className="descriptions-Area">
                    <span>Name: </span>
                    <span>{value.title}</span>
                </div>
                <div className="descriptions-Area">
                    <span>Genre: </span>
                    <span>{value.genre}</span>
                </div>
                <div className="descriptions-Area">
                    <span>Score: </span>
                    <span>{value.score}</span>
                </div>
                <div className="descriptions-Area">
                    <span>Description: </span>
                    <span>{value.description}</span>
                </div>
                <div className="div-Detail-BtnGroup">
                {!currentUser ? null : isAlreadyCollect(value.aid) 
                ? <Button onClick={() => handleRemoveCollection(value.aid)}>Remove From WatchList</Button> 
                : <Button onClick={() => handleAddCollection(value.aid)}>Add To WatchList</Button>}
                </div>
            </div>
        </div>
    );
    return(DetailPage);
}