import React from 'react';
import { useSelector } from 'react-redux';

const sidebarStyle = {
  backgroundColor: '#252525', // Dark grey background
  color: 'white',
  padding: '20px',
  width: '250px',
  height: '100vh',
  overflowY: 'auto',
};

const contactItemStyle = {
  padding: '10px',
  cursor: 'pointer',
  borderBottom: '1px solid #ddd', // light grey border
};

const ContactListsSidebar = ({ onContactSelect }) => {
  const contacts = useSelector((state) => state.contacts.contacts);
  
  return (
    <div style={sidebarStyle}>
      {contacts.map((contact) => (
        <div key={contact.id} onClick={() => onContactSelect(contact.id)} style={contactItemStyle}>
          {contact.name}
        </div>
      ))}
    </div>
  );
};

export default ContactListsSidebar;
