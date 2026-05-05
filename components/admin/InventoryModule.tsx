"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

type Category = {
  id: number;
  name: string;
};

type Promotion = {
  id: number;
  title: string;
  image: string;
  link: string;
  is_active: boolean;
};

export default function InventoryModule() {
  // --- TABS ---
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'promotions'>('products');

  // --- PRODUCT STATES ---
  const [inventory, setInventory] = useState<any[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [productImages, setProductImages] = useState<string[]>([]);
  const [activePreviewImage, setActivePreviewImage] = useState<string>("");

  // ✨ ADDED original_price TO FORM ✨
  const [productForm, setProductForm] = useState({
    name: '', price: '', original_price: '', category: '', tag: '', stock: '', description: '', colors: '', allowCustomText: false
  });

  // --- CATEGORY STATES ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryInput, setCategoryInput] = useState("");

  // --- PROMOTION STATES ---
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loadingPromotions, setLoadingPromotions] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isSubmittingPromo, setIsSubmittingPromo] = useState(false);
  const [promoForm, setPromoForm] = useState({ title: '', image: '', link: '', is_active: false });

  useEffect(() => {
    fetchInventory();
    fetchCategories();
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (productImages.length > 0 && !productImages.includes(activePreviewImage)) {
      setActivePreviewImage(productImages[0]);
    } else if (productImages.length === 0) {
      setActivePreviewImage("");
    }
  }, [productImages]);

  // =====================
  // FETCHING
  // =====================
  const fetchInventory = async () => {
    setLoadingInventory(true);
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (data) setInventory(data);
    setLoadingInventory(false);
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (data && !error) {
      setCategories(data);
      if (data.length > 0 && !productForm.category) {
        setProductForm(prev => ({ ...prev, category: data[0].name }));
      }
    }
    setLoadingCategories(false);
  };

  const fetchPromotions = async () => {
    setLoadingPromotions(true);
    const { data } = await supabase.from('promotional_banners').select('*').order('id', { ascending: false });
    if (data) setPromotions(data);
    setLoadingPromotions(false);
  };

  // =====================
  // PROMOTIONS LOGIC
  // =====================
  const handleSavePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.image || !promoForm.title) return alert("Image and Title are required.");
    
    setIsSubmittingPromo(true);
    try {
      const payload = { ...promoForm };
      await supabase.from('promotional_banners').insert([payload]);
      
      setIsPromoModalOpen(false);
      setPromoForm({ title: '', image: '', link: '', is_active: false });
      fetchPromotions();
    } catch (err) {
      alert("Failed to save promotion.");
    } finally {
      setIsSubmittingPromo(false);
    }
  };

  const togglePromoActive = async (id: number, currentState: boolean) => {
    await supabase.from('promotional_banners').update({ is_active: !currentState }).eq('id', id);
    fetchPromotions();
  };

  const handleDeletePromotion = async (id: number) => {
    if (confirm("Delete this promotional banner?")) {
      await supabase.from('promotional_banners').delete().eq('id', id);
      fetchPromotions();
    }
  };

  // =====================
  // CATEGORY LOGIC
  // =====================
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryInput("");
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryInput(cat.name);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryInput.trim()) return;
    
    setIsSubmittingCategory(true);
    try {
      if (editingCategory) {
        await supabase.from('categories').update({ name: categoryInput.trim() }).eq('id', editingCategory.id);
        await supabase.from('products').update({ category: categoryInput.trim() }).eq('category', editingCategory.name);
      } else {
        const { error } = await supabase.from('categories').insert([{ name: categoryInput.trim() }]);
        if (error && error.code !== '23505') throw error; 
      }
      
      setIsCategoryModalOpen(false);
      fetchCategories();
      fetchInventory(); 
    } catch (err) {
      alert("Failed to save department.");
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    const productsInCat = inventory.filter(p => p.category === cat.name).length;
    
    const confirmMsg = `CRITICAL WARNING:\n\nAre you sure you want to delete the "${cat.name}" department?\n\nThis will permanently nuke ALL ${productsInCat} assets currently inside this category. This action cannot be undone.`;
    
    if (confirm(confirmMsg)) {
      try {
        if (productsInCat > 0) {
          await supabase.from('products').delete().eq('category', cat.name);
        }
        await supabase.from('categories').delete().eq('id', cat.id);
        
        fetchCategories();
        fetchInventory();
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
  };

  // =====================
  // PRODUCT LOGIC
  // =====================
  const openAddProductModal = () => {
    if (categories.length === 0) {
      alert("Please create a Department (Category) first!");
      setActiveTab('categories');
      return;
    }
    setEditingId(null);
    // ✨ ADDED original_price ✨
    setProductForm({ 
      name: '', price: '', original_price: '', category: categories[0].name, tag: '', stock: '', description: '', colors: '', allowCustomText: false 
    });
    setProductImages([]);
    setTempImageUrl('');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: any) => {
    setEditingId(product.id);
    // ✨ ADDED original_price ✨
    setProductForm({
      name: product.name, 
      price: String(product.price), 
      original_price: product.original_price ? String(product.original_price) : '', 
      category: product.category, 
      tag: product.tag || '', 
      stock: String(product.stock), 
      description: product.description, 
      colors: product.colors ? product.colors.join(', ') : '', 
      allowCustomText: product.allowCustomText || false
    });
    setProductImages(product.gallery?.length ? product.gallery : (product.image ? [product.image] : []));
    setTempImageUrl('');
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Permanently remove this asset from the boutique?")) {
      await supabase.from('products').delete().eq('id', id);
      fetchInventory();
    }
  };

  const handleAddImage = () => {
    if (tempImageUrl.trim() && !productImages.includes(tempImageUrl)) {
      setProductImages([...productImages, tempImageUrl.trim()]);
      setTempImageUrl("");
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setProductImages(productImages.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productImages.length === 0) {
      alert("Please add at least one image to the gallery.");
      return;
    }
    
    setIsSubmittingProduct(true);
    try {
      const colorsArray = productForm.colors.trim() ? productForm.colors.split(',').map(c => c.trim()).filter(c => c !== '') : null;

      // ✨ UPDATED PAYLOAD TO INCLUDE original_price ✨
      const payload = {
        name: productForm.name, 
        price: Number(productForm.price), 
        original_price: productForm.original_price ? Number(productForm.original_price) : null,
        category: productForm.category, 
        tag: productForm.tag || null, 
        stock: Number(productForm.stock), 
        description: productForm.description, 
        image: productImages[0], 
        gallery: productImages, 
        colors: colorsArray, 
        allowCustomText: productForm.allowCustomText, 
        rating: 5.0, 
        reviews: 0, 
        aiMatch: 95
      };

      if (editingId) {
        await supabase.from('products').update(payload).eq('id', editingId);
      } else {
        await supabase.from('products').insert([payload]);
      }

      setIsProductModalOpen(false);
      fetchInventory();
    } catch (err: any) {
      console.error(err);
      alert(`Database Error: ${err.message}`);
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase">Operations</h1>
          
          {/* TAB NAVIGATION */}
          <div className="flex gap-4 mt-6 flex-wrap">
            <button 
              onClick={() => setActiveTab('products')} 
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-zinc-900 text-zinc-500 hover:text-white border border-white/5'}`}
            >
              ITEMS
            </button>
            <button 
              onClick={() => setActiveTab('categories')} 
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-zinc-900 text-zinc-500 hover:text-white border border-white/5'}`}
            >
              Categories
            </button>
            <button 
              onClick={() => setActiveTab('promotions')} 
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'promotions' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-zinc-900 text-zinc-500 hover:text-white border border-white/5'}`}
            >
              Promotions
            </button>
          </div>
        </div>
        
        {/* Dynamic Context Button */}
        {activeTab === 'products' && (
          <button onClick={openAddProductModal} className="flex items-center gap-3 px-8 py-5 bg-white text-black hover:bg-purple-600 hover:text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl">
            Add New ITEM
          </button>
        )}
        {activeTab === 'categories' && (
          <button onClick={openAddCategoryModal} className="flex items-center gap-3 px-8 py-5 bg-zinc-800 text-white hover:bg-white hover:text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl border border-white/10">
            Create a new Category
          </button>
        )}
        {activeTab === 'promotions' && (
          <button onClick={() => setIsPromoModalOpen(true)} className="flex items-center gap-3 px-8 py-5 bg-orange-500 text-white hover:bg-white hover:text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]">
            Deploy Sale Banner
          </button>
        )}
      </div>

      {/* ========================================= */}
      {/* PRODUCTS TAB VIEW */}
      {/* ========================================= */}
      {activeTab === 'products' && (
        <>
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
                    
                    {/* ✨ SALE BADGE IN GRID PREVIEW ✨ */}
                    {product.original_price && product.original_price > product.price && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg animate-pulse">SALE</div>
                    )}
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 truncate">{product.name}</h3>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <p className="text-xl text-purple-400 font-light">Rs. {product.price.toLocaleString()}</p>
                      {/* ✨ SHOW ORIGINAL PRICE CROSSED OUT ✨ */}
                      {product.original_price && product.original_price > product.price && (
                        <p className="text-sm text-zinc-500 line-through">Rs. {product.original_price.toLocaleString()}</p>
                      )}
                    </div>

                    <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-6">
                      <span className={`text-xs font-bold uppercase tracking-widest ${product.stock > 0 ? 'text-zinc-400' : 'text-red-500'}`}>
                        {product.stock} in stock
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => openEditProductModal(product)} className="w-10 h-10 bg-white/10 hover:bg-white hover:text-black text-white rounded-full flex items-center justify-center transition-all">
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

      {/* ========================================= */}
      {/* CATEGORIES TAB VIEW */}
      {/* ========================================= */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {loadingCategories ? (
             [1, 2, 3].map(i => <div key={i} className="h-40 bg-zinc-900/40 rounded-[2rem] animate-pulse border border-white/5"></div>)
          ) : (
            categories.map(cat => {
              const productCount = inventory.filter(p => p.category === cat.name).length;
              return (
                <div key={cat.id} className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2rem] hover:border-purple-500/30 transition-colors group flex flex-col justify-between h-48">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-wider truncate mb-1">{cat.name}</h3>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{productCount} Assets Active</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditCategoryModal(cat)} className="flex-1 py-3 bg-white/5 hover:bg-white hover:text-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteCategory(cat)} className="w-12 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all" title="Nuke Category & Products">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* ========================================= */}
      {/* PROMOTIONS TAB VIEW */}
      {/* ========================================= */}
      {activeTab === 'promotions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
          {loadingPromotions ? [1,2].map(i => <div key={i} className="h-64 bg-zinc-900/40 rounded-[2rem] animate-pulse border border-white/5"></div>) : promotions.map(promo => (
            <div key={promo.id} className={`border p-6 rounded-[2rem] flex flex-col transition-all ${promo.is_active ? 'bg-orange-500/10 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'bg-zinc-900/40 border-white/5'}`}>
              <div className="w-full h-32 bg-black rounded-xl overflow-hidden mb-4 relative">
                <img src={promo.image} className="w-full h-full object-cover opacity-80" />
                {promo.is_active && <div className="absolute top-3 left-3 bg-orange-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full animate-pulse shadow-lg">Live</div>}
              </div>
              <h3 className="text-lg font-black text-white uppercase truncate mb-1">{promo.title}</h3>
              <p className="text-xs text-zinc-500 truncate mb-6">{promo.link || 'No Link Attached'}</p>
              
              <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className={`text-xs font-bold uppercase tracking-widest ${promo.is_active ? 'text-orange-400' : 'text-zinc-500'}`}>Active</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={promo.is_active} onChange={() => togglePromoActive(promo.id, promo.is_active)} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${promo.is_active ? 'bg-orange-500' : 'bg-zinc-800'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${promo.is_active ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
                <button onClick={() => handleDeletePromotion(promo.id)} className="text-xs text-red-500 font-bold uppercase tracking-widest hover:text-white transition-colors bg-red-500/10 hover:bg-red-500 px-3 py-1.5 rounded-lg">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================= */}
      {/* CATEGORY MODAL */}
      {/* ========================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)}></div>
          <div className="relative bg-zinc-950 border border-white/10 rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-6">{editingCategory ? 'Edit Department' : 'New Department'}</h2>
            {editingCategory && <p className="text-xs text-amber-500 mb-6 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 leading-relaxed font-bold tracking-wide">Warning: Renaming this department will instantly update all corresponding assets in your inventory to the new name.</p>}
            
            <form onSubmit={handleSaveCategory} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 block">Department Name</label>
                <input required value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} type="text" placeholder="e.g. Rare Collectibles" className="w-full bg-black/50 border border-white/10 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-purple-500 transition-colors font-light" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="flex-1 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all">Cancel</button>
                <button type="submit" disabled={isSubmittingCategory} className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50">
                  {isSubmittingCategory ? 'Saving...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* PROMO MODAL */}
      {/* ========================================= */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsPromoModalOpen(false)}></div>
          <div className="relative bg-zinc-950 border border-orange-500/30 rounded-[2rem] w-full max-w-lg p-8 shadow-[0_0_50px_rgba(249,115,22,0.1)]">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 text-orange-500">Deploy Sale Banner</h2>
            
            <form onSubmit={handleSavePromotion} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 block">Banner Headline</label>
                <input required value={promoForm.title} onChange={(e) => setPromoForm({...promoForm, title: e.target.value})} type="text" placeholder="e.g. FLASH SALE 50% OFF" className="w-full bg-black/50 border border-white/10 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 block">Landscape Image URL</label>
                <input required value={promoForm.image} onChange={(e) => setPromoForm({...promoForm, image: e.target.value})} type="url" placeholder="Supabase Storage URL" className="w-full bg-black/50 border border-white/10 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 block">Click Destination Link</label>
                <input value={promoForm.link} onChange={(e) => setPromoForm({...promoForm, link: e.target.value})} type="text" placeholder="Optional (e.g. /market?category=Stanley)" className="w-full bg-black/50 border border-white/10 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
              
              <label className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-white/5 cursor-pointer mt-4 hover:border-orange-500/30 transition-colors">
                <input type="checkbox" className="w-5 h-5 accent-orange-500" checked={promoForm.is_active} onChange={(e) => setPromoForm({...promoForm, is_active: e.target.checked})} />
                <span className="text-sm font-bold text-white uppercase tracking-widest">Set as Active Live Banner</span>
              </label>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsPromoModalOpen(false)} className="py-4 px-6 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all">Cancel</button>
                <button type="submit" disabled={isSubmittingPromo} className="flex-1 py-4 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] disabled:opacity-50">
                  {isSubmittingPromo ? 'Deploying...' : 'Deploy to Homepage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* PRODUCT MODAL */}
      {/* ========================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setIsProductModalOpen(false)}></div>
          <div className="relative bg-zinc-950/80 border border-white/10 rounded-[2.5rem] w-full max-w-[1400px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            <button onClick={() => setIsProductModalOpen(false)} className="absolute top-6 right-6 w-12 h-12 bg-white/5 hover:bg-white hover:text-black text-white rounded-full flex items-center justify-center transition-all z-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {/* Left Preview Side */}
            <div className="w-full lg:w-[45%] bg-black/50 border-r border-white/5 flex flex-col items-center justify-center p-12 relative overflow-y-auto custom-scrollbar">
              <p className="absolute top-8 left-8 text-xs font-black text-purple-500 uppercase tracking-[0.3em] z-10">Live Gallery Preview</p>
              <div className="w-full aspect-[4/5] bg-zinc-900 rounded-[2rem] border border-white/5 overflow-hidden flex items-center justify-center relative shadow-2xl mt-12 mb-6">
                {activePreviewImage ? (
                  <img src={activePreviewImage} alt="Preview" className="w-full h-full object-cover opacity-90 transition-all duration-300" />
                ) : (
                  <span className="text-sm font-bold text-zinc-600 uppercase tracking-widest">Add an image URL</span>
                )}
                
                {/* ✨ SALE BADGE IN MODAL PREVIEW ✨ */}
                {productForm.original_price && Number(productForm.original_price) > Number(productForm.price) && (
                  <div className="absolute top-6 right-6 bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg animate-pulse z-20">SALE</div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 w-full pr-12">
                  <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-1">{productForm.category || 'Category'}</p>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight truncate">{productForm.name || 'Product Title'}</h3>
                  
                  <div className="flex items-center gap-3">
                    <p className="text-xl text-white font-light">Rs. {productForm.price || '0'}</p>
                    {/* ✨ SHOW ORIGINAL PRICE CROSSED OUT IN PREVIEW ✨ */}
                    {productForm.original_price && Number(productForm.original_price) > Number(productForm.price) && (
                      <p className="text-sm text-zinc-500 line-through">Rs. {productForm.original_price}</p>
                    )}
                  </div>
                </div>
              </div>

              {productImages.length > 0 && (
                <div className="flex gap-4 overflow-x-auto w-full pb-4 custom-scrollbar">
                  {productImages.map((img, idx) => (
                    <div key={idx} className="relative group shrink-0">
                      <button type="button" onClick={() => setActivePreviewImage(img)} className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activePreviewImage === img ? 'border-purple-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                        <img src={img} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Form Side */}
            <div className="w-full lg:w-[55%] p-8 sm:p-14 overflow-y-auto custom-scrollbar">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-10">{editingId ? 'Edit Asset' : 'Add New Asset'}</h2>
              <form onSubmit={handleSaveProduct} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="md:col-span-2">
                    <input required value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} type="text" placeholder="Product Name" className="w-full bg-transparent border-b border-white/20 text-white text-xl py-4 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light rounded-none" />
                  </div>
                  
                  {/* ✨ REGULAR PRICE ✨ */}
                  <div>
                    <input required value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} type="number" placeholder="Sale Price (Rs.)" className="w-full bg-transparent border-b border-white/20 text-white text-xl py-4 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light rounded-none" />
                  </div>

                  {/* ✨ NEW: ORIGINAL PRICE ✨ */}
                  <div>
                    <input value={productForm.original_price} onChange={(e) => setProductForm({...productForm, original_price: e.target.value})} type="number" placeholder="Original Price (Optional)" className="w-full bg-transparent border-b border-white/20 text-zinc-400 text-xl py-4 focus:outline-none focus:border-red-500 transition-colors font-light rounded-none placeholder:text-zinc-600" />
                    <p className="text-[10px] text-zinc-500 mt-2 italic">Fill this higher than Sale Price to put item on SALE</p>
                  </div>

                  <div>
                    <input required value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} type="number" placeholder="Inventory Count" className="w-full bg-transparent border-b border-white/20 text-white text-xl py-4 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light rounded-none" />
                  </div>

                  {/* Clean Category Select */}
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 block">Department</label>
                    <select required value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="w-full bg-black/50 border border-white/10 text-white text-lg px-5 py-4 focus:outline-none focus:border-purple-500 transition-colors rounded-xl cursor-pointer appearance-none">
                      {categories.map(cat => <option key={cat.id} value={cat.name} className="bg-zinc-900">{cat.name}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <input value={productForm.tag} onChange={(e) => setProductForm({...productForm, tag: e.target.value})} type="text" placeholder="Special Tag (e.g. Rare)" className="w-full bg-transparent border-b border-white/20 text-white text-xl py-4 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light rounded-none" />
                  </div>

                  <div className="md:col-span-2">
                    <input value={productForm.colors} onChange={(e) => setProductForm({...productForm, colors: e.target.value})} type="text" placeholder="Colors (Comma separated e.g. #000000, white, gold)" className="w-full bg-transparent border-b border-white/20 text-white text-xl py-4 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light rounded-none" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center justify-between cursor-pointer group py-4 border-b border-white/20 transition-all">
                      <span className="text-xl text-zinc-500 group-hover:text-white transition-colors font-light">Allow Custom Note/Engraving</span>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={productForm.allowCustomText} onChange={(e) => setProductForm({...productForm, allowCustomText: e.target.checked})} />
                        <div className={`block w-12 h-7 rounded-full transition-colors duration-300 ${productForm.allowCustomText ? 'bg-purple-500' : 'bg-zinc-800'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${productForm.allowCustomText ? 'transform translate-x-5' : ''}`}></div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="md:col-span-2 bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Product Gallery ({productImages.length} Images)</p>
                    <div className="flex gap-4">
                      <input 
                        value={tempImageUrl} onChange={(e) => setTempImageUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImage(); }}}
                        type="url" placeholder="Paste Supabase Storage URL here" className="flex-1 bg-black/50 border border-white/10 text-white text-lg px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors rounded-xl font-light" 
                      />
                      <button type="button" onClick={handleAddImage} className="px-8 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest rounded-xl transition-all text-xs">Add</button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <textarea required value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} placeholder="Product Description..." rows={3} className="w-full bg-transparent border-b border-white/20 text-white text-xl py-4 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light rounded-none resize-none"></textarea>
                  </div>
                </div>
                <button type="submit" disabled={isSubmittingProduct} className="w-full py-6 bg-white text-black hover:bg-purple-600 hover:text-white font-black text-sm uppercase tracking-[0.3em] transition-all shadow-xl mt-6">
                  {isSubmittingProduct ? 'Saving Ledger...' : (editingId ? 'Update Asset' : 'Publish Asset')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}