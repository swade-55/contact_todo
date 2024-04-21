import React from 'react';
import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addContact } from './slices/contactsSlice';

const CustomSelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <label htmlFor={props.id || props.name} className="label">{label}</label>
      <select {...field} {...props} className={`select select-bordered w-full mb-3 ${
        meta.touched && meta.error ? 'select-error' : ''
      }`}>
        {props.children}
      </select>
      <ErrorMessage component="div" name={props.name} className="text-error mb-3" />
    </div>
  );
};

const NewContactForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.companies);
  const loggedInUserId = useSelector((state) => state.auth.user);
  console.log("Logged in user",loggedInUserId)
  const initialValues = {
    name: '',
    status: '',
    company_id: '',
    job_title: '',
    phone: '',
    email: '',
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
    job_title: Yup.string()
      .required('Job Title is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
  });

  const onSubmit = (values, { resetForm }) => {
    if (loggedInUserId) {
      const companyData = { ...values, manager_id: loggedInUserId };
      dispatch(addContact(companyData));
      resetForm();
      navigate('/manage-contacts');
    } else {
      console.error("User ID is not available");
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl p-5">
      <div className="card-body">
        <h1 className="card-title mb-4">Add New Contact</h1>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <label htmlFor="name" className="label">
                Contact Name
              </label>
              <Field id="name" type="text" name="name" placeholder="Contact Name" className="input input-bordered w-full mb-3 text-xl" />
              <ErrorMessage name="name" component="div" className="text-error mb-3 text-xl" />

              <CustomSelect name="status" label="Status">
                <option value="">Select Status</option>
                <option value="Hot" style={{ color: 'red' }}>Hot</option>
                <option value="Cold" style={{ color: 'blue' }}>Cold</option>
                <option value="Warm" style={{ color: 'orange' }}>Warm</option>
              </CustomSelect>

              <CustomSelect name="company_id" label="Company">
                <option value="">Select Company</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </CustomSelect>
              <label htmlFor="job_title" className="label">Job Title</label>
              <Field id="job_title" name="job_title" placeholder="Job Title" className="input input-bordered w-full mb-3 text-xl" />
              <ErrorMessage name="job_title" component="div" className="text-error mb-3 text-xl" />

              <label htmlFor="phone" className="label">Phone</label>
              <Field id="phone" name="phone" placeholder="Phone Number" className="input input-bordered w-full mb-3 text-xl" />
              <ErrorMessage name="phone" component="div" className="text-error mb-3 text-xl" />

              <label htmlFor="email" className="label">Email</label>
              <Field id="email" name="email" placeholder="Email Address" className="input input-bordered w-full mb-3 text-xl" />
              <ErrorMessage name="email" component="div" className="text-error mb-3 text-xl" />

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
