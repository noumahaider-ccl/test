import React, { useState, useEffect } from 'react';
import { Clock, PieChart, LogOut, User } from 'lucide-react';

const TimeManagementSystem = () => {
  console.log('TimeManagementSystem component loaded'); // Add this line here
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [timeEntries, setTimeEntries] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [view, setView] = useState('timer');
  const [currentUser, setCurrentUser] = useState(null);
  const [taskType, setTaskType] = useState('');
  const [formError, setFormError] = useState('');

  // Mock users for demo
  const users = [
    { email: 'user1@example.com', password: 'password1', name: 'User One' },
    { email: 'user2@example.com', password: 'password2', name: 'User Two' }
  ];

  const [projects] = useState([
    { id: '1', name: 'Project A' },
    { id: '2', name: 'Project B' },
    { id: '3', name: 'Project C' }
  ]);

  const taskTypes = [
    { id: 'coding', name: 'Coding' },
    { id: 'analysis', name: 'Analysis' },
    { id: 'recruitment', name: 'Recruitment' },
    { id: 'other', name: 'Other' }
  ];

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    error: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u =>
      u.email === loginForm.email &&
      u.password === loginForm.password
    );

    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setLoginForm({ email: '', password: '', error: '' });
    } else {
      setLoginForm(prev => ({
        ...prev,
        error: 'Invalid email or password'
      }));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setTimeEntries([]);
    setActiveTimer(null);
  };

  const validateForm = () => {
    setFormError('');

    if (!taskName.trim()) {
      setFormError('Task name is required');
      return false;
    }

    if (!taskType) {
      setFormError('Task type is required');
      return false;
    }

    if (!selectedProject) {
      setFormError('Project selection is required');
      return false;
    }

    return true;
  };

  const startTimer = () => {
    if (activeTimer) return;
    if (!validateForm()) return;

    const newEntry = {
      id: Date.now(),
      taskName: taskName.trim(),
      taskType: taskType,
      projectId: selectedProject,
      startTime: Date.now(),
      duration: 0,
      userId: currentUser?.email
    };

    setTimeEntries(prev => [...prev, newEntry]);
    setActiveTimer(newEntry);
    setTaskName('');
  };

  const stopTimer = () => {
    if (!activeTimer) return;
    const duration = Date.now() - activeTimer.startTime;

    setTimeEntries(entries =>
      entries.map(entry =>
        entry.id === activeTimer.id
          ? {
              ...entry,
              endTime: Date.now(),
              duration
            }
          : entry
      )
    );
    setActiveTimer(null);
  };

  const formatDuration = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Update active timer duration
  useEffect(() => {
    let intervalId;
    if (activeTimer) {
      intervalId = setInterval(() => {
        setTimeEntries(entries =>
          entries.map(entry =>
            entry.id === activeTimer.id
              ? { ...entry, duration: Date.now() - entry.startTime }
              : entry
          )
        );
      }, 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeTimer]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div>
            <h2 className="text-center text-3xl font-bold">Time Management System</h2>
            <p className="mt-2 text-center text-gray-600">Sign in to your account</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {loginForm.error && (
              <div className="text-red-500 text-sm text-center">{loginForm.error}</div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="mt-1 w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Sign in
            </button>

            <div className="text-sm text-center text-gray-600">
              Demo accounts: user1@example.com / password1
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header with user info */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">CCL Resource Time Management App</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2" />
            {currentUser.name}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setView('timer')}
          className={`flex items-center px-4 py-2 rounded ${
            view === 'timer' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          <Clock className="w-4 h-4 mr-2" />
          Timer
        </button>
        <button
          type="button"
          onClick={() => setView('reports')}
          className={`flex items-center px-4 py-2 rounded ${
            view === 'reports' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          <PieChart className="w-4 h-4 mr-2" />
          Reports
        </button>
      </div>

      {/* Timer View */}
      {view === 'timer' && (
        <div>
          <div className="space-y-3 mb-4">
            {formError && (
              <div className="text-red-500 text-sm">{formError}</div>
            )}

            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
              className="mt-1 w-full p-2 border rounded"
              disabled={activeTimer}
            />

            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
              disabled={activeTimer}
            >
              <option value="">Select Task Type</option>
              {taskTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>

            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
              disabled={activeTimer}
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={activeTimer ? stopTimer : startTimer}
              className={`w-full p-2 rounded ${
                activeTimer
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {activeTimer ? 'Stop' : 'Start'}
            </button>
          </div>

          {activeTimer && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h2 className="font-semibold">{activeTimer.taskName}</h2>
              {activeTimer.projectId && (
                <p className="text-sm text-gray-600 mb-1">
                  {projects.find(p => p.id === activeTimer.projectId)?.name}
                </p>
              )}
              <p className="text-2xl font-mono">
                {formatDuration(Date.now() - activeTimer.startTime)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Reports View */}
      {view === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h2 className="font-semibold mb-4">Time Reports</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded">
                <h3 className="font-medium mb-2">Total Time Tracked</h3>
                <p className="text-2xl font-mono">
                  {formatDuration(timeEntries.reduce((sum, entry) => sum + entry.duration, 0))}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Time by Project</h3>
                <div className="space-y-2">
                  {projects.map(project => {
                    const projectTime = timeEntries
                      .filter(entry => entry.projectId === project.id)
                      .reduce((sum, entry) => sum + entry.duration, 0);

                    return (
                      <div key={project.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{project.name}</span>
                        <span className="font-mono">{formatDuration(projectTime)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Entries List */}
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Recent Entries</h2>
        <div className="space-y-2">
          {timeEntries
            .slice()
            .reverse()
            .map(entry => (
              <div key={entry.id} className="bg-gray-50 p-3 rounded">
                <div className="font-medium">{entry.taskName}</div>
                <div className="text-sm text-gray-600 flex gap-2">
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    {taskTypes.find(t => t.id === entry.taskType)?.name}
                  </span>
                  {entry.projectId && (
                    <span className="bg-green-100 px-2 py-1 rounded">
                      {projects.find(p => p.id === entry.projectId)?.name}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {formatDuration(entry.duration)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TimeManagementSystem;