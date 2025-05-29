import Airtable from 'airtable';

// Replace these with your actual values
const AIRTABLE_API_KEY = 'add-key-here';
const AIRTABLE_BASE_ID = 'add-id-here';
const TABLE_NAME = 'add-tblId-here'; // e.g 'tblhashcode'
const FIELD_NAME = 'specify-field-name-here'; // e.g., 'Verification Code'
const TEST_CODE = 'test-code-here'; // e.g., '2101E7' - verification code to test

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

async function testFindRecordByVCode() {
  try {
    const filterFormula = `{${FIELD_NAME}} = '${TEST_CODE}'`;
    const records = await base(TABLE_NAME)
      .select({
        maxRecords: 1,
        filterByFormula: filterFormula,
      })
      .firstPage();

    if (records.length === 0) {
      console.log('No record found for code:', TEST_CODE);
    } else {
      console.log('Record found:', records[0].fields);
    }
  } catch (error) {
    console.error('Airtable error:', error);
  }
}

testFindRecordByVCode();