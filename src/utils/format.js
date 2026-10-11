const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

export const formatCurrency = (amount) => currency.format(Number(amount) || 0);

export const formatShortCurrency = (amount) => {
    const value = Number(amount) || 0;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}m`;
    if (value >= 1000) return `$${Math.round(value / 1000)}k`;
    return currency.format(value);
};

export const formatDate = (date, options = { month: "short", day: "numeric", year: "numeric" }) =>
    new Intl.DateTimeFormat("en-US", options).format(new Date(date));

export const formatDateTime = (date) =>
    new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(date));

export const getInitials = (name = "") =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
