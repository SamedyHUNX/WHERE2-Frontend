import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from "../../config";
import { setTotalPage } from './paginationSlice';
import { setIsLoading } from './favoriteSlice';

/** 
 * Fetch all universities with pagination. 
 * @route GET /api/list/university/ 
 * @param {Object} param - The pagination parameters. 
 * @param {number} param.page - The current page number. 
 * @access Public 
 */
export const fetchUniversities = createAsyncThunk(
    'universities/fetchUniversities',
    async ({ page }, { dispatch }) => {
        try {
            const response = await axios.get(`${config.universities.getAllUniversity}?page=${page}`);
            dispatch(setTotalPage(response.data.pagination.totalPages || 1));
            const approvedUniversities = response.data.list
            return approvedUniversities;
        } catch (error) {
            return [];
        }
    }
);

/** 
 * Fetch a specific university by ID. 
 * @route GET /api/list/university/:id 
 * @param {number} id - The ID of the university to fetch. 
 * @access Public 
 */
export const fetchUniversity = createAsyncThunk(
    'universities/fetchUniversity',
    async (id) => {
        const response = await axios.get(`${config.universities.getUniversityById}/${id}`);

        console.log(response.data)

        return response.data;
    }
);

/** 
 * Search universities by query. 
 * @route GET /api/list/university 
 * @param {string} query - The search query. 
 * @access Public 
 */
export const searchUniversities = createAsyncThunk(
    'universities/searchUniversities',
    async ({ query, page }, { dispatch }) => {
        const response = await axios.get(`${config.universities.getAllUniversity}?q=${encodeURIComponent(query)}&page=${page}`);
        dispatch(setTotalPage(response.data.pagination.totalPages || 1));
        const approvedUniversities = response.data.list.filter(university => university.isApproved);
        return approvedUniversities;
    }
);

const universitySlice = createSlice({
    name: 'universities',
    initialState: {
        universities: [],
        university: [],
        loading: false,
        error: null,
    },
    reducers: {
        setUniversities: (state, action) => {
            state.universities = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            /** 
             * Fetch all universities. 
             * @route GET /api/list/university/ 
             * @access Public 
             */
            .addCase(fetchUniversities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUniversities.fulfilled, (state, action) => {
                state.loading = false;
                state.universities = action.payload;
            })
            .addCase(fetchUniversities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            /** 
             * Fetch a specific university by ID. 
             * @route GET /api/list/university/:id 
             * @access Public 
             */
            .addCase(fetchUniversity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUniversity.fulfilled, (state, action) => {
                state.loading = false;
                state.university = action.payload;
            })
            .addCase(fetchUniversity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            /** 
             * Search universities by query. 
             * @route GET /api/list/university/search 
             * @access Public 
             */
            .addCase(searchUniversities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchUniversities.fulfilled, (state, action) => {
                state.loading = false;
                state.universities = action.payload;
            })
            .addCase(searchUniversities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.universities = [];
            });
    },
});

export const { setUniversities, setLoading } = universitySlice.actions;
export default universitySlice.reducer;
