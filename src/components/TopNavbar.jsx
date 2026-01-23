import { Menu } from "react-feather";
import { Link } from "react-router-dom";
import { useUser } from "../../src/context/UserContext";
import DarkModeToggle from "./DarkModeToggle";

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
    <header className="h-16 bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 flex items-center z-50 pl-16 relative justify-between pr-6 transition-colors duration-200">
      <button
        className="md:hidden absolute left-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none transition-colors duration-200"
        onClick={toggleSidebar}
      >
        <Menu size={24} strokeWidth={1} />
      </button>

      <div className="flex items-center gap-3">
        <img src="images/icon.png" alt="Servana Logo" className="h-10 w-10" />
        <span
          className="text-xl font-semibold text-purple-800 dark:text-purple-300 relative transition-colors duration-200"
          style={{ top: "-1px" }}
        >
          servana
        </span>
      </div>

      <div className="flex items-center gap-3">
        <DarkModeToggle size={18} />
        <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200">
          <img
            src={avatarUrl|| "profile_picture/DefaultProfile.jpg"}
            alt={fullName || "Profile"}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
            {loading ? "" : fullName || ""}
          </span>
        </Link>
      </div>
    </header>
  );
}
