import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate, BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ManageContacts from './ManageContacts';
import ManageCompanies from './ManageCompanies';
import { fetchCompanies } from './slices/companiesSlice'
import { fetchAllContacts } from './slices/contactsSlice'
import { fetchAllTags } from './slices/tagsSlice'
import ManageToDo from './ManageToDo';
import { useDispatch } from 'react-redux'
import NewCompanyForm from './NewCompanyForm'
import NewContactForm from './NewContactForm'
import NewTodoForm from './NewTodoForm'
import NewTagForm from './NewTagForm'
import NewUserForm from './NewUserForm'
import NewListForm from './NewListForm'
import LoginForm from './LoginForm';
import ProtectedRoute from './ProtectedRoute';
import { checkSession,logoutUser } from './slices/authSlice';
import { useSelector } from 'react-redux';
import LandingPage from './LandingPage';



function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser())
      .then(() => {
        console.log('Logout successful');
        navigate('/login'); 
      })
      .catch((error) => console.error('Logout failed', error));
  };
  
  return (
    <div className="flex flex-col h-screen">
      <header className="navbar bg-base-100">
        <div className="flex-grow">
          <div className="flex justify-between items-center w-full px-4">
            <Link to="/manage-companies"><button className="btn btn-primary btn-lg">Manage Companies</button></Link>
            <Link to="/manage-contacts"><button className="btn btn-secondary btn-lg">Manage Contacts</button></Link>
            <Link to="/manage-todo"><button className="btn btn-accent btn-lg">Manage ToDo</button></Link>
            {!localStorage.getItem('token') ? (
              <>
                <Link to="/login"><button className="btn">Login</button></Link>
                <Link to="/signup"><button className="btn">Signup</button></Link>
              </>
            ) : (
              <button className="btn" onClick={handleLogout}>Logout</button>
            )}
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
  //add local state to manage loading. load h1 tag that says loading.
  //add local state to manage loading. Load h1 tag that says 'loading'
   
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkSession())
      .then((action) => {
        if (action.type.endsWith('fulfilled')) {
          // debugger
          const userId = action.payload.user_id;
          dispatch(fetchCompanies(userId));
          dispatch(fetchAllContacts(userId));
          dispatch(fetchAllTags());
        }
      });
  }, [dispatch]);
  

  const token = localStorage.getItem('token');


return (
  <Router>
    <div className="flex flex-col h-screen">
      <Routes>
        {auth.isAuthenticated ? (
          <>
            <Route path="/layout" element={token ? <Layout /> : <Navigate replace to="/login" />} />
            <Route path="/add-todo" element={<ProtectedRoute><NewTodoForm /></ProtectedRoute>} />
            <Route path="/add-list" element={<ProtectedRoute><NewListForm /></ProtectedRoute>} />
            <Route path="/add-tag" element={<ProtectedRoute><NewTagForm /></ProtectedRoute>} />
            <Route path="/manage-companies" element={<ProtectedRoute><ManageCompanies /></ProtectedRoute>} />
            <Route path="/manage-contacts" element={<ProtectedRoute><ManageContacts /></ProtectedRoute>} />
            <Route path="/manage-todo" element={<ProtectedRoute><ManageToDo /></ProtectedRoute>} />
            <Route path="/add-company" element={<ProtectedRoute><NewCompanyForm /></ProtectedRoute>} />
            <Route path="/add-contact" element={<ProtectedRoute><NewContactForm /></ProtectedRoute>} />
          </>
        ) : (
          <>
            {/* Public routes go here */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<NewUserForm />} />
            {/* Redirect to login if no other routes match and user is not logged in */}
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        )}
      </Routes>
    </div>
  </Router>
);
}
export default App;
