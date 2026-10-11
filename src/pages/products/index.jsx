import { useState } from "react";
import { FiArrowUpRight, FiBriefcase, FiCheck, FiCreditCard, FiEdit3, FiHome, FiPlus, FiTrash2, FiArchive, FiShield } from "react-icons/fi";
import Button from "../../components/button/index.jsx";
import Modal from "../../components/modal/index.jsx";
import { formatCurrency } from "../../utils/format.js";
import styles from "./styles.module.css";

const productIcons = {
    Mortgage: FiHome,
    Business: FiBriefcase,
    Personal: FiCreditCard,
};

const emptyProduct = { name: "", category: "Personal", apr: "", minAmount: "", maxAmount: "", maxTerm: "" };

const Products = ({ products, applications, onSaveProduct, onSetProductActive, onDeleteProduct }) => {
    const [formProduct, setFormProduct] = useState(null);
    const [formError, setFormError] = useState("");
    const [pendingAction, setPendingAction] = useState(null);
    const activeCount = products.filter((product) => product.active).length;

    const saveProduct = (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget).entries());
        const product = {
            id: formProduct.id || "",
            name: data.name.trim(),
            category: data.category,
            apr: Number(data.apr),
            minAmount: Number(data.minAmount),
            maxAmount: Number(data.maxAmount),
            maxTerm: Number(data.maxTerm),
            color: formProduct.color || "clay",
            active: formProduct.active ?? true,
        };
        if (product.name.length < 3 || !Number.isFinite(product.apr) || product.apr <= 0 || product.apr > 60
            || product.minAmount < 1 || product.maxAmount < product.minAmount || product.maxTerm < 1 || product.maxTerm > 40) {
            setFormError("Check the name, illustrative APR, amount range, and maximum term.");
            return;
        }
        onSaveProduct(product);
        setFormProduct(null);
        setFormError("");
    };

    const closeForm = () => {
        setFormProduct(null);
        setFormError("");
    };

    const confirmAction = () => {
        if (!pendingAction) return;
        if (pendingAction.type === "archive") onSetProductActive(pendingAction.product.id, false);
        if (pendingAction.type === "restore") onSetProductActive(pendingAction.product.id, true);
        if (pendingAction.type === "delete") onDeleteProduct(pendingAction.product.id);
        setPendingAction(null);
    };

    return (
        <main className={styles.page}>
            <div className={styles.topline}><span>ORIGINATION DESK</span><i /><span>PRODUCT LIBRARY / 03</span><a href="https://github.com/a2rp/loan-origination-platform" rel="noreferrer" target="_blank">SOURCE CODE <FiArrowUpRight aria-hidden="true" /></a></div>
            <section className={styles.heading}>
                <div><span className={styles.eyebrow}>LENDING CATALOGUE</span><h1>Loan products</h1><p>Keep the demo product terms in one clear place for your origination team.</p></div>
                <Button icon={<FiPlus aria-hidden="true" />} onClick={() => setFormProduct({ ...emptyProduct })} variant="primary">Add a product</Button>
            </section>

            <section className={styles.catalogSummary}>
                <div className={styles.catalogIntro}><span className={styles.catalogStamp}>LD<span>.</span></span><p><strong>Product library</strong><span>Manage the choices shown when a new case is created.</span></p></div>
                <div className={styles.summaryNumbers}><p><strong>{activeCount.toString().padStart(2, "0")}</strong><span>Active products</span></p><i /><p><strong>{products.length.toString().padStart(2, "0")}</strong><span>Total in catalogue</span></p></div>
                <p className={styles.illustrative}>All sample APRs and limits are illustrative. No offer or lending term is generated from these values.</p>
            </section>

            <section className={styles.catalogSection}>
                <div className={styles.catalogHeading}><div><span className={styles.eyebrow}>AVAILABLE PROGRAMMES</span><h2>Product shelf</h2></div><span>{products.length} products <i /></span></div>
                <div className={styles.productGrid}>
                    {products.map((product) => {
                        const Icon = productIcons[product.category] || FiCreditCard;
                        const useCount = applications.filter((application) => application.productId === product.id).length;
                        return (
                            <article className={styles.productCard + (product.active ? "" : " " + styles.productInactive)} key={product.id}>
                                <div className={styles.productTop}>
                                    <span className={styles.productIcon}><Icon aria-hidden="true" /></span>
                                    <span className={styles.category}>{product.category}</span>
                                    <span className={styles.productStatus}><i />{product.active ? "Active" : "Archived"}</span>
                                </div>
                                <div className={styles.productInfo}>
                                    <h3>{product.name}</h3>
                                    <p>{product.active ? "Available for new demo applications" : "Hidden from new application forms"}</p>
                                </div>
                                <div className={styles.productTerms}>
                                    <div className={styles.apr}><span>Sample APR from</span><strong>{product.apr.toFixed(2)}<small>%</small></strong></div>
                                    <div><span>Request range</span><strong>{formatCurrency(product.minAmount)} to {formatCurrency(product.maxAmount)}</strong></div>
                                    <div><span>Maximum term</span><strong>{product.maxTerm} years</strong></div>
                                </div>
                                <div className={styles.productFoot}><span>{useCount} {useCount === 1 ? "application" : "applications"} reference this product</span><span className={styles.cardArrow}><FiArrowUpRight aria-hidden="true" /></span></div>
                                <div className={styles.productActions}>
                                    <Button icon={<FiEdit3 aria-hidden="true" />} onClick={() => setFormProduct({ ...product })} size="small">Edit</Button>
                                    {product.active ? (
                                        <Button icon={<FiArchive aria-hidden="true" />} onClick={() => setPendingAction({ type: "archive", product, useCount })} size="small">Archive</Button>
                                    ) : (
                                        <Button icon={<FiCheck aria-hidden="true" />} onClick={() => setPendingAction({ type: "restore", product })} size="small" variant="quiet">Restore</Button>
                                    )}
                                    {!product.active && useCount === 0 && <Button aria-label={"Delete " + product.name} className={styles.deleteProduct} icon={<FiTrash2 aria-hidden="true" />} onClick={() => setPendingAction({ type: "delete", product })} size="small" variant="iconOnly" />}
                                </div>
                            </article>
                        );
                    })}
                </div>
                {!products.length && <div className={styles.empty}><FiCreditCard aria-hidden="true" /><h3>Your product shelf is empty</h3><p>Add a loan product to make it available for demo applications.</p><Button onClick={() => setFormProduct({ ...emptyProduct })} variant="primary">Add the first product</Button></div>}
            </section>

            <section className={styles.footerNote}><span><FiShield aria-hidden="true" /></span><p><strong>Terms stay transparent.</strong> These demo values support interface workflows only and do not represent an actual lender programme, rate, approval, or loan offer.</p></section>

            <Modal
                actions={<><Button onClick={closeForm}>Cancel</Button><Button form="product-form" type="submit" variant="primary">{formProduct?.id ? "Save product" : "Add product"}</Button></>}
                description="Set the illustrative details available to the application form."
                onClose={closeForm}
                open={Boolean(formProduct)}
                title={formProduct?.id ? "Edit loan product" : "Add loan product"}
            >
                {formProduct && <form className={styles.productForm} id="product-form" noValidate onSubmit={saveProduct}>
                    {formError && <p className={styles.formError} role="alert">{formError}</p>}
                    <div className={styles.formGrid}>
                        <label className={styles.field}><span>Product name</span><input defaultValue={formProduct.name} maxLength="60" name="name" placeholder="e.g. Community auto loan" /></label>
                        <label className={styles.field}><span>Category</span><select defaultValue={formProduct.category} name="category"><option>Personal</option><option>Mortgage</option><option>Business</option></select></label>
                        <label className={styles.field}><span>Illustrative APR (%)</span><input defaultValue={formProduct.apr} max="60" min="0.1" name="apr" placeholder="7.25" type="number" /></label>
                        <label className={styles.field}><span>Maximum term (years)</span><input defaultValue={formProduct.maxTerm} max="40" min="1" name="maxTerm" placeholder="10" type="number" /></label>
                        <label className={styles.field}><span>Minimum amount</span><input defaultValue={formProduct.minAmount} min="1" name="minAmount" placeholder="5,000" type="number" /></label>
                        <label className={styles.field}><span>Maximum amount</span><input defaultValue={formProduct.maxAmount} min="1" name="maxAmount" placeholder="100,000" type="number" /></label>
                    </div>
                    <p className={styles.formDisclaimer}>Product details are stored in page memory and reset when the page reloads.</p>
                </form>}
            </Modal>
            <Modal
                actions={<><Button onClick={() => setPendingAction(null)}>Cancel</Button><Button onClick={confirmAction} variant={pendingAction?.type === "delete" ? "danger" : "primary"}>{pendingAction?.type === "archive" ? "Archive product" : pendingAction?.type === "restore" ? "Restore product" : "Delete product"}</Button></>}
                description={pendingAction?.type === "delete" ? "This permanently removes the unused product from this demo session." : pendingAction?.type === "restore" ? "This product will again appear in the new application form." : "This hides the product from new applications while preserving existing case references."}
                onClose={() => setPendingAction(null)}
                open={Boolean(pendingAction)}
                title={pendingAction?.type === "delete" ? "Delete this product?" : pendingAction?.type === "restore" ? "Restore this product?" : "Archive this product?"}
            >
                {pendingAction && <div className={styles.confirmContent}><span>{pendingAction.type === "delete" ? <FiTrash2 aria-hidden="true" /> : pendingAction.type === "restore" ? <FiCheck aria-hidden="true" /> : <FiArchive aria-hidden="true" />}</span><p><strong>{pendingAction.product.name}</strong>{pendingAction.type === "archive" && pendingAction.useCount > 0 ? " is referenced by " + pendingAction.useCount + " application records. Archiving keeps those files intact." : pendingAction.type === "delete" ? " has no application records and will be removed." : pendingAction.type === "restore" ? " will be available for new cases." : " will no longer be available on new cases."}</p></div>}
            </Modal>
        </main>
    );
};

export default Products;
