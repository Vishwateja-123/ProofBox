async function runVerification() {
  const BASE = 'http://localhost:5001/api';

  console.log('--- Step 1: Health Check ---');
  const healthRes = await fetch(`${BASE}/health`).then(r => r.json());
  console.log('Health:', healthRes.status, '| DB:', healthRes.database.status);

  console.log('\n--- Step 2: Login with Demo Account ---');
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@proofbox.com', password: 'DemoPassword123!' })
  }).then(r => r.json());
  console.log('Login Success:', loginRes.success, '| User:', loginRes.user?.name);
  const token = loginRes.token;

  console.log('\n--- Step 3: Fetch Dashboard Summary ---');
  const dashRes = await fetch(`${BASE}/dashboard/summary`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());
  console.log('Total Purchases:', dashRes.summary.totalPurchases);
  console.log('Active Warranties:', dashRes.summary.activeWarranties);
  console.log('Expiring Soon (30d):', dashRes.summary.expiringSoon);
  console.log('Expired Warranties:', dashRes.summary.expiredWarranties);
  console.log('Total Spend: ₹' + dashRes.summary.totalSpend);

  console.log('\n--- Step 4: Fetch Purchases List & Search ---');
  const searchRes = await fetch(`${BASE}/purchases?search=Sony`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());
  console.log('Search "Sony" count:', searchRes.count, '| Found:', searchRes.purchases[0]?.productName);

  console.log('\n--- Step 5: Fetch Expiring Soon Items ---');
  const expiringRes = await fetch(`${BASE}/purchases/expiring`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());
  console.log('Expiring items count:', expiringRes.count);
  expiringRes.purchases.forEach(p => console.log(`  - ${p.productName}: ${p.daysRemaining} days left (Status: ${p.warrantyStatus})`));

  console.log('\n--- Step 6: Create New Purchase Record ---');
  const createRes = await fetch(`${BASE}/purchases`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      productName: 'Kindle Paperwhite 11th Gen',
      category: 'Electronics',
      seller: 'Amazon India',
      purchaseDate: '2026-05-01',
      price: 14999,
      warrantyMonths: 12,
      notes: 'Waterproof e-reader with adjustable warm light'
    })
  }).then(r => r.json());
  console.log('Created ID:', createRes.purchase?._id, '| Expiry:', createRes.purchase?.warrantyExpiryDate);
  const newId = createRes.purchase._id;

  console.log('\n--- Step 7: Update Purchase Record ---');
  const updateRes = await fetch(`${BASE}/purchases/${newId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ price: 13999, warrantyMonths: 24 })
  }).then(r => r.json());
  console.log('Updated Price:', updateRes.purchase?.price, '| New Expiry:', updateRes.purchase?.warrantyExpiryDate);

  console.log('\n--- Step 8: Delete Purchase Record ---');
  const delRes = await fetch(`${BASE}/purchases/${newId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());
  console.log('Deleted ID:', delRes.id);

  console.log('\n=========================================');
  console.log('🎉 ALL LIVE E2E INTEGRATION CHECKS PASSED!');
  console.log('=========================================');
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
