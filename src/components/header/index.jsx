import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiArrowUpRight, FiBriefcase, FiGithub, FiMenu, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const links = [
    { label: "Today", to: "/", end: true },
    { label: "Applications", to: "/applications" },
    { label: "Underwriting", to: "/underwriting" },
    { label: "Loan products", to: "/products" },
];

const Header = () => {
    const [isHidden, setIsHidden] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect(() => {
        let previousY = window.scrollY;
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY < 24 || menuOpen) setIsHidden(false);
            else if (currentY > previousY + 5) setIsHidden(true);
            else if (currentY < previousY - 5) setIsHidden(false);
            previousY = currentY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [menuOpen]);

    return (
        <header className={`${styles.header} ${isHidden && !menuOpen ? styles.hidden : ""}`}>
            <div className={styles.inner}>
                <NavLink aria-label="LendDesk home" className={styles.brand} onClick={() => setMenuOpen(false)} to="/">
                    <span className={styles.brandMark}><FiBriefcase aria-hidden="true" /></span>
                    <span className={styles.brandName}>lend<span>desk</span><i>.</i></span>
                </NavLink>

                <nav aria-label="Main navigation" className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""}`}>
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                            end={link.end}
                            onClick={() => setMenuOpen(false)}
                            to={link.to}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    <a className={styles.repository} href="https://github.com/a2rp/loan-origination-platform" rel="noreferrer" target="_blank">
                        <FiGithub aria-hidden="true" /> <span>Repository</span><FiArrowUpRight aria-hidden="true" />
                    </a>
                </nav>

                <button
                    aria-expanded={menuOpen}
                    aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                    className={styles.menuButton}
                    onClick={() => setMenuOpen((open) => !open)}
                    type="button"
                >
                    {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
                </button>
            </div>
        </header>
    );
};

export default Header;
