import { lazy, Suspense } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import LoadingSpinner from "./components/spinner/index.jsx";

const Overview = lazy(() => import("./pages/overview/index.jsx"));
const Applications = lazy(() => import("./pages/applications/index.jsx"));
const ApplicationDetail = lazy(() => import("./pages/applicationDetail/index.jsx"));
const Underwriting = lazy(() => import("./pages/underwriting/index.jsx"));
const Products = lazy(() => import("./pages/products/index.jsx"));
const NotFound = lazy(() => import("./pages/notFound/index.jsx"));

const ApplicationRoute = ({ applications, ...props }) => {
    const { applicationId } = useParams();
    const application = applications.find((item) => item.id === applicationId);
    return <ApplicationDetail application={application} {...props} />;
};

const AppRoutes = ({ applications, products, ...actions }) => {
    const location = useLocation();

    return (
        <Suspense fallback={<LoadingSpinner fullPage />} key={location.pathname}>
            <Routes>
                <Route element={<Overview applications={applications} onNewApplication={actions.onNewApplication} />} path="/" />
                <Route element={<Applications applications={applications} onNewApplication={actions.onNewApplication} products={products} />} path="/applications" />
                <Route element={<ApplicationRoute applications={applications} {...actions} />} path="/applications/:applicationId" />
                <Route element={<Underwriting applications={applications} onDecision={actions.onDecision} />} path="/underwriting" />
                <Route element={<Products applications={applications} onDeleteProduct={actions.onDeleteProduct} onSaveProduct={actions.onSaveProduct} onSetProductActive={actions.onSetProductActive} products={products} />} path="/products" />
                <Route element={<NotFound />} path="*" />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
