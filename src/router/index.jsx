import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from '@/components/organisms/Layout';

// Lazy load all page components
const HomePage = lazy(() => import('@/components/pages/HomePage'));
const ProductDetailPage = lazy(() => import('@/components/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/components/pages/CartPage'));
const WishlistPage = lazy(() => import('@/components/pages/WishlistPage'));
const NewArrivalsPage = lazy(() => import('@/components/pages/NewArrivalsPage'));
const CheckoutPage = lazy(() => import('@/components/pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('@/components/pages/OrderConfirmationPage'));
const NotFound = lazy(() => import('@/components/pages/NotFound'));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <HomePage />
      </Suspense>
    )
  },
  {
    path: "product/:id",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <ProductDetailPage />
      </Suspense>
    )
  },
  {
    path: "cart",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <CartPage />
      </Suspense>
    )
  },
  {
    path: "wishlist",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <WishlistPage />
      </Suspense>
    )
  },
  {
    path: "checkout",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <CheckoutPage />
</Suspense>
    )
  },
  {
    path: 'new-arrivals',
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NewArrivalsPage />
      </Suspense>
    )
  },
  {
    path: "order-confirmation/:orderId",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <OrderConfirmationPage />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    )
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);