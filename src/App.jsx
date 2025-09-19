import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Track from './components/Track';
import Journal from './components/Journal';
import Flags from './components/Flags';
import DrillDown from './components/DrillDown';
import Customize from './components/Customize';
import './App.css';

const TABS = {
  Dashboard,
  Track,
  Journal,
  Flags,
};

function App() {
  const [currentView, setCurrentView] = useState({ name: 'Dashboard' });

  function navigateTo(view) {
    setCurrentView(view);
  }

  function renderContent() {
    if (currentView.name === 'DrillDown') {
      return <DrillDown path={currentView.path} onNavigate={navigateTo} onBack={() => navigateTo({ name: 'Dashboard' })} />;
    }

    if (currentView.name === 'Customize') {
        return <Customize onBack={() => navigateTo({ name: 'Dashboard' })} />;
    }

    const ActiveComponent = TABS[currentView.name];
    if (ActiveComponent) {
      if (currentView.name === 'Dashboard') {
        return <ActiveComponent onNavigate={(path) => navigateTo({ name: 'DrillDown', path })} />;
      }
      return <ActiveComponent />;
    }

    return <div>Unknown view</div>;
  }

  const activeTab = currentView.name === 'DrillDown' || currentView.name === 'Customize' ? 'Dashboard' : currentView.name;
  let headerText = currentView.name;
  if (currentView.name === 'DrillDown') {
      headerText = currentView.path.join(' > ');
  }


  return (
    <div className="app">
      <header className="app-header">
        <h1>{headerText}</h1>
        {currentView.name === 'Dashboard' && (
            <button className="header-button" onClick={() => navigateTo({ name: 'Customize' })}>
                Customize
            </button>
        )}
      </header>
      <main className="app-content">
        {renderContent()}
      </main>
      <nav className="app-nav">
        {Object.keys(TABS).map((tabName) => (
          <button
            key={tabName}
            className={activeTab === tabName ? 'active' : ''}
            onClick={() => navigateTo({ name: tabName })}
          >
            {tabName}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
