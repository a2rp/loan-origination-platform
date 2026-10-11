import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import StatusPill from "../statusPill/index.jsx";
import { formatShortCurrency } from "../../utils/format.js";
import { getInitials } from "../../utils/format.js";
import styles from "./styles.module.css";

const ApplicationRow = ({ application, compact = false }) => (
    <Link className={`${styles.row} ${compact ? styles.compact : ""}`} to={`/applications/${application.id}`}>
        <span aria-hidden="true" className={styles.avatar}>{getInitials(application.borrower)}</span>
        <span className={styles.borrower}>
            <strong>{application.borrower}</strong>
            <span>{application.id} <i>·</i> {application.product}</span>
        </span>
        <span className={styles.status}><StatusPill status={application.status} /></span>
        <span className={styles.score}>
            <small>Credit score</small>
            <strong>{application.creditScore}</strong>
        </span>
        <span className={styles.amount}>
            <strong>{formatShortCurrency(application.amount)}</strong>
            <small>{application.term} year term</small>
        </span>
        <FiChevronRight aria-hidden="true" className={styles.chevron} />
    </Link>
);

export default ApplicationRow;
