// contactsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  contacts: [],
  status: 'idle',
  error: null,
};

// Async thunk for fetching contacts and their lists
export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async (companyId) => {
  const url = `http://localhost:5000/company-contacts-lists/${companyId}`; // Update the URL to match your Flask route
  const response = await fetch(url);
  
  if (!response.ok) {
    // If the response is not ok, throw an error
    const errorData = await response.text();
    throw new Error(errorData || 'Could not fetch contacts');
  }
  
  const data = await response.json();
  return data;
});

export const fetchAllContacts = createAsyncThunk('contacts/fetchAllContacts', async (companyId) => {
  const url = `http://localhost:5000/contacts-lists`; // Update the URL to match your Flask route
  const response = await fetch(url);
  
  if (!response.ok) {
    // If the response is not ok, throw an error
    const errorData = await response.text();
    throw new Error(errorData || 'Could not fetch contacts');
  }
  
  const data = await response.json();
  return data;
});

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    // You can add reducers for any synchronous actions here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // The payload should now be an array of contacts, each with their own lists
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchAllContacts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // The payload should now be an array of contacts, each with their own lists
        state.contacts = action.payload;
      })
      .addCase(fetchAllContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default contactsSlice.reducer;
