import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addList } from './slices/contactsSlice';

const newListSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters long')
    .required('Title is required'),
  contactId: Yup.number()
    .positive('Contact ID must be a positive number')
    .required('Contact ID is required')
    .integer('Contact ID must be an integer'),
});

const NewListForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const contacts = useSelector(state => state.contacts.contacts)
  console.log('contacts', contacts)

  return (
    <div>
      <button onClick={() => navigate('/manage-todo')}>Back to Manage Todo</button>
      <Formik
        initialValues={{ title: '', contactId: '' }}
        validationSchema={newListSchema}
        onSubmit={(values, { resetForm }) => {
          dispatch(addList({
            title: values.title,
            contact_id: parseInt(values.contactId, 10),
          }));
          resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="title" placeholder="List title" />
            <ErrorMessage name="title" component="div" />
            <Field as="select" name="contactId">
              <option value="">Select Contact</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="contactId" component="div" />

            <button type="submit" disabled={isSubmitting}>
              Add List
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewListForm;
