// src/airtable/registration.js
import {
  findRecordByField,
  findRecords,
  updateRecordWithFields,
  createRecord,
} from './client.js';
import {
  TABLE_IDS,
  FIELD_IDS,
  FIELD_VALUES,
  FIELD_NAMES,
  YEAR_TO_TABLE_ID,
  VERIFICATION_SUPPORTED_YEARS,
  fieldExistsForYear,
  getFieldId,
  getAllTables,
  getTableIdFromYear,
  getYearFromTableId,
} from './config.js';

/**
 * Get the current event year
 */
export async function getCurrentEventYear(env) {
  // TODO: Implement fetching from Airtable if needed
  return '2025'; // Fallback to current year
}

/**
 * Get all years with registration tables
 */
export async function getAllEventYears() {
  try {
    return Object.keys(YEAR_TO_TABLE_ID).sort(
      (a, b) => parseInt(b) - parseInt(a)
    );
  } catch (error) {
    console.error('Error getting event years:', error);
    throw error;
  }
}

/**
 * Check if verification is supported for a specific year
 */
export function isVerificationSupported(year) {
  return VERIFICATION_SUPPORTED_YEARS.includes(year);
}

/**
 * Get verification-supported years
 */
export function getVerificationSupportedYears() {
  return Object.keys(YEAR_TO_TABLE_ID)
    .filter(isVerificationSupported)
    .sort((a, b) => parseInt(b) - parseInt(a));
}

/**
 * Find registration by verification code in supported year tables
 * Only searches in years that support verification
 */
export async function findRegistrationByCode(code, env) {
  // debugger;
  try {
    const supportedYears = getVerificationSupportedYears();
    const currentYear = await getCurrentEventYear(env);

    if (isVerificationSupported(currentYear)) {
      const record = await findRecordByField(
        env,
        currentYear,
        'Verification Code',
        code
      );
      if (record) {
        return {
          record,
          year: currentYear,
          tableId: getTableIdFromYear(currentYear),
        };
      }
    }

    for (const year of supportedYears) {
      if (year === currentYear) continue;
      const record = await findRecordByField(
        env,
        year,
        'Verification Code',
        code
      );
      if (record) {
        return {
          record,
          year,
          tableId: getTableIdFromYear(year),
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error finding registration by code:', error);
    throw error;
  }
}

/**
 * Find registration by email across all year tables
 */
export async function findRegistrationByEmail(email, env) {
  try {
    const lowerEmail = email.toLowerCase();
    const currentYear = await getCurrentEventYear(env);
    const currentYearTableId = getTableIdFromYear(currentYear);

    if (fieldExistsForYear(currentYear, 'EMAIL')) {
      const emailFieldId = getFieldId(currentYear, 'EMAIL');
      const filterFormula = `LOWER({${emailFieldId}}) = '${lowerEmail}'`;

      const records = await findRecords(
        env,
        currentYearTableId,
        filterFormula
      );
      if (records.length > 0) {
        return {
          record: records[0],
          year: currentYear,
          tableId: currentYearTableId,
        };
      }
    }

    const years = await getAllEventYears();
    for (const year of years) {
      if (year === currentYear) continue;
      if (fieldExistsForYear(year, 'EMAIL')) {
        const tableId = getTableIdFromYear(year);
        const emailFieldId = getFieldId(year, 'EMAIL');
        const filterFormula = `LOWER({${emailFieldId}}) = '${lowerEmail}'`;

        const records = await findRecords(
          env,
          tableId,
          filterFormula
        );
        if (records.length > 0) {
          return {
            record: records[0],
            year,
            tableId,
          };
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error finding registration by email:', error);
    throw error;
  }
}

/**
 * Find registration by Discord user ID
 * Only checks years that support verification
 */
export async function findRegistrationByDiscordId(discordId, env) {
  try {
    const supportedYears = getVerificationSupportedYears();
    const currentYear = await getCurrentEventYear(env);

    if (isVerificationSupported(currentYear)) {
      const record = await findRecordByField(
        env,
        currentYear,
        'DISCORD_USER_ID',
        discordId
      );
      if (record) {
        return {
          record,
          year: currentYear,
          tableId: getTableIdFromYear(currentYear),
        };
      }
    }

    for (const year of supportedYears) {
      if (year === currentYear) continue;
      const record = await findRecordByField(
        env,
        year,
        'DISCORD_USER_ID',
        discordId
      );
      if (record) {
        return {
          record,
          year,
          tableId: getTableIdFromYear(year),
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error finding registration by Discord ID:', error);
    throw error;
  }
}

/**
 * Generate a verification code for a registration
 * Only works for years that support verification
 */
export async function generateVerificationCode(year, recordId, env) {
  if (!isVerificationSupported(year)) {
    throw new Error(`Verification is not supported for year ${year}`);
  }
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  await updateRecordWithFields(env, year, recordId, {
    VERIFICATION_CODE: code,
  });
  return code;
}

/**
 * Update the current event year
 */
export async function setCurrentEventYear(year, env) {
  // You may need to implement this with a direct fetch call if you want to update a settings record in Airtable
  throw new Error('setCurrentEventYear not implemented for direct fetch client');
}

/**
 * Update registration with Discord verification info
 * Only works for years that support verification
 */
export async function updateRegistrationWithDiscordInfo(
  registration,
  discordInfo,
  env
) {
  // debugger;
  const { year, record } = registration;
  if (!isVerificationSupported(year)) {
    throw new Error(`Verification is not supported for year ${year}`);
  }
  const updateFields = {
    [FIELD_NAMES[year].DISCORD_USER_ID]: discordInfo.userId,
    [FIELD_NAMES[year].DISCORD_USERNAME]: discordInfo.username,
    [FIELD_NAMES[year].VERIFICATION_STATUS]: FIELD_VALUES.VERIFICATION_COMPLETED,
    [FIELD_NAMES[year].VERIFICATION_DATE]: new Date().toISOString(),
    [FIELD_NAMES[year].DISCORD_ROLES]: discordInfo.roles.join(', '),
  };
  return await updateRecordWithFields(
    env,
    year,
    record.id,
    updateFields
  );
}

/**
 * Get field value from a record using year-specific field ID
 * Returns null if field doesn't exist for that year
 */
export function getFieldValue(record, year, fieldName) {
  try {
    const fieldId = getFieldId(year, fieldName);
    if (!fieldId) {
      return null;
    }
    if (!record.fields || !record.fields[fieldName]) {
      // console.log('hi from getFieldValue', `Field '${fieldName}' does not exist in record for year ${year}`);
      // the return value is expected to be null for empty fields
      return null;
    }

      // console.log(FIELD_IDS, FIELD_IDS[year][fieldName], record.fields[fieldName])

    return record.fields[fieldName];
  } catch (error) {
    console.error(
      `Error getting field value for ${fieldName} in ${year}:`,
      error
    );
    return null;
  }
}
