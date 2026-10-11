import { useMemo, useState } from "react";
import { FiArrowUpRight, FiCheck, FiChevronRight, FiFileText, FiSearch, FiShield, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../../components/button/index.jsx";
import Modal from "../../components/modal/index.jsx";
import StatusPill from "../../components/statusPill/index.jsx";
import { formatCurrency, formatShortCurrency, getInitials } from "../../utils/format.js";
import styles from "./styles.module.css";

const decisions = {
    "Offer sent": ["Prepare an illustrative offer?", "Prepare offer", "The case stage will move to Offer sent."],
    "Document review": ["Return this case for documents?", "Request documents", "The case will move to Document review."],
    Declined: ["Record a demo decline?", "Record decline", "The case will move to Declined in this session."],
};

const Underwriting = ({ applications, onDecision }) => {
    const reviewCases = applications.filter((application) => !["Funded", "Declined"].includes(application.status));
    const [selectedId, setSelectedId] = useState(reviewCases[0]?.id || "");
    const [search, setSearch] = useState("");
    const [scoreFilter, setScoreFilter] = useState("all");
    const [pendingDecision, setPendingDecision] = useState(null);
    const [reasonError, setReasonError] = useState("");
    const visibleCases = useMemo(() => reviewCases.filter((application) => {
        const query = search.toLowerCase().trim();
        const matchesSearch = !query || (application.borrower + " " + application.id + " " + application.product).toLowerCase().includes(query);
        const matchesScore = scoreFilter === "all" || (scoreFilter === "strong" && application.creditScore >= 740) || (scoreFilter === "review" && application.creditScore < 680);
        return matchesSearch && matchesScore;
    }).sort((first, second) => second.creditScore - first.creditScore), [reviewCases, scoreFilter, search]);
    const selected = visibleCases.find((application) => application.id === selectedId);
    const docsComplete = selected?.documents.filter((document) => document.complete).length || 0;
    const averageScore = reviewCases.length ? Math.round(reviewCases.reduce((sum, application) => sum + application.creditScore, 0) / reviewCases.length) : 0;

    const submitDecision = (event) => {
        event.preventDefault();
        const reason = String(new FormData(event.currentTarget).get("reason") || "").trim();
        if (reason.length < 8) {
            setReasonError("Add a brief review note of at least 8 characters.");
            return;
        }
        onDecision(selected.id, pendingDecision.status, reason);
        setPendingDecision(null);
        setReasonError("");
    };

    return (
        <main className={styles.page}>
            <div className={styles.topline}><span>ORIGINATION DESK</span><i /><span>RISK REVIEW / 02</span><span className={styles.demoFlag}>ILLUSTRATIVE DATA</span></div>
            <section className={styles.heading}>
                <div><span className={styles.eyebrow}>THE REVIEW BENCH</span><h1>Underwriting room</h1><p>Compare each file’s request, supporting documents, and sample credit profile.</p></div>
                <Link className={styles.fullRegister} to="/applications">Open all cases <FiArrowUpRight aria-hidden="true" /></Link>
            </section>

            <section className={styles.reviewSummary}>
                <div className={styles.summaryLead}><span className={styles.summaryIcon}><FiShield aria-hidden="true" /></span><p><small>REVIEW QUEUE</small><strong>{reviewCases.length.toString().padStart(2, "0")} <span>active files</span></strong></p></div>
                <div><small>AVERAGE SAMPLE SCORE</small><strong>{averageScore}</strong><span>Across open applications</span></div>
                <div><small>FILES WITH MISSING ITEMS</small><strong>{reviewCases.filter((application) => application.documents.some((document) => !document.complete)).length.toString().padStart(2, "0")}</strong><span>Checklist items remain</span></div>
                <p className={styles.summaryDisclaimer}>This page does not assess eligibility or make a credit decision.</p>
            </section>

            <section className={styles.reviewBench}>
                <div className={styles.queueColumn}>
                    <div className={styles.queueHeader}><div><span className={styles.eyebrow}>OPEN FILES</span><h2>Review queue <span>{visibleCases.length}</span></h2></div><FiFileText aria-hidden="true" /></div>
                    <label className={styles.searchBox}><FiSearch aria-hidden="true" /><span className={styles.srOnly}>Search review queue</span><input onChange={(event) => setSearch(event.target.value)} placeholder="Search applicant or file ID" value={search} /></label>
                    <div className={styles.scoreFilters}>
                        <button className={scoreFilter === "all" ? styles.filterActive : ""} onClick={() => setScoreFilter("all")} type="button">All scores</button>
                        <button className={scoreFilter === "strong" ? styles.filterActive : ""} onClick={() => setScoreFilter("strong")} type="button">740+</button>
                        <button className={scoreFilter === "review" ? styles.filterActive : ""} onClick={() => setScoreFilter("review")} type="button">Below 680</button>
                    </div>
                    <div className={styles.reviewList}>
                        {visibleCases.map((application) => (
                            <button aria-pressed={selectedId === application.id} className={styles.reviewItem + (selectedId === application.id ? " " + styles.reviewItemSelected : "")} key={application.id} onClick={() => setSelectedId(application.id)} type="button">
                                <span className={styles.avatar}>{getInitials(application.borrower)}</span>
                                <span className={styles.reviewPerson}><strong>{application.borrower}</strong><small>{application.id} · {application.product}</small><StatusPill status={application.status} /></span>
                                <span className={styles.reviewAmount}><strong>{formatShortCurrency(application.amount)}</strong><small>{application.creditScore} score</small></span>
                                <FiChevronRight aria-hidden="true" className={styles.reviewArrow} />
                            </button>
                        ))}
                        {!visibleCases.length && <div className={styles.queueEmpty}><FiSearch aria-hidden="true" /><strong>No matching files</strong><span>Change the search or score filter.</span><button onClick={() => { setSearch(""); setScoreFilter("all"); }} type="button"><FiX aria-hidden="true" /> Clear filters</button></div>}
                    </div>
                    <div className={styles.queueFooter}><span>Showing active demo records</span><span>Last refreshed just now</span></div>
                </div>

                <div className={styles.caseColumn}>
                    {selected ? (
                        <>
                            <div className={styles.caseHeader}><div><span className={styles.eyebrow}>FILE UNDER REVIEW / {selected.id}</span><h2>{selected.borrower}</h2><p>{selected.product} · {selected.owner}</p></div><Link aria-label={"Open " + selected.borrower + "'s application"} className={styles.openDetail} to={"/applications/" + selected.id}><FiArrowUpRight aria-hidden="true" /></Link></div>
                            <div className={styles.requestRibbon}>
                                <div><span>REQUESTED</span><strong>{formatCurrency(selected.amount)}</strong></div><div><span>TERM</span><strong>{selected.term} years</strong></div><div><span>ANNUAL INCOME</span><strong>{formatCurrency(selected.annualIncome)}</strong></div><StatusPill status={selected.status} />
                            </div>
                            <div className={styles.creditProfile}>
                                <div className={styles.profileTitle}><div><span className={styles.eyebrow}>BORROWER PROFILE</span><h3>Review the submitted details</h3></div><span className={styles.profileBadge}>Sample data</span></div>
                                <div className={styles.scorePanel}>
                                    <div className={styles.scoreRing} style={{ "--score-progress": Math.min(Math.max((selected.creditScore - 300) / 550 * 100, 0), 100) + "%" }}><strong>{selected.creditScore}</strong><span>SAMPLE SCORE</span></div>
                                    <div className={styles.scoreCopy}><strong>{selected.creditScore >= 740 ? "Strong sample profile" : selected.creditScore >= 680 ? "Mid range sample profile" : "Additional review suggested"}</strong><p>This score is demonstration data. It does not represent a bureau result or automated recommendation.</p></div>
                                </div>
                                <div className={styles.incomeBar}><div><span>Annual income on file</span><strong>{formatCurrency(selected.annualIncome)}</strong></div><span className={styles.incomeTrack}><i style={{ width: Math.min(selected.annualIncome / 250000 * 100, 100) + "%" }} /></span></div>
                                <div className={styles.documentSummary}><div><span>Supporting checklist</span><strong>{docsComplete} of {selected.documents.length} items marked complete</strong></div><Link to={"/applications/" + selected.id}>Review documents <FiArrowUpRight aria-hidden="true" /></Link></div>
                            </div>
                            <div className={styles.purposeBlock}><span className={styles.eyebrow}>BORROWER PURPOSE</span><p>{selected.purpose}</p><Link to={"/applications/" + selected.id}>Open full application <FiArrowUpRight aria-hidden="true" /></Link></div>
                            <div className={styles.decisionActions}>
                                <div><span className={styles.eyebrow}>RECORD A WORKSPACE OUTCOME</span><p>Decision controls update this sample case only.</p></div>
                                <div className={styles.decisionButtons}>
                                    <Button onClick={() => setPendingDecision({ status: "Document review" })} variant="quiet">Request information</Button>
                                    <Button onClick={() => setPendingDecision({ status: "Declined" })} variant="danger">Decline</Button>
                                    <Button onClick={() => setPendingDecision({ status: "Offer sent" })} variant="primary"><FiCheck aria-hidden="true" /> Prepare offer</Button>
                                </div>
                            </div>
                        </>
                    ) : <div className={styles.caseEmpty}><span><FiShield aria-hidden="true" /></span><h2>Select a case to review</h2><p>Choose a file from the queue to compare its sample details.</p></div>}
                </div>
            </section>

            <section className={styles.notice}><span><FiShield aria-hidden="true" /></span><p><strong>For workflow demonstration only.</strong> No lending criteria, consumer report, eligibility check, or financial recommendation is applied in this interface.</p></section>
            <Modal
                actions={<><Button onClick={() => setPendingDecision(null)}>Cancel</Button><Button form="decision-note" type="submit" variant={pendingDecision?.status === "Declined" ? "danger" : "primary"}>{pendingDecision ? decisions[pendingDecision.status][1] : "Confirm"}</Button></>}
                description={pendingDecision ? decisions[pendingDecision.status][2] : ""}
                onClose={() => { setPendingDecision(null); setReasonError(""); }}
                open={Boolean(pendingDecision)}
                title={pendingDecision ? decisions[pendingDecision.status][0] : "Confirm decision"}
            >
                {selected && pendingDecision && <form className={styles.decisionForm} id="decision-note" noValidate onSubmit={submitDecision}>
                    <p>Apply this outcome to <strong>{selected.borrower}</strong>, file <strong>{selected.id}</strong>.</p>
                    <label htmlFor="decision-reason">Review note <span>Required</span></label>
                    <textarea id="decision-reason" maxLength="280" name="reason" placeholder="Add a short explanation for the activity trail" rows="3" />
                    {reasonError && <small className={styles.reasonError} role="alert">{reasonError}</small>}
                    <small className={styles.formDisclaimer}>This note is added to this browser session only.</small>
                </form>}
            </Modal>
        </main>
    );
};

export default Underwriting;
