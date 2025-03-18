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
HandleDarkMode();
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Home />} >
          <Route index element={<Listings />} />
          <Route path='business/:businessName' element={<BusinessDetails/>}></Route>
        </Route>
        <Route path="dashboard" element={<div>dashboard</div>} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path='*' element={<div>404 not found</div>} />
      </Routes>
    </Provider>
  </BrowserRouter>
)
