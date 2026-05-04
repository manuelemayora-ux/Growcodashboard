-- ============================================================
-- STOCKLY — Esquema inicial de base de datos
-- Multi-tenant con RLS, soft delete, auditoría
-- ============================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. TENANTS — Organizaciones/empresas
-- ============================================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  vertical TEXT NOT NULL DEFAULT 'generico'
    CHECK (vertical IN ('llantas','ropa','ferreteria','abarrotes','generico')),
  settings JSONB DEFAULT '{}',
  plan TEXT NOT NULL DEFAULT 'free'
    CHECK (plan IN ('free','starter','pro','enterprise')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','suspended','cancelled')),
  fiscal_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- 2. USERS — Usuarios del sistema
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  auth_id UUID UNIQUE NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer'
    CHECK (role IN ('owner','admin','manager','seller','viewer')),
  full_name TEXT NOT NULL,
  phone TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- 3. LOCATIONS — Sucursales y bodegas
-- ============================================================
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'store'
    CHECK (type IN ('store','warehouse')),
  address TEXT,
  is_main BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- 4. CATEGORIES — Categorías de productos
-- ============================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES categories(id),
  color TEXT DEFAULT '#3b7dd8',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- 5. SUPPLIERS — Proveedores
-- ============================================================
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nrc TEXT,
  nit TEXT,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  payment_terms_days INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- 6. PRODUCTS — Productos
-- ============================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  barcode TEXT,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  brand TEXT,
  base_unit TEXT DEFAULT 'unidad',
  cost_price NUMERIC(12,2) DEFAULT 0,
  sale_price NUMERIC(12,2) DEFAULT 0,
  wholesale_price NUMERIC(12,2),
  distributor_price NUMERIC(12,2),
  min_stock INT DEFAULT 0,
  max_stock INT,
  attributes JSONB DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  tax_rate NUMERIC(5,4) DEFAULT 0.13,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, sku)
);

-- ============================================================
-- 7. PRODUCT_VARIANTS — Variantes de productos
-- ============================================================
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  attributes JSONB DEFAULT '{}',
  price_overrides JSONB DEFAULT '{}',
  barcode TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, sku)
);

-- ============================================================
-- 8. INVENTORY — Stock por ubicación
-- ============================================================
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 0,
  reserved_quantity INT NOT NULL DEFAULT 0,
  last_count_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, variant_id, location_id)
);

-- ============================================================
-- 9. INVENTORY_MOVEMENTS — Historial de movimientos
-- ============================================================
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  location_id UUID NOT NULL REFERENCES locations(id),
  type TEXT NOT NULL
    CHECK (type IN ('purchase','sale','adjustment','transfer_in','transfer_out','return')),
  quantity INT NOT NULL,
  unit_cost NUMERIC(12,2),
  reference_type TEXT,
  reference_id UUID,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 10. CUSTOMERS — Clientes
-- ============================================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  document_type TEXT CHECK (document_type IN ('dui','nit','passport')),
  document_number TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  customer_type TEXT NOT NULL DEFAULT 'final'
    CHECK (customer_type IN ('final','ccf','exento')),
  credit_limit NUMERIC(12,2) DEFAULT 0,
  credit_days INT DEFAULT 0,
  current_balance NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- 11. SALES — Ventas / Documentos de venta
-- ============================================================
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  folio TEXT,
  document_type TEXT NOT NULL DEFAULT 'factura'
    CHECK (document_type IN ('factura','ccf','nota_remision')),
  customer_id UUID REFERENCES customers(id),
  location_id UUID REFERENCES locations(id),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('quote','draft','confirmed','dte_pending','dte_emitted','paid','cancelled')),
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  iva_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  dte_data JSONB DEFAULT '{}',
  notes TEXT,
  created_by UUID REFERENCES users(id),
  confirmed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- 12. SALE_ITEMS — Líneas de venta
-- ============================================================
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  tax_rate NUMERIC(5,4) DEFAULT 0.13,
  line_total NUMERIC(12,2) NOT NULL DEFAULT 0
);

-- ============================================================
-- 13. PURCHASES — Compras a proveedores
-- ============================================================
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  folio TEXT,
  supplier_id UUID REFERENCES suppliers(id),
  location_id UUID REFERENCES locations(id),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','confirmed','received','cancelled')),
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  iva_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  supplier_invoice_number TEXT,
  supplier_invoice_date DATE,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- 14. PURCHASE_ITEMS — Líneas de compra
-- ============================================================
CREATE TABLE purchase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INT NOT NULL DEFAULT 1,
  unit_cost NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL DEFAULT 0
);

-- ============================================================
-- 15. PAYMENTS — Pagos recibidos
-- ============================================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES sales(id),
  customer_id UUID REFERENCES customers(id),
  amount NUMERIC(12,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cash'
    CHECK (payment_method IN ('cash','card','transfer','check')),
  reference TEXT,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 16. AUDIT_LOG — Registro de auditoría
-- ============================================================
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_auth ON users(auth_id);
CREATE INDEX idx_locations_tenant ON locations(tenant_id);
CREATE INDEX idx_categories_tenant ON categories(tenant_id);
CREATE INDEX idx_suppliers_tenant ON suppliers(tenant_id);
CREATE INDEX idx_products_tenant_sku ON products(tenant_id, sku);
CREATE INDEX idx_products_tenant_barcode ON products(tenant_id, barcode);
CREATE INDEX idx_products_tenant_name ON products(tenant_id, name);
CREATE INDEX idx_products_tenant_category ON products(tenant_id, category_id);
CREATE INDEX idx_product_variants_tenant ON product_variants(tenant_id);
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_inventory_tenant_product ON inventory(tenant_id, product_id, location_id);
CREATE INDEX idx_inventory_movements_tenant ON inventory_movements(tenant_id, created_at DESC);
CREATE INDEX idx_inventory_movements_product ON inventory_movements(product_id, created_at DESC);
CREATE INDEX idx_customers_tenant ON customers(tenant_id);
CREATE INDEX idx_customers_tenant_doc ON customers(tenant_id, document_number);
CREATE INDEX idx_sales_tenant_created ON sales(tenant_id, created_at DESC);
CREATE INDEX idx_sales_tenant_customer ON sales(tenant_id, customer_id);
CREATE INDEX idx_sales_tenant_status ON sales(tenant_id, status);
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_purchases_tenant ON purchases(tenant_id, created_at DESC);
CREATE INDEX idx_purchase_items_purchase ON purchase_items(purchase_id);
CREATE INDEX idx_payments_tenant ON payments(tenant_id, created_at DESC);
CREATE INDEX idx_payments_sale ON payments(sale_id);
CREATE INDEX idx_audit_log_tenant ON audit_log(tenant_id, created_at DESC);
CREATE INDEX idx_audit_log_entity ON audit_log(tenant_id, entity_type, entity_id);

-- ============================================================
-- FUNCIÓN: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'tenants','users','locations','categories','suppliers',
    'products','product_variants','inventory','customers',
    'sales','purchases'
  ])
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
      tbl, tbl
    );
  END LOOP;
END $$;

-- ============================================================
-- RLS — Row Level Security en TODAS las tablas
-- ============================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Función helper: obtener tenant_id del usuario actual
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM users WHERE auth_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Políticas RLS de tenant isolation
-- Patrón: cada tabla solo permite ver/editar filas del mismo tenant

CREATE POLICY "tenant_isolation" ON users
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "tenant_isolation" ON locations
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "tenant_isolation" ON categories
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "tenant_isolation" ON suppliers
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "tenant_isolation" ON products
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "tenant_isolation" ON product_variants
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "tenant_isolation" ON inventory
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "tenant_isolation" ON inventory_movements
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "tenant_isolation" ON customers
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "tenant_isolation" ON sales
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "tenant_isolation" ON sale_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM sales WHERE sales.id = sale_items.sale_id AND sales.tenant_id = get_current_tenant_id())
  );

CREATE POLICY "tenant_isolation" ON purchases
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "tenant_isolation" ON purchase_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM purchases WHERE purchases.id = purchase_items.purchase_id AND purchases.tenant_id = get_current_tenant_id())
  );

CREATE POLICY "tenant_isolation" ON payments
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY "tenant_isolation" ON audit_log
  FOR ALL USING (tenant_id = get_current_tenant_id());

-- Tenants: el owner puede ver su propio tenant
CREATE POLICY "tenant_self" ON tenants
  FOR ALL USING (id = get_current_tenant_id());

-- ============================================================
-- FUNCIÓN: Auditoría automática
-- ============================================================
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
  current_user_id UUID;
  current_tenant UUID;
BEGIN
  SELECT id, tenant_id INTO current_user_id, current_tenant
  FROM users WHERE auth_id = auth.uid() LIMIT 1;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (tenant_id, user_id, action, entity_type, entity_id, new_values)
    VALUES (current_tenant, current_user_id, 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (tenant_id, user_id, action, entity_type, entity_id, old_values, new_values)
    VALUES (current_tenant, current_user_id, 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (tenant_id, user_id, action, entity_type, entity_id, old_values)
    VALUES (current_tenant, current_user_id, 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar audit triggers a tablas principales
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'products','sales','purchases','customers','suppliers',
    'inventory','locations','categories'
  ])
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_audit AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION audit_trigger_func()',
      tbl, tbl
    );
  END LOOP;
END $$;
