import React from 'react';
import { Navigation } from '../Navigation/Navigation';
import './DashboardLayout.css';

export function DashboardLayout({ children, title, subtitle }) {
  return (
    <div className="dashboard-container">
      <Navigation />
      <main className="dashboard-main">
        {title && (
          <div className="page-header">
            <h1>{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
        )}
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
