const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { createClient } = require('@supabase/supabase-js');

// Parse environment variables
const envPath = path.join(__dirname, '.env.local');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (err) {
  console.error("Could not find .env.local file in the project root!");
  process.exit(1);
}

const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    env[key] = val;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration in .env.local!");
  process.exit(1);
}

const csvUrl = 'https://docs.google.com/spreadsheets/d/1ffkOmgG1WORH0hoqHzcdlTsdyhvO9q6jNOcY_kjhmH0/export?format=csv';

const BRANDS = [
  'Gucci', 'Vogue Eyewear', 'Vogue', 'Dolce & Gabbana', 'Dolce', 'Fendi', 
  'Carrera', 'Prada', 'Tom Ford', 'Armani Exchange', 'Armani', 'Tiffany & Co.', 
  'Tiffany', 'Balenciaga', 'Maui Jim', 'Burberry', 'Michael Kors', 'Ray-Ban', 
  'Coach', 'Versace', 'Persol', 'Hugo Boss', 'Saint Laurent', 'Oakley'
];

function detectBrand(name) {
  for (const brand of BRANDS) {
    if (name.toLowerCase().startsWith(brand.toLowerCase())) {
      return brand;
    }
  }
  return name.split(' ')[0] || 'Genérico';
}

function parseCSV(text) {
  const lines = [];
  let row = [""];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      lines.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== '') {
    lines.push(row);
  }
  return lines;
}

function parseDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return new Date().toISOString();
  // Expecting M/D/YYYY or YYYY-MM-DD
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day).toISOString();
  }
  return new Date(dateStr).toISOString();
}

async function ask(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function main() {
  console.log("=== Stockly Google Sheet Import System ===");
  
  let email = process.argv[2];
  let password = process.argv[3];

  if (!email || !password) {
    email = await ask("Ingresa tu correo de Stockly (email): ");
    password = await ask("Ingresa tu contraseña de Stockly: ");
  }

  if (!email || !password) {
    console.error("Correo y contraseña obligatorios.");
    return;
  }

  const ws = require('ws');
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    realtime: {
      transport: ws
    }
  });

  console.log("\nIniciando sesión en Supabase...");
  let authData = null;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      if (error.message.includes("Invalid login credentials") || error.message.includes("credentials")) {
        console.log("Usuario no registrado. Intentando registrar cuenta nueva...");
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: 'Manuel Mayora' } }
        });
        
        if (signUpError) {
          throw new Error("Error en registro: " + signUpError.message);
        }
        authData = signUpData;
        console.log(`Cuenta creada exitosamente para ${email}.`);
      } else {
        throw error;
      }
    } else {
      authData = data;
      console.log("Inicio de sesión exitoso.");
    }
  } catch (authErr) {
    console.error("Fallo de autenticación/registro:", authErr.message);
    return;
  }

  const user = authData.user;
  if (!user) {
    console.error("No se pudo obtener el objeto usuario de Supabase Auth.");
    return;
  }

  // Get tenant profile
  console.log("Obteniendo información del tenant...");
  let { data: profile, error: profileErr } = await supabase
    .from('users')
    .select('id, tenant_id, full_name')
    .eq('auth_id', user.id)
    .maybeSingle();

  if (profileErr) {
    console.error("Error obteniendo perfil:", profileErr.message);
    return;
  }

  // Auto-onboarding if user profile does not exist yet (matches frontend behavior)
  let tenantId;
  let userId;
  if (!profile) {
    console.log("No se encontró perfil de usuario, iniciando creación automática de tenant...");
    const { data: tenants } = await supabase.from('tenants').select('id').limit(1);
    tenantId = tenants?.[0]?.id;

    if (!tenantId) {
      const { data: newTenant, error: tErr } = await supabase
        .from('tenants')
        .insert({ name: 'Growco S.A.S.', slug: 'growco-sas-' + Date.now().toString().slice(-4) })
        .select()
        .single();
      if (tErr) {
        console.error("Error creando tenant:", tErr.message);
        return;
      }
      tenantId = newTenant.id;
      console.log(`Tenant creado: ${newTenant.name} (${tenantId})`);
    } else {
      console.log(`Usando tenant existente: ${tenantId}`);
    }

    const { data: newProfile, error: uErr } = await supabase
      .from('users')
      .insert({
        tenant_id: tenantId,
        auth_id: user.id,
        email: user.email || '',
        role: 'owner',
        full_name: user.user_metadata?.full_name || 'Administrador'
      })
      .select()
      .single();

    if (uErr) {
      console.error("Error creando perfil de usuario:", uErr.message);
      return;
    }
    profile = newProfile;
    userId = newProfile.id;
    console.log("Perfil de usuario creado.");
  } else {
    tenantId = profile.tenant_id;
    userId = profile.id;
    console.log(`Tenant ID: ${tenantId}`);
  }

  // Get or create location
  console.log("Verificando ubicación (sucursal)...");
  let { data: location, error: locErr } = await supabase
    .from('locations')
    .select('id')
    .eq('tenant_id', tenantId)
    .eq('is_main', true)
    .maybeSingle();

  if (locErr) {
    console.error("Error verificando sucursal:", locErr.message);
    return;
  }

  if (!location) {
    const { data: newLoc, error: newLocErr } = await supabase
      .from('locations')
      .insert({
        tenant_id: tenantId,
        name: 'Tienda Principal',
        is_main: true,
        type: 'store'
      })
      .select()
      .single();

    if (newLocErr) {
      console.error("Error creando sucursal principal:", newLocErr.message);
      return;
    }
    location = newLoc;
    console.log(`Sucursal 'Tienda Principal' creada.`);
  } else {
    console.log(`Usando sucursal principal existente: ${location.id}`);
  }

  // Fetch Google Sheets data
  console.log("\nDescargando datos del documento Google Sheets...");
  let csvText;
  try {
    const res = await fetch(csvUrl);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    csvText = await res.text();
  } catch (err) {
    console.error("Error descargando el CSV de Google Sheets:", err.message);
    return;
  }

  console.log("Procesando filas...");
  const rows = parseCSV(csvText);
  const header = rows[0];
  const dataRows = rows.slice(1);

  console.log(`Total de filas a importar: ${dataRows.length}`);

  // Step 1: Unique categories
  const categoriesSet = new Set();
  dataRows.forEach(row => {
    if (row[1]) categoriesSet.add(row[1].trim());
  });

  console.log(`Categorías únicas encontradas (${categoriesSet.size}):`, Array.from(categoriesSet));

  console.log("Importando categorías...");
  const categoriesMap = {};
  for (const catName of categoriesSet) {
    let { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('name', catName)
      .maybeSingle();

    if (!cat) {
      const { data: newCat, error: catErr } = await supabase
        .from('categories')
        .insert({ tenant_id: tenantId, name: catName })
        .select()
        .single();
      if (catErr) {
        console.error(`Error creando categoría '${catName}':`, catErr.message);
      } else {
        categoriesMap[catName] = newCat.id;
      }
    } else {
      categoriesMap[catName] = cat.id;
    }
  }

  // Step 2: Batched Product Insertion
  console.log("\nImportando productos en lotes...");
  const batchSize = 100;
  const productsToInsert = [];

  dataRows.forEach(row => {
    const name = row[0];
    const categoryName = row[1];
    const sku = row[2];
    const costPrice = parseFloat(row[6]) || 0;
    const salePrice = parseFloat(row[7]) || 0;

    if (!name || !sku) return;

    productsToInsert.push({
      tenant_id: tenantId,
      sku: sku,
      name: name,
      category_id: categoriesMap[categoryName] || null,
      brand: detectBrand(name),
      cost_price: costPrice,
      sale_price: salePrice,
      created_by: userId,
      updated_by: userId
    });
  });

  // Upsert products in batches
  const skuToIdMap = {};
  for (let i = 0; i < productsToInsert.length; i += batchSize) {
    const chunk = productsToInsert.slice(i, i + batchSize);
    const { data: inserted, error: upsertErr } = await supabase
      .from('products')
      .upsert(chunk, { onConflict: 'tenant_id,sku' })
      .select('id, sku');

    if (upsertErr) {
      console.error(`Error insertando lote de productos (${i}-${i + chunk.length}):`, upsertErr.message);
    } else if (inserted) {
      inserted.forEach(p => {
        skuToIdMap[p.sku] = p.id;
      });
      console.log(`Lote de productos importado: ${i + inserted.length}/${productsToInsert.length}`);
    }
  }

  // Step 3: Seeding Inventory & Transactions
  console.log("\nImportando inventarios y transacciones (Sell-In / Sell-Out)...");
  
  const inventoryToUpsert = [];
  const purchasesToInsert = [];
  const salesToInsert = [];
  
  dataRows.forEach(row => {
    const sku = row[2];
    const stockQty = parseInt(row[5], 10) || 0;
    const costPrice = parseFloat(row[6]) || 0;
    const salePrice = parseFloat(row[7]) || 0;
    
    const sellInQty = parseInt(row[9], 10) || 0;
    const sellInDate = row[10];
    const sellInVal = parseFloat(row[11]) || 0;
    
    const sellOutQty = parseInt(row[12], 10) || 0;
    const sellOutDate = row[13];
    const sellOutVal = parseFloat(row[14]) || 0;

    const productId = skuToIdMap[sku];
    if (!productId) return;

    inventoryToUpsert.push({
      tenant_id: tenantId,
      product_id: productId,
      location_id: location.id,
      quantity: stockQty
    });

    if (sellInQty > 0 && sellInDate) {
      purchasesToInsert.push({
        product_id: productId,
        sku: sku,
        quantity: sellInQty,
        cost: costPrice,
        total: sellInVal,
        date: parseDate(sellInDate)
      });
    }

    if (sellOutQty > 0 && sellOutDate) {
      salesToInsert.push({
        product_id: productId,
        sku: sku,
        quantity: sellOutQty,
        price: salePrice,
        total: sellOutVal,
        date: parseDate(sellOutDate)
      });
    }
  });

  // A. Upsert Inventory
  console.log(`Insertando registros de stock (${inventoryToUpsert.length})...`);
  for (let i = 0; i < inventoryToUpsert.length; i += batchSize) {
    const chunk = inventoryToUpsert.slice(i, i + batchSize);
    const { error: invErr } = await supabase
      .from('inventory')
      .upsert(chunk, { onConflict: 'product_id,location_id' });
    if (invErr) {
      console.error(`Error en inventario de lote (${i}):`, invErr.message);
    }
  }
  console.log("Inventario importado exitosamente.");

  // B. Seeding purchases
  if (purchasesToInsert.length > 0) {
    console.log(`\nImportando ${purchasesToInsert.length} compras históricas (Sell-In)...`);
    
    for (let i = 0; i < purchasesToInsert.length; i += batchSize) {
      const chunk = purchasesToInsert.slice(i, i + batchSize);
      
      const purchaseRecords = chunk.map((tx, idx) => ({
        tenant_id: tenantId,
        folio: `SI-${tx.sku}-${idx}`,
        location_id: location.id,
        status: 'received',
        subtotal: tx.total / 1.13,
        iva_amount: tx.total - (tx.total / 1.13),
        total: tx.total,
        notes: 'Importado de Google Sheets (Sell-In)',
        created_by: userId,
        created_at: tx.date
      }));

      const { data: insertedPurchases, error: txErr } = await supabase
        .from('purchases')
        .insert(purchaseRecords)
        .select('id, folio');

      if (txErr) {
        console.error(`Error creando compras lote (${i}):`, txErr.message);
        continue;
      }

      const itemsToInsert = [];
      const movementsToInsert = [];

      insertedPurchases.forEach(p => {
        const parts = p.folio.split('-');
        const sku = parts.slice(1, -1).join('-');
        const tx = chunk.find(t => t.sku === sku);

        if (tx) {
          itemsToInsert.push({
            purchase_id: p.id,
            product_id: tx.product_id,
            quantity: tx.quantity,
            unit_cost: tx.cost,
            line_total: tx.total
          });

          movementsToInsert.push({
            tenant_id: tenantId,
            product_id: tx.product_id,
            location_id: location.id,
            type: 'purchase',
            quantity: tx.quantity,
            unit_cost: tx.cost,
            reference_type: 'purchases',
            reference_id: p.id,
            notes: 'Carga histórica de compra (Sell-In)',
            created_by: userId,
            created_at: tx.date
          });
        }
      });

      if (itemsToInsert.length > 0) {
        await supabase.from('purchase_items').insert(itemsToInsert);
        await supabase.from('inventory_movements').insert(movementsToInsert);
      }
    }
    console.log("Compras importadas con éxito.");
  }

  // C. Seeding Sales
  if (salesToInsert.length > 0) {
    console.log(`\nImportando ${salesToInsert.length} ventas históricas (Sell-Out)...`);
    
    for (let i = 0; i < salesToInsert.length; i += batchSize) {
      const chunk = salesToInsert.slice(i, i + batchSize);
      
      const salesRecords = chunk.map((tx, idx) => ({
        tenant_id: tenantId,
        folio: `SO-${tx.sku}-${idx}`,
        location_id: location.id,
        status: 'paid',
        subtotal: tx.total / 1.13,
        iva_amount: tx.total - (tx.total / 1.13),
        total: tx.total,
        paid_amount: tx.total,
        payment_method: 'efectivo',
        notes: 'Importado de Google Sheets (Sell-Out)',
        created_by: userId,
        created_at: tx.date,
        paid_at: tx.date,
        confirmed_at: tx.date
      }));

      const { data: insertedSales, error: sErr } = await supabase
        .from('sales')
        .insert(salesRecords)
        .select('id, folio');

      if (sErr) {
        console.error(`Error creando ventas lote (${i}):`, sErr.message);
        continue;
      }

      const itemsToInsert = [];
      const movementsToInsert = [];

      insertedSales.forEach(s => {
        const parts = s.folio.split('-');
        const sku = parts.slice(1, -1).join('-');
        const tx = chunk.find(t => t.sku === sku);

        if (tx) {
          itemsToInsert.push({
            sale_id: s.id,
            product_id: tx.product_id,
            quantity: tx.quantity,
            unit_price: tx.price,
            line_total: tx.total,
            tax_rate: 0.13
          });

          movementsToInsert.push({
            tenant_id: tenantId,
            product_id: tx.product_id,
            location_id: location.id,
            type: 'sale',
            quantity: -tx.quantity,
            unit_cost: tx.price,
            reference_type: 'sales',
            reference_id: s.id,
            notes: 'Carga histórica de venta (Sell-Out)',
            created_by: userId,
            created_at: tx.date
          });
        }
      });

      if (itemsToInsert.length > 0) {
        await supabase.from('sale_items').insert(itemsToInsert);
        await supabase.from('inventory_movements').insert(movementsToInsert);
      }
    }
    console.log("Ventas importadas con éxito.");
  }

  console.log("\n=== IMPORTACIÓN COMPLETADA EXITOSAMENTE ===");
  console.log("Todos los productos, categorías, inventarios e historial de movimientos");
  console.log("del documento Google Sheets han sido subidos a Supabase.");
}

main();
