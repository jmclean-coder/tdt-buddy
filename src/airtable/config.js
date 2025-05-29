// Configuration for table IDs
export const TABLE_IDS = {
  'Discord Bot Settings': 'tbl0YKe7aCrgAMWtD', // Bot Settings table
  // Year tables with their IDs
  2025: 'tbldFJRElI7v4CfZx', // 2025 registrations table
  2024: 'tblnJecLF95cyPnbO', // 2024 registrations table
  // Add other year tables as needed
};

export const FIELD_NAMES = {
  // Common fields
  CURRENT_EVENT_YEAR: 'Current Event Year',
  2025: {
    DISCORD_USER_ID: 'Discord User ID',
    DISCORD_USERNAME: 'Discord Username',
    VERIFICATION_STATUS: 'Verification Status',
    VERIFICATION_DATE: 'Verification Date',
    VERIFICATION_CODE: 'Verification Code',
    DISCORD_ROLES: 'Discord Roles',
    NAME_FULL: 'Name - Full',
    EMAIL: 'Email',
    PAYMENT_STATUS: 'Payment Status',
    CURRENT_EVENT_YEAR: 'Current Event Year',
  },
  2024: {
    NAME_FULL: 'Name - Full',
    EMAIL: 'Email',
    PAYMENT_STATUS: 'Payment Status',
  }
  // ...
};

export const FIELD_IDS = {
  // Bot Settings table field
   [FIELD_NAMES.CURRENT_EVENT_YEAR]: 'tbl0YKe7aCrgAMWtD',
  // 2025 table fields - including verification fields
  2025: {
    [FIELD_NAMES[2025].VERIFICATION_CODE]: 'fldDv8tDT8C7awJds',
    [FIELD_NAMES[2025].DISCORD_USER_ID]: 'fldqFpv3Lj3q0TUah',
    [FIELD_NAMES[2025].DISCORD_USERNAME]: 'fldY7jTwWJh2aOuiB',
    [FIELD_NAMES[2025].VERIFICATION_STATUS]: 'fldBBUv45XOpRABMp',
    [FIELD_NAMES[2025].VERIFICATION_DATE]: 'fldGzYF2FZ8gZ077E',
    [FIELD_NAMES[2025].DISCORD_ROLES]: 'flds8vQRgNzAjlWo0',
    [FIELD_NAMES[2025].NAME_FULL]: 'fldSEfZhC4ySXhhAu',
    [FIELD_NAMES[2025].EMAIL]: 'fldWL2TFh3Ovd4j5N',
    [FIELD_NAMES[2025].PAYMENT_STATUS]: 'fld9DakacidJgdJVp',
  },

  // 2024 table fields - no verification fields
  2024: {
    // Registration fields only
    [FIELD_NAMES[2024].NAME_FULL]: 'fld2IKkoWvwzrupML',
    [FIELD_NAMES[2024].EMAIL]: 'fld6PxeMBuMcHhrh4',
    [FIELD_NAMES[2024].PAYMENT_STATUS]: 'fldjHFFhwJbqKqR7G', // Paid in Full, Active Payment Plan, Incomplete
  },

  // Add other years as needed with their registration fields
};

// Define which years support verification
export const VERIFICATION_SUPPORTED_YEARS = ['2025'];

// Define field values that indicate various statuses
export const FIELD_VALUES = {
  PAYMENT_COMPLETED: 'Paid in Full',
  PAYMENT_PLAN: 'Active Payment Plan',
  VERIFICATION_COMPLETED: 'Verified',
  VERIFICATION_PENDING: 'Unverified',
};

// Map of year strings to table IDs
export const YEAR_TO_TABLE_ID = {
  2025: TABLE_IDS['2025'],
  2024: TABLE_IDS['2024'],
  2023: TABLE_IDS['2023'],
  // Add other years as needed
};

// Reverse map for getting year from table ID
export const TABLE_ID_TO_YEAR = Object.entries(
  YEAR_TO_TABLE_ID
).reduce((acc, [year, tableId]) => {
  acc[tableId] = year;
  return acc;
}, {});

/**
 * Helper function to get field ID by year and field name
 * Returns null if field doesn't exist for that year
 */
export function getFieldId(year, fieldName) {
  // debugger;
  // Check if we have field IDs for this year
  if (!FIELD_IDS[year]) {
    return null;
  }
  // debugger;
  // Check if we have this specific field for this year
  return FIELD_IDS[year][fieldName] || null;
}

/**
 * Check if a specific field exists for a year
 */
export function fieldExistsForYear(year, fieldName) {
  return !!getFieldId(year, fieldName);
}

/**
 * Get the table ID from a year string.
 * Example: getTableIdFromYear('2025') => 'tblXXXXXXXXXXXXXX'
 */
export function getTableIdFromYear(year) {
  return YEAR_TO_TABLE_ID[year] || null;
}

/**
 * Get the year string from a table ID.
 * Example: getYearFromTableId('tblXXXXXXXXXXXXXX') => '2025'
 */
export function getYearFromTableId(tableId) {
  return (
    Object.keys(YEAR_TO_TABLE_ID).find(
      (year) => YEAR_TO_TABLE_ID[year] === tableId
    ) || null
  );
}

/**
 * Get all table IDs as an array.
 */
export function getAllTables() {
  return Object.values(YEAR_TO_TABLE_ID);
}
