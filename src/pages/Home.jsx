import React from 'react';
import DashboardPublic from './DashboardPublic';
import { TopNavigation } from '../components/Navigation/TopNavigation';
import { AuthenticatedNavigation } from '../components/Navigation/AuthenticatedNavigation';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <div>
      {user && <AuthenticatedNavigation />}
      {user && <TopNavigation />}
      <DashboardPublic hidePublicNav={Boolean(user)} hidePublicHeader={Boolean(user)} />
    </div>
  );
}

export default Home;
