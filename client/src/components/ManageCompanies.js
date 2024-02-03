import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { useTable } from 'react-table'; 
import '../styles/ManageCompanies.css';
import { updateCompany,fetchCompanies,deleteCompany } from './slices/companiesSlice';
import {useDispatch} from 'react-redux'

const ManageCompanies = () => {
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
  const handleAddUserClick = ()=>{
    navigate('/add-user')
  }

  const handleEditClick = (company, e) => {
    e.preventDefault();
    setEditRowId(company.id);
    setEditFormData({ name: company.name, id: company.id });
  };

  const handleCancelClick = ()=>{
    setEditRowId(null)
  }

  const handleSaveClick = () => {
    dispatch(updateCompany(editFormData))
      .catch((error) => {
        console.error('Update failed', error);
      });
    setEditRowId(null);
  };

  const handleFormChange = (e) =>{
    setEditFormData({...editFormData, [e.target.name]:e.target.value})

  }

  const handleDeleteClick = (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      dispatch(deleteCompany(companyId))
        .then(() => {
          dispatch(fetchCompanies());
        })
        .catch((error) => {
          console.error('Delete failed', error);
        });
    }
  };
 


  
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Manager ID',
        accessor: 'manager_id', 
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ row }) => {
          if (editRowId === row.original.id) {
            return (
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleFormChange}
              />
            );
          } else {
            return <span>{row.original.name}</span>;
          }
        },
      },
          {
            Header: 'Actions',
            Cell: ({ row }) => {
              return editRowId === row.original.id ? (
                <div>
              <button onClick={handleSaveClick}>Save</button>
              <button onClick={handleCancelClick}>Cancel</button>
              <button onClick={() => handleDeleteClick(row.original.id)}>Delete</button>
            </div>
          ) : (
            <button onClick={(e) => handleEditClick(row.original, e)}>Edit</button>
            );
          },
        },
      ],
      [editRowId, editFormData]
      );
      
      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({ columns, data: Array.isArray(companies) ? companies : [companies] });

      console.log(companies);


      return (
        <div className="container">
      <button onClick={handleAddCompanyClick}>Add New Company</button>
      <button onClick={handleAddUserClick}>Add New User</button>
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
