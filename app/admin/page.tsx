"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

const CATEGORIES = ["MiNi Fan", "Stanley tumblers", "Prayer Mat", "Beauty products", "Tables", "Decoration"];

export default function AdminDashboard() {
  // --- AUTH STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  // --- DASHBOARD STATE ---
  const [activeModule, setActiveModule] = useState<'Orders' | 'Inventory'>('Orders');
  const [isOrdersMenuOpen, setIsOrdersMenuOpen] = useState(true);

  // --- ORDERS STATE ---
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [metrics, setMetrics] = useState({ revenue: 0, pending: 0, total: 0, aov: 0 });
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'];

  // --- INVENTORY STATE ---
  const [inventory, setInventory] = useState<any[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // ✨ NEW GALLERY STATES ✨
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [productImages, setProductImages] = useState<string[]>([]);
  const [activePreviewImage, setActivePreviewImage] = useState<string>("");

  const [productForm, setProductForm] = useState({
    name: '', price: '', category: 'Decoration', tag: '', stock: '', description: ''
  });

  // --- CHECK SESSION ON LOAD ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        fetchOrders();
        fetchInventory();
      }
    });
  }, []);

  // Set the preview image whenever the gallery changes
  useEffect(() => {
    if (productImages.length > 0 && !productImages.includes(activePreviewImage)) {
      setActivePreviewImage(productImages[0]);
    } else if (productImages.length === 0) {
      setActivePreviewImage("");
    }
  }, [productImages]);

  // --- SECURE LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError("Invalid Admin Credentials.");
    } else {
      setIsAuthenticated(true);
      fetchOrders();
      fetchInventory();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  // --- FETCH DATA ---
  const fetchOrders = async () => {
    setLoadingOrders(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) {
      const formatted = data.map(o => ({ ...o, status: o.status === 'Shipped' ? 'Dispatched' : (o.status || 'Processing') }));
      setOrders(formatted);
      const valid = formatted.filter(o => o.status !== 'Cancelled');
      const rev = valid.reduce((sum, o) => sum + Number(o.total_amount), 0);
      setMetrics({ revenue: rev, pending: formatted.filter(o => o.status === 'Processing').length, total: formatted.length, aov: valid.length > 0 ? Math.round(rev / valid.length) : 0 });
    }
    setLoadingOrders(false);
  };

  const fetchInventory = async () => {
    setLoadingInventory(true);
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (data) setInventory(data);
    setLoadingInventory(false);
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setMetrics(prev => ({ ...prev, pending: newStatus === 'Processing' ? prev.pending + 1 : prev.pending - 1 }));
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  };

  // --- INVENTORY ACTIONS ---
  const openAddModal = () => {
    setEditingId(null);
    setProductForm({ name: '', price: '', category: 'Decoration', tag: '', stock: '', description: '' });
    setProductImages([]);
    setTempImageUrl('');
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingId(product.id);
    setProductForm({
      name: product.name, price: String(product.price), category: product.category, tag: product.tag || '', stock: String(product.stock), description: product.description
    });
    // Load existing gallery or fallback to the single main image
    setProductImages(product.gallery?.length ? product.gallery : (product.image ? [product.image] : []));
    setTempImageUrl('');
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to permanently remove this asset from the boutique?")) {
      await supabase.from('products').delete().eq('id', id);
      fetchInventory();
    }
  };

  // ✨ ADD IMAGE TO GALLERY ✨
  const handleAddImage = () => {
    if (tempImageUrl.trim() && !productImages.includes(tempImageUrl)) {
      setProductImages([...productImages, tempImageUrl.trim()]);
      setTempImageUrl("");
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setProductImages(productImages.filter((_, idx) => idx !== indexToRemove));
  };

  // ✨ SAVE TO SUPABASE ✨
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productImages.length === 0) {
      alert("Please add at least one image to the gallery.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        name: productForm.name,
        price: Number(productForm.price),
        category: productForm.category,
        tag: productForm.tag || null,
        stock: Number(productForm.stock),
        description: productForm.description,
        image: productImages[0], // Main image is the first one in the array
        gallery: productImages,  // Full array saved to gallery column
        rating: 5.0, reviews: 0, aiMatch: 95
      };

      if (editingId) {
        await supabase.from('products').update(payload).eq('id', editingId);
      } else {
        await supabase.from('products').insert([payload]);
      }

      setIsProductModalOpen(false);
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert("Failed to save product. Make sure you added the 'gallery' column in Supabase SQL.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredOrders = activeTab === 'All' ? orders : orders.filter(o => o.status === activeTab);

  if (!isAuthenticated) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-40"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-transparent to-zinc-950 -z-20"></div>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 animate-fade-in">
          <div className="w-full max-w-lg bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-12 shadow-[0_0_50px_rgba(147,51,234,0.15)]">
            <div className="flex justify-center mb-8">
              <img src="/cart-io-logo.png" alt="CART IO" className="h-16 w-auto object-contain brightness-0 invert" />
            </div>
            <h1 className="text-3xl font-black text-white text-center tracking-[0.2em] uppercase mb-4">Admin Portal</h1>
            <p className="text-purple-400 text-center text-xs font-bold uppercase tracking-widest mb-10 flex items-center justify-center gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(147,51,234,0.8)]"></span> Secure Authentication
            </p>
            <form onSubmit={handleLogin} className="space-y-8">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin Email" className="w-full bg-black/50 border-b border-white/20 text-white text-lg py-4 focus:outline-none focus:border-purple-500 transition-all rounded-none" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-black/50 border-b border-white/20 text-white text-lg py-4 focus:outline-none focus:border-purple-500 transition-all rounded-none" />
              {authError && <p className="text-red-500 text-xs text-center font-bold uppercase tracking-[0.2em]">{authError}</p>}
              <button type="submit" className="w-full py-6 bg-white text-black font-black text-sm uppercase tracking-[0.3em] rounded-none hover:bg-purple-600 hover:text-white transition-all">Login to Dashboard</button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-30"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/60 to-zinc-950 -z-20"></div>

      {/* ✨ MULTI-IMAGE PRODUCT MODAL ✨ */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setIsProductModalOpen(false)}></div>
          <div className="relative bg-zinc-950/80 border border-white/10 rounded-[2.5rem] w-full max-w-[1400px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            <button onClick={() => setIsProductModalOpen(false)} className="absolute top-6 right-6 w-12 h-12 bg-white/5 hover:bg-white hover:text-black text-white rounded-full flex items-center justify-center transition-all z-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {/* Left Side: Live Gallery Preview */}
            <div className="w-full lg:w-[45%] bg-black/50 border-r border-white/5 flex flex-col items-center justify-center p-12 relative overflow-y-auto custom-scrollbar">
              <p className="absolute top-8 left-8 text-xs font-black text-purple-500 uppercase tracking-[0.3em] z-10">Live Gallery Preview</p>
              
              {/* Main Preview */}
              <div className="w-full aspect-[4/5] bg-zinc-900 rounded-[2rem] border border-white/5 overflow-hidden flex items-center justify-center relative shadow-2xl mt-12 mb-6">
                {activePreviewImage ? (
                  <img src={activePreviewImage} alt="Preview" className="w-full h-full object-cover opacity-90 transition-all duration-300" />
                ) : (
                  <span className="text-sm font-bold text-zinc-600 uppercase tracking-widest">Add an image URL</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 w-full pr-12">
                  <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-1">{productForm.category || 'Category'}</p>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight truncate">{productForm.name || 'Product Title'}</h3>
                  <p className="text-xl text-white font-light">Rs. {productForm.price || '0'}</p>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {productImages.length > 0 && (
                <div className="flex gap-4 overflow-x-auto w-full pb-4 custom-scrollbar">
                  {productImages.map((img, idx) => (
                    <div key={idx} className="relative group shrink-0">
                      <button 
                        onClick={() => setActivePreviewImage(img)}
                        type="button"
                        className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activePreviewImage === img ? 'border-purple-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                      >
                        <img src={img} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-[55%] p-8 sm:p-14 overflow-y-auto custom-scrollbar">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-10">{editingId ? 'Edit Asset' : 'Add New Asset'}</h2>
              <form onSubmit={handleSaveProduct} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="md:col-span-2">
                    <input required value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} type="text" placeholder="Product Name" className="w-full bg-transparent border-b border-white/20 text-white text-xl py-4 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light rounded-none" />
                  </div>
                  <div>
                    <input required value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} type="number" placeholder="Price (Rs.)" className="w-full bg-transparent border-b border-white/20 text-white text-xl py-4 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light rounded-none" />
                  </div>
                  <div>
                    <input required value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} type="number" placeholder="Inventory Count" className="w-full bg-transparent border-b border-white/20 text-white text-xl py-4 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light rounded-none" />
                  </div>
                  <div>
                    <select required value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="w-full bg-transparent border-b border-white/20 text-white text-xl py-4 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light rounded-none cursor-pointer appearance-none">
                      {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-zinc-900 text-lg">{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <input value={productForm.tag} onChange={(e) => setProductForm({...productForm, tag: e.target.value})} type="text" placeholder="Special Tag (e.g. Rare)" className="w-full bg-transparent border-b border-white/20 text-white text-xl py-4 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light rounded-none" />
                  </div>
                  
                  {/* ✨ MULTI-IMAGE INPUT UI ✨ */}
                  <div className="md:col-span-2 bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Product Gallery ({productImages.length} Images)</p>
                    <div className="flex gap-4">
                      <input 
                        value={tempImageUrl} 
                        onChange={(e) => setTempImageUrl(e.target.value)} 
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImage(); }}}
                        type="url" 
                        placeholder="Paste Supabase Storage URL here" 
                        className="flex-1 bg-black/50 border border-white/10 text-white text-lg px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors rounded-xl font-light" 
                      />
                      <button 
                        type="button" 
                        onClick={handleAddImage}
                        className="px-8 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest rounded-xl transition-all text-xs"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <textarea required value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} placeholder="Product Description..." rows={3} className="w-full bg-transparent border-b border-white/20 text-white text-xl py-4 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light rounded-none resize-none"></textarea>
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-white text-black hover:bg-purple-600 hover:text-white font-black text-sm uppercase tracking-[0.3em] transition-all shadow-xl mt-6">
                  {isSubmitting ? 'Saving Ledger...' : (editingId ? 'Update Asset' : 'Publish Asset')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- DASHBOARD UI CONTINUES EXACTLY AS BEFORE --- */}
      <div className="min-h-screen flex pt-24 md:pt-32 relative z-10 max-w-[1600px] mx-auto">
        <div className="w-80 bg-zinc-900/40 backdrop-blur-2xl border border-white/5 hidden lg:flex flex-col h-[calc(100vh-8rem)] sticky top-24 shadow-2xl rounded-3xl ml-6 z-20 overflow-hidden">
          <div className="p-8 pb-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse"></div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Portal Status</p>
                <p className="text-sm text-white font-black uppercase tracking-wider">Online & Secure</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <h2 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] mb-6">Navigation</h2>
            <nav className="space-y-4">
              <div>
                <button onClick={() => { setActiveModule('Orders'); setIsOrdersMenuOpen(!isOrdersMenuOpen); }} className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all group ${activeModule === 'Orders' ? 'bg-purple-600/10 border border-purple-500/30 text-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.1)]' : 'bg-transparent text-zinc-500 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                  <div className="flex items-center gap-4">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    Orders
                  </div>
                  <svg className={`w-5 h-5 transition-transform duration-300 ${isOrdersMenuOpen && activeModule === 'Orders' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOrdersMenuOpen && activeModule === 'Orders' ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                  <div className="flex flex-col gap-2 pl-12 pr-2 border-l border-white/10 ml-8 space-y-1">
                    {tabs.map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={`text-left w-full px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-between group ${activeTab === tab ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50 border border-transparent'}`}>
                        {tab}
                        <span className={`px-2.5 py-1 rounded-md text-[10px] ${activeTab === tab ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-500 group-hover:text-white'}`}>
                          {tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={() => setActiveModule('Inventory')} className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all group ${activeModule === 'Inventory' ? 'bg-purple-600/10 border border-purple-500/30 text-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.1)]' : 'bg-transparent text-zinc-500 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                <svg className="w-5 h-5 group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                Inventory
              </button>

              <Link href="/admin/chat" className="flex items-center gap-4 px-6 py-5 bg-transparent text-zinc-500 hover:bg-white/5 hover:text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-all group mt-2">
                <svg className="w-5 h-5 group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                Customer Chat
              </Link>
            </nav>
          </div>

          <div className="p-8 pt-4 border-t border-white/5 mt-auto">
            <button onClick={handleSignOut} className="w-full py-5 bg-transparent border border-zinc-700 text-zinc-400 text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-8 lg:p-12 overflow-x-hidden relative z-10">
          
          {activeModule === 'Orders' && (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase">Order Ledger</h1>
                  <p className="text-zinc-400 mt-2 text-base md:text-lg font-light tracking-wide">{activeTab === 'All' ? 'Showing all incoming orders.' : `Currently viewing: ${activeTab}`}</p>
                </div>
                <button onClick={fetchOrders} className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 rounded-2xl text-xs md:text-sm font-black text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  Refresh Data
                </button>
              </div>

              {/* METRICS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-xl relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors"></div>
                  <p className="text-xs md:text-sm font-black text-zinc-500 uppercase tracking-widest mb-3 relative z-10">Total Revenue</p>
                  <p className="text-4xl md:text-5xl font-black text-white relative z-10 tracking-tighter">Rs. {metrics.revenue.toLocaleString()}</p>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-xl relative overflow-hidden group hover:border-white/30 transition-colors">
                  <p className="text-xs md:text-sm font-black text-zinc-500 uppercase tracking-widest mb-3 relative z-10">Average Order Value</p>
                  <p className="text-4xl md:text-5xl font-black text-white relative z-10 tracking-tighter">Rs. {metrics.aov.toLocaleString()}</p>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-xl relative overflow-hidden group hover:border-white/30 transition-colors">
                  <p className="text-xs md:text-sm font-black text-zinc-500 uppercase tracking-widest mb-3 relative z-10">Total Orders</p>
                  <p className="text-4xl md:text-5xl font-black text-white relative z-10 tracking-tighter">{metrics.total}</p>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-md border border-red-500/20 p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                  <p className="text-xs md:text-sm font-black text-red-400 uppercase tracking-widest mb-3 relative z-10">Action Required</p>
                  <p className="text-4xl md:text-5xl font-black text-white relative z-10 tracking-tighter flex items-center gap-4">
                    {metrics.pending}
                    {metrics.pending > 0 && <span className="relative flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span></span>}
                  </p>
                </div>
              </div>

              {/* LIST */}
              {loadingOrders ? (
                <div className="space-y-6">{[1, 2, 3].map(i => <div key={i} className="h-40 bg-zinc-900/40 backdrop-blur-md rounded-3xl animate-pulse border border-white/5"></div>)}</div>
              ) : filteredOrders.map((order) => (
                <div key={order.id} className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-[2.5rem] p-8 lg:p-10 flex flex-col xl:flex-row gap-10 shadow-2xl relative overflow-hidden transition-all duration-300 mb-8">
                  <div className={`absolute left-0 top-0 bottom-0 w-3 transition-colors ${order.status === 'Processing' ? 'bg-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.8)]' : order.status === 'Dispatched' ? 'bg-blue-500' : order.status === 'Delivered' ? 'bg-white' : 'bg-red-500'}`}></div>
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-center gap-4 mb-2">
                      <span className="text-xs font-black text-black bg-white px-4 py-1.5 rounded-lg tracking-widest uppercase">ID: {order.order_id}</span>
                      <span className="text-xs text-zinc-400 font-medium tracking-wide">{new Date(order.created_at).toLocaleString()}</span>
                    </div>
                    <div>
                      <h3 className={`text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase ${order.status === 'Cancelled' ? 'text-zinc-600 line-through' : 'text-white'}`}>{order.customer_name}</h3>
                      <p className="text-base md:text-lg text-zinc-400 font-light">{order.shipping_address}, {order.city} {order.postal_code}</p>
                    </div>
                    
                    {/* Communication Buttons */}
                    <div className="flex flex-wrap items-center gap-4 pt-4">
                      <a href={`mailto:${order.customer_email}`} className="px-6 py-4 bg-black border border-white/10 hover:border-white/30 hover:bg-white hover:text-black rounded-xl text-xs font-black text-white uppercase tracking-widest transition-all flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        Email Client
                      </a>
                      <a href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="px-6 py-4 bg-[#0b141a] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-black rounded-xl text-xs font-black text-[#25D366] uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                        WhatsApp Client
                      </a>
                    </div>
                  </div>
                  
                  <div className="xl:w-2/5 bg-black rounded-[1.5rem] p-6 md:p-8 border border-white/5">
                    <p className="text-xs font-black text-purple-400 uppercase tracking-widest mb-6">Order Items</p>
                    <div className="space-y-5 max-h-48 overflow-y-auto custom-scrollbar pr-4">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className={`flex gap-4 items-center ${order.status === 'Cancelled' ? 'opacity-50 grayscale' : ''}`}>
                          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover opacity-90 border border-white/10" />
                          <p className="text-base text-zinc-300 leading-tight"><span className="font-black text-white mr-3">{item.quantity}x</span> {item.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="xl:w-64 flex flex-col justify-between border-t xl:border-t-0 xl:border-l border-white/10 pt-8 xl:pt-0 xl:pl-10">
                    <div>
                      <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Total</p>
                      <p className={`text-4xl font-black mb-3 tracking-tighter ${order.status === 'Cancelled' ? 'text-zinc-600 line-through' : 'text-white'}`}>Rs. {order.total_amount.toLocaleString()}</p>
                    </div>
                    <div className="mt-8">
                      <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className={`w-full text-xs font-black uppercase tracking-[0.2em] rounded-xl py-5 px-4 outline-none cursor-pointer appearance-none text-center transition-all ${
                          order.status === 'Processing' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' :
                          order.status === 'Dispatched' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                          order.status === 'Delivered' ? 'bg-white/20 text-white border border-white/50' :
                          'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}>
                        <option value="Processing" className="bg-zinc-900 text-white">Processing</option>
                        <option value="Dispatched" className="bg-zinc-900 text-white">Dispatched</option>
                        <option value="Delivered" className="bg-zinc-900 text-white">Delivered</option>
                        <option value="Cancelled" className="bg-zinc-900 text-white">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* INVENTORY VIEW */}
          {activeModule === 'Inventory' && (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase">Inventory Ledger</h1>
                  <p className="text-zinc-400 mt-2 text-base md:text-lg font-light tracking-wide">Manage your luxury assets.</p>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-3 px-8 py-5 bg-white text-black hover:bg-purple-600 hover:text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl group">
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                  Add New Asset
                </button>
              </div>

              {loadingInventory ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => <div key={i} className="h-80 bg-zinc-900/40 rounded-[2rem] animate-pulse border border-white/5"></div>)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {inventory.map(product => (
                    <div key={product.id} className="bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:border-white/20 rounded-[2rem] overflow-hidden flex flex-col group transition-all duration-300">
                      <div className="w-full aspect-[4/3] bg-black p-8 flex items-center justify-center relative">
                        <img src={product.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 left-4 bg-white text-black text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">{product.category}</div>
                      </div>
                      <div className="p-6 md:p-8 flex flex-col flex-1">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 truncate">{product.name}</h3>
                        <p className="text-xl text-purple-400 font-light mb-6">Rs. {product.price.toLocaleString()}</p>
                        <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-6">
                          <span className={`text-xs font-bold uppercase tracking-widest ${product.stock > 0 ? 'text-zinc-400' : 'text-red-500'}`}>
                            {product.stock} in stock
                          </span>
                          <div className="flex gap-2">
                            <button onClick={() => openEditModal(product)} className="w-10 h-10 bg-white/10 hover:bg-white hover:text-black text-white rounded-full flex items-center justify-center transition-all">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="w-10 h-10 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full flex items-center justify-center transition-all">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
}