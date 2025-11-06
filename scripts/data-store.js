// This module acts as a central place to fetch and store application data.
// This prevents multiple network requests for the same data.

let professors = [];
let hasFetched = false;

/**
 * Fetches professor data from the API if it hasn't been fetched yet.
 * Returns the stored list of professors.
 */
export async function getProfessors(forceRefresh = false) {
    // If we are not forcing a refresh and we have already fetched, return the cached data.
    if (!forceRefresh && hasFetched) {
        return professors;
    }
        try {
            const response = await fetch('/api/professors');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            professors = await response.json();
            hasFetched = true;
        } catch (error) {
            console.error("❌ Could not fetch professors:", error);
            professors = []; // Return an empty array on error
        }
    return professors;
}