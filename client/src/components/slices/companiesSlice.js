// companiesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  companies: [],
  status: 'idle', 
  error: null,
};

// Async thunk for fetching companies
export const fetchCompanies = createAsyncThunk('companies/fetchCompanies', async (userId) => {

  if (userId === undefined) {
    userId = '1'; 
}
    const url = `http://localhost:5000/companies/${userId}`; 
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

  export const deleteCompany = createAsyncThunk('companies/deleteCompany', async (companyId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/companies/${companyId}`, {
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
  
  
  export const updateCompany = createAsyncThunk('companies/updateCompany', async (companyData, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/companies/${companyData.id}`, {
        method: 'PATCH',
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
          // This case handles if for some reason the company is not found; you might decide to add it instead
          console.warn("Updated company not found in the array");
          // Optionally add the company to the array
          // state.companies.push(action.payload);
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        console.error('Updating company failed', action.error.message);
        state.error = action.error.message;
      });
  },
});

export default companiesSlice.reducer;
