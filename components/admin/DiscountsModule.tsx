"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

type PromoCode = {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  is_active: boolean;
  usage_count: number;
  created_at: string;
};

export default function DiscountsModule() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number | ''>('');
  const [minOrderValue, setMinOrderValue] = useState<number | ''>('');

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching promo codes:', error);
    } else if (data) {
      setPromoCodes(data);
    }
    setIsLoading(false);
  };

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !discountValue) return alert("Code and Value are required.");
    
    setIsCreating(true);
    const finalCode = newCode.toUpperCase().replace(/\s+/g, '');

    const { error } = await supabase.from('promo_codes').insert([{
      code: finalCode,
      discount_type: discountType,
      discount_value: Number(discountValue),
      min_order_value: Number(minOrderValue) || 0,
    }]);

    if (error) {
      if (error.code === '23505') alert("This code already exists!");
      else alert("Failed to create code.");
      console.error(error);
    } else {
      setNewCode('');
      setDiscountValue('');
      setMinOrderValue('');
      fetchPromoCodes();
    }
    setIsCreating(false);
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from('promo_codes')
      .update({ is_active: !currentStatus })
      .eq('id', id);
    
    if (!error) {
      setPromoCodes(promoCodes.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
    }
  };

  const deleteCode = async (id: number, codeName: string) => {
    if (!confirm(`Are you sure you want to permanently delete the code ${codeName}?`)) return;
    
    const { error } = await supabase.from('promo_codes').delete().eq('id', id);
    if (!error) {
      setPromoCodes(promoCodes.filter(p => p.id !== id));
    }
  };

  const activeCount = promoCodes.filter(p => p.is_active).length;

  return (
    <div className="w-full pb-20 relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 relative z-10">
        <div className="flex-1 w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase break-words">Discount Engine</h1>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base font-light tracking-wide">Generate and monitor promotional gateways for marketing campaigns.</p>
        </div>
        
        {/* ACTIVE CODES METRIC */}
        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 px-8 py-5 rounded-3xl flex items-center gap-5 shrink-0 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-inner">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Active Promos</p>
            <p className="text-3xl font-black text-white leading-none tracking-tighter">
              {isLoading ? '...' : activeCount} <span className="text-sm text-purple-400 font-bold uppercase tracking-widest ml-1">Live</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10">
        
        {/* LEFT: COMPOSER & PREVIEW */}
        <div className="lg:w-[400px] shrink-0 space-y-6">
          
          {/* ✨ LIVE PREVIEW CARD ✨ */}
          <div className="relative w-full aspect-[1.58/1] rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden shadow-2xl group border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">Cartio Gift Card</span>
              <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>

            <div className="relative z-10">
              <p className="text-4xl font-black text-white tracking-tighter uppercase font-mono mb-2 drop-shadow-lg">
                {newCode || 'CARTIO10'}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-white tracking-widest uppercase">
                  {discountValue ? (discountType === 'percentage' ? `${discountValue}% OFF` : `Rs. ${discountValue} OFF`) : '0% OFF'}
                </p>
                {minOrderValue ? (
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest border-l border-white/20 pl-3">Min Rs. {minOrderValue}</span>
                ) : null}
              </div>
            </div>
          </div>

          {/* ✨ CREATE FORM ✨ */}
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-xl">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter border-b border-white/5 pb-4 mb-6">Generate Code</h2>
            
            <form onSubmit={handleCreateCode} className="space-y-6">
              <div className="group">
                <label className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-2 block transition-colors">Promo Code Word</label>
                <input 
                  type="text" 
                  placeholder="e.g. CARTIO10" 
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono tracking-widest uppercase" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 block">Discount Type</label>
                  <select 
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full bg-black/40 border border-white/10 text-white px-4 py-4 rounded-xl outline-none focus:border-white transition-all appearance-none cursor-pointer font-bold text-xs"
                  >
                    <option value="percentage">% Percentage</option>
                    <option value="fixed">Rs. Amount</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 block">Value</label>
                  <input 
                    type="number" 
                    placeholder={discountType === 'percentage' ? 'e.g. 15' : 'e.g. 500'} 
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value) || '')}
                    className="w-full bg-black/40 border border-white/10 text-white px-4 py-4 rounded-xl outline-none focus:border-white transition-all font-mono" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 block">Minimum Spend (Rs.)</label>
                <input 
                  type="number" 
                  placeholder="Leave empty for no minimum" 
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value) || '')}
                  className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-white transition-all font-mono" 
                />
              </div>

              <button 
                type="submit"
                disabled={isCreating}
                className="w-full py-5 bg-white text-black hover:bg-purple-600 hover:text-white hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] rounded-xl font-black text-xs uppercase tracking-[0.3em] transition-all duration-300 mt-4 disabled:opacity-50 flex justify-center items-center gap-3"
              >
                {isCreating ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span> : 'Activate Gift Card'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: LIST OF CODES */}
        <div className="flex-1">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-900/40 rounded-[2rem] animate-pulse border border-white/5"></div>)}
            </div>
          ) : promoCodes.length === 0 ? (
            <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-16 text-center backdrop-blur-xl">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center text-zinc-500"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></div>
              <p className="text-zinc-400 font-light tracking-widest uppercase">No promotional codes found.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {promoCodes.map((promo) => (
                <div key={promo.id} className={`bg-zinc-900/40 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-500 hover:shadow-2xl border ${promo.is_active ? 'border-white/10 hover:border-purple-500/30' : 'border-red-500/20 opacity-60 hover:opacity-100'}`}>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter font-mono">{promo.code}</h3>
                      <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 ${promo.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${promo.is_active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                        {promo.is_active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400 font-light mt-4 border-t border-white/5 pt-4">
                      <span className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Value</span>
                        <strong className="text-white text-sm tracking-wide">{promo.discount_type === 'percentage' ? `${promo.discount_value}% OFF` : `Rs. ${promo.discount_value}`}</strong>
                      </span>
                      <span className="w-px h-6 bg-white/10 hidden sm:block"></span>
                      <span className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Min Spend</span>
                        <strong className="text-white text-sm tracking-wide">{promo.min_order_value > 0 ? `Rs. ${promo.min_order_value}` : 'None'}</strong>
                      </span>
                      <span className="w-px h-6 bg-white/10 hidden sm:block"></span>
                      <span className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Times Used</span>
                        <strong className="text-purple-400 text-sm tracking-wide">{promo.usage_count}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                    <button 
                      onClick={() => toggleStatus(promo.id, promo.is_active)}
                      className={`flex-1 md:flex-none px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${promo.is_active ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white' : 'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white border border-green-500/30'}`}
                    >
                      {promo.is_active ? 'Pause Code' : 'Re-Activate'}
                    </button>
                    <button 
                      onClick={() => deleteCode(promo.id, promo.code)}
                      className="p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors shrink-0"
                      title="Delete Code"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}