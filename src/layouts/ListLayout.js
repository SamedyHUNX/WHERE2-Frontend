import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removedIsClicked, getFavorite } from '../features/slices/favoriteSlice';

//resuable 
import Card from "../components/reusable/Card";

//layouts
import NoResults from '../layouts/NoResults';
import WrapperComponent from '../components/reusable/WrapperComponent';

/**
 * ListLayout component
 *
 * @param {Array} items - List of items to display (universities or scholarships).
 * @param {string} category - Category of items (e.g., 'university', 'scholarship').
 * @param {number} page - Current page number.
 * @param {boolean} isLoading - Loading status of items.
 * @returns {JSX.Element} The list of cards or a "No results found" message.
 */
const ListLayout = ({ items, category, page , isLoading, major, price}) => {
    const dispatch = useDispatch();
    const { isClicked } = useSelector((state) => state.favorites);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                if (page === 1) {
                    dispatch(removedIsClicked());
                }
                await dispatch(getFavorite({ category, limit: 10 }));
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };

        fetchFavorites();
    }, [page, category, dispatch]);
console.log('items in layout',items)
    const renderList = () => {
        if (items.length === 0 && !isLoading) {
            return <NoResults />;
        } else if (major !== "") {
            return items.map((item, index) => (
                <WrapperComponent>
                    <Card
                        key={index}
                        image={item.university.image_url}
                        imageAlt={item.university.image_alt}
                        title={item.university.name}
                        description={item.university.description}
                        facebookLink={item.university.facebook_url}
                        instagramLink={item.university.instagram_url}
                        telegramLink={item.university.telegram_url}
                        websiteLink={item.university.website}
                        location={item.university.location}
                        route={`/detail/${category}/${item.university.id}`}
                        id={item.university.id}
                        type={category}
                        isHeartClicked={isClicked[item.university.id]}
                        />
                </WrapperComponent>
            ));
        }else if (price !== "") {
            return items.map((item, index) => (
                <WrapperComponent>
                    <Card
                        key={index}
                        image={item.image_url}
                        imageAlt={item.image_alt}
                        title={item.name}
                        description={item.description}
                        facebookLink={item.facebook_url}
                        instagramLink={item.instagram_url}
                        telegramLink={item.telegram_url}
                        websiteLink={item.website}
                        location={item.location}
                        route={`/detail/${category}/${item.id}`}
                        id={item.id}
                        type={category}
                        isHeartClicked={isClicked[item.id]}
                        />
                </WrapperComponent>
            ));
        } else {
            return items.map((item, index) => (
                <WrapperComponent>
                    <Card
                        key={index}
                        image={item.image_url}
                        imageAlt={item.image_alt}
                        title={item.name}
                        description={item.description}
                        facebookLink={item.facebook_url}
                        instagramLink={item.instagram_url}
                        telegramLink={item.telegram_url}
                        websiteLink={item.website}
                        location={item.location}
                        route={`/detail/${category}/${item.id}`}
                        id={item.id}
                        type={category}
                        isHeartClicked={isClicked[item.id]}
                        />
                </WrapperComponent>
            ));
        }

     
    };

    return (
        renderList()
    );
};

export default ListLayout