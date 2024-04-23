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
import { checkSession, logoutUser } from './slices/authSlice';
import { useSelector } from 'react-redux';
import LandingPage from './LandingPage';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';



function Layout() {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      console.log('Logout successful');
      // Assuming your state changes upon logout, triggering a re-render
    }).catch((error) => console.error('Logout failed', error));
  };
  return (
    <div className="flex flex-col h-screen">
      <header className="navbar bg-base-100" style={{ zIndex: '1000' }}>
        <div className="flex-grow">
          <div className="flex justify-between items-center w-full px-4">
            <Link to="/manage-companies">
              {/* <button className="btn btn-neutral btn-lg p-5 text-5xl flex justify-center items-center">Manage All Companies</button> */}
              <button
                className="btn btn-primary btn-lg text-5xl flex justify-center items-center"
                style={{
                  padding: '1.25rem 2.5rem', // Equivalent to py-5 px-10 in Tailwind
                  display: 'inline-flex', // Make sure it's flex
                  alignItems: 'center', // Vertically centers text
                  justifyContent: 'center', // Horizontally centers text
                  height: '100%', // Ensure full height is used
                  width: 'auto', // Adjust width as needed or use specific size
                  lineHeight: '1' // Adjust line height to ensure vertical centering
                }}
              >
                Manage All Companies
              </button>
            </Link>
            <Link to="/manage-contacts">
              {/* <button className="btn btn-primary btn-lg p-5 text-5xl flex justify-center items-center">Manage All Contacts</button> */}
              <button
                className="btn btn-primary btn-lg text-5xl flex justify-center items-center"
                style={{
                  padding: '1.25rem 2.5rem', // Equivalent to py-5 px-10 in Tailwind
                  display: 'inline-flex', // Make sure it's flex
                  alignItems: 'center', // Vertically centers text
                  justifyContent: 'center', // Horizontally centers text
                  height: '100%', // Ensure full height is used
                  width: 'auto', // Adjust width as needed or use specific size
                  lineHeight: '1' // Adjust line height to ensure vertical centering
                }}
              >
                Manage All Contacts
              </button>
            </Link>

            {/* <Link to="/manage-todo"><button className="btn btn-accent btn-lg p-4 text-5xl">Manage All ToDo</button></Link> */}
            {!auth.isAuthenticated ? (
              <>
                <Link to="/login"><button className="btn">Login</button></Link>
                <Link to="/signup"><button className="btn">Signup</button></Link>
              </>
            ) : (
              // <button className="btn btn-info btn-lg p-5 text-5xl"onClick={handleLogout}>Logout</button>
              <button onClick={handleLogout}
                className="btn btn-info btn-lg text-5xl flex justify-center items-center"
                style={{
                  padding: '1.25rem 2.5rem', // Equivalent to py-5 px-10 in Tailwind
                  display: 'inline-flex', // Make sure it's flex
                  alignItems: 'center', // Vertically centers text
                  justifyContent: 'center', // Horizontally centers text
                  height: '100%', // Ensure full height is used
                  width: 'auto', // Adjust width as needed or use specific size
                  lineHeight: '1' // Adjust line height to ensure vertical centering
                }}
              >
                Logout
              </button>
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
          <h1 className="text-5xl font-bold">Manage Your Contacts</h1>
          <p className="py-12"></p>
          <button className="btn btn-info btn-lg p-5 text-5xl flex justify-center items-center w-full h-full" onClick={openModal}>Help</button>
        </div>
      </div>

      {/* Modal for instructions */}
      {isModalOpen && (
        <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
          <div className="modal-box relative">
            <label htmlFor="my-modal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeModal}>✕</label>
            <h3 className="text-4xl font-bold">Instructions</h3>
            <p className="py-5 text-5xl">Here are the steps to use this system efficiently:</p>
            <ul className="list-disc list-inside">
              <li className="text-4xl">Navigate to Manage All Companies to add or edit company details.</li>
              <li className="text-4xl">Go to Manage All Contacts to view and manage your contacts.</li>
              <li className="text-4xl">For help, contact help@tamu.edu</li>
            </ul>
            <div className="modal-action">
              <button className="btn btn-info btn-lg p-5 text-5xl flex justify-center items-center w-full h-full" onClick={closeModal}>Got it!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkSession())
      .then((action) => {
        if (action.type.endsWith('fulfilled')) {
          const userId = action.payload.user_id;
          console.log('useriD', userId)
          const userIdObject = action.payload;
          console.log('useriD', userIdObject)
          dispatch(fetchCompanies(userId));
          dispatch(fetchAllContacts(userId));
          dispatch(fetchAllTags());
        }
      });
  }, [dispatch]);

  // // const loggedInUserId = useSelector((state) => state.auth.user.id);
  // const loggedInUserIdObject = useSelector((state) => state.auth.user);
  // // console.log('logged in user', loggedInUserId)
  // console.log('logged in user object', loggedInUserIdObject)

  return (
    <BrowserRouter>
      {auth.isAuthenticated && <Breadcrumbs />}
      <Routes>
        {/* Public Routes */}
        {!auth.isAuthenticated ? (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<NewUserForm />} />
            {/* Redirect all other paths to "/" if not authenticated */}
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        ) : (
          /* Protected Routes for Authenticated Users */

          <>
            <Route path="/layout" element={<Layout />} />
            <Route path="/add-todo" element={<NewTodoForm />} />
            <Route path="/add-list" element={<NewListForm />} />
            <Route path="/add-tag" element={<NewTagForm />} />
            <Route path="/manage-companies" element={<ManageCompanies />}>
              <Route path="add-company" element={<NewCompanyForm />} />
            </Route>
            <Route path="/manage-contacts" element={<ManageContacts />} />
            <Route path="/manage-todo" element={<ManageToDo />} />
            {/* <Route path="/add-company" element={<NewCompanyForm />} /> */}
            <Route path="/add-contact" element={<NewContactForm />} />
            {/* Redirect unhandled paths back to "/layout" for authenticated users */}
            <Route path="*" element={<Navigate replace to="/layout" />} />
          </>
        )}
      </Routes>

    </BrowserRouter>
  );
} export default App;
