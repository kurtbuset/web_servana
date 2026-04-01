import { getAvatarUrl } from "../../../utils/imageUtils";
import Badge from "../../../components/ui/Badge";

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
                        <Badge variant="purple-gradient" size="lg">
                            {getRoleName()}
                        </Badge>
                        {departments.length > 0 && (
                            <>
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>•</span>
                                {departments.map((dept, idx) => (
                                    <Badge key={idx} variant="blue-gradient" size="lg">
                                        {dept.dept_name || dept}
                                    </Badge>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
