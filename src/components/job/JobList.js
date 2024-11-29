import Card from "../reusable/Card";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getFavorite } from "../../features/slices/favoriteSlice";
import { removedIsClicked } from "../../features/slices/favoriteSlice";
import WrapperComponent from "../reusable/WrapperComponent";
import NoResults from "../../layouts/NoResults";
import defaultImg from './../../assets/images/where2.jpg'
const JobList = ({ jobs, page }) => {
	const dispatch = useDispatch();
	const { isClicked } = useSelector((state) => state.favorites);
	let image;

	// console.log('sdfbjkdfsajbkfdhksajhdjklafskhjadfshjkfsjhdfsahjkdffdsajhkdfsahj job list')
	useEffect(() => {
		const fetchFavorites = async () => {
			try {
				if (page === 1) {
					dispatch(removedIsClicked());
				}
				await dispatch(getFavorite({ category: "job" }));
			} catch (error) {
				console.error("Error fetching favorites:", error);
			}
		};
		fetchFavorites();
	}, [page, dispatch]);
	if (jobs.length === 0) {
		return <NoResults />;
	}
	return (
		<>
		  {jobs.map((job) => {
			if (job.isApproved) {
			  const image = job.company_id ? job.company.img_url : defaultImg;
			  return (
				<WrapperComponent key={job.id}>
				  <Card
					id={job.id}
					image={image}
					imageAlt={job.job_require}
					title={job.company_name}
					position={job.position}
					salary={job.salary}
					description={job.job_desc}
					location={job.location}
					deadLine={job.deadline}
					timeOut={job.work_hour}
					type={"job"}
					isHeartClicked={isClicked[job.id]}
					route={`/detail/job/${job.id}`}
				  />
				</WrapperComponent>
			  );
			}
			return null;
		  })}
		</>
	  );
	  
};

export default JobList;
