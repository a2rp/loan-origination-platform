import { useMemo, useState } from "react";
import { FiArrowUpRight, FiPlus, FiSearch, FiSliders, FiX } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import ApplicationRow from "../../components/applicationRow/index.jsx";
import Button from "../../components/button/index.jsx";
import { applicationStages } from "../../data/seed.js";
import { formatShortCurrency } from "../../utils/format.js";
import styles from "./styles.module.css";

const Applications = ({ applications, products, onNewApplication }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const [productId, setProductId] = useState("all");
    const [sort, setSort] = useState("newest");
    const requestedStage = searchParams.get("status") || "All stages";
    const selectedStage = applicationStages.includes(requestedStage) ? requestedStage : "All stages";

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        return applications
            .filter((application) => {
                const matchesSearch = !query || [application.borrower, application.email, application.id, application.product]
                    .some((value) => value.toLowerCase().includes(query));
                const matchesStage = selectedStage === "All stages" || application.status === selectedStage;
                const matchesProduct = productId === "all" || application.productId === productId;
                return matchesSearch && matchesStage && matchesProduct;
            })
            .sort((first, second) => {
                if (sort === "oldest") return new Date(first.submittedAt) - new Date(second.submittedAt);
                if (sort === "amount-high") return second.amount - first.amount;
                if (sort === "amount-low") return first.amount - second.amount;
                return new Date(second.submittedAt) - new Date(first.submittedAt);
            });
    }, [applications, productId, search, selectedStage, sort]);

    const activeCount = applications.filter((application) => !["Funded", "Declined"].includes(application.status)).length;
    const totalRequested = applications.reduce((sum, application) => sum + application.amount, 0);
    const hasFilters = Boolean(search || productId !== "all" || selectedStage !== "All stages");

    const clearFilters = () => {
        setSearch("");
        setProductId("all");
        setSort("newest");
        setSearchParams({});
    };

    return (
        <main className={styles.page}>
            <div className={styles.topline}><span>ORIGINATION DESK</span><i /> <span>APPLICATION REGISTER</span><a href="https://github.com/a2rp/loan-origination-platform" rel="noreferrer" target="_blank">SOURCE <FiArrowUpRight aria-hidden="true" /></a></div>
            <section className={styles.heading}>
                <div><span className={styles.eyebrow}>CASE FILES / 01</span><h1>Application register</h1><p>Follow each request from first contact through its next lending decision.</p></div>
                <Button icon={<FiPlus aria-hidden="true" />} onClick={onNewApplication} variant="primary">New application</Button>
            </section>

            <section aria-label="Application totals" className={styles.overviewStats}>
                <div><small>OPEN REQUESTS</small><strong>{activeCount.toString().padStart(2, "0")}</strong><span>Awaiting a next step</span></div>
                <div><small>ALL CASES</small><strong>{applications.length.toString().padStart(2, "0")}</strong><span>Across every stage</span></div>
                <div><small>REQUESTED VALUE</small><strong>{formatShortCurrency(totalRequested)}</strong><span>Illustrative loan amounts</span></div>
                <div className={styles.statMark}><FiSliders aria-hidden="true" /><span>Filter, sort, and open any file to continue the review.</span></div>
            </section>

            <section className={styles.register}>
                <div className={styles.registerHeading}>
                    <div><span className={styles.eyebrow}>THE ACTIVE REGISTER</span><h2>Borrower requests <span>{filtered.length}</span></h2></div>
                    <p>In-memory demo data <i /></p>
                </div>

                <div className={styles.filters}>
                    <label className={styles.searchBox}>
                        <FiSearch aria-hidden="true" />
                        <span className={styles.srOnly}>Search applications</span>
                        <input onChange={(event) => setSearch(event.target.value)} placeholder="Search borrower, ID, or product" value={search} />
                        {search && <button aria-label="Clear search" onClick={() => setSearch("")} type="button"><FiX aria-hidden="true" /></button>}
                    </label>
                    <label className={styles.selectBox}><span>Stage</span><select onChange={(event) => {
                        const next = new URLSearchParams(searchParams);
                        if (event.target.value === "All stages") next.delete("status");
                        else next.set("status", event.target.value);
                        setSearchParams(next);
                    }} value={selectedStage}>
                        <option>All stages</option>
                        {applicationStages.map((stage) => <option key={stage}>{stage}</option>)}
                    </select></label>
                    <label className={styles.selectBox}><span>Product</span><select onChange={(event) => setProductId(event.target.value)} value={productId}>
                        <option value="all">All products</option>
                        {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                    </select></label>
                    <label className={styles.selectBox}><span>Sort</span><select onChange={(event) => setSort(event.target.value)} value={sort}>
                        <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="amount-high">Largest request</option><option value="amount-low">Smallest request</option>
                    </select></label>
                    {hasFilters && <button className={styles.clearFilters} onClick={clearFilters} type="button">Clear filters</button>}
                </div>

                {filtered.length ? (
                    <div className={styles.rows}>
                        <div className={styles.columnHead}><span>Borrower / product</span><span>Current stage</span><span>Credit file</span><span>Requested</span></div>
                        {filtered.map((application) => <ApplicationRow application={application} key={application.id} />)}
                    </div>
                ) : (
                    <div className={styles.empty}>
                        <span className={styles.emptyIcon}><FiSearch aria-hidden="true" /></span>
                        <h3>No matching applications</h3>
                        <p>Try a different name, loan product, or stage filter.</p>
                        <Button onClick={clearFilters} variant="quiet">Reset the register</Button>
                    </div>
                )}
                <div className={styles.registerFoot}><span>Displaying {filtered.length} of {applications.length} application records</span><span>Every case detail is an illustrative demo</span></div>
            </section>
        </main>
    );
};

export default Applications;
