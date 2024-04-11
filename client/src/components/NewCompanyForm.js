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
    <div className="card bg-base-100 shadow-xl p-5">
      <div className="card-body">
        <button onClick={handleBack} className="btn px-10 py-3 text-lg">
          Back to Manage Companies
        </button>
        <h1 className="card-title my-4">Add New Company</h1>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="name" className="label">Company Name</label>
                <Field id="name" name="name" placeholder="Company Name" className="input input-bordered w-full" />
                <ErrorMessage name="name" component="div" className="text-error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="image" className="label">Company Image</label>
                <input id="image" name="image" type="file" onChange={(event) => {
                  setFieldValue("image", event.currentTarget.files[0]);
                }} className="input input-bordered w-full" />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-4">
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
