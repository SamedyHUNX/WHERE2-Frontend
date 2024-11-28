import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../config";
import { setTotalPage } from "./paginationSlice";
import { act } from "react";

/**
 * Fetch all accommodations with pagination.
 * @route GET /api/list/accommodation/
 * @param {Object} param - The pagination parameters.
 * @param {number} param.page - The current page number.
 * @access Public
 */
export const fetchAccommodations = createAsyncThunk(
    'accommodation/fetchAccommodations',
    async ({page, limit}) => {
        try {
            const response = await axios.get(`${ config.list.getAllList('accommodation')}?page=${page}&limit=${limit}`);

            return response.data;
        } catch (error) {
            return []
        }
    }
);

/**
 * Fetch a specific accommodation by ID.
 * @route GET /api/list/accommodation/:id
 * @param {number} id - The ID of the accommodation to fetch.
 * @access Public
 */
export const fetchAccommodation = createAsyncThunk(
    'accommodation/fetchAccommodation',
    async (id) => {
        const response = await axios.get(`${ config.accommodation.getAccommodationById }/${ id }`);
        return response.data.oneAccommodation;
    }
);

const accommodationSlice = createSlice({
    name: 'accommodation',
    initialState: {
        loading: true,
        error: null,
        data: [],
        totalPages: 1,
        accommodation: {},
        accommodationImages: {}
    },
    reducers: {
        /**
         * Set the current accommodation data.
         * @param {Object} state - The current state.
         * @param {Object} action - The action payload.
         */
        setAccommodation: (state, action) => {
            state.accommodation = action.payload;
        },
        setAccommodationImages: (state, action) => {
            state.accommodationImages = action.payload
        },
        clearAccommodationImage: (state, action) => {
            state.accommodationImages = {}
        }
    },
    extraReducers: (builder) => {
        builder
        // Fetch all accommodations
            .addCase(fetchAccommodations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAccommodations.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.list;
                state.totalPages = action.payload.pagination.totalPages
            })
            .addCase(fetchAccommodations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // Fetch accommodation by ID
            .addCase(fetchAccommodation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAccommodation.fulfilled, (state, action) => {
                state.loading = false;
                state.accommodation = action.payload;
            })
            .addCase(fetchAccommodation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    }
});

export const { setAccommodation, setAccommodationImages,clearAccommodationImage } = accommodationSlice.actions;
export default accommodationSlice.reducer;
