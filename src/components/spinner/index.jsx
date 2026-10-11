import styles from "./styles.module.css";

const LoadingSpinner = ({ fullPage = false }) => (
    <div aria-label="Loading" className={`${styles.spinner} ${fullPage ? styles.fullPage : ""}`} role="status">
        <span />
    </div>
);

export default LoadingSpinner;
