/**
 * AnimatedBackground - Animated blob background elements
 */
export default function AnimatedBackground({ isDark }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className={`absolute -top-40 -right-40 w-80 h-80 rounded-full filter blur-xl animate-blob ${isDark ? 'opacity-20' : 'opacity-30 mix-blend-multiply'}`}
        style={{ backgroundColor: isDark ? '#8b5cf6' : '#d8b4fe' }}
      ></div>
      <div 
        className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full filter blur-xl animate-blob animation-delay-2000 ${isDark ? 'opacity-20' : 'opacity-30 mix-blend-multiply'}`}
        style={{ backgroundColor: isDark ? '#ec4899' : '#fbcfe8' }}
      ></div>
      <div 
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full filter blur-xl animate-blob animation-delay-4000 ${isDark ? 'opacity-20' : 'opacity-30 mix-blend-multiply'}`}
        style={{ backgroundColor: isDark ? '#6366f1' : '#c7d2fe' }}
      ></div>
    </div>
  );
}
