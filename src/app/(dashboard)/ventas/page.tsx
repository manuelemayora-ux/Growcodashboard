"use client";

import { useState } from "react";
import { useProductos, Product } from "@/hooks/useProductos";
import { useVentas, CartItem } from "@/hooks/useVentas";
import { 
  Search, Plus, Minus, Trash2, ShoppingCart, 
  CreditCard, Banknote, Landmark, ArrowRight
} from "lucide-react";

const paymentMethods = [
  { id: "efectivo" as const, icon: Banknote, label: "Efectivo" },
  { id: "tarjeta" as const, icon: CreditCard, label: "Tarjeta" },
  { id: "transferencia" as const, icon: Landmark, label: "Transf." },
] as const;

export default function PosPage() {
  const { products, isLoading: productsLoading } = useProductos();
  const { checkoutSale } = useVentas();

  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "tarjeta" | "transferencia">("tarjeta");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter products for catalog
  const filteredProducts = products.filter(p => 
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
    p.stock > 0
  );

  // Cart actions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.sku === product.sku);
      if (existing) {
        if (existing.quantity >= product.stock) return prev; // Cannot exceed stock
        return prev.map(item => 
          item.sku === product.sku 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { 
        sku: product.sku, 
        name: product.name, 
        price: product.salePrice, 
        quantity: 1, 
        maxStock: product.stock 
      }];
    });
  };

  const updateQuantity = (sku: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.sku === sku) {
        const newQ = item.quantity + delta;
        if (newQ > 0 && newQ <= item.maxStock) {
          return { ...item, quantity: newQ };
        }
      }
      return item;
    }));
  };

  const removeFromCart = (sku: string) => {
    setCart(prev => prev.filter(item => item.sku !== sku));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      await checkoutSale.mutateAsync({
        cart,
        paymentMethod,
        subtotal,
        taxes,
        total
      });
      alert("¡Venta procesada con éxito!");
      setCart([]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert("Error al cobrar la venta: " + msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxes = subtotal * 0.13; // 13% tax example
  const total = subtotal + taxes;

  if (productsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[rgb(var(--cyan))] border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm font-semibold" style={{color:'rgb(var(--text-secondary))'}}>Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-fade-up">
      
      {/* LEFT PANEL: CATALOG */}
      <div className="flex-1 flex flex-col min-h-0 bg-white rounded-[32px] border border-[rgb(var(--border))] shadow-sm overflow-hidden">
        {/* Header & Search */}
        <div className="p-6 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg-base))]">
          <h1 className="text-2xl font-black text-[rgb(var(--bg-dark))] mb-4">Nueva Venta</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[rgb(var(--text-dim))]" />
            <input
              type="text"
              placeholder="Buscar por nombre o código de barra (SKU)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-[20px] border-[2px] border-white bg-white px-5 py-4 pl-12 text-base outline-none transition-all font-semibold focus:border-[rgb(var(--cyan))] focus:shadow-[0_0_0_4px_rgba(0,209,255,0.15)]"
            />
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-[rgb(var(--bg-base))]">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[rgb(var(--text-dim))]">
              <ShoppingCart className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm font-semibold">No se encontraron productos disponibles</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="bento-card bg-white p-5 cursor-pointer hover:shadow-lg hover:border-[rgb(var(--cyan-dim))] transition-all flex flex-col justify-between h-40 group"
                >
                  <div>
                    <span className="badge-pill badge-cyan text-[10px]">{p.category_name}</span>
                    <h3 className="font-bold text-[rgb(var(--bg-dark))] mt-2 line-clamp-1 group-hover:text-[rgb(var(--cyan-bright))] transition-colors">{p.name}</h3>
                    <p className="text-xs font-mono text-[rgb(var(--text-dim))] mt-1">{p.sku}</p>
                  </div>
                  <div className="flex items-end justify-between mt-4">
                    <span className="text-xl font-extrabold text-[rgb(var(--bg-dark))] font-mono-price">${p.salePrice.toFixed(2)}</span>
                    <span className="text-xs font-bold text-[rgb(var(--text-dim))] bg-[rgb(var(--bg-input))] px-2.5 py-1 rounded-xl">{p.stock} uds</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: CART & CHECKOUT */}
      <div className="w-full lg:w-[420px] flex flex-col min-h-0 bg-[rgb(var(--bg-dark))] rounded-[32px] shadow-xl overflow-hidden relative border border-white/5">
        
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[rgb(var(--cyan))] blur-[120px] opacity-10 pointer-events-none rounded-full"></div>

        {/* Cart Header */}
        <div className="p-6 border-b border-white/5 z-10 relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl glass-cyan flex items-center justify-center text-white"><ShoppingCart className="h-5 w-5" /></div>
            <h2 className="text-xl font-black text-white">Detalle de Venta</h2>
          </div>
          <span className="badge-pill badge-lime text-xs font-black">{cart.reduce((s,i)=>s+i.quantity,0)} items</span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 z-10 relative">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/20">
              <ShoppingCart className="h-16 w-16 mb-4 animate-bounce" />
              <p className="text-sm font-semibold">El carrito está vacío</p>
              <p className="text-xs mt-1 opacity-60">Selecciona productos de la izquierda</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.sku} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                  <p className="text-xs font-mono text-white/40 mt-0.5">{item.sku}</p>
                  <div className="text-sm font-extrabold text-[rgb(var(--cyan-bright))] font-mono-price mt-2">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <button 
                    onClick={() => removeFromCart(item.sku)}
                    className="text-white/30 hover:text-[rgb(var(--red-main))] transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-1 bg-white/5 rounded-xl border border-white/10 p-1">
                    <button 
                      onClick={() => updateQuantity(item.sku, -1)}
                      className="h-6 w-6 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-extrabold text-white font-mono-price">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.sku, 1)}
                      className="h-6 w-6 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer / Checkout */}
        <div className="p-6 bg-black/40 backdrop-blur-xl border-t border-white/10 z-10 relative">
          
          {/* Totals */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-white/50 text-sm font-bold">
              <span>Subtotal</span>
              <span className="font-mono-price">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white/50 text-sm font-bold">
              <span>Impuestos (13%)</span>
              <span className="font-mono-price">${taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white text-2xl font-black mt-2 pt-2 border-t border-white/10">
              <span>Total</span>
              <span className="font-mono-price text-[rgb(var(--accent))]">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {paymentMethods.map(pm => (
              <button
                key={pm.id}
                onClick={() => setPaymentMethod(pm.id)}
                className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border transition-all ${
                  paymentMethod === pm.id 
                    ? "bg-[rgb(var(--cyan))] border-[rgb(var(--cyan-bright))] text-white shadow-[0_4px_12px_rgba(0,209,255,0.3)]" 
                    : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                <pm.icon className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase">{pm.label}</span>
              </button>
            ))}
          </div>

          {/* Checkout Button */}
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className="w-full flex items-center justify-between p-4 rounded-[20px] font-black text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed
              bg-gradient-to-r from-[rgb(var(--accent))] to-[#e5ff66] text-[rgb(var(--bg-dark))] hover:shadow-[0_10px_30px_rgba(204,255,0,0.3)] hover:scale-[1.02]"
          >
            <span>{isProcessing ? "Procesando..." : "Cobrar"}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono-price">${total.toFixed(2)}</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
