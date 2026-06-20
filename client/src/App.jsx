import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import ProviderLayout from './components/provider/ProviderLayout';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ServicesPage from './pages/services/ServicesPage';
import ServiceDetails from './pages/services/ServiceDetails';
import MyGigs from './pages/gigs/MyGigs';
import GigStep1 from './pages/gigs/GigStep1';
import GigStep2 from './pages/gigs/GigStep2';
import GigStep3 from './pages/gigs/GigStep3';
import GigStep4 from './pages/gigs/GigStep4';
import GigStep5 from './pages/gigs/GigStep5';
import GigPublish from './pages/gigs/GigPublish';
import GigDetails from './pages/gigs/GigDetails';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderOverview from './pages/provider/ProviderOverview';
import ProviderProfile from './pages/provider/ProviderProfile';
import EditProfile from './pages/provider/EditProfile';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerProfile from './pages/customer/CustomerProfile';
import SubmitRequest from './pages/requests/SubmitRequest';
import MyRequests from './pages/requests/MyRequests';
import TrackRequest from './pages/requests/TrackRequest';
import ManageOrders from './pages/orders/ManageOrders';
import OrderDetails from './pages/orders/OrderDetails';
import OrderRequirements from './pages/orders/OrderRequirements';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/gigs/create/step1" element={
            <ProtectedRoute allowedRoles={['ServiceProvider']}>
              <GigStep1 />
            </ProtectedRoute>
          } />
          <Route path="/gigs/create/step2/:gigId" element={
            <ProtectedRoute allowedRoles={['ServiceProvider']}>
              <GigStep2 />
            </ProtectedRoute>
          } />
          <Route path="/gigs/create/step3/:gigId" element={
            <ProtectedRoute allowedRoles={['ServiceProvider']}>
              <GigStep3 />
            </ProtectedRoute>
          } />
          <Route path="/gigs/create/step4/:gigId" element={
            <ProtectedRoute allowedRoles={['ServiceProvider']}>
              <GigStep4 />
            </ProtectedRoute>
          } />
          <Route path="/gigs/create/step5/:gigId" element={
            <ProtectedRoute allowedRoles={['ServiceProvider']}>
              <GigStep5 />
            </ProtectedRoute>
          } />
          <Route path="/gigs/publish/:gigId" element={
            <ProtectedRoute allowedRoles={['ServiceProvider']}>
              <GigPublish />
            </ProtectedRoute>
          } />

          <Route path="/provider" element={
            <ProtectedRoute allowedRoles={['ServiceProvider']}>
              <ProviderLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ProviderDashboard />} />
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="profile" element={<ProviderOverview />} />
            <Route path="profile/edit" element={<EditProfile />} />
          </Route>

          <Route path="/gigs/my" element={
            <ProtectedRoute allowedRoles={['ServiceProvider']}>
              <ProviderLayout />
            </ProtectedRoute>
          }>
            <Route index element={<MyGigs />} />
          </Route>

          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/provider/:userId" element={<ProviderProfile />} />

          <Route path="/provider/profile/edit" element={
            <ProtectedRoute allowedRoles={['ServiceProvider']}>
              <EditProfile />
            </ProtectedRoute>
          } />
          <Route path="/gigs/edit/:gigId" element={
            <ProtectedRoute allowedRoles={['ServiceProvider']}>
              <GigDetails />
            </ProtectedRoute>
          } />

          <Route path="/customer/dashboard" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/customer/profile" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <CustomerProfile />
            </ProtectedRoute>
          } />
          <Route path="/requests/submit/:listingId" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <SubmitRequest />
            </ProtectedRoute>
          } />
          <Route path="/requests/my" element={
            <ProtectedRoute allowedRoles={['Customer', 'ServiceProvider']}>
              <MyRequests />
            </ProtectedRoute>
          } />
          <Route path="/requests/track/:id" element={
            <ProtectedRoute allowedRoles={['Customer', 'ServiceProvider']}>
              <TrackRequest />
            </ProtectedRoute>
          } />

          <Route path="/orders/my" element={
            <ProtectedRoute allowedRoles={['Customer', 'ServiceProvider']}>
              <ManageOrders />
            </ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute allowedRoles={['Customer', 'ServiceProvider']}>
              <OrderDetails />
            </ProtectedRoute>
          } />
          <Route path="/orders/requirements/:gigId" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <OrderRequirements />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
