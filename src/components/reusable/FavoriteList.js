import FavoriteCard from "./FavoriteCard";
import config from "./../../config";


const FavoriteList = ({ favorites, category }) => {
    let renderFavorite;
    if (category === "job") {
        favorites = favorites.map(fav => fav.job)

        renderFavorite = favorites.map((job) => (
            <FavoriteCard
                key={job.id}
                title={job.company_name}
                position={job.position}
                salary={job.salary}
                description={job.job_desc}
                // facebookLink={job.updatedAt}
                // instagramLink={job.updatedAt}
                // twitterLink={job.createdAt}
                // youtubeLink={job.createdAt}
                // websiteLink={job.createdAt}
                location={job.location}
                deadLine={job.deadline}
                timeOut={job.work_hour}
                type={"job"}
                route={`/detail/job/${job.id}`}
            />
        ));
            
    } else if (category === "university") {

        favorites = favorites.map(fav => fav.university)

        renderFavorite = favorites.map((university) => (
            <FavoriteCard
                key={university.id}
                title={university.name}
                description={university.description}
                facebookLink={university.facebook_url}
                instagramLink={university.instagram_url}
                //   twitterLink={university.twitterLink}
                //   youtubeLink={university.youtubeLink}
                websiteLink={university.website_url}
                location={university.location}
                route={`/detail/university/${university.id}`}
            // deadLine={university.deadLine}
            // timeOut={university.salary}
            />
        ));

    } else if (category === "loan") {

        favorites = favorites.map(fav => fav.loan)

        renderFavorite = favorites.map((loan) => (
            <FavoriteCard
                key={loan.loan_id}
                id={loan.loan_id}
                title={loan.bank_name}
                description={loan.loan_type}
                interest={loan.interest_rate}
                loan_size={loan.loan_limit}
                currency={"KHR and USD"}
                term={loan.loan_term}
                // facebookLink={loan.updatedAt}
                // instagramLink={loan.updatedAt}
                // twitterLink={loan.createdAt}
                // youtubeLink={loan.createdAt}
                // websiteLink={loan.createdAt}
                location={loan.address}
                deadLine={loan.deadline}
                // timeOut={loan.salary}
                type={"loan"}
                redirect={loan.info_link}

            />
        ))
    } else if (category === "scholarship") {

        favorites = favorites.map(fav => fav.scholarship)

        renderFavorite = favorites.map((scholarship) => (
            <FavoriteCard
            key={scholarship.id}
            title={scholarship.name}
            description={scholarship.description}
            location={scholarship.location}
            deadLine={scholarship.deadLine}
            id={scholarship.id}
            type={'scholarship'}
            route={`/detail/scholarship/${ scholarship.id }`}

            />
        ))
    } else {
        favorites = favorites.map(fav => fav.accommodation)

        renderFavorite = favorites.map((accommodation) => (
            <FavoriteCard
            key={accommodation.id}
            id={accommodation.id}
            type={"accommodation"}
            title={accommodation.name}
            size={accommodation.size}
            price = {accommodation.price}
            address = {accommodation.location}
            description={accommodation.description}
            // facebookLink={accommodation.updatedAt}
            // instagramLink={accommodation.updatedAt}
            // twitterLink={accommodation.createdAt}
            // youtubeLink={accommodation.createdAt}
            // websiteLink={accommodation.createdAt}
            // deadLine={accommodation.deadline}
            // timeOut={accommodation.salary}
            route={`/detail/accommodation/${ accommodation.id }`}
            />
        ))
    }
    ;
    
    if (config.env !== 'production') {
        console.log('Favorites:', favorites);
    }

    return (
        <>
            {!favorites[0]?<div>YOU HAVE NOT ADDED TO YOUR COLLECTION YET...</div>:<>{renderFavorite}</>}
        </>
      
    )
};
export default FavoriteList;
