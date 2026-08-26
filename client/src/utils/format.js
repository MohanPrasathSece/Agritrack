/**
 * Formats a location object into a readable string
 * @param {Object|string} location - The location object or string
 * @returns {string} - Formatted location string
 */
export const formatLocation = (location) => {
    if (!location) return 'Location Unknown';
    if (typeof location === 'string') return location;

    // Handle Supabase JSONB location object
    const { village, district, state, pincode, fullAddress, full_address } = location;

    // Safety: ensure we return a string, not a nested object
    if (typeof (fullAddress || full_address) === 'string' && (fullAddress || full_address)) {
        return fullAddress || full_address;
    }

    return [village, district, state, pincode]
        .filter(v => typeof v === 'string' && v.trim())
        .join(', ') || 'Regional Center';
};
