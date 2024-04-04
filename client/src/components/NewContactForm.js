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
  const loggedInUserId = useSelector((state) => state.auth.user?.id);

  const initialValues = {
    name: '',
    status: '',
    company_id: '',
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
  });

  const onSubmit = (values, { resetForm }) => {
    if (loggedInUserId) {
      const companyData = { ...values, manager_id: loggedInUserId };
      dispatch(addContact(companyData));
      resetForm();
      navigate('/manage-companies');
    } else {
      console.error("User ID is not available");
    }
  };

  const handleBack = () => {
    navigate('/manage-contacts');
  };

  return (
    <div className="card bg-base-100 shadow-xl p-5">
      <div className="card-body">
        <button onClick={handleBack} className="btn px-10 py-3 text-lg">Back to Manage Contacts</button>
        <h1 className="card-title mb-4">Add New Contact</h1>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <label htmlFor="name" className="label">
                Contact Name
              </label>
              <Field id="name" type="text" name="name" placeholder="Contact Name" className="input input-bordered w-full mb-3" />
              <ErrorMessage name="name" component="div" className="text-error mb-3" />

              <label htmlFor="status" className="label">
                Status
              </label>
              <Field as="select" name="status" className="select select-bordered w-full mb-3">
                <option value="">Select Status</option>
                <option value="Hot">Hot</option>
                <option value="Cold">Cold</option>
                <option value="Warm">Warm</option>
              </Field>
              <ErrorMessage name="status" component="div" className="text-error mb-3" />

              <label htmlFor="company_id" className="label">
                Company
              </label>
              <Field as="select" name="company_id" className="select select-bordered w-full mb-3">
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="company_id" component="div" className="text-error mb-3" />

              <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg">
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default NewContactForm;
