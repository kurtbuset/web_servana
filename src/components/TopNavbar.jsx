import { Menu } from "react-feather";
import { Link } from "react-router-dom";
import { useUser } from "../../src/context/UserContext";

export default function TopNavbar({ toggleSidebar }) {
  const { userData, loading } = useUser();

  // Build full name
  const fullName = userData
    ? [userData.profile?.prof_firstname, userData.profile?.prof_middlename, userData.profile?.prof_lastname]
        .filter(Boolean)
        .join(" ")
    : "";

  // Get avatar or fallback
  const avatarUrl = userData?.image?.img_location;

  return (
    <header className="h-14 sm:h-16 bg-white shadow flex items-center z-50 pl-12 sm:pl-14 md:pl-16 relative justify-between pr-3 sm:pr-4 md:pr-6">
      <button
        className="md:hidden absolute left-2 sm:left-3 text-gray-700 hover:text-gray-900 focus:outline-none"
        onClick={toggleSidebar}
      >
        <Menu size={20} className="sm:w-6 sm:h-6" strokeWidth={1} />
      </button>

      <div className="flex items-center gap-2 sm:gap-3">
        <img src="images/icon.png" alt="Servana Logo" className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10" />
        <span
          className="text-base sm:text-lg md:text-xl font-semibold text-purple-800 relative"
          style={{ top: "-1px" }}
        >
          servana
        </span>
      </div>

      <Link to="/profile" className="flex items-center gap-2 sm:gap-3 hover:opacity-80">
        <img
          src={avatarUrl|| "profile_picture/DefaultProfile.jpg"}
          alt={fullName || "Profile"}
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover"
        />
        <span className="text-xs sm:text-sm font-medium text-gray-700 hidden xs:block max-w-[100px] sm:max-w-[150px] md:max-w-none truncate">
          {loading ? "" : fullName || ""}
        </span>
      </Link>
    </header>
  );
}
