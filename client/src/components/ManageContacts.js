import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { updateContact, deleteContact } from './slices/contactsSlice';

const ManageContacts = () => {
  const contacts = useSelector((state) => state.contacts.contacts);
  console.log('this is contacts', contacts)
  const companies = useSelector(state=>state.companies.companies)
  console.log('this is companies', companies)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editRowId, setEditRowId] = useState(null);
  const [selectedCompanyId,setSelectedCompanyId] = useState('')

  const contactSchema = Yup.object().shape({
    // ... other validations ...
    job_title: Yup.string()
      .max(100, 'Job title must not exceed 100 characters'),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Phone number is not valid")
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must not exceed 15 digits'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const handleBack = () => {
    navigate('/');
  };

  const filteredContacts = selectedCompanyId
  ? contacts.filter(contact => contact.company_id?.toString() === selectedCompanyId)
  : contacts;

  const handleAddContactClick = () => {
    navigate('/add-contact');
  };

  const handleCancelClick = () => {
    setEditRowId(null);
  };

  const handleCompanyChange = (event)=>{
    setSelectedCompanyId(event.target.value)
  }

  const handleDeleteClick = (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      dispatch(deleteContact(contactId))
        .catch((error) => {
          console.error('Delete failed', error);
        });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-6xl font-bold mb-6 text-center">Manage Contacts</h1>
      <div className="flex gap-4 mb-6">
        <button onClick={handleAddContactClick} className="btn btn-primary btn-lg px-10 py-5 text-5xl">Add New Contact</button>
        <button onClick={handleBack} className="btn btn-primary btn-lg px-10 py-5 text-5xl">Back to Home</button>
        <select value={selectedCompanyId} onChange={handleCompanyChange} className="select select-bordered select-lg text-3xl p-4">
          <option value="">Select a Company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full text-3xl">
          <thead>
            <tr className="text-5xl">
              <th>ID</th>
              <th>Company</th>
              <th>Name</th>
              <th>Status</th>
              <th>Job Title</th> 
              <th>Phone</th>
              <th>Email</th> 
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredContacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.id}</td>
              <td>{contact.company?.name ?? 'No Company'}</td>
              <td>
                {editRowId === contact.id ? (
                  <Formik
                    initialValues={{
                      name: contact.name,
                      status: contact.status,
                      job_title: contact.job_title || '',
                      phone: contact.phone || '',
                      email: contact.email || '',
                    }}
                    validationSchema={contactSchema}
                    onSubmit={(values, { setSubmitting }) => {
                      dispatch(updateContact({ ...contact, ...values }))
                        .catch((error) => console.error('Update failed', error));
                      setEditRowId(null);
                      setSubmitting(false);
                    }}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <Field name="name" type="text" className="input input-bordered input-lg w-full text-lg" />
                        <ErrorMessage name="name" component="div" className="text-error text-lg" />
                        <Field as="select" name="status" className="select select-bordered select-lg w-full text-lg">
                          <option value="">Select Status</option>
                          <option value="hot">Hot</option>
                          <option value="warm">Warm</option>
                          <option value="cold">Cold</option>
                        </Field>
                        <ErrorMessage name="status" component="div" className="text-error text-lg" />
                        <Field name="job_title" type="text" className="input input-bordered input-lg w-full text-lg" />
                        <ErrorMessage name="job_title" component="div" className="text-error text-lg" />
                        <Field name="phone" type="text" className="input input-bordered input-lg w-full text-lg" />
                        <ErrorMessage name="phone" component="div" className="text-error text-lg" />
                        <Field name="email" type="email" className="input input-bordered input-lg w-full text-lg" />
                        <ErrorMessage name="email" component="div" className="text-error text-lg" />
                        <div className="flex gap-2">
                          <button type="submit" disabled={isSubmitting} className="btn btn-success btn-lg px-4 py-2 text-3xl">Save</button>
                          <button type="button" onClick={handleCancelClick} className="btn btn-ghost btn-lg px-4 py-2 text-3xl">Cancel</button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <>
                    {contact.name}
                  </>
                )}
              </td>
              <td className={`text-3xl ${contact.status === 'hot' ? 'text-red-500' : contact.status === 'warm' ? 'text-yellow-500' : 'text-blue-500'}`}>
                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
              </td>
              <td>{contact.job_title || 'N/A'}</td> {/* Display job title */}
              <td>{contact.phone || 'N/A'}</td> {/* Display phone */}
              <td>{contact.email || 'N/A'}</td> {/* Display email */}
              <td>
                <div className="flex gap-2">
                  {editRowId === contact.id ? (
                    <>
                      <button onClick={() => handleDeleteClick(contact.id)} className="btn btn-error btn-lg px-4 py-2 text-3xl">Delete</button>
                      <button onClick={handleCancelClick} className="btn btn-ghost btn-lg px-4 py-2 text-3xl">Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => setEditRowId(contact.id)} className="btn btn-info btn-lg px-4 py-2 text-3xl">Edit</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};

export default ManageContacts;
