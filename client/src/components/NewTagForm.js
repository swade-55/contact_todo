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
    <div>
      <button onClick={handleBack}>Back to Manage Todo</button>
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
          <Form>
            <Field type="text" name="tagName" placeholder="Tag Name" />
            <ErrorMessage name="tagName" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Add Tag
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewTagForm;
