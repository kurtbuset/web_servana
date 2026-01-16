import React, { useState } from "react";
import TopNavbar from "../components/TopNavbar";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleSidebar = () => {
        setMobileSidebarOpen((prev) => !prev);
    };

    const toggleDropdown = (name) => {
        setOpenDropdown((prev) => (prev === name ? null : name));
    };

    return (
        <>
            <div className="flex flex-col h-screen overflow-hidden">
                <TopNavbar toggleSidebar={toggleSidebar} />



                <div className="flex flex-1 overflow-hidden">
                    <Sidebar
                        isMobile={true}
                        isOpen={mobileSidebarOpen}
                        toggleDropdown={toggleDropdown}
                        openDropdown={openDropdown}
                        onClose={() => setMobileSidebarOpen(false)}
                    />

                    <Sidebar
                        isMobile={false}
                        toggleDropdown={toggleDropdown}
                        openDropdown={openDropdown}
                    />

                    <main className="flex-1 bg-gray-100 p-15 overflow-y-auto transition-colors duration-300">
                        <div className="bg-white p-4 rounded-lg flex flex-col flex-1 min-h-0 transition-all duration-300">
                            <h1>Dashboard</h1>
                        </div>
                    </main>


                </div>
            </div>

        </>
    )
}