/**
 * AnimatedBackground - Animated blob background for profile screen
 */
export default function AnimatedBackground({ isDark }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob ${isDark ? 'bg-purple-600' : 'bg-purple-300'}`}></div>
      <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 ${isDark ? 'bg-pink-600' : 'bg-pink-300'}`}></div>
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 ${isDark ? 'bg-indigo-600' : 'bg-indigo-300'}`}></div>
    </div>
  );
}
