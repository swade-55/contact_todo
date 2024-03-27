import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addCompany } from './slices/companiesSlice';

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
    navigate('/manage-companies')
    
  };

  const handleBack = () => {
    navigate('/manage-companies');
  };

  return (
    <div className="card bg-base-100 shadow-xl p-5">
      <div className="card-body">
        <button onClick={handleBack} className="btn px-10 py-3 text-lg">
          Back to Manage Companies
        </button>
        <h1 className="card-title my-4">Add New Company</h1>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <label htmlFor="name" className="label">
                Company Name
              </label>
              <Field id="name" type="text" name="name" placeholder="Company Name" className="input input-bordered w-full" />
              <ErrorMessage name="name" component="div" className="text-error" />

              <label htmlFor="manager_id" className="label">
                Manager ID
              </label>
              <Field id="manager_id" type="number" name="manager_id" placeholder="Manager ID" className="input input-bordered w-full" />
              <ErrorMessage name="manager_id" component="div" className="text-error" />

              <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-4 btn-lg">
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default NewCompanyForm;
