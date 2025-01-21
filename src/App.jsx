import React from 'react';
import { useState } from 'react';
import TimeManagementSystem from './components/TimeManagementSystem';
import TestDashboard from './components/TestDashboard';

function App() {
  console.log('App component loaded'); // Add this line here

  const [view, setView] = useState('app'); // 'app' or 'tests'

  return (
    <div>
      <div className="bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto flex gap-4">
          <button
            onClick={() => setView('app')}
            className={`px-4 py-2 rounded ${
              view === 'app' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            Application
          </button>
          <button
            onClick={() => setView('tests')}
            className={`px-4 py-2 rounded ${
              view === 'tests' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            Test Dashboard
          </button>
        </div>
      </div>

      {view === 'app' ? <TimeManagementSystem /> : <TestDashboard />}
    </div>
  );
}

export default App;