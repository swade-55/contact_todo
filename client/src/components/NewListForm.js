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
    .required('Contact is required')
    .integer('Contact ID must be an integer'),
});

const NewListForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const contacts = useSelector(state => state.contacts.contacts);

  const handleBack = () => {
    navigate('/manage-todo');
  };

  return (
    <div className="card bg-base-200 p-4">
      <div className="card-body">
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
            <Form className="form-control">
              <label className="label">
                <span className="label-text">List Title</span>
              </label>
              <Field type="text" name="title" placeholder="List Title" className="input input-bordered w-full" />
              <ErrorMessage name="title" component="div" className="text-error" />

              <label className="label">
                <span className="label-text">Select Contact</span>
              </label>
              <Field as="select" name="contactId" className="select select-bordered w-full">
                <option value="">Select Contact</option>
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="contactId" component="div" className="text-error" />

              <div className="form-control mt-6">
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  Add List
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <button onClick={handleBack} className="btn btn-ghost mt-4">
          Back to Manage Todo
        </button>
      </div>
    </div>
  );
};

export default NewListForm;
