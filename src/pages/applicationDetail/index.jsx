import { useState } from "react";
import { FiArrowLeft, FiArrowUpRight, FiCheck, FiChevronDown, FiEdit2, FiFileText, FiMessageSquare, FiShield, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/button/index.jsx";
import Modal from "../../components/modal/index.jsx";
import StatusPill from "../../components/statusPill/index.jsx";
import { applicationStages } from "../../data/seed.js";
import { formatCurrency, formatDate, getInitials } from "../../utils/format.js";
import styles from "./styles.module.css";

const ApplicationDetail = ({ application, onEditApplication, onDeleteApplication, onStageChange, onToggleDocument, onAddNote }) => {
    const [pendingAction, setPendingAction] = useState(null);
    const navigate = useNavigate();

    if (!application) {
        return (
            <main className={styles.page}>
                <div className={styles.notFound}><span>CASE FILE / UNAVAILABLE</span><h1>This application is not in the register.</h1><p>It may have been removed from this demo workspace.</p><Link to="/applications"><FiArrowLeft aria-hidden="true" /> Return to applications</Link></div>
            </main>
        );
    }

    const completedDocuments = application.documents.filter((document) => document.complete).length;
    const nextStage = applicationStages[applicationStages.indexOf(application.status) + 1];
    const progress = Math.max(((applicationStages.indexOf(application.status) + 1) / applicationStages.length) * 100, 10);

    const confirmAction = () => {
        if (pendingAction?.type === "delete") {
            onDeleteApplication(application.id);
            setPendingAction(null);
            navigate("/applications");
            return;
        }
        if (pendingAction?.type === "stage") onStageChange(application.id, pendingAction.status);
        setPendingAction(null);
    };

    const addNote = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const note = String(data.get("note") || "").trim();
        if (!note) return;
        onAddNote(application.id, note);
        event.currentTarget.reset();
    };

    return (
        <main className={styles.page}>
            <div className={styles.breadcrumb}><Link to="/applications"><FiArrowLeft aria-hidden="true" /> All applications</Link><span>/</span><span>{application.id}</span></div>
            <section className={styles.fileHeader}>
                <div className={styles.fileIdentity}>
                    <span aria-hidden="true" className={styles.avatar}>{getInitials(application.borrower)}</span>
                    <div><span className={styles.eyebrow}>LOAN APPLICATION / {application.id}</span><h1>{application.borrower}</h1><p>{application.product} <i>·</i> Submitted {formatDate(application.submittedAt)}</p></div>
                </div>
                <div className={styles.fileActions}><StatusPill status={application.status} /><Button icon={<FiEdit2 aria-hidden="true" />} onClick={() => onEditApplication(application)}>Edit file</Button><Button aria-label={`Delete application ${application.id}`} className={styles.deleteButton} icon={<FiTrash2 aria-hidden="true" />} onClick={() => setPendingAction({ type: "delete" })} variant="iconOnly" /></div>
            </section>

            <section aria-label="Application progress" className={styles.progressPanel}>
                <div className={styles.progressHeading}><div><span className={styles.eyebrow}>CASE PROGRESSION</span><h2>{application.status}</h2></div><strong>{Math.round(progress)}<small>%</small></strong></div>
                <div className={styles.progressBar}><span style={{ width: `${progress}%` }} /></div>
                <div className={styles.progressFooter}><span>Received</span><span>Document review</span><span>Underwriting</span><span>Offer sent</span><span>Funded</span><span>Closed</span></div>
                <div className={styles.nextStep}>
                    <span><FiShield aria-hidden="true" /> {nextStage ? `Ready for ${nextStage.toLowerCase()}` : "This file is at a final stage"}</span>
                    {nextStage && <Button onClick={() => setPendingAction({ type: "stage", status: nextStage })} variant="primary">Advance to {nextStage} <FiChevronDown aria-hidden="true" /></Button>}
                </div>
            </section>

            <div className={styles.detailGrid}>
                <div className={styles.primaryColumn}>
                    <section className={styles.requestCard}>
                        <div className={styles.cardHeading}><div><span className={styles.eyebrow}>REQUEST SUMMARY</span><h2>Borrower and loan details</h2></div><FiFileText aria-hidden="true" /></div>
                        <div className={styles.loanAmount}><span>Requested principal</span><strong>{formatCurrency(application.amount)}</strong><small>Illustrative request amount</small></div>
                        <div className={styles.facts}>
                            <div><span>Loan product</span><strong>{application.product}</strong></div>
                            <div><span>Requested term</span><strong>{application.term} years</strong></div>
                            <div><span>Annual income</span><strong>{formatCurrency(application.annualIncome)}</strong></div>
                            <div><span>Employer / business</span><strong>{application.employer || "Not provided"}</strong></div>
                            <div><span>Application owner</span><strong>{application.owner}</strong></div>
                            <div><span>Credit score</span><strong>{application.creditScore} <small>sample score</small></strong></div>
                        </div>
                        <div className={styles.purpose}><span>Purpose stated</span><p>{application.purpose}</p></div>
                    </section>

                    <section className={styles.documentsCard}>
                        <div className={styles.cardHeading}><div><span className={styles.eyebrow}>DOCUMENT DESK</span><h2>Application checklist</h2></div><span className={styles.documentCount}>{completedDocuments} / {application.documents.length} complete</span></div>
                        <p className={styles.cardDescription}>Click a line to update the in-memory demo checklist.</p>
                        <div className={styles.documentList}>
                            {application.documents.map((document) => (
                                <button aria-checked={document.complete} className={`${styles.document} ${document.complete ? styles.documentComplete : ""}`} key={document.id} onClick={() => onToggleDocument(application.id, document.id)} role="checkbox" type="button">
                                    <span className={styles.check}>{document.complete && <FiCheck aria-hidden="true" />}</span>
                                    <span className={styles.documentCopy}><strong>{document.name}</strong><small>{document.detail}</small></span>
                                    <span className={styles.documentState}>{document.complete ? "Received" : "Needed"}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className={styles.sideColumn}>
                    <section className={styles.contactCard}>
                        <span className={styles.eyebrow}>BORROWER CONTACT</span>
                        <h2>{application.borrower}</h2>
                        <a href={`mailto:${application.email}`}>{application.email}<FiArrowUpRight aria-hidden="true" /></a>
                        <a href={`tel:${application.phone.replace(/[^\d+]/g, "")}`}>{application.phone}<FiArrowUpRight aria-hidden="true" /></a>
                    </section>

                    <section className={styles.timelineCard}>
                        <div className={styles.cardHeading}><div><span className={styles.eyebrow}>FILE HISTORY</span><h2>Activity trail</h2></div></div>
                        <div className={styles.timeline}>
                            {application.timeline.map((item, index) => <div className={styles.timelineItem} key={`${item.label}-${index}`}><span className={`${styles.timelineDot} ${item.complete ? styles.timelineDone : ""}`}>{item.complete && <FiCheck aria-hidden="true" />}</span><p><strong>{item.label}</strong><small>{item.date}</small></p></div>)}
                        </div>
                    </section>

                    <section className={styles.notesCard}>
                        <div className={styles.cardHeading}><div><span className={styles.eyebrow}>PRIVATE WORKSPACE NOTES</span><h2>Team notes</h2></div><FiMessageSquare aria-hidden="true" /></div>
                        <div className={styles.notesList}>
                            {application.notes.length ? application.notes.map((note, index) => <p className={styles.note} key={`${note}-${index}`}>{note}<small>Saved in this session</small></p>) : <p className={styles.noNotes}>No notes yet. Add a useful detail for your team.</p>}
                        </div>
                        <form className={styles.noteForm} onSubmit={addNote}>
                            <label className={styles.srOnly} htmlFor="team-note">Add a team note</label>
                            <textarea id="team-note" maxLength="280" name="note" placeholder="Add a note to this file" rows="2" />
                            <Button size="small" type="submit" variant="quiet">Add note</Button>
                        </form>
                    </section>
                </aside>
            </div>

            <Modal
                actions={<><Button onClick={() => setPendingAction(null)}>Cancel</Button><Button onClick={confirmAction} variant={pendingAction?.type === "delete" || pendingAction?.status === "Declined" ? "danger" : "primary"}>{pendingAction?.type === "delete" ? "Delete application" : `Move to ${pendingAction?.status}`}</Button></>}
                description={pendingAction?.type === "delete" ? "This removes the case from the current demo session. This action cannot be undone after you confirm." : "This updates the in-memory application stage and adds an entry to the case history."}
                onClose={() => setPendingAction(null)}
                open={Boolean(pendingAction)}
                title={pendingAction?.type === "delete" ? "Delete this application?" : "Confirm case stage change"}
            >
                <div className={styles.confirmContent}>
                    <span className={styles.confirmMark}>{pendingAction?.type === "delete" ? <FiTrash2 aria-hidden="true" /> : <FiShield aria-hidden="true" />}</span>
                    <p>{pendingAction?.type === "delete" ? <><strong>{application.borrower}</strong> and this case file will be removed from the application register.</> : <>Move <strong>{application.borrower}</strong> from <strong>{application.status}</strong> to <strong>{pendingAction?.status}</strong>?</>}</p>
                </div>
            </Modal>
        </main>
    );
};

export default ApplicationDetail;
