import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { deleteCompanyContacts} from './slices/contactsSlice';
import { updateCompany, deleteCompany } from './slices/companiesSlice';

const ManageCompanies = () => {
  const companies = useSelector((state) => state.companies.companies);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editRowId, setEditRowId] = useState(null);

  const companySchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),
  });

  const handleBack = () => {
    navigate('/');
  };

  const handleAddCompanyClick = () => {
    navigate('/add-company');
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
        <button onClick={handleAddCompanyClick} className="btn btn-primary btn-lg px-10 py-5 text-5xl">Add New Company</button>
        <button onClick={handleBack} className="btn btn-primary btn-lg px-10 py-5 text-5xl">Back to Home</button>
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
                      initialValues={{ name: company.name }}
                      validationSchema={companySchema}
                      onSubmit={(values, { setSubmitting }) => {
                        dispatch(updateCompany({ ...company, name: values.name }))
                          .catch((error) => console.error('Update failed', error));
                        setEditRowId(null);
                        setSubmitting(false);
                      }}
                    >
                      {({ isSubmitting }) => (
                        <Form>
                          <Field name="name" type="text" className="input input-bordered input-lg w-full max-w-xs text-lg" />
                          <ErrorMessage name="name" component="div" className="text-error text-lg" />
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
                  {editRowId === company.id ? (
                    <button onClick={() => handleDeleteClick(company.id)} className="btn btn-error btn-lg px-4 py-2 text-3xl">Delete</button>
                  ) : (
                    <button onClick={() => setEditRowId(company.id)} className="btn btn-accent btn-xl px-4 py-2 text-3xl">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}  

export default ManageCompanies;
