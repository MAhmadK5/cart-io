"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function ReviewsModule() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (confirm("Are you sure you want to permanently delete this customer feedback?")) {
      await supabase.from('reviews').delete().eq('id', id);
      fetchReviews();
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase">Client Feedback</h1>
          <p className="text-zinc-400 mt-2 text-base md:text-lg font-light tracking-wide">Manage public reviews and ratings.</p>
        </div>
        <button 
          onClick={fetchReviews} 
          className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 rounded-2xl text-xs md:text-sm font-black text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl group"
        >
          <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Refresh Feed
        </button>
      </div>

      {loadingReviews ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-zinc-900/40 rounded-[2rem] animate-pulse border border-white/5"></div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-16 text-center flex flex-col items-center justify-center">
          <svg className="w-16 h-16 text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">No Reviews Yet</h3>
          <p className="text-zinc-500 font-light tracking-wide">Client feedback will appear here once submitted.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:border-white/20 rounded-[2rem] p-8 flex flex-col group transition-all duration-300 relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-black text-purple-400 uppercase tracking-widest mb-1">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight line-clamp-1">
                    {review.user_name || review.name || "Anonymous"}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-lg border border-white/10 shadow-inner">
                  <span className="text-white font-black text-sm">{review.rating}</span>
                  <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                </div>
              </div>
              
              <p className="text-zinc-300 font-light text-sm italic mb-8 leading-relaxed">
                "{review.comment || review.review_text}"
              </p>
              
              <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-md">
                  Product ID: {review.product_id}
                </span>
                <button 
                  onClick={() => handleDeleteReview(review.id)} 
                  className="w-10 h-10 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full flex items-center justify-center transition-all opacity-50 group-hover:opacity-100"
                  title="Delete Review"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}