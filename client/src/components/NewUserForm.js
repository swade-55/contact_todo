import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const NewUserForm = () => {
  const navigate = useNavigate();
  const initialValues = {
    username: '',
    email: '',
    password: '',
  };

  const handleBack=()=>{
    navigate('/manage-companies')
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const onSubmit = (values, { setSubmitting, resetForm, setErrors }) => {
    // Construct the API endpoint
    const apiUrl = '/users'; 

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        resetForm();
    })
    .catch(error => {
        console.error('Error:', error);
        setErrors({ submit: 'Failed to create user' });
    })
    .finally(() => {
        setSubmitting(false);
    });
};


  return (
    <div>
      <button onClick={handleBack} className="btn px-10 py-3 text-lg">Back to Manage Companies</button>
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <Field type="text" name="username" placeholder="Username" />
          <ErrorMessage name="username" component="div" />

          <Field type="email" name="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" />

          <Field type="password" name="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" />

          <button type="submit" disabled={isSubmitting}>
            Create User
          </button>
        </Form>
      )}
    </Formik>
    </div>
  );
};

export default NewUserForm;
