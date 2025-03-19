import React from 'react';
import Link from 'next/link';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon,
  text,
  isActive = false,
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
        isActive
          ? 'bg-primary-blue text-white'
          : 'text-dark-gray hover:bg-light-gray'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{text}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  // In a real app, you'd determine the active link based on the current route
  const activeLink: string = '/dashboard';

  return (
    <div className="hidden md:flex w-64 flex-col bg-white border-r border-light-gray">
      <div className="py-6 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-10 w-10 bg-primary-blue rounded-md flex items-center justify-center">
            <span className="text-white font-bold">R</span>
          </div>
          <span className="text-xl font-heading font-bold text-primary-blue">
            RAGWriter
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        <SidebarLink
          href="/dashboard"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          }
          text="Dashboard"
          isActive={activeLink === '/dashboard'}
        />

        <SidebarLink
          href="/corpus"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          }
          text="Corpus"
          isActive={activeLink === '/corpus'}
        />

        <SidebarLink
          href="/generate"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 01-.659 1.591L9.5 14.5m3.25-11.396c.251.023.501.05.75.082m-1.5-.082a24.301 24.301 0 00-4.5 0m12 0v5.714a2.25 2.25 0 01-.659 1.591L18.5 14.5m-12 0l3.75 3.75m7.5-7.5l-3.75 3.75"
              />
            </svg>
          }
          text="Generate"
          isActive={activeLink === '/generate'}
        />

        <SidebarLink
          href="/history"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          text="History"
          isActive={activeLink === '/history'}
        />

        <SidebarLink
          href="/settings"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
          text="Settings"
          isActive={activeLink === '/settings'}
        />
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-lighter-gray rounded-lg p-4">
          <h4 className="font-medium text-dark-gray mb-2">Usage Stats</h4>
          <div className="text-sm text-medium-gray mb-2">
            Words Generated: 1,245 / 15,000
          </div>
          <div className="w-full bg-light-gray rounded-full h-2">
            <div
              className="bg-secondary-teal h-2 rounded-full"
              style={{ width: '8%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 