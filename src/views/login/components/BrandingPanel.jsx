/**
 * BrandingPanel - Right side branding panel with logo and animations
 */
export default function BrandingPanel() {
  return (
    <div className="w-full lg:w-3/5 bg-gradient-to-br from-[#6237A0] via-[#7A4ED9] to-[#8B5CF6] flex items-center justify-center p-8 sm:p-10 md:p-12 min-h-[200px] sm:min-h-[250px] lg:min-h-0 relative overflow-hidden">
      {/* Animated circles */}
      <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white/20 rounded-full animate-ping-slow"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-white/20 rounded-full animate-ping-slow animation-delay-1000"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float animation-delay-2000"></div>
      
      <div className="flex flex-col items-center sm:flex-row relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
          <img
            src="images/icon.png"
            alt="Servana Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mb-3 sm:mb-0 sm:mr-4 drop-shadow-2xl relative z-10 animate-float"
          />
        </div>
        <span className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white font-baloo drop-shadow-lg">
          servana
        </span>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>
    </div>
  );
}
