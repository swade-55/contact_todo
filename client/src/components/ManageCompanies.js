import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { useTable } from 'react-table'; // Import useTable from react-table
import '../styles/ManageCompanies.css';
import { updateCompany } from './slices/companiesSlice';
import {useDispatch} from 'react-redux'

const ManageCompanies = () => {
  // Retrieve companies from Redux store
  const companies = useSelector((state) => state.companies.companies);
  const navigate = useNavigate();
  const [editRowId, setEditRowId] = useState(null)
  const [editFormData,setEditFormData] = useState({name:'',id:null})
  const dispatch = useDispatch();


  const handleBack = () => {
    navigate('/')
  }

  const handleAddCompanyClick = ()=>{
    navigate('/add-company')
  }

  const handleEditClick = (company,e)=>{
    e.preventDefault()
    setEditRowId(company.id)
    setEditFormData({name:company.name,id:company.id})
  }

  const handleCancelClick = ()=>{
    setEditRowId(null)
  }

  const handleSaveClick = () => {
    dispatch(updateCompany(editFormData)) // Dispatch the action using Redux's dispatch
      .then(() => {
        // Handle success - maybe refresh the list or show a success message
      })
      .catch((error) => {
        // Handle error - show an error message
      });
    setEditRowId(null);
  };

  const handleFormChange = (e) =>{
    setEditFormData({...editFormData, [e.target.name]:e.target.value})

  }

  // Define columns for react-table

  
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ row }) => {
          return editRowId === row.original.id ? (
            <input
            type="text"
            name="name"
            value={editFormData.name}
            onChange={handleFormChange}
            />
            ) : (
              <span>{row.original.name}</span>
              );
            },
          },
          {
            Header: 'Actions',
            Cell: ({ row }) => {
              return editRowId === row.original.id ? (
                <div>
              <button onClick={handleSaveClick}>Save</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          ) : (
            <button onClick={(e) => handleEditClick(row.original, e)}>Edit</button>
            );
          },
        },
      ],
      [editRowId, editFormData]
      );
      
      // Use the state and functions returned from useTable to build your UI
      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({ columns, data: companies });


      // Render the table UI using react-table's UI construction methods
      return (
        <div className="container">
      <button onClick={handleAddCompanyClick}>Add New Company</button>
      <button onClick={handleBack}>Back to Home</button>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCompanies;
