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
    return contacts.flatMap(contact =>
      contact.todo_lists.map(list => ({
        id: list.id, // Assuming each list has a unique id
        title: list.title
      }))
    );
  }
  
  const listNames = getListNames(contacts);

  const todoSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters long'),
    description: Yup.string('description needs to be a string'),
    dueDate: Yup.date().nullable(),
    completed: Yup.boolean(),
    listId: Yup.string()
      .required('List ID is required'),
    selectedTags: Yup.array(Yup.number()).required('At least one tag is required'),
  });

  const handleSubmit = (values) => {
    const todo = {
      ...values,
      list_id: values.listId,
      due_date: values.dueDate ? new Date(values.dueDate).toISOString() : null,
      tags: values.selectedTags,
    };
    dispatch(addTodo(todo));
  };

  const handleBack = () => {
    navigate('/manage-todo');
  };

  return (
    <div className="card bg-base-200 p-4">
      <div className="card-body">
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
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <Field type="text" name="title" placeholder="Todo title" className="input input-bordered" />
                <ErrorMessage name="title" component="div" className="text-error" />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <Field as="textarea" name="description" placeholder="Todo description" className="textarea textarea-bordered h-24" />
                <ErrorMessage name="description" component="div" className="text-error" />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Due Date</span>
                </label>
                <Field type="date" name="dueDate" className="input input-bordered" />
                <ErrorMessage name="dueDate" component="div" className="text-error" />
              </div>

              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Completed</span>
                  <Field type="checkbox" name="completed" className="checkbox" />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">List</span>
                </label>
                <Field as="select" name="listId" className="select select-bordered">
                  <option value="">Select List</option>
                  {listNames.map((list, index) => (
                    <option key={index} value={list.id}>
                      {list.title}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="listId" component="div" className="text-error" />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tags</span>
                </label>
                <FieldArray
                  name="selectedTags"
                  render={arrayHelpers => (
                    <select
                      multiple={true}
                      value={values.selectedTags}
                      className="select select-bordered"
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
                <ErrorMessage name="selectedTags" component="div" className="text-error" />
              </div>

              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary btn-lg">Add Todo</button>
              </div>
            </Form>
          )}
        </Formik>
        <button className="btn px-10 py-3 text-lg" onClick={handleBack}>Back to Manage Todo</button>
      </div>
    </div>
  );
};

export default NewToDoForm;