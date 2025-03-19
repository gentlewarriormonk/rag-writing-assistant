import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <header className="bg-white border-b border-light-gray">
      <div className="px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-blue rounded-md flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-heading font-bold text-primary-blue">
                RAGWriter
              </span>
            </Link>
          </div>

          {/* Navigation links - desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/corpus">Corpus</NavLink>
            <NavLink href="/generate">Generate</NavLink>
            <NavLink href="/history">History</NavLink>
            <NavLink href="/settings">Settings</NavLink>
          </nav>

          {/* User menu */}
          <div className="flex items-center">
            <div className="relative">
              <button className="flex items-center space-x-1 text-dark-gray hover:text-primary-blue">
                <div className="h-8 w-8 rounded-full bg-light-gray flex items-center justify-center text-sm font-medium">
                  US
                </div>
                <span className="hidden md:inline-block">User</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {/* Dropdown menu would go here */}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-dark-gray hover:text-primary-blue">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Navigation link component
const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  // In a real app, you'd check if the current path matches href
  const isActive = false;

  return (
    <Link
      href={href}
      className={`text-sm font-medium hover:text-primary-blue ${
        isActive
          ? 'text-primary-blue border-b-2 border-primary-blue'
          : 'text-dark-gray'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar; 