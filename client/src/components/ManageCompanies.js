import React from 'react';
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { useTable } from 'react-table'; // Import useTable from react-table
import '../styles/ManageCompanies.css';

const ManageCompanies = () => {
  // Retrieve companies from Redux store
  const companies = useSelector((state) => state.companies.companies);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/')
  }

  // Define columns for react-table
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id', // accessor is the "key" in the data
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      // Add more columns as needed
    ],
    []
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
