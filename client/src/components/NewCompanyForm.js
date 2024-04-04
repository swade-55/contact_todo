import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addCompany } from './slices/companiesSlice';

const NewCompanyForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedInUserId = useSelector((state) => state.auth.user?.id);

  const initialValues = {
    name: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Company name is required'),
  });

  const onSubmit = (values, { resetForm }) => {
    if (loggedInUserId) {
      const companyData = { ...values, manager_id: loggedInUserId };
      dispatch(addCompany(companyData));
      resetForm();
      navigate('/manage-companies');
    } else {
      console.error("User ID is not available");
    }
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
