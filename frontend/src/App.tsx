import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import Groups from './pages/Groups';
import CreateGroup from './pages/CreateGroup';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import ForgotPassword from './pages/ForgotPassword';
import SuccessNotification from './components/SuccessNotification';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/success" element={<SuccessNotification />} />
              <Route path="/events" element={<Events />} />
              <Route path="/groups" element={<Groups />} />

              <Route 
                path="/create-event" 
                element={
                  <PrivateRoute requireAuth={true}>
                    <CreateEvent />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/create-group" 
                element={
                  <PrivateRoute requireAuth={true}>
                    <CreateGroup />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute requireAuth={true}>
                    <Profile />
                  </PrivateRoute>
                } 
              />

              <Route 
                path="/admin" 
                element={
                  <PrivateRoute allowedRoles={['moderator', 'admin']}>
                    <Admin />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;