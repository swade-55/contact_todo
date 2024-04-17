import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addCompany } from './slices/companiesSlice';

const NewCompanyForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedInUserId = useSelector((state) => state.auth.user);
  
  console.log('this is new id',loggedInUserId)

  const initialValues = {
    name: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Company name is required'),
  });

  const onSubmit = (values, { resetForm, setSubmitting }) => {
    if (!loggedInUserId) {
      console.error("User ID is not available");
      setSubmitting(false); // Stop the submission process
      return;
    }

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('manager_id', loggedInUserId);
    
    // Append the image file if it exists
    if (values.image) {
      formData.append('image', values.image);
    }

    dispatch(addCompany(formData)); // Make sure your action creator can handle FormData
    resetForm();
    navigate('/manage-companies');
  };

  const handleBack = () => {
    navigate('/manage-companies');
  };

  

  return (
    <div className="card bg-base-100 shadow-xl p-8">
      <div className="card-body">
        <button onClick={handleBack} className="btn btn-accent btn-lg px-10 py-4 text-3xl mb-5">
          Back to Manage Companies
        </button>
        <h1 className="card-title text-4xl my-4">Add New Company</h1>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className="form-control w-full max-w-xs">
                <label htmlFor="name" className="label text-4xl">Company Name</label>
                <Field id="name" name="name" placeholder="Company Name" className="input input-bordered input-lg w-full text-lg" />
                <ErrorMessage name="name" component="div" className="text-error text-4xl" />
              </div>
              
              <div className="form-control w-full max-w-xs my-6">
                <label htmlFor="image" className="label text-4xl">Company Image</label>
                <input id="image" name="image" type="file" onChange={(event) => {
                  setFieldValue("image", event.currentTarget.files[0]);
                }} className="input input-bordered input-lg w-full" />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg p-5 text-4xl flex justify-center items-center w-full">
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
