// Vercel serverless function: GET /api/search?q=iphone+16
// Calls SerpApi (Google Shopping, UAE) and returns cleaned, price-sorted offers.
module.exports = async (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase().slice(0, 80);
  if (q.length < 2) return res.status(400).json({ error: 'Type at least 2 characters.' });

  const key = process.env.SERPAPI_KEY;
  if (!key) return res.status(500).json({ error: 'Server is not configured yet.' });

  const url = new URL('https://serpapi.com/search.json');
  url.search = new URLSearchParams({
    engine: 'google_shopping', q, gl: 'ae', hl: 'en',
    location: 'United Arab Emirates', api_key: key
  }).toString();

  try {
    const r = await fetch(url);
    const d = await r.json();
    if (!r.ok || (d.error && !/hasn't returned any results/i.test(d.error))) {
      console.error('SerpApi error', r.status, d.error);
      return res.status(502).json({ error: 'Price source is unavailable. Try again shortly.' });
    }

    const results = (d.shopping_results || [])
      .filter(x => typeof x.extracted_price === 'number' && !x.second_hand_condition)
      .map(x => {
        const dl = String(x.delivery || '');
        const free = /free/i.test(dl);
        const m = dl.match(/(?:aed|\+)\s*([\d,.]+)/i);
        const ship = free ? 0 : (m ? parseFloat(m[1].replace(/,/g, '')) || 0 : 0);
        return {
          title: x.title, store: x.source || 'Store',
          price: x.extracted_price, ship, free, delivery: dl,
          total: x.extracted_price + ship,
          link: x.link || x.product_link || '', image: x.thumbnail || '',
          rating: x.rating || null
        };
      })
      .filter(x => x.link)
      .sort((a, b) => a.total - b.total)
      .slice(0, 40);

    // Same query = served from Vercel's cache for 6h, so you don't pay twice.
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).json({ q, updated: new Date().toISOString(), results });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: 'Something went wrong. Try again shortly.' });
  }
};
