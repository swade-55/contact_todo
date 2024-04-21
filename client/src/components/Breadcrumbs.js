import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const displayNameMapping = {
    'manage-companies': 'Manage Companies',
    'add-company': 'New Company Form',
    // Add more mappings as needed
  };


  return (
    <div>
      <Link to="/">Home</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return (
          <span key={to}>
            {' > '}
            <Link to={to}>{value}</Link>
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;