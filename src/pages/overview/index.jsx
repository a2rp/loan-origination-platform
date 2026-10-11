import { FiArrowUpRight, FiArrowRight, FiFilePlus, FiShield, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import ApplicationRow from "../../components/applicationRow/index.jsx";
import Button from "../../components/button/index.jsx";
import { applicationStages } from "../../data/seed.js";
import { formatCurrency, formatShortCurrency } from "../../utils/format.js";
import styles from "./styles.module.css";

const Overview = ({ applications, onNewApplication }) => {
    const activeApplications = applications.filter((application) => !["Funded", "Declined"].includes(application.status));
    const needsAttention = applications.filter((application) => ["Received", "Document review"].includes(application.status));
    const underwritingTotal = applications
        .filter((application) => application.status === "Underwriting")
        .reduce((sum, application) => sum + application.amount, 0);
    const offers = applications.filter((application) => application.status === "Offer sent").length;
    const queue = [...activeApplications].sort((first, second) => new Date(second.submittedAt) - new Date(first.submittedAt)).slice(0, 4);
    const stages = applicationStages.map((stage) => ({
        name: stage,
        count: applications.filter((application) => application.status === stage).length,
    }));
    const total = Math.max(applications.length, 1);

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroCopy}>
                    <span className={styles.kicker}>LENDING OPERATIONS <i /> OCTOBER 11, 2026</span>
                    <h1>Origination, <em>in motion.</em></h1>
                    <p>A focused desk for the people, documents, and decisions that move each application forward.</p>
                    <div className={styles.heroActions}>
                        <Button icon={<FiFilePlus aria-hidden="true" />} onClick={onNewApplication} variant="primary">Start an application</Button>
                        <Link className={styles.textLink} to="/applications">Open application register <FiArrowUpRight aria-hidden="true" /></Link>
                    </div>
                    <div className={styles.heroFoot}>
                        <span><i className={styles.liveDot} /> Sample workspace</span>
                        <span>{applications.length.toString().padStart(2, "0")} applications in view</span>
                    </div>
                </div>
                <div className={styles.heroImage}>
                    <img alt="Home keys and paperwork prepared for a mortgage review" src={`${import.meta.env.BASE_URL}assets/mortgage-papers.jpg`} />
                    <div className={styles.imageNote}>
                        <span>THE LENDING DESK</span>
                        <strong>One clear next step.</strong>
                    </div>
                    <span className={styles.imageIndex}>01 / 04</span>
                </div>
            </section>

            <section aria-label="Portfolio snapshot" className={styles.snapshot}>
                <Link className={styles.metric} to="/applications?status=Received">
                    <span className={styles.metricIcon}><FiFilePlus aria-hidden="true" /></span>
                    <span className={styles.metricBody}><small>Needs a first look</small><strong>{needsAttention.length.toString().padStart(2, "0")}</strong><span>New or waiting on documents</span></span>
                    <FiArrowUpRight aria-hidden="true" className={styles.metricArrow} />
                </Link>
                <Link className={styles.metric} to="/underwriting">
                    <span className={styles.metricIcon}><FiShield aria-hidden="true" /></span>
                    <span className={styles.metricBody}><small>In underwriting</small><strong>{formatShortCurrency(underwritingTotal)}</strong><span>Illustrative request value</span></span>
                    <FiArrowUpRight aria-hidden="true" className={styles.metricArrow} />
                </Link>
                <Link className={styles.metric} to="/applications?status=Offer%20sent">
                    <span className={styles.metricIcon}><FiTrendingUp aria-hidden="true" /></span>
                    <span className={styles.metricBody}><small>Offers to follow up</small><strong>{offers.toString().padStart(2, "0")}</strong><span>Waiting for borrower response</span></span>
                    <FiArrowUpRight aria-hidden="true" className={styles.metricArrow} />
                </Link>
            </section>

            <section className={styles.pipeline}>
                <div className={styles.sectionIntro}>
                    <div><span className={styles.eyebrow}>THE APPLICATION FLOW</span><h2>Every case has a next step.</h2></div>
                    <p>{formatCurrency(applications.reduce((sum, application) => sum + application.amount, 0))}<span> total requested, illustrative</span></p>
                </div>
                <div className={styles.stageTrack}>
                    {stages.map((stage, index) => (
                        <Link className={styles.stage} key={stage.name} to={`/applications?status=${encodeURIComponent(stage.name)}`}>
                            <span className={styles.stageTop}><span>{String(index + 1).padStart(2, "0")}</span><strong>{stage.count}</strong></span>
                            <span className={styles.stageLabel}>{stage.name}</span>
                            <span className={`${styles.stageBar} ${styles[`stageColor${index}`]}`} style={{ "--stage-progress": `${Math.max(stage.count / total * 100, 7)}%` }} />
                        </Link>
                    ))}
                </div>
            </section>

            <section className={styles.queueSection}>
                <div className={styles.queueHeading}>
                    <div><span className={styles.eyebrow}>IN THE WORKROOM</span><h2>Applications to move</h2><p>The most recently submitted files, ready for your next review.</p></div>
                    <Link className={styles.viewAll} to="/applications">View all applications <FiArrowRight aria-hidden="true" /></Link>
                </div>
                <div className={styles.queueList}>
                    {queue.length > 0 ? queue.map((application) => <ApplicationRow application={application} compact key={application.id} />) : (
                        <div className={styles.emptyQueue}><strong>Everything is up to date.</strong><span>New applications will appear here.</span></div>
                    )}
                </div>
            </section>

            <section className={styles.bottomNote}>
                <span className={styles.noteMark}>LD</span>
                <p><strong>Demo workspace</strong><span>Sample applicants, scores, products, rates, and decisions are illustrative. No credit decision is made by this interface.</span></p>
                <Link to="/products">Review loan products <FiArrowUpRight aria-hidden="true" /></Link>
            </section>
        </main>
    );
};

export default Overview;
