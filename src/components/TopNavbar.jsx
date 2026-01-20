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
    <header className="h-16 bg-white shadow flex items-center z-50 pl-16 relative justify-between pr-6">
      <button
        className="md:hidden absolute left-4 text-gray-700 hover:text-gray-900 focus:outline-none"
        onClick={toggleSidebar}
      >
        <Menu size={24} strokeWidth={1} />
      </button>

      <div className="flex items-center gap-3">
        <img src="images/icon.png" alt="Servana Logo" className="h-10 w-10" />
        <span
          className="text-xl font-semibold text-purple-800 relative"
          style={{ top: "-1px" }}
        >
          servana
        </span>
      </div>

      <Link to="/profile" className="flex items-center gap-3 hover:opacity-80">
        <img
          src={avatarUrl|| "profile_picture/DefaultProfile.jpg"}
          alt={fullName || "Profile"}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-700">
          {loading ? "" : fullName || ""}
        </span>
      </Link>
    </header>
  );
}
