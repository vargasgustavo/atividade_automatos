import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import PDFViewer from './components/PDFViewer';
import AIChat from './components/AIChat';
import { ToastProvider } from './context/ToastContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <ToastProvider>
      <div className="container">
        <nav className="navbar">
            <div className="logo">
                <div className="logo-icon"></div>
                <span>SecHub</span>
            </div>
            <div className="nav-links">
                <button 
                  className={activeTab === 'dashboard' ? 'active' : ''} 
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </button>
                {/* <button 
                  className={activeTab === 'pdf-viewer' ? 'active' : ''} 
                  onClick={() => setActiveTab('pdf-viewer')}
                >
                  Visualizador de PDF
                </button> */}
                <button 
                  className={activeTab === 'ai-chat' ? 'active' : ''} 
                  onClick={() => setActiveTab('ai-chat')}
                >
                  Assistente IA
                </button>
            </div>
        </nav>

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'pdf-viewer' && <PDFViewer />}
        {activeTab === 'ai-chat' && <AIChat />}
      </div>
    </ToastProvider>
  );
}

export default App;
