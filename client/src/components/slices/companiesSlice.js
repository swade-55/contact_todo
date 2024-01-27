// companiesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  companies: [],
  status: 'idle', 
  error: null,
};

// Async thunk for fetching companies
export const fetchCompanies = createAsyncThunk('companies/fetchCompanies', async (userId) => {
    const url = `http://localhost:5000/companies/${userId}`; // Full URL to your Flask API
    const response = await fetch(url);
  
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error('Could not fetch companies');
    }
  
    const data = await response.json();
    return data;
  });

  export const addCompany = createAsyncThunk('companies/addCompany', async (companyData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  
  export const updateCompany = createAsyncThunk('companies/updateCompany', async (companyData, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/companies/${companyData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });

export const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    // Reducers for any synchronous actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        console.log('Fetching companies: Loading');
        state.status = 'loading';
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        console.error('Fetching companies: Failed', action.error.message);
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addCompany.pending, (state) => {
        console.log('Fetching companies: Loading');
        state.status = 'loading';
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        //update state with the new company in the end
        state.status = 'succeeded';
        state.companies = action.payload;
        //action.payload might be one company
        //include the added company to the end of the companies array
        console.log(action.payload)
      })
      .addCase(addCompany.rejected, (state, action) => {
        console.error('Fetching companies: Failed', action.error.message);
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default companiesSlice.reducer;
