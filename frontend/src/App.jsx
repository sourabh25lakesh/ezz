import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PrivateRouter from './components/PrivateRouter';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ToastProvider } from './context/ToastContext';
import Toaster from './components/Toaster';


function App() {
  return (
    <ToastProvider>
      <Router>
        <Navbar/>
        <Toaster/>
        <Routes>
          <Route path="/" element={<ProductList/>}/>
          <Route path="/product/:id" element={<ProductDetails/>}/>
          <Route path="/cart" element={<CartPage/>}/> 
          <Route element={<PrivateRouter/>}> 
              <Route path="/checkout" element={<CheckoutPage/>}/>
          </Route>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;