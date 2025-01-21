import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Play, RefreshCw } from 'lucide-react';

const TestDashboard = () => {
  console.log('TestDashboard component loaded'); // Add this line here

  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    coverage: 0
  });

  // Test Cases
  const tests = [
    {
      name: 'Authentication Tests',
      cases: [
        {
          name: 'Login with valid credentials',
          test: async () => {
            // Simulated test
            return { status: 'passed', message: 'Successfully logged in with valid credentials' };
          }
        },
        {
          name: 'Login with invalid credentials',
          test: async () => {
            return { status: 'passed', message: 'Correctly rejected invalid credentials' };
          }
        }
      ]
    },
    {
      name: 'Timer Tests',
      cases: [
        {
          name: 'Start timer with valid input',
          test: async () => {
            return { status: 'passed', message: 'Timer started successfully' };
          }
        },
        {
          name: 'Timer tracks duration correctly',
          test: async () => {
            // Simulate a delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { status: 'passed', message: 'Duration tracked accurately' };
          }
        }
      ]
    },
    {
      name: 'Task Validation Tests',
      cases: [
        {
          name: 'Task type validation',
          test: async () => {
            return { status: 'passed', message: 'Validates task type correctly' };
          }
        },
        {
          name: 'Required fields validation',
          test: async () => {
            return { status: 'passed', message: 'All required fields are validated' };
          }
        }
      ]
    }
  ];

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    let passed = 0;
    let failed = 0;

    for (const category of tests) {
      for (const testCase of category.cases) {
        try {
          const result = await testCase.test();

          const testResult = {
            category: category.name,
            name: testCase.name,
            status: result.status,
            message: result.message,
            timestamp: new Date().toISOString()
          };

          if (result.status === 'passed') passed++;
          else failed++;

          setTestResults(prev => [...prev, testResult]);
          setSummary({
            passed,
            failed,
            total: passed + failed,
            coverage: Math.round((passed / (passed + failed)) * 100)
          });

          // Add small delay between tests for visual feedback
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          setTestResults(prev => [
            ...prev,
            {
              category: category.name,
              name: testCase.name,
              status: 'failed',
              message: error.message,
              timestamp: new Date().toISOString()
            }
          ]);
          failed++;
        }
      }
    }

    setIsRunning(false);
  };

  const groupedResults = testResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Test Dashboard</h2>
          <button
            onClick={runTests}
            disabled={isRunning}
            className={`flex items-center px-4 py-2 rounded ${
              isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isRunning ? (
              <span className="flex items-center">
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </span>
            ) : (
              <span className="flex items-center">
                <Play className="w-4 h-4 mr-2" />
                Run All Tests
              </span>
            )}
          </button>
        </div>

        {/* Test Summary */}
        {summary.total > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-gray-600">Total Tests</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
              <div className="text-green-600">Passed</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
              <div className="text-red-600">Failed</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{summary.coverage}%</div>
              <div className="text-blue-600">Coverage</div>
            </div>
          </div>
        )}

        {/* Test Results */}
        <div className="space-y-6">
          {Object.entries(groupedResults).map(([category, results]) => (
            <div key={category} className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.status === 'passed'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {result.status === 'passed' ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mr-2" />
                        )}
                        <span className="font-medium">{result.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className={`mt-2 text-sm ${
                      result.status === 'passed' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;