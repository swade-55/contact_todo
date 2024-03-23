import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
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

  const handleAddUserClick = () => {
    navigate('/add-user');
  };

  const handleCancelClick = () => {
    setEditRowId(null);
  };

  const handleDeleteClick = (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      dispatch(deleteCompany(companyId))
        .catch((error) => {
          console.error('Delete failed', error);
        });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <button onClick={handleAddCompanyClick} className="btn btn-primary">Add New Company</button>
        <button onClick={handleAddUserClick} className="btn btn-secondary">Add New User</button>
        <button onClick={handleBack} className="btn">Back to Home</button>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Manager ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.id}</td>
                <td>{company.manager_id}</td>
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
                          <Field name="name" type="text" className="input input-bordered w-full max-w-xs" />
                          <ErrorMessage name="name" component="div" className="text-error" />
                          <div className="flex justify-end mt-2">
                            <button type="submit" disabled={isSubmitting} className="btn btn-success">Save</button>
                            <button type="button" onClick={handleCancelClick} className="btn btn-ghost">Cancel</button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  ) : (
                    company.name
                  )}
                </td>
                <td>
                  {editRowId === company.id ? (
                    <button onClick={() => handleDeleteClick(company.id)} className="btn btn-error">Delete</button>
                  ) : (
                    <button onClick={() => setEditRowId(company.id)} className="btn btn-accent">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCompanies;