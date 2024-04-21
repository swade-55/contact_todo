// NewCompanyForm.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addCompany } from './slices/companiesSlice';

const NewCompanyForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.auth.user);
  // const loggedInUserIdObject = useSelector((state) => state.auth.user);
  console.log('logged in user', loggedInUserId)
  

  const initialValues = {
    name: '',
    image: null,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Company name is required'),
  });

  const onSubmit = (values, { setSubmitting }) => {
    if (!loggedInUserId) {
      console.error("User ID is not available");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('manager_id', loggedInUserId);
    
    if (values.image) {
      formData.append('image', values.image);
    }

    dispatch(addCompany(formData))
      .then(() => {
        onClose();
      })
      .catch(error => {
        console.error('Failed to add company', error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ setFieldValue, isSubmitting }) => (
        <Form>
          <div className="form-control w-full max-w-xs">
            <label htmlFor="name" className="label text-xl">Company Name</label>
            <Field id="name" name="name" placeholder="Company Name" className="input input-bordered w-full max-w-xs" />
            <ErrorMessage name="name" component="div" className="text-error text-xl" />
          </div>

          <div className="form-control w-full max-w-xs my-6">
            <label htmlFor="image" className="label text-xl">Company Logo</label>
            <input id="image" name="image" type="file" onChange={(event) => setFieldValue("image", event.currentTarget.files[0])} className="input input-bordered w-full max-w-xs" />
          </div>

          <div className="flex justify-between">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">Submit</button>
            <button type="button" onClick={onClose} className="btn btn-error">Cancel</button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewCompanyForm;
