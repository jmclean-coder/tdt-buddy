import express from 'express';
import Airtable from 'airtable';

const app = express();
const PORT = 3000;

// Your Airtable config
const AIRTABLE_API_KEY = 'patLdKeiMDoMZPc8w.b2dc345cc9e54083377cdb1431172118239b7c7a6fce49a275d9debc7af5298d';
const AIRTABLE_BASE_ID = 'appCyKgWmx7Mvd4Et';
const TABLE_NAME = 'tbldFJRElI7v4CfZx';
const FIELD_NAME = 'Verification Code';
const TEST_CODE = '2101E7';

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

app.get('/test-airtable', async (req, res) => {
  try {
    const filterFormula = `{${FIELD_NAME}} = '${TEST_CODE}'`;
    const records = await base(TABLE_NAME)
      .select({
        maxRecords: 1,
        filterByFormula: filterFormula,
      })
      .firstPage();

    if (records.length === 0) {
      res.json({ message: 'No record found for code', code: TEST_CODE });
    } else {
      res.json({ message: 'Record found', fields: records[0].fields });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});