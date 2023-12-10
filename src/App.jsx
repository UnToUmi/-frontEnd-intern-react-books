import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/login';
import Contact from './pages/contact/index';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import Home from './components/Home';
import Header from './components/Header';
import Register from './pages/register';
import { callFetchAccount } from './services/api';
import { useDispatch, useSelector } from 'react-redux';
import { handleGetAccountAction } from './redux/account/accountSlice';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import Admin from './pages/admin';
import ProtectedRoute from './components/ProtectedRoute';
import LayoutAdmin from './components/Admin/LayoutAdmin';
import './styles/reset.scss';
import User from './pages/user/index';
import Book from './pages/book';
import BookPage from './pages/bookPage/bookPage';
import './styles/global.scss';
import OrderPage from './pages/order';
import ViewHistory from './pages/order/ViewHistory';
import { Row } from 'antd';
import AdminOrder from './pages/adminOrder';

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className='layout-app'>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Outlet context={[searchTerm, setSearchTerm]} />
      <Footer />
    </div>
  )
}


export default function App() {

  const dispatch = useDispatch();

  const isLoading = useSelector(state => state.account.isLoading)

  const getAccount = async () => {
    if (window.location.pathname === '/login' ||
      window.location.pathname === '/register')
      return;

    const res = await callFetchAccount();
    if (res && res.data) {
      dispatch(handleGetAccountAction(res.data));
    }
  }
  useEffect(() => {
    getAccount();
  }, [])
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,

      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "book/:slug",
          element: <BookPage />,
        },
        {
          path: "order",
          element:
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
        },
        {
          path: "history",
          element:
            <ProtectedRoute>
              <ViewHistory />
            </ProtectedRoute>
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element:
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
        },
        {
          path: "user",
          element: <User />,
        },
        {
          path: "book",
          element: <Book />,
        },
        {
          path: "order",
          element: <AdminOrder />,
        },

      ],
    },

    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);
  return (
    <>
      {isLoading === false
        || window.location.pathname === '/login'
        || window.location.pathname === '/register'
        || window.location.pathname === '/'
        ?
        <RouterProvider router={router} />
        :
        <Loading />
      }
    </>
  );
}
