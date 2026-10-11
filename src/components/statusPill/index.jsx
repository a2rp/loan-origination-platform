import styles from "./styles.module.css";

const StatusPill = ({ status }) => {
    const key = status.toLowerCase().replace(/\s+/g, "-");
    return <span className={`${styles.pill} ${styles[key] || styles.neutral}`}>{status}</span>;
};

export default StatusPill;
