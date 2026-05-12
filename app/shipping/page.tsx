import Link from 'next/link';

export const metadata = {
  title: 'Shipping Protocol | CARTIO',
  description: 'Learn about CARTIO dispatch timelines, delivery fees, and order tracking.',
};

export default function ShippingPolicyPage() {
  return (
    <>
      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-screen -z-30 animate-live-bg opacity-30"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/90 via-transparent to-zinc-950 -z-20"></div>

      <div className="min-h-screen pt-32 pb-24 px-4 sm:px-8 relative z-10 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-16 md:mb-20 text-center">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6">Shipping Policy</h1>
            <p className="text-lg md:text-xl text-zinc-400 font-light tracking-wide max-w-2xl mx-auto">
              Everything you need to know about how your premium items are dispatched and delivered to your doorstep.
            </p>
          </div>

          {/* Content Container */}
          <div className="bg-zinc-950/60 backdrop-blur-2xl border border-white/10 p-8 md:p-14 lg:p-16 rounded-[2.5rem] shadow-2xl space-y-12">
            
            <section>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
                <span className="w-8 h-1 bg-purple-500 rounded-full hidden sm:block"></span>
                1. Order Processing Time
              </h2>
              <div className="space-y-4 text-zinc-400 font-light tracking-wide text-base md:text-lg leading-relaxed sm:pl-12">
                <p>
                  All orders are verified and processed within <strong className="text-white font-bold">1 to 2 business days</strong> (excluding weekends and holidays) after receiving your order confirmation.
                </p>
                <p>
                  You will receive an automated email notification the moment your order is dispatched from our logistics center.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
                <span className="w-8 h-1 bg-purple-500 rounded-full hidden sm:block"></span>
                2. Delivery Fees & Timelines
              </h2>
              <div className="space-y-6 text-zinc-400 font-light tracking-wide text-base md:text-lg leading-relaxed sm:pl-12">
                <p>We offer nationwide delivery across Pakistan via our premium courier partners.</p>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-black text-purple-400 uppercase tracking-widest mb-1">Standard Delivery</p>
                    <p className="text-3xl font-black text-white tracking-tighter mb-2">Rs. 300</p>
                    <p className="text-sm">Estimated 3-5 Business Days</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-purple-400 uppercase tracking-widest mb-1">Orders Over Rs. 3,500</p>
                    <p className="text-3xl font-black text-white tracking-tighter mb-2">FREE</p>
                    <p className="text-sm">Complimentary Premium Delivery</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
                <span className="w-8 h-1 bg-purple-500 rounded-full hidden sm:block"></span>
                3. Cash on Delivery (COD)
              </h2>
              <div className="space-y-4 text-zinc-400 font-light tracking-wide text-base md:text-lg leading-relaxed sm:pl-12">
                <p>
                  For your convenience and security, CARTIO proudly supports <strong className="text-white font-bold">Cash on Delivery (COD)</strong>. 
                </p>
                <p>
                  Please ensure that exact change is available at the time of delivery to expedite the handover process. Our couriers will not hand over the package before the payment is settled.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
                <span className="w-8 h-1 bg-purple-500 rounded-full hidden sm:block"></span>
                4. Order Tracking
              </h2>
              <div className="space-y-4 text-zinc-400 font-light tracking-wide text-base md:text-lg leading-relaxed sm:pl-12">
                <p>
                  Once your assets are dispatched, you will receive a tracking number via email/WhatsApp. You can use this to monitor your shipment's live status. 
                </p>
                <Link href="/track" className="inline-flex items-center gap-3 px-6 py-4 bg-white text-black hover:bg-purple-600 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all mt-2">
                  Track Your Order <span className="text-lg leading-none">→</span>
                </Link>
              </div>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
                <span className="w-8 h-1 bg-purple-500 rounded-full hidden sm:block"></span>
                5. Damaged or Lost Assets
              </h2>
              <div className="space-y-4 text-zinc-400 font-light tracking-wide text-base md:text-lg leading-relaxed sm:pl-12">
                <p>
                  CARTIO takes extreme care in packaging your items. However, if your order arrives damaged, please contact our concierge desk within <strong className="text-white font-bold">48 hours</strong> of delivery.
                </p>
                <p>
                  Please save all packaging materials and damaged goods, as we will require photographic evidence to process a rapid replacement.
                </p>
              </div>
            </section>

          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <p className="text-zinc-500 font-light tracking-wide mb-6">
              Have questions regarding your dispatch? Our concierge desk is online 24/7.
            </p>
            <a href="mailto:pkcartio@gmail.com" className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-white/20 text-white hover:bg-white hover:text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all">
              Contact Support
            </a>
          </div>

        </div>
      </div>
    </>
  );
}