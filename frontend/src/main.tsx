import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Layouts/Home.tsx'
import Register from './pages/Register.tsx'
import Login from './pages/Login.tsx'
import { Provider } from 'react-redux'
import store from "./app/store.ts"
import { HandleDarkMode } from './lib/utils.ts'
import Listings from './pages/Listings.tsx'
import BusinessDetails from './pages/BusinessDetails.tsx'
import MerchantDashboard from './Layouts/MerchantDashboard.tsx'
import MerchantRegister from './pages/MerchantRegister.tsx'
import Analytics from './pages/Analytics.tsx'
import Credentials from './pages/Credentials.tsx'
import Bookings from './pages/Bookings.tsx'
import Slots from './pages/Slots.tsx'
import Leads from './pages/Leads.tsx'
import { ErrorAlert, NormalAlert } from './components/Alert.tsx'
import ScrollTop from './lib/ScrollTop.tsx'

HandleDarkMode();
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ScrollTop />
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Home />} >
          <Route index element={<Listings />} />
          <Route path='business/:businessName' element={<BusinessDetails />} />
          <Route path="merchant/create-account" element={<MerchantRegister />} />
          <Route path="bookings" element={<Bookings />} />
        </Route>
        <Route path='/merchant' element={<MerchantDashboard />}>
          <Route index element={<Analytics />} />
          <Route path='credentials' element={<Credentials />} />
          <Route path="slots" element={<Slots />} />
          <Route path="leads/:intervalId" element={<Leads />} />
        </Route>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path='*' element={<div>404 not found</div>} />
      </Routes>
      <ErrorAlert />
      <NormalAlert />
    </Provider>
  </BrowserRouter>
)
