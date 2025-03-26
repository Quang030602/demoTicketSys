import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import TicketSystem from './pages/TicketSystem';
import Auth from './components/Auth/Auth';
import AccountVerification from './components/Auth/AccountVerification';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './redux/user/userSlice';
import { useAuth } from './utils/useAuth';

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />;
  return <Outlet />;
};

function App() {
  const currentUser = useSelector(selectCurrentUser);
  useAuth()
  return (
    <Routes>
      <Route
        path='/'
        element={
          <Navigate to='/ticket'replace={true} />
        }
      />

      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path='/ticket' element={<TicketSystem />} />
      </Route>

      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />
      {/* <Route path='*' element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;