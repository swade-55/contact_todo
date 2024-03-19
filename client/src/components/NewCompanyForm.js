// NewCompanyForm.jsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addCompany} from './slices/companiesSlice'; 

const NewCompanyForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    name: '',
    manager_id: '', 
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Company name is required'),
    manager_id: Yup.number().required('Manager ID is required').positive().integer(),
  });


  const onSubmit = (values, { resetForm }) => {
    dispatch(addCompany(values));
    resetForm();
  };


  const handleBack=()=>{
    navigate('/manage-companies')
  }

  return (
    <div>
      <button onClick={handleBack}>Back to Manage Companies</button>
      <h1>Add New Company</h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="name" placeholder="Company Name" />
            <ErrorMessage name="name" component="div" />

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

export default NewCompanyForm;
