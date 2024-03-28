 Contact Management System

The Contact Management System is a full-stack web application designed to manage companies, contacts, to-dos, lists, and tags. It provides a comprehensive suite of features to add, view, update, and delete various entities within the system, ensuring efficient and organized contact management.

 Features

- Manage Companies: Create, view, edit, and delete companies.
- Manage Contacts: Add contacts under companies, view contact details, and update or delete them as needed.
- To-Do Management: Associate to-dos with contacts, including details such as title, description, completion status, and due dates.
- List Management: Organize to-dos in customizable lists for better organization.
- Tagging System: Assign tags to to-dos for enhanced categorization and retrieval.

 Tech Stack

- Backend: Python Flask
- Frontend: ReactJS + Redux for state management
- Database: SQL (with SQLAlchemy ORM)
- Form Handling: Formik with Yup for validation
- Styling: Tailwind CSS

 Getting Started

 Prerequisites

- Python 3.8+
- Node.js 14+
- NPM

 Setting Up the Server

1. Navigate to the server directory:
   ```sh
   cd server
   ```
2. Install the required Python dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Initialize the database:
   ```sh
   flask db upgrade
   ```
4. Start the server:
   ```sh
   flask run
   ```

 Setting Up the Client

1. Navigate to the client directory:
   ```sh
   cd client
   ```
2. Install the required Node.js dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm start
   ```
4. The application should now be running and accessible at [http://localhost:3000](http://localhost:3000).

 Usage

Navigate through the application using the provided menu to manage companies, contacts, and to-dos. Each section provides intuitive forms for adding new entities, with existing entities listed below. Use the edit and delete buttons next to each entity for management.

 Contributing

Contributions are welcome! Please feel free to submit pull requests or create issues for bugs and feature requests.

 License

This project is licensed under the MIT License - see the LICENSE.md file for details.

---

This README provides a basic overview and setup guide for your project. Feel free to customize it further to better suit your project's needs or to add additional sections such as "Contributors", "Acknowledgments", or any other information you deem necessary.