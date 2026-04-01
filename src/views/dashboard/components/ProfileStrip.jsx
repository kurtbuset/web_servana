import { useUser } from "../../../context/UserContext";

export default function ProfileStrip() {
    const { userData, getRoleName, getUserEmail, getUserName } = useUser();
    
    const getInitials = (name) => {
        if (!name) return 'U';
        const names = name.trim().split(' ');
        if (names.length === 1) return names[0][0].toUpperCase();
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    };

    const getUserFullName = () => {
        if (userData?.profile) {
            const firstName = userData.profile.prof_firstname || '';
            const lastName = userData.profile.prof_lastname || '';
            return `${firstName} ${lastName}`.trim() || 'User';
        }
        return getUserName() || 'User';
    };

    const getDepartments = () => {
        if (userData?.departments && userData.departments.length > 0) {
            return userData.departments;
        }
        return [];
    };

    const fullName = getUserFullName();
    const email = getUserEmail() || userData?.sys_user_email || 'No email';
    const roleName = getRoleName() || 'No Role';
    const departments = getDepartments();

    return (
        <div className="profile-strip">
            <div className="profile-avatar-lg">
                {getInitials(fullName)}
            </div>
            <div>
                <div className="profile-name">
                    Hi, {fullName}
                </div>
                <div className="profile-email">
                    {email}
                </div>
                <div className="profile-badges">
                    <span className="badge badge-purple">
                        {roleName}
                    </span>
                    {departments.length > 0 ? (
                        departments.map((dept, index) => (
                            <span key={dept.dept_id || index} className="badge badge-cyan">
                                {dept.dept_name}
                            </span>
                        ))
                    ) : (
                        <span className="badge badge-cyan">
                            No Department
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}