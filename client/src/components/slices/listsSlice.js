import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchListsAndTodosForContact = createAsyncThunk(
  'lists/fetchListsAndTodosForContact',
  async (contactId, thunkAPI) => {
    const response = await fetch(`/contact-lists-todos/${contactId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch lists and todos');
    }
    const listsAndTodos = await response.json();
    return listsAndTodos;
  }
);

export const listsSlice = createSlice({
  name: 'lists',
  initialState: {
    lists: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    // Reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListsAndTodosForContact.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchListsAndTodosForContact.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lists = action.payload;
      })
      .addCase(fetchListsAndTodosForContact.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default listsSlice.reducer;
