import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const Modal = ({ open, title, description, onClose, children, actions, size = "regular" }) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;

        const previousFocus = document.activeElement;
        dialogRef.current?.focus();
        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
            if (event.key !== "Tab") return;

            const controls = dialogRef.current?.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            );
            if (!controls?.length) return;
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            previousFocus?.focus?.();
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div className={styles.overlay} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section
                aria-describedby={description ? "lenddesk-dialog-description" : undefined}
                aria-labelledby="lenddesk-dialog-title"
                aria-modal="true"
                className={`${styles.dialog} ${size === "wide" ? styles.wide : ""}`}
                ref={dialogRef}
                role="dialog"
                tabIndex={-1}
            >
                <header className={styles.header}>
                    <div>
                        <h2 id="lenddesk-dialog-title">{title}</h2>
                        {description && <p id="lenddesk-dialog-description">{description}</p>}
                    </div>
                    <button aria-label="Close dialog" className={styles.closeButton} onClick={onClose} type="button">
                        <FiX aria-hidden="true" />
                    </button>
                </header>
                <div className={styles.body}>{children}</div>
                {actions && <footer className={styles.actions}>{actions}</footer>}
            </section>
        </div>,
        document.body,
    );
};

export default Modal;
