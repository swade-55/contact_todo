import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { updateContact, deleteContact } from './slices/contactsSlice';
import '../styles/ManageContacts.css';

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
    ? contacts.filter(contact => contact.company_id.toString() === selectedCompanyId)
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
    <div className="container">
      <button onClick={handleAddContactClick}>Add New Contact</button>
      <button onClick={handleBack}>Back to Home</button>
      <select value={selectedCompanyId} onChange={handleCompanyChange}>
        <option value="">Select a Company</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Company</th>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {filteredContacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.id}</td>
              <td>{contact.company.name}</td>
              <td>
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
                        <Field name="name" type="text" />
                        <ErrorMessage name="name" component="div" />
                        <Field as="select" name="status">
                          <option value="">Select Status</option>
                          <option value="hot">Hot</option>
                          <option value="warm">Warm</option>
                          <option value="cold">Cold</option>
                        </Field>
                        <ErrorMessage name="status" component="div" />
                        <button type="submit" disabled={isSubmitting}>Save</button>
                        <button type="button" onClick={handleCancelClick}>Cancel</button>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  contact.name
                )}
              </td>
              <td>
                {contact.status}
              </td>
              <td>
                {editRowId === contact.id ? (
                  <>
                    <button onClick={() => handleDeleteClick(contact.id)}>Delete</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setEditRowId(contact.id)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageContacts;
