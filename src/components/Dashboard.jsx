import React, { useState, useEffect } from 'react';
import { getLayout } from '../data/storage';
import * as Icons from './Icons';
import './Dashboard.css';

function Dashboard({ onNavigate }) {
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    // Force a re-render when returning to the dashboard to see customizations
    const handleFocus = () => {
        setLayout(getLayout());
    };
    window.addEventListener('focus', handleFocus);
    setLayout(getLayout()); // Initial load
    return () => {
        window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (!layout) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-grid">
      {Object.keys(layout).map((categoryName) => {
        const IconComponent = Icons[categoryName.replace(' ', '')] || Icons.Activity;
        return (
          <button
            key={categoryName}
            className="category-button"
            onClick={() => onNavigate([categoryName])}
          >
            <IconComponent />
            <span>{categoryName}</span>
          </button>
        );
      })}
    </div>
  );
}

export default Dashboard;
