
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { removedIsClicked,getFavorite } from "../features/slices/favoriteSlice";
import Card from "./reusable/Card";
import WrapperComponent from "./reusable/WrapperComponent";
import NoResults from "../layouts/NoResults";
const AccommodationList = ({ accommodations, page }) => {
    let image;
    const dispatch = useDispatch();
    const { isClicked } = useSelector((state) => state.favorites);
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                if (page === 1) {
                    dispatch(removedIsClicked());
                }
               await dispatch(getFavorite({ category: "accommodation"}));
            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        };
        fetchFavorites();
    }, [page, dispatch]);
    if (accommodations.length === 0) {
		return <NoResults />;
	}
    return (
    <>
        {accommodations.map(accommodation => {
        accommodation.image_url? image = accommodation.image_url.img1: image = null
            return (
            <WrapperComponent>
            <Card
                key={accommodation.id}
                id={accommodation.id}
                image={image}
                imageAlt={"room"}
                title={accommodation.name}
                price = {accommodation.price}
                location={accommodation.location}
                description={accommodation.description}
                mapURL={accommodation.google_map}
                // facebookLink={accommodation.updatedAt}
                // instagramLink={accommodation.updatedAt}
                // twitterLink={accommodation.createdAt}
                // youtubeLink={accommodation.createdAt}
                // websiteLink={accommodation.createdAt}
                // deadLine={accommodation.deadline}
                // timeOut={accommodation.salary}
                type={"accommodation"}
                isHeartClicked = {isClicked[accommodation.id]}
                route={`/detail/accommodation/${ accommodation.id }`}
                    />
                    </WrapperComponent>)
        
    })}
    </>
);
};

export default AccommodationList;