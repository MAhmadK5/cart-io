"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const CATEGORIES = ["MiNi Fan", "Stanley tumblers", "Prayer Mat", "Beauty products", "Tables", "Decoration"];

export default function InventoryModule() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [productImages, setProductImages] = useState<string[]>([]);
  const [activePreviewImage, setActivePreviewImage] = useState<string>("");

  const [productForm, setProductForm] = useState({
    name: '', price: '', category: 'Decoration', tag: '', stock: '', description: '', colors: '', allowCustomText: false
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    if (productImages.length > 0 && !productImages.includes(activePreviewImage)) {
      setActivePreviewImage(productImages[0]);
    } else if (productImages.length === 0) {
      setActivePreviewImage("");
    }
  }, [productImages]);

  const fetchInventory = async () => {
    setLoadingInventory(true);
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (data) setInventory(data);
    setLoadingInventory(false);
  };

  const openAddModal = () => {
    setEditingId(null);
    setProductForm({ name: '', price: '', category: 'Decoration', tag: '', stock: '', description: '', colors: '', allowCustomText: false });
    setProductImages([]);
    setTempImageUrl('');
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingId(product.id);
    setProductForm({
      name: product.name, 
      price: String(product.price), 
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
    if (confirm("Are you sure you want to permanently remove this asset from the boutique?")) {
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
    
    setIsSubmitting(true);
    try {
      const colorsArray = productForm.colors.trim() 
        ? productForm.colors.split(',').map(c => c.trim()).filter(c => c !== '') 
        : null;

      const payload = {
        name: productForm.name,
        price: Number(productForm.price),
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

      let dbError;

      // ✨ WE NOW EXPLICITLY CAPTURE THE ERROR FROM SUPABASE ✨
      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId);
        dbError = error;
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        dbError = error;
      }

      // If Supabase rejected it, throw the error so the catch block sees it!
      if (dbError) throw dbError;

      setIsProductModalOpen(false);
      fetchInventory();
    } catch (err: any) {
      console.error("Supabase Error:", err);
      // ✨ THIS WILL NOW POP UP AND TELL YOU EXACTLY WHAT IS MISSING IN YOUR DB ✨
      alert(`Database Error: ${err.message}\n\nPlease check your Supabase table columns!`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase">Inventory Record</h1>
          <p className="text-zinc-400 mt-2 text-base md:text-lg font-light tracking-wide">Manage your luxury assets.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-3 px-8 py-5 bg-white text-black hover:bg-purple-600 hover:text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl">
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

      {/* --- MODAL UI --- */}
      {/* --- MODAL UI --- */}
{isProductModalOpen && (
  <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setIsProductModalOpen(false)}></div>
          <div className="relative bg-zinc-950/80 border border-white/10 rounded-[2.5rem] w-full max-w-[1400px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            <button onClick={() => setIsProductModalOpen(false)} className="absolute top-6 right-6 w-12 h-12 bg-white/5 hover:bg-white hover:text-black text-white rounded-full flex items-center justify-center transition-all z-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="w-full lg:w-[45%] bg-black/50 border-r border-white/5 flex flex-col items-center justify-center p-12 relative overflow-y-auto custom-scrollbar">
              <p className="absolute top-8 left-8 text-xs font-black text-purple-500 uppercase tracking-[0.3em] z-10">Live Gallery Preview</p>
              
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
                        value={tempImageUrl} 
                        onChange={(e) => setTempImageUrl(e.target.value)} 
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImage(); }}}
                        type="url" 
                        placeholder="Paste Supabase URL here" 
                        className="flex-1 bg-black/50 border border-white/10 text-white text-lg px-6 py-4 focus:outline-none focus:border-purple-500 transition-colors rounded-xl font-light" 
                      />
                      <button type="button" onClick={handleAddImage} className="px-8 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest rounded-xl transition-all text-xs">
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
    </>
  );
}