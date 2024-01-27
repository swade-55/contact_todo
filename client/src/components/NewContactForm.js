// NewCompanyForm.jsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addContact} from './slices/contactsSlice'; 

const NewContactForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    name: '',
    status:'',
    company_id:'',
    manager_id:'',

  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Contact name is required'),
    status: Yup.string().required('Status is required'),
    company_id: Yup.number().required('Company ID is required').positive().integer(),
    manager_id: Yup.number().required('Manager ID is required').positive().integer(),
  });

  const onSubmit = (values) => {
    dispatch(addContact(values))
      // .then(() => {
      //   // Handle success - maybe redirect to company list or show a success message
      //   dispatch(fetchCompanies())
      // })
      // .catch((error) => {
      //   // Handle error - show an error message
      // })
      // .finally(() => setSubmitting(false));
  };

  const handleBack=()=>{
    navigate('/manage-contacts')
  }

  return (
    <div>
      <button onClick={handleBack}>Back to Manage Contacts</button>
      <h1>Add New Contact</h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="name" placeholder="Contact Name" />
            <ErrorMessage name="name" component="div" />

            {/* Dropdown for status */}
            <Field as="select" name="status">
              <option value="">Select Status</option>
              <option value="Hot">Hot</option>
              <option value="Cold">Cold</option>
              <option value="Warm">Warm</option>
            </Field>
            <ErrorMessage name="status" component="div" />

            <Field type="number" name="company_id" placeholder="Company ID" />
            <ErrorMessage name="company_id" component="div" />

            <Field type="number" name="manager_id" placeholder="Manager ID" />
            <ErrorMessage name="manager_id" component="div" />

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
