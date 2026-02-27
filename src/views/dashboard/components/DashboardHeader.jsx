import { getAvatarUrl } from "../../../utils/imageUtils";

/**
 * DashboardHeader - User profile header section
 * Shows profile picture, name, email, role, and departments
 */
export default function DashboardHeader({ userData, getRoleName }) {
    // Build full name and get user info
    const fullName = [
        userData?.profile?.prof_firstname,
        userData?.profile?.prof_middlename,
        userData?.profile?.prof_lastname
    ].filter(Boolean).join(" ");
    const email = userData?.sys_user_email || userData?.profile?.prof_email || userData?.email || 'No email available';
    const avatarUrl = getAvatarUrl(userData);
    const departments = userData?.departments || [];

    return (
        <div className="dashboard-header p-4">
            <div className="flex items-center gap-4">
                {/* Profile Picture */}
                <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
                
                {/* User Info */}
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        Hi, {fullName || 'User'}
                    </h1>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {email}
                        </p>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>•</span>
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                            {getRoleName()}
                        </span>
                        {departments.length > 0 && (
                            <>
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>•</span>
                                {departments.map((dept, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
                                    >
                                        {dept.dept_name || dept}
                                    </span>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
