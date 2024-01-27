// contactsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  contacts: [],
  status: 'idle',
  error: null,
};

export const addContact = createAsyncThunk('contacts/addContact',async(contactData,{rejectWithValue})=>{
  try{
    const response = await fetch('http://localhost:5000/contacts',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify(contactData)
    });
    if (!response.ok){
      throw new Error('Network response was not ok')
    }
    return response.json();
  } catch (error){
    return rejectWithValue(error.message)
  }
});

export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async (companyId) => {
  const url = `http://localhost:5000/company-contacts-lists/${companyId}`; 
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Could not fetch contacts');
  }
  
  const data = await response.json();
  return data;
});

export const fetchAllContacts = createAsyncThunk('contacts/fetchAllContacts', async () => {
  const response = await fetch('http://localhost:5000/contacts-lists');
  if (!response.ok) {
    throw new Error('Could not fetch contacts');
  }
  return await response.json();
});

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
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
        // Set the contacts to the fetched data
        state.contacts = action.payload;
      })
      .addCase(fetchAllContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addContact.pending,(state)=>{
        state.status='loading';
      })
      .addCase(addContact.fulfilled,(state,action)=>{
        state.status='succeeded';
        state.contacts.push(action.payload)
      })
      .addCase(addContact.rejected,(state,action)=>{
        state.status='failed';
        state.error=action.error.message;
      })
  },
});

export default contactsSlice.reducer;
