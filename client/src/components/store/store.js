import {configureStore} from '@reduxjs/toolkit'
import listsReducer from '../slices/listsSlice'
import contactsReducer from '../slices/contactsSlice'
import companiesReducer from '../slices/companiesSlice'

export const store = configureStore({
    reducer:{
        lists:listsReducer,
        contacts: contactsReducer,
        companies: companiesReducer,
    }
})

export default store