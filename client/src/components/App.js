import React, {useEffect} from 'react';
import '../styles/App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ManageContacts from './ManageContacts';
import ManageCompanies from './ManageCompanies';
import {fetchCompanies} from './slices/companiesSlice'
import {fetchAllTags} from './slices/tagsSlice'
import ManageToDo from './ManageToDo';
import {useDispatch} from 'react-redux'
import NewCompanyForm from './NewCompanyForm'
import NewContactForm from './NewContactForm'
import NewTodoForm from './NewTodoForm'
import NewTagForm from './NewTagForm'
import NewUserForm from './NewUserForm'
import NewListForm from './NewListForm'
import {fetchAllContacts} from './slices/contactsSlice'



function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    //userId will act as a placeholder until feature is developed to create users via sign up form(unfinished stretch goals)
    const userId = 1;
    dispatch(fetchCompanies(userId));
    dispatch(fetchAllContacts(userId));
    dispatch(fetchAllTags());
  }, [dispatch]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/manage-companies" element={<ManageCompanies />} />
        <Route path="/manage-contacts" element={<ManageContacts />} />
        <Route path="/manage-todo" element={<ManageToDo />} />
        <Route path = "/add-company" element={<NewCompanyForm/>} />
        <Route path = "/add-contact" element={<NewContactForm/>} />
        <Route path = "/add-user" element={<NewUserForm/>} />
        <Route path = "/add-todo" element={<NewTodoForm/>} />
        <Route path = "/add-list" element={<NewListForm/>} />
        <Route path = "/add-tag" element={<NewTagForm/>} />

      </Routes>
    </Router>
  );
}

function Layout() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to the Capstone Matching System</h1>
        <h2>Welcome, Samuel Wade!</h2>
      </header>
      <div className="button-container">
        <Link to="/manage-companies"><button className="menu-button">Manage Companies</button></Link>
        <Link to="/manage-contacts"><button className="menu-button">Manage Contacts</button></Link>
        <Link to="/manage-todo"><button className="menu-button">Manage ToDo</button></Link>
      </div>
      <footer className="app-footer">
        © 2023 Capstone Matching System
      </footer>
    </div>
  );
}

export default App;
