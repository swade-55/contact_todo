import {configureStore} from '@reduxjs/toolkit'
import listsReducer from '../slices/listsSlice'
import contactsReducer from '../slices/contactsSlice'
import companiesReducer from '../slices/companiesSlice'
import tagsReducer from '../slices/tagsSlice'
export const store = configureStore({
    reducer:{
        lists:listsReducer,
        contacts: contactsReducer,
        companies: companiesReducer,
        tags: tagsReducer,
    }
})

export default store
