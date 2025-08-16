import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import './App.css'
import SignInPage from './pages/auth/sign-in'
import SignUpPage from './pages/auth/sign-up'
import OAuthCallback from './pages/auth/oauth-callback'
import ConfirmEmail from './pages/auth/confirm-email'
import DashboardLayout from './pages/dashboard/layout'
import Home from './pages/dashboard/home'
import { LoadingAccount } from './components/ui/loading-account'
import { useUser } from './hooks/use-user'
import Profile from './pages/dashboard/project-views/profile'
import Overview from './pages/dashboard/project-views/overview'
import Documents from './pages/dashboard/project-views/documents'
import MembersView from './pages/dashboard/project-views/members-view'
import NotesView from './pages/dashboard/project-views/notes'
import TasksView from './pages/dashboard/project-views/tasks'

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <LoadingAccount />;
}

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<SignInPage />} />
        <Route path='sign-up' element={<SignUpPage />} />
        <Route path='confirm-email' element={<ConfirmEmail />} />
        <Route path="auth/callback" element={<OAuthCallback />} />
        <Route path='dashboard' element={user ? <DashboardLayout /> : <Navigate to="/" replace />}>
          <Route index element={<Home />} />
          <Route path='profile' element={<Profile />} />
          <Route path=":projectId">
            <Route index element={<Overview />} />
            <Route path='documents' element={<Documents />} />
            <Route path='members' element={<MembersView />} />
            <Route path='notes' element={<NotesView />} />
            <Route path='tasks' element={<TasksView />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
