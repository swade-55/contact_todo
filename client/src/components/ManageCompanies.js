import React, { useState, useRef  } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import NewCompanyForm from './NewCompanyForm';
import { deleteCompanyContacts } from './slices/contactsSlice';
import { updateCompany, deleteCompany } from './slices/companiesSlice';

const ManageCompanies = () => {
  const companies = useSelector((state) => state.companies.companies);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editRowId, setEditRowId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef(null);

  const handleOpenModal = () => {
    console.log("Opening Modal");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("Closing Modal");
    setIsModalOpen(false);
  };

  const companySchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),
    image: Yup.mixed().nullable()
  });

  const handleBack = () => {
    navigate('/');
  };

  const handleAddCompanyClick = () => {
    navigate('add-company');
  };

  const handleCancelClick = () => {
    setEditRowId(null);
  };

  const handleDeleteClick = (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      dispatch(deleteCompany(companyId))
      dispatch(deleteCompanyContacts(companyId))
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-6xl font-bold mb-6 text-center">Manage Companies</h1>
      <div className="flex justify-between mb-6">
        <button onClick={handleOpenModal} className="btn btn-primary btn-lg text-5xl">Add New Company</button>
        <button onClick={() => navigate('/')} className="btn btn-primary btn-lg text-5xl">Back to Home</button>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full text-4xl">
          <thead>
            <tr className="text-5xl">
              <th>ID</th>
              <th>Name</th>
              <th>Logo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.id}</td>
                <td>
                  {editRowId === company.id ? (
                    <Formik
                    initialValues={{ name: company.name}}
                      validationSchema={companySchema}
                      onSubmit={(values, { setSubmitting }) => {
                        const formData = new FormData();
                        formData.append('name', values.name);
                        const file = fileInputRef.current.files[0];
                        if (file) {
                          formData.append('image', file);
                        }
                        // Append additional fields if necessar                      
                        const updatePayload = { id: company.id, formData };
                        dispatch(updateCompany(updatePayload))
                          .then(() => {
                            // Handle success
                            setEditRowId(null);
                          })
                          .catch((error) => {
                            // Handle error
                            console.error('Update failed', error);
                          })
                          .finally(() => {
                            setSubmitting(false);
                          });
                      }}
                      
                    >
                      {({ isSubmitting, setFieldValue  }) => (
                        <Form>
                          <Field name="name" type="text" className="input input-bordered input-lg w-full max-w-xs text-lg" />
                          <ErrorMessage name="name" component="div" className="text-error text-lg" />
                          <input type="file" ref={fileInputRef} className="input input-bordered input-lg w-full max-w-xs text-lg" />
                          <div className="flex justify-end mt-2">
                            <button type="submit" disabled={isSubmitting} className="btn btn-success btn-lg px-4 py-2 text-3xl">Save</button>
                            <button type="button" onClick={handleCancelClick} className="btn btn-ghost btn-lg px-4 py-2 text-3xl">Cancel</button>
                          </div>
                        </Form>
                        
                      )}
                    </Formik>
                  ) : (
                    company.name
                  )}
                </td>
                <td>
                  {company.image_path ? (
                    <img src={company.image_path} alt={`${company.name} logo`} style={{ width: '150px', height: 'auto' }} />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td>
                  <button onClick={() => setEditRowId(company.id)} className="btn btn-accent btn-xl px-4 py-2 text-3xl">Edit</button>
                  <button onClick={() => handleDeleteClick(company.id)} className="btn btn-error btn-xl px-4 py-2 text-3xl">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            position: 'relative',
            width: '50%',
            maxWidth: '600px',
          }}>
            <NewCompanyForm onClose={handleCloseModal} />
            <button onClick={handleCloseModal} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default ManageCompanies;
