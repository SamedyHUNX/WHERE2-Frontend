import { useNavigate } from "react-router-dom";
import PaginationButton from "./PaginationButton";

// Enable for debugging
const isDebug = false;

/**
 * Pagination Component
 *
 * This component handles pagination logic and navigation for the university list.
 *
 * @param {number} totalPage - The total number of pages available
 * @param {number} currentPage - The current page being viewed
 * @param {string} category - The category for filtering the list
 * @param {string} searchQuery - The search query parameter if exists
 * @returns {JSX.Element} - Renders the pagination buttons
 */
const Pagination = ({ totalPage, limit = 10, currentPage, category, searchQuery = '' }) => {
    const navigate = useNavigate();

    const buildURL = (newPage) => {
        let url = `/list/${category}?page=${newPage}&limit=${limit}`;
        if (searchQuery) {
            url += `&q=${searchQuery}`;
        }
        return url;
    };

    // if (isDebug) {
    //     console.log("Pagination says: total page", totalPage);
    //     console.log("Pagination says: current page", currentPage);
    // }

    /**
     * handlePageChange
     *
     * Navigates to the specified page and scrolls to the top of the window.
     *
     * @param {number} newPage - The new page number to navigate to
     */
    const handlePageChange = (newPage) => {
        window.scrollTo(0, 0);
        navigate(buildURL(newPage));
    };

    /**
     * handleNextClick
     *
     * Navigates to the next page if the current page is less than the total number of pages.
     */
    const handleNextClick = () => {
        if (currentPage < totalPage) {
            navigate(buildURL(currentPage + 1));
        }
    };

    /**
     * handlePrevClick
     *
     * Navigates to the previous page if the current page is greater than 1.
     */
    const handlePrevClick = () => {
        if (currentPage > 1) {
            navigate(buildURL(currentPage - 1));
        }
    };

    /**
     * PaginationPages
     *
     * Renders the pagination buttons based on the current and total pages.
     */
    const PaginationPages = () => {
        const buttons = [];
        const maxButtons = 7;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = startPage + maxButtons - 1;

        if (endPage > totalPage) {
            endPage = totalPage;
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <PaginationButton
                    key={i}
                    type={'number'}
                    onClick={() => handlePageChange(i)}
                    currentNumber={Number(i)}
                    isActive={i === currentPage}
                />
            );
        }

        return buttons;
    };

    return (
        <div className='flex items-center justify-center my-16 px-1 gap-[18px]'>
            <PaginationButton
                type={'prev'}
                onClick={handlePrevClick}
                disabled={currentPage === 1}
                isActive={currentPage}
            />
            {PaginationPages()}
            <PaginationButton
                type={'next'}
                onClick={handleNextClick}
                disabled={currentPage === totalPage}
                isActive={currentPage}
            />
        </div>
    );
};

export default Pagination;
