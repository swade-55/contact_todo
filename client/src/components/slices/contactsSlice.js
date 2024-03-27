// contactsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  contacts: [],
  status: 'idle',
  error: null,
};

export const deleteContact = createAsyncThunk('contacts/deleteContacts', async (contactId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/contacts/${contactId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return contactId;  // Return the ID of the deleted contact
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


export const updateContact = createAsyncThunk('contacts/updateContact', async (contactData, { rejectWithValue }) => {
  try {
    const response = await fetch(`/contacts/${contactData.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addContact = createAsyncThunk('contacts/addContact',async(contactData,{rejectWithValue})=>{
  try{
    const response = await fetch('/contacts',{
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


export const fetchAllContacts = createAsyncThunk('contacts/fetchAllContacts', async (userId) => {
  const url = `/contacts-lists/${userId}`; 
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`);
    throw new Error('Could not fetch contacts');
  }

  const data = await response.json();
  return data;
});

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

export const addTodo = createAsyncThunk(
  'contacts/addTodo',
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



export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    deleteCompanyContacts: (state, action)=>{
      const companyId = action.payload
      state.contacts = state.contacts.filter((contact) => contact.company_id !== companyId)


    }
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(addList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const {contact_id} = action.payload;
        const contactIndex = state.contacts.findIndex(contact => contact.id === contact_id);
          state.contacts[contactIndex].todo_lists.push(action.payload);

      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
        
        if (index !== -1) {
          // Update the contact in the array
          state.contacts[index] = action.payload;
        } else {
          console.warn("Updated contact not found in the array");
        }
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        console.log(action.payload)
        state.status = 'succeeded';
        const { list_id} = action.payload;
        state.contacts.forEach(contact => {
          contact.todo_lists?.forEach(list => {
            if (list.id === list_id) {
              list.todos.push(action.payload);
            }
          });
        });
      });
  },
});
export const { deleteCompanyContacts } = contactsSlice.actions
export default contactsSlice.reducer;
