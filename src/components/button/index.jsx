import styles from "./styles.module.css";

const Button = ({ children, variant = "secondary", size = "regular", icon, className = "", ...props }) => (
    <button className={`${styles.button} ${styles[variant] || ""} ${styles[size] || ""} ${className}`} {...props}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {children}
    </button>
);

export default Button;
