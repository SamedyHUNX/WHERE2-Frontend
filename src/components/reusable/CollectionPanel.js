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
        
    }, [category, dispatch]);
    return (
        <div className="w-full h-full rounded-3xl shadow-lg border-2">
            <h1 className="text-2xl font-bold mt-[48px] ml-6 text-3xl underline font-bold text-gray-900 mb-6 tracking-tight">Collections</h1>
            <div className="w-full mx-auto flex flex-col pt-[48px] justify-between bg-white px-4">
                <div className="w-[90%] sm:w-[99%] mx-auto flex flex-col gap-y-8 justify-evenly align-start p-6 bg-white rounded-3xl shadow-inner border-2 overflow-hidden overflow-y-scroll max-h-[1100px]">
                    {isLoading[`${category}`] ? <LoadingOverlay /> : <FavoriteList favorites={favorites} category={category} />}
                    {error && <p>{"You Have not add to your favorite yet..."}</p>}
            </div>
            </div>
            </div>
        
    );
};

export default CollectionPanel;