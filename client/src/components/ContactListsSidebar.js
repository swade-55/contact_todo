import React from 'react';
import { useSelector } from 'react-redux';

const ContactListsSidebar = ({ onContactSelect }) => {
  const contacts = useSelector((state) => state.contacts.contacts);
  
  return (
    <div>
      {contacts.map((contact) => (
        <div key={contact.id} onClick={() => onContactSelect(contact.id)}>
          {contact.name}
        </div>
      ))}
    </div>
  );
};

export default ContactListsSidebar;
