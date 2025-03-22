import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global styles
import { BrowserRouter as Router } from 'react-router-dom'; // For routing
import ErrorBoundary from './components/ErrorBoundary'; // Corrected import
import reportWebVitals from './pages/reportWebVitals';

// Lazy load the App component for better performance
const LazyApp = React.lazy(() => import('./App'));

// Root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app with error boundaries and strict mode
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <React.Suspense fallback={<div>Loading...</div>}>
          <LazyApp />
        </React.Suspense>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);

// Measure performance in production
if (process.env.NODE_ENV === 'production') {
  reportWebVitals(console.log); // Log performance metrics
}

// Export for testing purposes
export default root;