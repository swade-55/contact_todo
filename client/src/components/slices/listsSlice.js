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

export const fetchAllTodos = createAsyncThunk(
  'todos/fetchAllTodos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todoData, { rejectWithValue }) => {
    try {
      const response = await fetch('/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: todoData.title,
          description: todoData.description,
          completed: todoData.completed,
          dueDate: todoData.due_date, 
          listId: todoData.list_id,   
          tags: todoData.tags,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addList = createAsyncThunk(
  'lists/addList',
  async (listData, { rejectWithValue }) => {
    try {
      const response = await fetch('/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listData),
      });
      if (!response.ok) {
        throw new Error('Failed to add list');
      }
      const data = await response.json();
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
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        const listId = action.payload.list_id;
        if (!state.todos[listId]) {
          state.todos[listId] = [];
        }
        state.todos[listId].push(action.payload);
      })
      .addCase(fetchAllTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'An unknown error occurred';
      })
      .addCase(fetchAllTodos.fulfilled, (state, action) => {
        state.allTodos = action.payload;
        state.status = 'succeeded';
      })
      .addCase(addList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the state with the newly added list
        const { contact_id, ...listData } = action.payload;
        if (!state.listsByContact[contact_id]) {
          state.listsByContact[contact_id] = [];
        }
        state.listsByContact[contact_id].push(listData);
      })
      .addCase(addList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'An unknown error occurred';
      });
  },
});

export default listsSlice.reducer;
