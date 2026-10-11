import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./components/button/index.jsx";
import ApplicationForm from "./components/applicationForm/index.jsx";
import Footer from "./components/footer/index.jsx";
import Header from "./components/header/index.jsx";
import Modal from "./components/modal/index.jsx";
import ScrollToTop from "./components/scrollToTop/index.jsx";
import Toast from "./components/toast/index.jsx";
import AppRoutes from "./AppRoutes.jsx";
import { initialApplications, initialProducts } from "./data/seed.js";
import { formatDate } from "./utils/format.js";
import styles from "./App.module.css";

const App = () => {
    const [applications, setApplications] = useState(initialApplications);
    const [products, setProducts] = useState(initialProducts);
    const [applicationDialog, setApplicationDialog] = useState(null);
    const [toast, setToast] = useState(null);
    const toastTimer = useRef(null);
    const navigate = useNavigate();

    const notify = useCallback((type, title, message) => {
        window.clearTimeout(toastTimer.current);
        setToast({ type, title, message });
        toastTimer.current = window.setTimeout(() => setToast(null), 5200);
    }, []);
    const closeToast = useCallback(() => {
        window.clearTimeout(toastTimer.current);
        setToast(null);
    }, []);
    const closeApplicationDialog = useCallback(() => setApplicationDialog(null), []);

    useEffect(() => () => window.clearTimeout(toastTimer.current), []);

    const openNewApplication = () => setApplicationDialog({ mode: "create", application: null });
    const openEditApplication = (application) => setApplicationDialog({ mode: "edit", application });

    const saveApplication = (formValues) => {
        const selectedProduct = products.find((product) => product.id === formValues.productId);
        if (!selectedProduct) {
            notify("error", "Choose a loan product", "Select a product before saving this application.");
            return;
        }
        if (applicationDialog?.mode === "edit") {
            const existing = applicationDialog.application;
            setApplications((current) => current.map((application) => application.id === existing.id
                ? { ...application, ...formValues, product: selectedProduct.name }
                : application));
            setApplicationDialog(null);
            notify("success", "Application updated", "The changes are available in this session.");
            return;
        }

        const largestId = applications.reduce((largest, application) => Math.max(largest, Number(application.id.replace("LD-", "")) || 0), 1000);
        const id = "LD-" + (largestId + 1);
        const newApplication = {
            ...formValues,
            id,
            product: selectedProduct.name,
            status: "Received",
            creditScore: 700,
            submittedAt: new Date().toISOString(),
            owner: "Morgan Reed",
            documents: [
                { id: "identity", name: "Identity verification", detail: "Government ID", complete: false },
                { id: "income", name: "Income verification", detail: "Supporting income documents", complete: false },
                { id: "bank", name: "Bank statements", detail: "Last three months", complete: false },
            ],
            timeline: [{ label: "Application received", date: formatDate(new Date()), complete: true }],
            notes: [],
        };
        setApplications((current) => [newApplication, ...current]);
        setApplicationDialog(null);
        notify("success", "Application created", id + " has been added to the register.");
        navigate("/applications/" + id);
    };

    const updateApplicationStage = (id, status, reviewNote = "") => {
        const application = applications.find((item) => item.id === id);
        if (!application) {
            notify("error", "Application not found", "Refresh the register and select a current case.");
            return;
        }
        const stageLabel = status === "Offer sent" ? "Illustrative offer prepared" : status === "Declined" ? "Demo decline recorded" : "Stage changed to " + status;
        setApplications((current) => current.map((item) => item.id === id ? {
            ...item,
            status,
            timeline: [...item.timeline, { label: stageLabel, date: formatDate(new Date()), complete: true }],
            notes: reviewNote ? [...item.notes, "Review note: " + reviewNote] : item.notes,
        } : item));
        notify(status === "Declined" ? "info" : "success", "Workspace outcome recorded", "The sample case moved to " + status + ".");
    };

    const toggleDocument = (id, documentId) => {
        const application = applications.find((item) => item.id === id);
        const document = application?.documents.find((item) => item.id === documentId);
        if (!application || !document) return;
        const nextState = !document.complete;
        setApplications((current) => current.map((item) => item.id === id ? {
            ...item,
            documents: item.documents.map((record) => record.id === documentId ? { ...record, complete: nextState } : record),
        } : item));
        notify("success", nextState ? "Checklist item received" : "Checklist item reopened", document.name + " marked " + (nextState ? "complete." : "needed."));
    };

    const addApplicationNote = (id, note) => {
        setApplications((current) => current.map((application) => application.id === id
            ? { ...application, notes: [...application.notes, note] }
            : application));
        notify("success", "Team note added", "The note is available for this session.");
    };

    const deleteApplication = (id) => {
        const target = applications.find((application) => application.id === id);
        setApplications((current) => current.filter((application) => application.id !== id));
        if (target) notify("success", "Application removed", target.borrower + " has been removed from this session.");
    };

    const decideApplication = (id, status, reason) => updateApplicationStage(id, status, reason);

    const saveProduct = (product) => {
        const isNew = !product.id;
        const saved = { ...product, id: product.id || "prod-" + Date.now() };
        setProducts((current) => isNew
            ? [...current, saved]
            : current.map((item) => item.id === saved.id ? saved : item));
        setApplications((current) => current.map((application) => application.productId === saved.id
            ? { ...application, product: saved.name }
            : application));
        notify("success", isNew ? "Product added" : "Product updated", saved.name + " is reflected in the product library.");
    };

    const setProductActive = (id, active) => {
        const product = products.find((item) => item.id === id);
        setProducts((current) => current.map((item) => item.id === id ? { ...item, active } : item));
        if (product) notify("success", active ? "Product restored" : "Product archived", product.name + (active ? " is available for new cases." : " is hidden from new cases."));
    };

    const deleteProduct = (id) => {
        const product = products.find((item) => item.id === id);
        const inUse = applications.some((application) => application.productId === id);
        if (inUse) {
            notify("error", "Product is still in use", "Archive it to preserve the linked application records.");
            return;
        }
        setProducts((current) => current.filter((item) => item.id !== id));
        if (product) notify("success", "Product deleted", product.name + " was removed from the catalogue.");
    };

    const isEditing = applicationDialog?.mode === "edit";

    return (
        <div className={styles.app}>
            <Header />
            <ScrollToTop />
            <div className={styles.routeContent}>
                <AppRoutes
                    applications={applications}
                    onAddNote={addApplicationNote}
                    onDecision={decideApplication}
                    onDeleteApplication={deleteApplication}
                    onDeleteProduct={deleteProduct}
                    onEditApplication={openEditApplication}
                    onNewApplication={openNewApplication}
                    onSaveProduct={saveProduct}
                    onSetProductActive={setProductActive}
                    onStageChange={updateApplicationStage}
                    onToggleDocument={toggleDocument}
                    products={products}
                />
            </div>
            <Footer />
            <Modal
                actions={<><Button onClick={closeApplicationDialog}>Cancel</Button><Button form="application-form" type="submit" variant="primary">{isEditing ? "Save changes" : "Create application"}</Button></>}
                description={isEditing ? "Update the borrower and request details in this case file." : "Capture the starter details for a new lending case."}
                onClose={closeApplicationDialog}
                open={Boolean(applicationDialog)}
                size="wide"
                title={isEditing ? "Edit application" : "New loan application"}
            >
                {applicationDialog && <ApplicationForm application={applicationDialog.application} key={applicationDialog.mode + (applicationDialog.application?.id || "new")} onSubmit={saveApplication} products={products} />}
            </Modal>
            <Toast onClose={closeToast} toast={toast} />
        </div>
    );
};

export default App;
