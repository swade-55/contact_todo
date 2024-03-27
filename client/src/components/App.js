import React, {useEffect, useState} from 'react';
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




function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <header className="navbar bg-base-100">
        <div className="flex-grow">
          <div className="flex justify-between items-center w-full px-4">
            <Link to="/manage-companies"><button className="btn btn-primary btn-lg">Manage Companies</button></Link>
            <Link to="/manage-contacts"><button className="btn btn-secondary btn-lg">Manage Contacts</button></Link>
            <Link to="/manage-todo"><button className="btn btn-accent btn-lg">Manage ToDo</button></Link>
          </div>
        </div>
      </header>
      <HeroSection />
      <footer className="footer bg-base-300 text-base-content">
        <div className="items-center grid-flow-col">
          <p>© 2023 Capstone Matching System</p>
        </div>
      </footer>
    </div>
  );
}

function HeroSection() {
  // State to control the visibility of the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome to the Contact Management System</h1>
          <p className="py-6">Manage your contacts.</p>
          <button className="btn btn-primary btn-lg" onClick={openModal}>Get Started</button>
        </div>
      </div>

      {/* Modal for instructions */}
      {isModalOpen && (
        <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
          <div className="modal-box relative">
            <label htmlFor="my-modal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeModal}>✕</label>
            <h3 className="text-lg font-bold">Instructions</h3>
            <p className="py-4">Here are the steps to use this system efficiently:</p>
            <ul className="list-disc list-inside">
              <li>Navigate to Manage Companies to add or edit company details.</li>
              <li>Go to Manage Contacts to view and manage your contacts.</li>
              <li>Use the Manage ToDo section to keep track of your tasks for each contact.</li>
            </ul>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={closeModal}>Got it!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


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
      <div className="flex flex-col h-screen">
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
      </div>
    </Router>
  );
}

export default App;
