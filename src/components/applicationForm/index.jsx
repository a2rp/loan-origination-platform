import { useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import styles from "./styles.module.css";

const ApplicationForm = ({ products, application, onSubmit }) => {
    const [error, setError] = useState("");
    const selectableProducts = products.filter((product) => product.active || product.id === application?.productId);
    const defaultProduct = selectableProducts[0]?.id || "";

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const values = Object.fromEntries(form.entries());
        const name = values.borrower.trim();
        const email = values.email.trim();
        const amount = Number(values.amount);
        const term = Number(values.term);
        const annualIncome = Number(values.annualIncome);

        if (!name || !email || !values.phone.trim() || !values.productId || !values.purpose.trim()) {
            setError("Fill in each required field to continue.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Enter a valid email address.");
            return;
        }
        if (amount < 500 || amount > 20000000 || term < 1 || term > 40 || annualIncome < 0) {
            setError("Check the requested amount, term, and annual income.");
            return;
        }

        setError("");
        onSubmit({
            borrower: name,
            email,
            phone: values.phone.trim(),
            productId: values.productId,
            amount,
            term,
            annualIncome,
            employer: values.employer.trim(),
            purpose: values.purpose.trim(),
        });
    };

    return (
        <form className={styles.form} id="application-form" noValidate onSubmit={handleSubmit}>
            {error && <p className={styles.error} role="alert"><FiAlertCircle aria-hidden="true" />{error}</p>}
            <div className={styles.grid}>
                <label className={styles.field}>
                    <span>Borrower name <i>Required</i></span>
                    <input autoComplete="name" defaultValue={application?.borrower || ""} maxLength={90} name="borrower" placeholder="e.g. Jordan Ellis" />
                </label>
                <label className={styles.field}>
                    <span>Email address <i>Required</i></span>
                    <input autoComplete="email" defaultValue={application?.email || ""} maxLength={120} name="email" placeholder="jordan@example.com" />
                </label>
                <label className={styles.field}>
                    <span>Phone number <i>Required</i></span>
                    <input autoComplete="tel" defaultValue={application?.phone || ""} maxLength={30} name="phone" placeholder="(415) 555-0142" />
                </label>
                <label className={styles.field}>
                    <span>Loan product <i>Required</i></span>
                    <select defaultValue={application?.productId || defaultProduct} name="productId">
                        <option value="">Choose a product</option>
                        {selectableProducts.map((product) => <option key={product.id} value={product.id}>{product.name}{product.active ? "" : " (archived)"}</option>)}
                    </select>
                </label>
                <label className={styles.field}>
                    <span>Requested amount <i>Required</i></span>
                    <div className={styles.numberInput}><span>$</span><input defaultValue={application?.amount || ""} min="500" name="amount" placeholder="25,000" type="number" /></div>
                </label>
                <label className={styles.field}>
                    <span>Term in years <i>Required</i></span>
                    <input defaultValue={application?.term || ""} max="40" min="1" name="term" placeholder="5" type="number" />
                </label>
                <label className={styles.field}>
                    <span>Annual income <i>Required</i></span>
                    <div className={styles.numberInput}><span>$</span><input defaultValue={application?.annualIncome || ""} min="0" name="annualIncome" placeholder="85,000" type="number" /></div>
                </label>
                <label className={styles.field}>
                    <span>Employer or business</span>
                    <input defaultValue={application?.employer || ""} maxLength={100} name="employer" placeholder="Company name" />
                </label>
                <label className={`${styles.field} ${styles.full}`}>
                    <span>Purpose of the loan <i>Required</i></span>
                    <textarea defaultValue={application?.purpose || ""} maxLength={320} name="purpose" placeholder="What will the funds help make possible?" rows="3" />
                </label>
            </div>
            <p className={styles.disclaimer}>This demo keeps application data in page memory only. Amounts, products, and rates are illustrative.</p>
        </form>
    );
};

export default ApplicationForm;
