import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      {/* Header */}
      <nav className="bg-neutral text-neutral-content p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <Link to="/" className="btn btn-ghost normal-case text-xl">Contact Management</Link>
            <div>
              <Link to="/login" className="btn btn-primary mr-2">Log In</Link>
              <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow container mx-auto flex flex-col justify-center p-12 text-center">
        <h1 className="mb-6 text-5xl font-bold">
          Welcome to Contact Management
        </h1>
        <p className="mb-6">Streamline your workflows with our integrated contact management system.</p>
        <Link to="/signup" className="btn btn-primary btn-lg">
          Get Started
        </Link>
      </main>

      {/* Footer */}
      <footer className="bg-neutral p-4 text-neutral-content text-center">
        <div>
          <p>&copy; 2024 ContactManagement, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
