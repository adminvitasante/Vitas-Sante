import { Icon } from "@/components/ui/icon";

export default function MarketingPage() {
  return (
    <>
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-4">Marketing Materials</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl">Access curated, high-fidelity brand assets designed for professional outreach. Enhance your authority within the clinical ecosystem.</p>
      </header>

      {/* Referral Link Generator (Priority Section) */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="bg-surface-container-lowest rounded-full p-8 relative overflow-hidden border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,27,63,0.04)]">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="flex-1">
              <h2 className="text-xl font-headline font-bold text-primary mb-2">Unique Referral Link</h2>
              <p className="text-sm text-on-surface-variant">Generate a personalized URL to track your impact and commissions accurately.</p>
            </div>
            <div className="flex-1 w-full flex items-center gap-2">
              <div className="flex-1 bg-surface-container-low px-6 py-4 rounded-xl font-mono text-sm text-primary border-b-2 border-primary">
                clinicalatelier.com/ref/dr-h-jean-2024
              </div>
              <button className="bg-primary text-white p-4 rounded-xl hover:bg-primary-container transition-colors">
                <Icon name="content_copy" className="block" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Assets Grid */}
      <section className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-headline font-bold text-on-surface">Certified Brand Assets</h3>
          <div className="flex gap-2">
            <span className="px-4 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full">NEW ASSETS AVAILABLE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Social Media Kit */}
          <div className="group bg-surface-container-lowest rounded-full overflow-hidden border border-outline-variant/5 transition-all hover:shadow-lg">
            <div className="h-48 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Haitian medical professional in scrubs smiling warmly while holding a digital tablet in a bright clinical setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXhmcz6444n6N2WJRHxy5dS1HFaaeeoE8hGQ1CG0Y0g1_MA3N8u4VIccQ0shcGbuIOGW2CtIHEY4djcC3xP1dZRXz50av6VrQIw0vLnmdNu6kq7Xu2qiqKe7QiEEvtcFAxE4QMPCfVcErQPAgPs1AvNZ5lBYdka6ZTxJ1l3VGym3WeiSh_yW-FRVMZkX-eByze2y_0T1EAjVndP_PTl4kMZKs8LKhMR19QKhk_Uj41WBZohVJVGchZDSdcOm888_KJyiLJsYPVY78q" />
            </div>
            <div className="p-6">
              <h4 className="font-headline font-bold text-on-surface mb-2">Social Media Kits</h4>
              <p className="text-xs text-on-surface-variant mb-6 line-clamp-2">High-impact visual stories for Instagram, LinkedIn, and WhatsApp Status.</p>
              <button className="w-full py-3 bg-surface-container-low text-primary text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                <Icon name="download" className="text-sm" />
                DOWNLOAD KIT
              </button>
            </div>
          </div>

          {/* Printable Brochures */}
          <div className="group bg-surface-container-lowest rounded-full overflow-hidden border border-outline-variant/5 transition-all hover:shadow-lg">
            <div className="h-48 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Elegant close-up of high-quality printed medical brochures on a minimalist wooden desk with soft focus background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbhd5SeNI_QEln0TFsJTi3Qe2Lz6gGwuTsgTddQUrnsTDqel-mEk5--xCiicQgdsMQetRFThG0DJKId72ioz6dO27AC-K3rsss7arAS4XKGBhIpR9NDATRZCXQ3lMhi7iKA2EV5aP6ItYp_Abe2vGBYO8TJcektH8MDCQfGmF6hJhe8bz4CIIINo99FyKeyiTPH4h9jJRIIzz1kRPbRz657sDgUnk-vrJqOAXvS_MiZjkI9TNFpF2AibYAL0gDYDD1F6x9nzhB1YMy" />
            </div>
            <div className="p-6">
              <h4 className="font-headline font-bold text-on-surface mb-2">Printable Brochures</h4>
              <p className="text-xs text-on-surface-variant mb-6 line-clamp-2">Patient education leaflets and premium clinic posters in high resolution.</p>
              <button className="w-full py-3 bg-surface-container-low text-primary text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                <Icon name="print" className="text-sm" />
                GET PDFS
              </button>
            </div>
          </div>

          {/* Email Templates */}
          <div className="group bg-surface-container-lowest rounded-full overflow-hidden border border-outline-variant/5 transition-all hover:shadow-lg">
            <div className="h-48 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Focus on a professional woman of Haitian descent typing on a laptop, warm interior lighting, clinical administrative office" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDGS1cMFI9VtscgrWgjaKE7VPskPAdXNj6-OALjTPJqoru20vw103v1rKGYXo71rVGRcp12EqvzJv_tFOxgegF-qnoKJ3pnAeEQlaUE3VKNbfOZmfl5VGX-t-Y7Xtd-hdBQqubmUyHj2gD2JKoB96sevcpHG9jUPAs2uDDhvmnhDya_MwXKWFxQVw9eBYc6Q6aj6WcglICELJ74uTWg5H5OTXTSUAxQJNa_l85jomIEB9A3BaXBF-qWi7RfKMvaQ7Nq-k6aQr9JZEH" />
            </div>
            <div className="p-6">
              <h4 className="font-headline font-bold text-on-surface mb-2">Email Templates</h4>
              <p className="text-xs text-on-surface-variant mb-6 line-clamp-2">Copywritten sequences for outreach to patients and professional peers.</p>
              <button className="w-full py-3 bg-surface-container-low text-primary text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                <Icon name="alternate_email" className="text-sm" />
                COPY CODE
              </button>
            </div>
          </div>

          {/* Brand Guidelines */}
          <div className="group bg-surface-container-lowest rounded-full overflow-hidden border border-outline-variant/5 transition-all hover:shadow-lg">
            <div className="h-48 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Professional branding moodboard featuring blue and teal color swatches and clean medical typography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqP1MCU8pqihKYBxLt0Lw6yuk_Gq52yPDOj3qKX4IAItEhopIDVH-v3FsvMNzVfxRsEirXCLVzFrykUPvFnsfKa5-K052cGnslXKDAJY3xdcBlAGVSzpRd8lcqTPwtKDzvQDEOq_He1IC0ybVFwlTo3GWnbzNxa8_9Q0EadqixWioc-L9_2n1zbnVvGodpE4QbSJrdMRf5T2nZ1Hg1-mEN836C8ZeR-eHxq62AEchfydroTWNEPUoK2CxK-uiYWsV7etPZhpnMEhVF" />
            </div>
            <div className="p-6">
              <h4 className="font-headline font-bold text-on-surface mb-2">Brand Guidelines</h4>
              <p className="text-xs text-on-surface-variant mb-6 line-clamp-2">Usage instructions for logos, colors, and the Clinical Atelier voice.</p>
              <button className="w-full py-3 bg-surface-container-low text-primary text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                <Icon name="menu_book" className="text-sm" />
                VIEW GUIDE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Quote Section (Tonal Depth) */}
      <section className="max-w-6xl mx-auto mt-20 p-12 bg-primary rounded-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full blur-3xl opacity-50 -mr-32 -mt-32" />
        <div className="relative z-10 text-center">
          <p className="text-3xl font-headline font-bold text-white mb-6">&ldquo;Our brand is built on clinical precision and empathetic care. These tools help you share that vision.&rdquo;</p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-white/30" />
            <span className="text-primary-fixed text-sm font-bold tracking-widest uppercase">The Editorial Board</span>
            <div className="w-12 h-px bg-white/30" />
          </div>
        </div>
      </section>
    </>
  );
}
