import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Groups from './pages/Groups';
import Templates from './pages/Templates';
import SendMessage from './pages/SendMessage';
import Messages from './pages/Messages';
import MessageDetails from './pages/MessageDetails';
import Layout from './components/Layout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="groups" element={<Groups />} />
          <Route path="templates" element={<Templates />} />
          <Route path="send" element={<SendMessage />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:id" element={<MessageDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
