import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { addTodo } from './slices/contactsSlice';
import { useNavigate } from 'react-router-dom';

const NewToDoForm = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const contacts = useSelector(state=>state.contacts.contacts)
  const tags = useSelector(state => state.tags.tags);

  function getListNames(contacts) {
    return contacts.map(contact => 
      contact.todo_lists.map(list => 
        list.title 
      )
    ).flat(); 
  }
  
  const listNames = getListNames(contacts);

  const todoSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters long'),
    description: Yup.string(),
    dueDate: Yup.date().nullable(),
    completed: Yup.boolean(),
    listId: Yup.number()
      .required('List ID is required')
      .positive('List ID must be a positive number')
      .integer('List ID must be an integer'),
    selectedTags: Yup.array(Yup.number()).required('At least one tag is required'),
  });

  const handleSubmit = (values) => {
    const todo = {
      ...values,
      list_id: parseInt(values.listId, 10),
      due_date: values.dueDate ? new Date(values.dueDate).toISOString() : null,
      tags: values.selectedTags,
    };
    dispatch(addTodo(todo));
  };

  const handleBack = () => {
    navigate('/manage-todo');
  };

  return (
    <div>
      <button onClick={handleBack}>Back to Manage Todo</button>
      <Formik
        initialValues={{
          title: '',
          description: '',
          dueDate: '',
          completed: false,
          listId: '',
          selectedTags: [],
        }}
        validationSchema={todoSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Field type="text" name="title" placeholder="Todo title" />
            <ErrorMessage name="title" component="div" />

            <Field as="textarea" name="description" placeholder="Todo description" />
            <ErrorMessage name="description" component="div" />

            <Field type="date" name="dueDate" />
            <ErrorMessage name="dueDate" component="div" />

            <label>
              Completed:
              <Field type="checkbox" name="completed" />
            </label>
            <Field as="select" name="listId">
              <option value="">Select List</option>
              {listNames.map((listName, index) => (
                <option key={index} value={listName}>
                  {listName}
                </option>
              ))}
            </Field>
            <ErrorMessage name="listId" component="div" />

            <FieldArray
              name="selectedTags"
              render={arrayHelpers => (
                <select
                  multiple={true}
                  value={values.selectedTags}
                  onChange={e => {
                    const options = e.target.options;
                    const value = [];
                    for (let i = 0, l = options.length; i < l; i++) {
                      if (options[i].selected) {
                        value.push(options[i].value);
                      }
                    }
                    setFieldValue("selectedTags", value);
                  }}
                  required
                >
                  {tags.map(tag => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              )}
            />
            <ErrorMessage name="selectedTags" component="div" />

            <button type="submit">Add Todo</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewToDoForm;
