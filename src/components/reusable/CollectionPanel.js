import React, {useEffect} from "react";
import { useDispatch,useSelector } from "react-redux";
import { getFavorite} from "../../features/slices/favoriteSlice";
import { LoadingOverlay } from "./Loading";
import FavoriteList from "./FavoriteList";


const CollectionPanel = ({ category }) => {
    const dispatch = useDispatch();
    let {isLoading, favorites,error } = useSelector(state => state.favorites);
    useEffect(() => {
        dispatch(getFavorite({ category }));
        
    }, [category]);
    return (
        <div className="mt-[100px]">
            <div className="max-w-7xl mx-auto flex-col  justify-between flex p-6 bg-white rounded-3xl shadow-lg border-2  w-full ">
          <h1 className="text-2xl font-bold mb-6">Collections</h1>
          
                <div className="max-w-7xl mx-auto flex-col gap-y-8 justify-between flex p-6 bg-white rounded-3xl shadow-inner border-2  w-full overflow-hidden max-h-[1000px] overflow-y-scroll">
                    {isLoading[`${category}`] ? <LoadingOverlay /> : <FavoriteList favorites={favorites} category={category} />}
                    {error && <p>{"You Have not add to your favorite yet..."}</p>}
            </div>
            </div>
            </div>
        
    );
};

export default CollectionPanel;