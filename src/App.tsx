import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import './styles/global.css';

// Import your root component or routes
// import YourRootComponent from './components/YourRootComponent';

function App() {
  return (
    <ThemeProvider>
      {/* Your app components here */}
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Your App Title</h1>
        {/* Add your components here */}
      </div>
    </ThemeProvider>
  );
}

export default App;
