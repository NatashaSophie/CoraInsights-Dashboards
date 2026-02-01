import React from 'react';
import { TopNavigation } from '../TopNavigation/TopNavigation';
import './DashboardLayout.css';

export function DashboardLayout({ children, title, subtitle }) {
  return (
    <>
      <TopNavigation />
      <div className="dashboard-container">
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
    </>
  );
}
