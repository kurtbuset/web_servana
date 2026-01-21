import Select from "react-select";

/**
 * TransferModal - Modal for selecting department to transfer to
 */
export default function TransferModal({
  isOpen,
  departments,
  selectedDepartment,
  currentDepartment,
  onDepartmentChange,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const departmentOptions = departments.map((dept) => ({
    value: dept,
    label: dept,
  }));

  const handleConfirm = (e) => {
    if (!selectedDepartment || selectedDepartment === currentDepartment) {
      e.preventDefault();
      return;
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-gray-400/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Transfer Department
        </h3>
        <div className="mb-6">
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Department
          </label>
          <Select
            options={departmentOptions}
            onChange={(selected) => {
              onDepartmentChange(selected?.value || null);
            }}
            value={
              departmentOptions.find(
                (option) => option.value === selectedDepartment
              ) || null
            }
            classNamePrefix="select"
            placeholder="Select a department"
            styles={{
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected
                  ? "#6237A0"
                  : state.isFocused
                  ? "#E6DCF7"
                  : "white",
                color: state.isSelected ? "white" : "#000000",
              }),
              control: (provided) => ({
                ...provided,
                borderColor: "#D1D5DB",
                minHeight: "42px",
                boxShadow: "none",
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#000000",
              }),
            }}
          />
        </div>
        <div className="flex justify-center gap-20">
          <button
            onClick={() => {
              onCancel();
              onDepartmentChange(null);
            }}
            className="px-5 py-2 border rounded-lg text-white bg-[#BCBCBC] hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={
              !selectedDepartment || selectedDepartment === currentDepartment
            }
            className={`px-5 py-2 text-white rounded-lg transition-colors ${
              selectedDepartment && selectedDepartment !== currentDepartment
                ? "bg-[#6237A0] hover:bg-[#4c2b7d]"
                : "bg-[#6237A0]/50 cursor-not-allowed"
            }`}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
