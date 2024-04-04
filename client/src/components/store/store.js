import {configureStore} from '@reduxjs/toolkit'
import contactsReducer from '../slices/contactsSlice'
import companiesReducer from '../slices/companiesSlice'
import tagsReducer from '../slices/tagsSlice'
import authReducer from '../slices/authSlice'
export const store = configureStore({
    reducer:{
        contacts: contactsReducer,
        companies: companiesReducer,
        tags: tagsReducer,
        auth: authReducer,
    }
})

export default store
