// slices/tagsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const addTag = createAsyncThunk(
  'tags/addTag',
  async (tagData, { rejectWithValue }) => {
    try {
      const response = await fetch('/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
      });
      if (!response.ok) {
        throw new Error('Failed to add tag');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllTags = createAsyncThunk(
  'tags/fetchAllTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/tags');
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const tagsSlice = createSlice({
  name: 'tags',
  initialState: {
    tags: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTag.fulfilled, (state, action) => {
        // Add the new tag to the tags array
        state.tags.push(action.payload);
      })
      .addCase(addTag.rejected, (state, action) => {
        state.error = action.payload?.message || 'An unknown error occurred';
      })
      .addCase(fetchAllTags.fulfilled, (state, action) => {
        state.tags = action.payload;
      });
  },
});

export default tagsSlice.reducer;
