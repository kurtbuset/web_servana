import { Filter } from "react-feather";

/**
 * DepartmentFilter - Dropdown for filtering by department
 */
export default function DepartmentFilter({
  departments,
  selectedDepartment,
  onDepartmentChange,
  isOpen,
  onToggle,
}) {
  return (
    <div className="relative p-4 flex text-center justify-between rounded-xl py-2 px-4 items-center m-4 shadow-sm bg-[#E6DCF7]">
      <button
        className="text-sm text-[#6237A0] w-full text-left focus:outline-none"
        onClick={onToggle}
      >
        {selectedDepartment}
      </button>
      <button
        className="text-[#6237A0] hover:text-purple-800 transition"
        onClick={onToggle}
      >
        <Filter size={16} />
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          {departments.map((dept) => (
            <div
              key={dept}
              className={`px-4 py-2 cursor-pointer hover:bg-[#E6DCF7] ${
                dept === selectedDepartment
                  ? "font-bold text-[#6237A0]"
                  : ""
              }`}
              onClick={() => {
                onDepartmentChange(dept);
                onToggle();
              }}
            >
              {dept}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
