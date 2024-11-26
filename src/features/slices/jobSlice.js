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
export const fetchOneCompany = createAsyncThunk(
  "company/getOneCompany",
  async (id) => {
    const response = await axios.get(config.job.getOneCompany(id));
    return response;
  }
);

const jobSlices = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    company: {
      isLoading: true,
      data: {}
    },
    companyImage: '',
    companyProfile: {
      isLoading: true,
      data:{}
    },
  },
  reducers: {
    setCompanyImage: (state, action) => {
      state.companyImage = action.payload
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
      })
      .addCase(fetchOneCompany.pending, (state, action) => {
        state.companyProfile.isLoading = true;
      })
      .addCase(fetchOneCompany.fulfilled, (state, action) => {
        state.companyProfile.isLoading = false;
        state.companyProfile.data = action.payload;
      })
      .addCase(fetchOneCompany.rejected, (state, action) => {
        state.companyProfile.isLoading = false;
        state.companyProfile.error = action.error.message;
      })
    
  }
});

export const { setCompanyImage } = jobSlices.actions;
export default jobSlices.reducer;
