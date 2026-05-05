"use client";

import { useState } from "react";
import { demoProducts } from "@/lib/demo-data";
import { 
  Search, Plus, Minus, Trash2, ShoppingCart, 
  CreditCard, Banknote, Landmark, ArrowRight, User
} from "lucide-react";

interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  maxStock: number;
}

export default function PosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "tarjeta" | "transferencia">("tarjeta");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter products for catalog
  const filteredProducts = demoProducts.filter(p => 
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
    p.stock > 0
  );

  // Cart actions
  const addToCart = (product: typeof demoProducts[0]) => {
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

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      alert("¡Venta procesada con éxito!");
      setCart([]);
      setIsProcessing(false);
    }, 800);
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxes = subtotal * 0.13; // 13% tax example
  const total = subtotal + taxes;

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

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-[rgb(var(--bg-base))]">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <button 
                key={product.sku}
                onClick={() => addToCart(product)}
                className="flex flex-col text-left bg-white p-4 rounded-[24px] border border-[rgb(var(--border))] hover:border-[rgb(var(--cyan-bright))] hover:shadow-[0_8px_24px_rgba(0,209,255,0.15)] transition-all group"
              >
                <div className="flex justify-between items-start w-full mb-3">
                  <span className="badge-pill bg-[rgb(var(--bg-muted))] text-[rgb(var(--text-secondary))]">{product.category}</span>
                  <span className="text-[10px] font-bold text-[rgb(var(--text-dim))]">Stock: {product.stock}</span>
                </div>
                <div className="font-bold text-[rgb(var(--bg-dark))] line-clamp-2 min-h-[40px] leading-tight">
                  {product.name}
                </div>
                <div className="mt-auto pt-4 flex items-center justify-between w-full">
                  <span className="font-mono-price text-lg font-black text-[rgb(var(--cyan-bright))] group-hover:text-[rgb(var(--blue-deep))] transition-colors">
                    ${product.salePrice.toFixed(2)}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-[rgb(var(--bg-muted))] flex items-center justify-center group-hover:bg-[rgb(var(--cyan))] group-hover:text-white transition-colors">
                    <Plus className="h-4 w-4" />
                  </div>
                </div>
              </button>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-10 text-center text-[rgb(var(--text-dim))] font-bold">
                No se encontraron productos
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: CART / TICKET */}
      <div className="w-full lg:w-[400px] flex flex-col min-h-0 bg-[rgb(var(--bg-dark))] rounded-[32px] shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-tr from-[rgb(var(--cyan-bright))] to-[rgb(var(--blue-deep))] blur-[80px] opacity-20 rounded-full pointer-events-none"></div>

        {/* Cart Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl glass-cyan flex items-center justify-center text-white">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black text-white">Ticket</h2>
          </div>
          <button className="text-white/50 hover:text-white transition-colors">
            <User className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 z-10 relative space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/30 p-6 text-center">
              <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
              <p className="font-bold text-sm">El carrito está vacío</p>
              <p className="text-xs mt-1">Busca un producto y agrégalo</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.sku} className="bg-white/5 border border-white/10 rounded-[20px] p-3 flex flex-col gap-3 backdrop-blur-sm">
                <div className="flex justify-between items-start gap-2">
                  <div className="font-bold text-white text-sm leading-tight">{item.name}</div>
                  <button onClick={() => removeFromCart(item.sku)} className="text-white/30 hover:text-[rgb(var(--red-main))] transition-colors shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex justify-between items-end">
                  <div className="font-mono-price font-bold text-[rgb(var(--cyan-bright))]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-3 bg-black/20 rounded-full px-2 py-1 border border-white/5">
                    <button 
                      onClick={() => updateQuantity(item.sku, -1)}
                      className="text-white/50 hover:text-white transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-bold text-white text-sm min-w-[1rem] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.sku, 1)}
                      className="text-white/50 hover:text-white transition-colors"
                    >
                      <Plus className="h-4 w-4" />
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
            {[
              { id: "efectivo", icon: Banknote, label: "Efectivo" },
              { id: "tarjeta", icon: CreditCard, label: "Tarjeta" },
              { id: "transferencia", icon: Landmark, label: "Transf." },
            ].map(pm => (
              <button
                key={pm.id}
                onClick={() => setPaymentMethod(pm.id as any)}
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
