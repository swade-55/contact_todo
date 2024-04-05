import React from 'react';
import { useSelector } from 'react-redux';


const ContactListsSidebar = ({ onContactSelect }) => {
  const contacts = useSelector((state) => state.contacts.contacts);
  console.log("this is contacts",contacts)

  
  
  return (
    <div className="bg-neutral text-neutral-content p-5 w-64 overflow-y-auto h-full">
      {contacts.map((contact, index) => ( 
        <div key={index} onClick={() => onContactSelect(contact.id)} className="cursor-pointer py-2 my-2 border-b border-neutral-content">
          {contact.name}
        </div>
      ))}
    </div>
  );
};
//this is a test
export default ContactListsSidebar;
