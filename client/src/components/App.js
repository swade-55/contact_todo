import React, {useEffect} from 'react';
import '../styles/App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ManageContacts from './ManageContacts';
import ManageCompanies from './ManageCompanies';
import {fetchCompanies} from './slices/companiesSlice'
import ManageToDo from './ManageToDo';
import {useDispatch} from 'react-redux'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const userId = 1;
    dispatch(fetchCompanies(userId));
  }, [dispatch]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/manage-companies" element={<ManageCompanies />} />
        <Route path="/manage-contacts" element={<ManageContacts />} />
        <Route path="/manage-todo" element={<ManageToDo />} />
      </Routes>
    </Router>
  );
}

// Layout component that includes the header, navigation, and footer
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
