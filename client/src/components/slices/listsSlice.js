import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk
export const fetchListsForContact = createAsyncThunk(
  'lists/fetchListsForContact',
  async (contactId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/lists-for-contact/${contactId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lists');
      }
      const data = await response.json();
      // Directly return the data which should be an array
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const listsSlice = createSlice({
  name: 'lists',
  initialState: {
    listsByContact: {},
    todos: {},
    status: 'idle',
    error: null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListsForContact.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchListsForContact.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'An unknown error occurred';
      })
      .addCase(fetchListsForContact.fulfilled, (state, action) => {
        // Log the action payload
        console.log('Fulfilled action payload:', action.payload); 
        // Update state with the new array of lists for the contactId
        state.listsByContact[action.meta.arg] = action.payload;
        state.status = 'succeeded';
      });
  },
});

export default listsSlice.reducer;
