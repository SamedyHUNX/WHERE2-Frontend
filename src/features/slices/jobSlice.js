import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../config";

export const fetchCompany = createAsyncThunk(
  "jobs/associatedCompany",
  async (id) => {
    const response = await axios.get(config.job.getAssociatedCompany(id));
    const approvedCompanies = response.data.data.associatedCompany.filter(company => company.isApproved);
    const companyDetails = response.data.data.associatedCompany
    return { associatedCompany: companyDetails };
  }
);

const jobSlices = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    company: {
      isLoading: true,
      data: {}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state, action) => {
        state.company.isLoading = true;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.company.isLoading = false;
        state.company.data = action.payload.associatedCompany[0];
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.company.isLoading = false;
        state.company.error = action.error.message;
      });
  }
});

export default jobSlices.reducer;
