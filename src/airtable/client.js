import {
  TABLE_IDS,
  YEAR_TO_TABLE_ID,
  TABLE_ID_TO_YEAR,
  getFieldId,
  fieldExistsForYear,
} from './config';
import { isVerificationSupported } from '../airtable/operations.js';

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

/**
 * Find records in an Airtable table with specific filter formula
 */
export async function findRecords(
  env,
  tableIdOrName,
  filterFormula,
  options = {}
) {
  // debugger;
  try {
    const params = new URLSearchParams({
      filterByFormula: filterFormula,
      maxRecords: options.maxRecords?.toString() || '1',
      ...(options.view ? { view: options.view } : {}),
    });

    const url = `${AIRTABLE_API_URL}/${env.AIRTABLE_BASE_ID}/${tableIdOrName}?${params}`;

    // console.log('Airtable request URL:', url);
    // console.log('Airtable API Key present:', !!env.AIRTABLE_API_KEY);
    // console.log('Airtable filter formula:', filterFormula);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    // console.log(res);

    if (!res.ok) {
      const error = await res.text();
    }

    const data = await res.json();
    return data.records;
  } catch (error) {
    console.error(
      `Airtable error finding records in ${tableIdOrName}:`,
      error
    );
    throw new AirtableError('Failed to find records', error);
  }
}

/**
 * Find a single record by field value using year-specific field ID
 * Returns null if the field doesn't exist for that year
 */
export async function findRecordByField(
  env,
  year,
  fieldName,
  fieldValue
) {
  // debugger;
  try {
    const tableId = YEAR_TO_TABLE_ID[year];
    if (!tableId)
      throw new Error(`No table ID found for year ${year}`);

    const fieldId = getFieldId(year, fieldName);
    if (!fieldId) {
      console.warn(
        `Field '${fieldName}' does not exist for year ${year}`
      );
      return null;
    }

    // Treat fieldValue as a string to format it correctly for Airtable filter formulas.
    const formattedValue =
      typeof fieldValue === 'string' ? `'${fieldValue}'` : fieldValue;
    const filterFormula = `{${fieldId}} = ${formattedValue}`;

    const records = await findRecords(env, tableId, filterFormula);
    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error(
      `Error finding record by ${fieldName} in ${year}:`,
      error
    );
    throw error;
  }
}

/**
 * Update a record with year-specific field IDs
 * Only updates fields that exist for that year
 */
export async function updateRecordWithFields(
  env,
  year,
  recordId,
  fieldUpdates
) {
  // debugger
  try {
    const tableId = YEAR_TO_TABLE_ID[year];
    if (!tableId)
      throw new Error(`No table ID found for year ${year}`);

    const fieldIdUpdates = {};
    for (const [fieldName, value] of Object.entries(fieldUpdates)) {
      const fieldId = getFieldId(year, fieldName);
      if (fieldId) {
        fieldIdUpdates[fieldId] = value;
      } else {
        console.warn(
          `Skipping update for field '${fieldName}' as it doesn't exist for year ${year}`
        );
      }
    }

    if (Object.keys(fieldIdUpdates).length === 0) {
      console.warn(`No valid fields to update for year ${year}`);
      return null;
    }

    const url = `${AIRTABLE_API_URL}/${env.AIRTABLE_BASE_ID}/${tableId}/${recordId}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: fieldIdUpdates }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new AirtableError(
        `Airtable error: ${res.status} ${error}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error(
      `Airtable error updating record in ${year}:`,
      error
    );
    throw new AirtableError('Failed to update record', error);
  }
}

/**
 * Create a new record in Airtable
 */
export async function createRecord(env, tableIdOrName, fields) {
  try {
    const url = `${AIRTABLE_API_URL}/${env.AIRTABLE_BASE_ID}/${tableIdOrName}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new AirtableError(
        `Airtable error: ${res.status} ${error}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error(
      `Airtable error creating record in ${tableIdOrName}:`,
      error
    );
    throw new AirtableError('Failed to create record', error);
  }
}

/**
 * Custom error class for Airtable errors
 */
class AirtableError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'AirtableError';
    this.originalError = originalError;
  }
}
