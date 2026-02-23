import { X } from "react-feather";
import { Avatar } from "../../../components/ui";

/**
 * ViewProfileModal - Modal for viewing admin profile details
 */
export default function ViewProfileModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[70] p-4 animate-fadeIn" onClick={onClose}>
      <div className="rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-slideUp" onClick={(e) => e.stopPropagation()}>
        {/* Purple Gradient Header */}
        <div className="relative bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] p-5 text-white">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Profile Icon and Title */}
          <div className="flex items-center gap-2 mb-5">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-bold">Admin Profile</h3>
          </div>

          {/* Profile Picture */}
          <div className="flex justify-center mb-4">
            <Avatar
              src={user.profile_picture}
              name={user.email}
              alt="Profile"
              size="4xl"
              showStatus
              isOnline={user.active}
              ring
              ringColor="rgba(255, 255, 255, 0.3)"
            />
          </div>

          {/* Email/Username */}
          <h4 className="text-xl font-bold text-center mb-4">{user.email.split('@')[0]}</h4>

          {/* Three Dots Menu */}
          <div className="flex justify-center gap-1.5">
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
          </div>
        </div>

        {/* Dark Content Section */}
        <div className="p-5 bg-[#2b2d31]">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider text-gray-400">Email Address</p>
              <p className="text-sm font-medium text-white">{user.email}</p>
            </div>

            <div>
              <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider text-gray-400">Role</p>
              <p className="text-sm font-medium text-white">Administrator</p>
            </div>

            <div>
              <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wider text-gray-400">Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${user.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <p className="text-sm font-medium text-white">{user.active ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-5 px-4 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-sm font-semibold rounded-lg hover:from-[#7C3AED] hover:to-[#6D28D9] transition-all shadow-lg"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
