export function parseRssDateOrNow(raw: string | undefined | null): Date {
    if (!raw) return new Date();

    const d = new Date(raw);
    if (isNaN(d.getTime())) {
        return new Date();
    }
    return d;
}