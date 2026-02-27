/**
 * DepartmentUsersPanel - Discord-style right sidebar showing department team members
 * 
 * This is a re-export of the modular component structure.
 * See ./DepartmentUsersPanel/ folder for individual components.
 * 
 * Usage:
 * ```jsx
 * const [isDepartmentPanelOpen, setIsDepartmentPanelOpen] = useState(false);
 * 
 * <button onClick={() => setIsDepartmentPanelOpen(!isDepartmentPanelOpen)}>
 *   Toggle Department Panel
 * </button>
 * 
 * <DepartmentUsersPanel 
 *   isOpen={isDepartmentPanelOpen} 
 *   onClose={() => setIsDepartmentPanelOpen(false)} 
 * />
 * ```
 */
export { default } from "./DepartmentUsersPanel/index";
