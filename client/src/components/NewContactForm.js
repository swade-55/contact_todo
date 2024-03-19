import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addContact } from './slices/contactsSlice';

const NewContactForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.companies);

  const initialValues = {
    name: '',
    status: '',
    company_id: '',
    manager_id: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Contact name is required')
      .matches(/^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/, 'Name must start with a capital letter and contain only letters'),
    status: Yup.string()
      .required('Status is required')
      .oneOf(['Hot', 'Cold', 'Warm'], 'Invalid status selected'),
    company_id: Yup.number()
      .required('Company ID is required')
      .positive('Company ID must be positive')
      .integer('Company ID must be an integer'),
    manager_id: Yup.number()
      .required('Manager ID is required')
      .positive('Manager ID must be positive')
      .integer('Manager ID must be an integer'),
  });


  const onSubmit = (values, { resetForm }) => {
    dispatch(addContact(values));
    resetForm();
  };

  const handleBack = () => {
    navigate('/manage-contacts');
  };

  return (
    <div>
      <button onClick={handleBack}>Back to Manage Contacts</button>
      <h1>Add New Contact</h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="name" placeholder="Contact Name" />
            <ErrorMessage name="name" component="div" />

            <Field as="select" name="status">
              <option value="">Select Status</option>
              <option value="Hot">Hot</option>
              <option value="Cold">Cold</option>
              <option value="Warm">Warm</option>
            </Field>
            <ErrorMessage name="status" component="div" />

            <Field type="number" name="manager_id" placeholder="Manager ID" />
            <ErrorMessage name="manager_id" component="div" />

            <Field as="select" name="company_id">
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="company_id" component="div" />

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewContactForm;
