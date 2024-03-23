import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTag } from './slices/tagsSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const NewTagForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tagSchema = Yup.object().shape({
    tagName: Yup.string()
      .required('Tag name is required')
      .min(2, 'Tag name must be at least 2 characters long')
      .matches(/^[A-Za-z ]*$/, 'Tag name must not contain numbers or special characters')
      .max(50, 'Tag name must not exceed 50 characters'), 
  });

  const handleBack = () => {
    navigate('/manage-todo');
  };

  return (
    <div className="card bg-base-200 p-4">
      <div className="card-body">
        <Formik
          initialValues={{ tagName: '' }}
          validationSchema={tagSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            dispatch(addTag({ name: values.tagName }));
            resetForm();
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="form-control">
              <label className="label">
                <span className="label-text">Tag Name</span>
              </label>
              <Field
                type="text"
                name="tagName"
                placeholder="Tag Name"
                className="input input-bordered w-full"
              />
              <ErrorMessage name="tagName" component="div" className="text-error" />
              <div className="form-control mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  Add Tag
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <button onClick={handleBack} className="btn btn-ghost mt-4">
          Back to Manage Todo
        </button>
      </div>
    </div>
  );
};

export default NewTagForm;
