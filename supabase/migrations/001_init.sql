-- Enum catégories
CREATE TYPE product_category AS ENUM (
  'Vénitien','Loup','Colombine','Bauta','Papillon',
  'Intégral','Demi-visage','Plumes','Arlequin','Baroque',
  'Fantôme','Floral','Métallique','Minimaliste'
);

-- Produits
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  category product_category NOT NULL,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Variantes couleur
CREATE TABLE product_variants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  color_name text NOT NULL,
  color_hex text NOT NULL,
  photo_url text,
  stock integer DEFAULT 0,
  position integer DEFAULT 0
);

-- Commandes
CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_email text NOT NULL,
  client_name text,
  shipping_address jsonb,
  status text DEFAULT 'pending',
  total numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Lignes de commande
CREATE TABLE order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  variant_id uuid REFERENCES product_variants(id),
  quantity integer NOT NULL,
  price_at_purchase numeric(10,2) NOT NULL
);

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Produits publiés visibles par tous
CREATE POLICY "public_products" ON products FOR SELECT USING (is_published = true);
CREATE POLICY "public_variants" ON product_variants FOR SELECT USING (true);

-- Commandes : insert public, lecture service role
CREATE POLICY "insert_orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "insert_order_items" ON order_items FOR INSERT WITH CHECK (true);
