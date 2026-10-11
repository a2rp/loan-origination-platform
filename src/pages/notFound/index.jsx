import { FiArrowLeft, FiArrowUpRight, FiCompass } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const NotFound = () => (
    <main className={styles.page}>
        <span className={styles.mark}><FiCompass aria-hidden="true" /></span>
        <span className={styles.code}>LENDDESK / 404</span>
        <h1>This page isn't in the file room.</h1>
        <p>The link may be out of date, or this workspace does not have a page at that address.</p>
        <div className={styles.actions}>
            <Link to="/"><FiArrowLeft aria-hidden="true" /> Back to today</Link>
            <Link to="/applications">Open applications <FiArrowUpRight aria-hidden="true" /></Link>
        </div>
    </main>
);

export default NotFound;
