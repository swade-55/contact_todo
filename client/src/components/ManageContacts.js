import React, {useState,useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { useTable } from 'react-table'; 
import {fetchContacts} from './slices/contactsSlice'
import {fetchCompanies} from './slices/companiesSlice'
import '../styles/ManageContacts.css';

const ManageContacts = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedCompanyId,setSelectedCompanyId] = useState('')

  const companies = useSelector(state=>state.companies.companies)
  const contacts = useSelector((state) => state.contacts.contacts);

  useEffect(()=>{
    dispatch(fetchCompanies())
  },[dispatch])

  useEffect(()=>{
    if (selectedCompanyId){
        dispatch(fetchContacts(selectedCompanyId))
    }
  },[selectedCompanyId,dispatch])


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
      },
      {
        Header:'Last Contact Date',
        accessor: 'last_contact_date'
      },
      {
        Header:'Current Status',
        accessor:'status'
      },
    ],
    []
  );

  const handleCompanyChange = (event)=>{
    setSelectedCompanyId(event.target.value)
  }

  const handleBack = ()=>{
    navigate('/')
  }

  const handleAddContactClick = ()=>{
    navigate('/add-contact')
  }
  

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: contacts });

  return (
    <div className="ManageContacts-container">
      <button onClick={handleBack}>Back to Home</button>
      <button onClick={handleAddContactClick}>Add New Contact</button>
      <select value={selectedCompanyId} onChange={handleCompanyChange}>
        <option value="">Select a Company</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>

      <div className="container">
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
    </div>
    
    
  );
};

export default ManageContacts;


