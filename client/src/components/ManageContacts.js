import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { updateContact, deleteContact } from './slices/contactsSlice';

const ManageContacts = () => {
  const contacts = useSelector((state) => state.contacts.contacts);
  const companies = useSelector(state=>state.companies.companies)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editRowId, setEditRowId] = useState(null);
  const [selectedCompanyId,setSelectedCompanyId] = useState('')

  const contactSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),
    status: Yup.string()
      .required('Status is required'),
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
    <div className="container mx-auto p-4">
    <h1 className="text-6xl font-bold mb-4 text-center">Manage Contacts</h1>
      <div className="flex gap-4 mb-4">
      <button onClick={handleAddContactClick} className="btn btn-primary btn-lg">Add New Contact</button>
      <button onClick={handleBack} className="btn px-10 py-3 text-lg">Back to Home</button>
      <select value={selectedCompanyId} onChange={handleCompanyChange} className="select select-bordered">
        <option value="">Select a Company</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
      </div>
      <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th className="text-5xl">ID</th>
            <th className="text-5xl">Company</th>
            <th className="text-5xl">Name</th>
            <th className="text-5xl">Status</th>
            <th className="text-5xl">Actions</th>
          </tr>
        </thead>
        <tbody>
        {filteredContacts.map((contact) => (
            <tr key={contact.id}>
              <td className="text-3xl">{contact.id}</td>
              <td className="text-3xl">{contact.company?.name ?? 'No Company'}</td>
              <td className="text-3xl">
                {editRowId === contact.id ? (
                  <Formik
                    initialValues={{ name: contact.name, status: contact.status }}
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
                        <Field name="name" type="text" className="input input-bordered" />
                        <ErrorMessage name="name" component="div" className="text-error"/>
                        <Field as="select" name="status" className="select select-bordered">
                          <option value="">Select Status</option>
                          <option value="hot">Hot</option>
                          <option value="warm">Warm</option>
                          <option value="cold">Cold</option>
                        </Field>
                        <ErrorMessage name="status" component="div" className="text-error"/>
                        <div className="flex gap-2 mt-2">
                        <button type="submit" disabled={isSubmitting}>Save</button>
                        <button type="button" onClick={handleCancelClick}>Cancel</button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  contact.name
                )}
              </td>
              <td className={`text-3xl ${contact.status === 'hot' ? 'text-red-500' : contact.status === 'warm' ? 'text-yellow-500' : 'text-blue-500'}`}>
      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
    </td>
              <td>
              <div className="flex gap-2">
                {editRowId === contact.id ? (
                  <>
                    <button onClick={() => handleDeleteClick(contact.id)} className="btn btn-error btn-sm">Delete</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setEditRowId(contact.id)} className="btn btn-info btn-lg">Edit</button>
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
