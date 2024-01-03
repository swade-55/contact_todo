import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchListsForContact = createAsyncThunk(
  'lists/fetchListsForContact',
  async (contactId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/lists-for-contact/${contactId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lists');
      }
      const lists = await response.json();
      return lists;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchTodosForList = createAsyncThunk(
  'todos/fetchTodosForList',
  async (listId, thunkAPI) => {
    const response = await fetch(`/todos/${listId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    const todos = await response.json();
    return todos;
  }
);

export const fetchTodosForContact = createAsyncThunk(
  'lists/fetchTodosForContact',
  async (contactId, thunkAPI) => {
    const response = await fetch(`/todos-for-contact/${contactId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos for contact');
    }
    const todos = await response.json();
    return todos;
  }
);

export const listsSlice = createSlice({
  name: 'lists',
  initialState: {
    lists: [],
    todos: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    // Reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListsForContact.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchListsForContact.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lists = action.payload;
      })
      .addCase(fetchListsForContact.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTodosForList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodosForList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Assuming action.meta.arg is the list ID
        state.todos[action.meta.arg] = action.payload;
      })
      .addCase(fetchTodosForList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTodosForContact.fulfilled, (state, action) => {
        state.todosByContact[action.meta.arg] = action.payload;
      });
  },
});

export default listsSlice.reducer;
