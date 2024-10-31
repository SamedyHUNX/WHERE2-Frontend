const ListContainer = ({children}) => {
    return (
        <div className="min-h-screen mx-auto  
        max-w-[1200px] lg:mt-[180px]
        sm:w-[100%] md:px-[24px] min-[1440px]:px-[35px] sm:px-[16px] sm:mt-[6.9rem]
        list
        "
        >
            {children}
        </div>
    );
};
export default ListContainer;
