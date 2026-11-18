import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Library from './pages/Library.jsx';
import ReadingForm from './pages/ReadingForm.jsx';
import ReadingDetails from './pages/ReadingDetails.jsx';
function Protected({ children }) { const { auth } = useAuth(); return auth ? children : <Navigate to="/login" replace />; }
export default function App() { return <AuthProvider><BrowserRouter><Routes>
  <Route path="/login" element={<Login/>}/>
  <Route element={<Protected><Layout/></Protected>}>
    <Route path="/library" element={<Library/>}/>
    <Route path="/readings/new" element={<ReadingForm/>}/>
    <Route path="/readings/:id" element={<ReadingDetails/>}/>
    <Route path="/readings/:id/edit" element={<ReadingForm/>}/>
  </Route>
  <Route path="*" element={<Navigate to="/library" replace/>}/>
</Routes></BrowserRouter></AuthProvider>; }
