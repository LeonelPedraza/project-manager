import { BrowserRouter, Routes, Route } from 'react-router'
import './App.css'
import SignInPage from './pages/auth/sign-in'
import SignUpPage from './pages/auth/sign-up'
import OAuthCallback from './pages/auth/oauth-callback'
import ConfirmEmail from './pages/auth/confirm-email'
import DashboardLayout from './pages/dashboard/layout'
import Home from './pages/dashboard/home'
import Project from './pages/dashboard/views/overview'
import MembersView from './pages/dashboard/views/members-view'
import { Profile } from './pages/dashboard/views/profile'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<SignInPage />} />
        <Route path='sign-up' element={<SignUpPage />} />
        <Route path='confirm-email' element={<ConfirmEmail />} />
        <Route path="auth/callback" element={<OAuthCallback />} />
        <Route path='dashboard' element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path='profile' element={<Profile />} />
          <Route path=":projectId">
            <Route index element={<Project />} />
            <Route path='members' element={<MembersView />} />          
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
