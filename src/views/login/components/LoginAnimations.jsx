/**
 * LoginAnimations - CSS animations for login screen
 */
export default function LoginAnimations() {
  return (
    <style jsx>{`
      @keyframes blob {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
      }
      @keyframes gradient {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      @keyframes ping-slow {
        0% { transform: scale(1); opacity: 1; }
        75%, 100% { transform: scale(2); opacity: 0; }
      }
      .animate-blob { animation: blob 7s infinite; }
      .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
      .animate-shake { animation: shake 0.5s; }
      .animate-float { animation: float 3s ease-in-out infinite; }
      .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
      .animation-delay-1000 { animation-delay: 1s; }
      .animation-delay-2000 { animation-delay: 2s; }
      .animation-delay-4000 { animation-delay: 4s; }
    `}</style>
  );
}
