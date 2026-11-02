import { CURATED_PRODUCTS } from '../data/productCatalog.js';

// Quick in-memory cache for external lookups
const searchCache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

/**
 * Score how well a curated product matches the search query.
 * Higher score = more relevant match.
 */
function calculateMatchScore(product, query) {
  const q = query.toLowerCase().trim();
  const name = product.name.toLowerCase();
  const brand = product.brand.toLowerCase();
  const tagline = (product.tagline || '').toLowerCase();
  const models = (product.models || []).map((m) => m.toLowerCase()).join(' ');

  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;
  if (brand === q) return 50;
  if (brand.startsWith(q)) return 45;
  if (models.includes(q)) return 40;
  if (tagline.includes(q)) return 20;

  // Multi-word matching (e.g. "iphone pro" matches "iPhone 16 Pro")
  const queryTokens = q.split(/\s+/).filter(Boolean);
  const matchedTokens = queryTokens.filter(
    (token) => name.includes(token) || brand.includes(token) || models.includes(token)
  );
  if (matchedTokens.length === queryTokens.length) {
    return 35 + matchedTokens.length * 5;
  }
  if (matchedTokens.length > 0) {
    return matchedTokens.length * 10;
  }

  return 0;
}

/**
 * Map third-party categories (like dummyjson) to ProofBox allowed categories
 */
function mapCategoryToProofBox(rawCategory = '') {
  const cat = rawCategory.toLowerCase();
  if (cat.includes('laptop') || cat.includes('mobile') || cat.includes('smart') || cat.includes('audio') || cat.includes('tablet')) {
    return 'Electronics';
  }
  if (cat.includes('appliance') || cat.includes('kitchen') || cat.includes('home')) {
    return 'Appliances';
  }
  if (cat.includes('vehicle') || cat.includes('motor') || cat.includes('car')) {
    return 'Vehicles';
  }
  if (cat.includes('furniture')) {
    return 'Furniture';
  }
  if (cat.includes('cloth') || cat.includes('shoe') || cat.includes('shirt') || cat.includes('dress') || cat.includes('watch')) {
    return 'Clothing';
  }
  if (cat.includes('sport') || cat.includes('outdoor')) {
    return 'Sports & Outdoors';
  }
  if (cat.includes('tool') || cat.includes('hardware')) {
    return 'Tools & Hardware';
  }
  return 'Electronics';
}

/**
 * GET /api/products/search?q=...
 */
export async function searchProducts(req, res, next) {
  try {
    const rawQuery = (req.query.q || '').trim();

    if (!rawQuery) {
      // Return popular flagships by default
      const defaultProducts = CURATED_PRODUCTS.slice(0, 6);
      return res.status(200).json({
        success: true,
        count: defaultProducts.length,
        query: '',
        products: defaultProducts
      });
    }

    const q = rawQuery.toLowerCase();

    // 1. Search curated catalog with relevance scoring
    const scoredCurated = CURATED_PRODUCTS.map((prod) => ({
      product: prod,
      score: calculateMatchScore(prod, q)
    }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product);

    let combined = [...scoredCurated];

    // 2. If curated matches are low or query might be a general item, query public product API
    if (combined.length < 5 && q.length >= 2) {
      const cacheKey = `ext_${q}`;
      const cached = searchCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        combined = [...combined, ...cached.data];
      } else {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2200);

          const apiRes = await fetch(
            `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}&limit=6`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (apiRes.ok) {
            const data = await apiRes.json();
            const externalProducts = (data.products || []).map((p) => {
              // Extract or synthesize colors from tags/images
              const mainImg = p.thumbnail || (p.images && p.images[0]) || '';
              const altImg = (p.images && p.images[1]) || mainImg;

              return {
                id: `ext-${p.id}`,
                name: p.title,
                brand: p.brand || 'Premium Brand',
                tagline: p.description ? p.description.slice(0, 100) + '...' : 'Verified consumer product.',
                category: mapCategoryToProofBox(p.category),
                defaultSeller: 'Authorized Retailer',
                defaultWarrantyMonths: 12,
                basePrice: Math.round(p.price || 199),
                models: [p.title],
                colors: [
                  {
                    name: 'Standard Edition',
                    hex: '#1D1D1F',
                    image: mainImg
                  },
                  ...(altImg !== mainImg
                    ? [
                        {
                          name: 'Special Finish',
                          hex: '#8E8E93',
                          image: altImg
                        }
                      ]
                    : [])
                ],
                variants: [
                  { id: 'standard', label: 'Standard Configuration', priceDelta: 0 },
                  { id: 'extended', label: 'Plus Bundle', priceDelta: Math.round((p.price || 100) * 0.2) }
                ],
                specs: [
                  `Category: ${p.category || 'General'}`,
                  `Customer Rating: ${p.rating ? `${p.rating} / 5.0` : 'Top Rated'}`,
                  '1-Year Limited Manufacturer Warranty'
                ]
              };
            });

            searchCache.set(cacheKey, { timestamp: Date.now(), data: externalProducts });
            combined = [...combined, ...externalProducts];
          }
        } catch {
          // Graceful fallback to curated matches on timeout or network block
        }
      }
    }

    // Deduplicate by name
    const seen = new Set();
    const unique = [];
    for (const prod of combined) {
      const key = prod.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(prod);
      }
    }

    return res.status(200).json({
      success: true,
      count: unique.length,
      query: rawQuery,
      products: unique.slice(0, 8)
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/products/popular
 * Returns flagship trending products
 */
export function getPopularProducts(req, res) {
  const popular = CURATED_PRODUCTS.slice(0, 8);
  return res.status(200).json({
    success: true,
    count: popular.length,
    products: popular
  });
}
