import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BsArrowDownUp } from "react-icons/bs";
import { LuX } from "react-icons/lu";

import Accordion from "./Accordion";
import DateRange from "./DateRange";
import { BiCategory } from "react-icons/bi";

function FilterComponent ({ items , category , location }){
	const [openFilter,setOpenFilter] = useState(false)

	const handleModel = () => {
		setOpenFilter(!openFilter);
	};

	const navigate = useNavigate();
	
	const applyFilter = (filters) => {
		const queryString = Object.entries(filters)
		  .map(([key, value]) => `${key}=${value}`)
		  .join("&");
		navigate(`/list/${category}?${queryString}`);
	};	

	useEffect(() => {
		setOpenFilter(false);
	}, [location])

	return(
		<div className="" style={{ display: "flex" , width:"100%", margin: "0px 0px 30px 0px" }}>
			<div 
				className="lg:max-w-[103px] h-[51px] bg-white border flex items-center justify-center cursor-pointer rounded-md text-lg z-10  border-[#7CD1EB] px-5"
				onClick={handleModel}
			>
				<BsArrowDownUp className="pr-0.5"/>
				Filter
			</div>	
			{openFilter && (
			<div className="pt-4 absolute z-50 lg:min-w-[890px] sm:min-w-[80%]">
				<div className="sm:max-w-[890px] border border-[#7cd1eb] lg:h-full bg-white rounded-md drop-shadow-md relative">
					<div className="pt-5 mx-12 ">
						<div className="flex justify-end items-end">
							<LuX onClick={handleModel} className="w-[24px] h-[24px] cursor-pointer"/>
						</div>
						<div className="flex justify-between items-center">
							<h3 className="font-bold text-[#7cd1eb] text-[20px]">
								Filter By
							</h3>
						</div>
						<Accordion 
							items={items} 
							handlemodel={handleModel} 
							applyFilter={applyFilter}
						/>
						<div>
							{/* <DateRange/> */}
						</div>	
					</div>
				</div>
			</div>
			)}
		</div>
	)
}
export default FilterComponent