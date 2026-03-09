/**
 * Category object returned by API
 */

export type Category = {
    id: number;             // Category ID from API
    name: string;           // Category name, e.g. "Bills"
    created_at: string;     // ISO timestamp when category was created
    updated_at: string;     // ISO timestamp of last update
}