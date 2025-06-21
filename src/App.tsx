import { BrowserRouter, Routes, Route } from 'react-router'
import './App.css'
import AuthLayout from './pages/auth/layout'
import SignInPage from './pages/auth/sign-in'
import SignUpPage from './pages/auth/sign-up'
import OAuthCallback from './pages/auth/oauth-callback'
import ConfirmEmail from './pages/auth/confirm-email'
import DashboardLayout from './pages/dashboard/layout'
import Home from './pages/dashboard/home'
import Project from './pages/dashboard/project'
import MembersView from './pages/dashboard/views/members-view'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthLayout />}>
          <Route index element={<SignInPage />} />
          <Route path='sign-up' element={<SignUpPage />} />
          <Route path='confirm-email' element={<ConfirmEmail />} />
          <Route path="auth/callback" element={<OAuthCallback />} />
        </Route>
        <Route path='/dashboard' element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path='project' element={<Project />} />
          <Route path='members' element={<MembersView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
