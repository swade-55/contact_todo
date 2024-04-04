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
    <div className="container mx-auto p-4">
      <h1 className="text-6xl font-bold mb-4 text-center">Manage Companies</h1>
      <div className="flex justify-between mb-4">
        <button onClick={handleAddCompanyClick} className="btn btn-primary btn-lg">Add New Company</button>
        <button onClick={handleBack} className="btn px-10 py-3 text-lg">Back to Home</button>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="text-5xl">ID</th>
              <th className="text-5xl">Name</th>
              <th className="text-5xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td className="text-3xl">{company.id}</td>
                <td className="text-3xl">
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
                    <button onClick={() => setEditRowId(company.id)} className="btn btn-accent btn-lg">Edit</button>
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