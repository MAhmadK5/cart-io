"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

type Review = {
  id: number;
  name: string;
  tag: string;
  text: string;
  rating: number;
  created_at?: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    tag: '',
    text: '',
    rating: 5
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      if (data) setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert([{
        name: newReview.name,
        tag: newReview.tag || 'Verified Client',
        text: newReview.text,
        rating: newReview.rating
      }]);

      if (error) throw error;

      setShowSuccess(true);
      setNewReview({ name: '', tag: '', text: '', rating: 5 });
      fetchReviews(); // Refresh the list instantly
      
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-30"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-transparent to-zinc-950 -z-20"></div>

      <div className="min-h-screen pb-32 pt-24 md:pt-32 relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        
        <div className="mb-12 md:mb-20 text-center">
          <p className="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-[0.4em] mb-4">The Ledger</p>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
            Client Perspectives
          </h1>
          <p className="text-zinc-400 mt-6 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
            Discover the experiences of those who have elevated their lifestyle with CARTIO.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* LEFT: SUBMIT REVIEW FORM */}
          <div className="w-full lg:w-1/3 shrink-0">
            <div className="sticky top-32 bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_50px_rgba(147,51,234,0.1)]">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-8">Leave Feedback</h2>
              
              {showSuccess ? (
                <div className="bg-purple-500/10 border border-purple-500/30 p-8 rounded-2xl text-center">
                  <span className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  <h3 className="text-xl font-black text-purple-400 uppercase tracking-widest mb-2">Feedback Secured</h3>
                  <p className="text-sm text-zinc-400 font-light">Thank you for contributing to the CARTIO network.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <input required value={newReview.name} onChange={(e) => setNewReview({...newReview, name: e.target.value})} type="text" placeholder="Your Name" className="w-full bg-transparent border-b border-white/20 text-white text-lg py-3 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light rounded-none" />
                  </div>
                  <div>
                    <input value={newReview.tag} onChange={(e) => setNewReview({...newReview, tag: e.target.value})} type="text" placeholder="Title (e.g. Interior Designer)" className="w-full bg-transparent border-b border-white/20 text-white text-lg py-3 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light rounded-none" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 mt-6">Rating</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setNewReview({...newReview, rating: star})} className="focus:outline-none transition-transform hover:scale-110">
                          <svg className={`w-8 h-8 ${newReview.rating >= star ? 'text-purple-500' : 'text-zinc-700'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4">
                    <textarea required value={newReview.text} onChange={(e) => setNewReview({...newReview, text: e.target.value})} placeholder="Write your perspective..." rows={4} className="w-full bg-transparent border-b border-white/20 text-white text-lg py-3 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600 font-light rounded-none resize-none"></textarea>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-white text-black hover:bg-purple-600 hover:text-white font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl mt-4 disabled:opacity-50">
                    {isSubmitting ? 'Transmitting...' : 'Submit Perspective'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT: LIST OF REVIEWS */}
          <div className="w-full lg:w-2/3">
            {loading ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3].map((i) => <div key={i} className="h-48 bg-zinc-900/40 rounded-3xl animate-pulse"></div>)}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] backdrop-blur-md">
                <p className="text-2xl text-zinc-500 font-light tracking-widest">No perspectives recorded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-10 hover:border-white/20 transition-all duration-300 relative group overflow-hidden shadow-2xl">
                    <div className="absolute -inset-2 bg-gradient-to-tr from-purple-600/0 via-purple-600/0 to-blue-500/0 group-hover:from-purple-600/10 group-hover:to-transparent transition-all duration-500 z-0"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-black text-zinc-300 border border-white/10">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-white font-black text-xl">{review.name}</h4>
                            <p className="text-xs text-purple-400 uppercase tracking-[0.2em] font-bold mt-1">{review.tag}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 text-purple-500">
                          {[...Array(review.rating)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-zinc-300 font-medium leading-relaxed text-xl md:text-2xl">
                        "{review.text}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}