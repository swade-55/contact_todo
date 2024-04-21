// companiesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  companies: [],
  status: 'idle', 
  error: null,
};

// Async thunk for fetching companies
export const fetchCompanies = createAsyncThunk('companies/fetchCompanies', async (userId) => {
    const url = `/companies/${userId}`; 
    const response = await fetch(url);
  
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error('Could not fetch companies');
    }
  
    const data = await response.json();
    return data;
  });

  export const addCompany = createAsyncThunk('companies/addCompany', async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch('/companies', {
        method: 'POST',
        body: formData, // Directly passing FormData object
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  

  export const deleteCompany = createAsyncThunk('companies/deleteCompany', async (companyId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/companies/${companyId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return companyId;  // Return the ID of the deleted company
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  
  
  export const updateCompany = createAsyncThunk('companies/updateCompany', async ({id, formData}, { rejectWithValue }) => {
    try {
      console.log(`Sending PATCH request for company ${id} with data:`, formData);
      const response = await fetch(`/companies/${id}`, {
        method: 'PATCH',
        body: formData, // Now correctly using the formData passed in the payload
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
      
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });

export const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    
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
        state.status = 'succeeded';
        // Append the new company to the existing array instead of replacing it
        state.companies.push(action.payload);
      })
      .addCase(addCompany.rejected, (state, action) => {
        console.error('Fetching companies: Failed', action.error.message);
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter(company => company.id !== action.payload);
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex(company => company.id === action.payload.id);
        if (index !== -1) {
          // Update the company in the array
          state.companies[index] = action.payload;
        } else {
          console.warn("Updated company not found in the array");
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        console.error('Updating company failed', action.error.message);
        state.error = action.error.message;
      });
  },
});

export default companiesSlice.reducer;
