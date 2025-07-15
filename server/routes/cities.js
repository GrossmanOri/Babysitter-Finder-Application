const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/cities?q=<query> - חיפוש ערים בעברית (data.gov.il)
router.get('/', async (req, res) => {
  const q = req.query.q || '';
  if (!q) return res.status(400).json({ error: 'Missing q param' });

  try {
    const { data } = await axios.get('https://data.gov.il/api/3/action/datastore_search', {
      params: {
        resource_id: '5c78e9fa-c2e2-4771-93ff-7f400a12f7ba',
        q: q,
        limit: 20
      }
    });

    // מחלץ את שמות היישובים בעברית ומסנן כפילויות
    const cities = data.result.records.map(r => r['שם_ישוב']).filter(Boolean);
    res.json({ cities: [...new Set(cities)] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 