import React from "react";
import { Link } from "react-router-dom";

const KeepInWithUs = "https://i.imgur.com/96f0W9s.jpg"

const joinUs = () => {
	return (
		<div className="relative w-full lg:h-[600px] h-[300px] mt-[32px] mb-[8px] pb-[64px]">
			<img src={KeepInWithUs} className="absolute top-0 left-0 w-full h-full object-cover" />
			<div className="absolute inset-0 bg-black opacity-25"></div>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<h1 className="lg:text-[44px] sm:text-[32px] text-white font-black">
					KEEP IN TOUCH WITH US
				</h1>
				<Link to="/signup">
					<button className="text-[#375761] bg-white rounded-[100px] p-2 px-5 drop-shadow-lg hover:scale-110" >
						Sign Up Now!
					</button>
				</Link>
			</div>
			
		</div>
	)
};
export default joinUs;