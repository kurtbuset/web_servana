import Modal from "../../../components/Modal";
import Select from "react-select";
import { useTheme } from "../../../context/ThemeContext";

/**
 * ChatsModals - All modal dialogs for ChatsScreen
 * 
 * Props grouped into 2 objects:
 * - state: Modal visibility and data state
 * - actions: All handlers and setters
 */
export default function ChatsModals({ state, actions }) {
  const { isDark } = useTheme();
  
  const {
    showEndChatModal,
    showTransferModal,
    showTransferConfirmModal,
    allDepartments,
    transferDepartment,
    selectedDepartment,
  } = state;

  const {
    confirmEndChat,
    cancelEndChat,
    setTransferDepartment,
    handleDepartmentSelect,
    confirmTransfer,
    cancelTransfer,
    cancelTransferConfirm,
  } = actions;

  const departmentOptions = allDepartments.map((dept) => ({
    value: dept.dept_name,
    label: dept.dept_name,
  }));

  const handleTransferConfirm = () => {
    if (!transferDepartment || transferDepartment === selectedDepartment) {
      return;
    }
    handleDepartmentSelect();
  };

  return (
    <>
      {/* End Chat Modal */}
      <Modal
        isOpen={showEndChatModal}
        onClose={cancelEndChat}
        title="End Chat"
        size="md"
        isDark={isDark}
        actions={[
          {
            label: "Cancel",
            onClick: cancelEndChat,
            variant: "secondary"
          },
          {
            label: "Confirm",
            onClick: confirmEndChat,
            variant: "danger"
          }
        ]}
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to end this chat session?
        </p>
      </Modal>

      {/* Transfer Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => {
          cancelTransfer();
          setTransferDepartment(null);
        }}
        title="Transfer Department"
        size="md"
        isDark={isDark}
        actions={[
          {
            label: "Cancel",
            onClick: () => {
              cancelTransfer();
              setTransferDepartment(null);
            },
            variant: "secondary"
          },
          {
            label: "Select",
            onClick: handleTransferConfirm,
            variant: "primary",
            disabled: !transferDepartment || transferDepartment === selectedDepartment
          }
        ]}
      >
        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Select Department
          </label>
          <Select
            options={departmentOptions}
            onChange={(selected) => {
              setTransferDepartment(selected?.value || null);
            }}
            value={
              departmentOptions.find(
                (option) => option.value === transferDepartment
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
                  : isDark ? "#2d2d2d" : "white",
                color: state.isSelected ? "white" : isDark ? "#e5e7eb" : "#000000",
              }),
              control: (provided) => ({
                ...provided,
                backgroundColor: isDark ? "#2d2d2d" : "white",
                borderColor: isDark ? "#4a4a4a" : "#D1D5DB",
                minHeight: "42px",
                boxShadow: "none",
              }),
              singleValue: (provided) => ({
                ...provided,
                color: isDark ? "#e5e7eb" : "#000000",
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: isDark ? "#2d2d2d" : "white",
              }),
            }}
          />
        </div>
      </Modal>

      {/* Transfer Confirm Modal */}
      <Modal
        isOpen={showTransferConfirmModal}
        onClose={cancelTransferConfirm}
        title="Confirm Transfer"
        size="md"
        isDark={isDark}
        actions={[
          {
            label: "Cancel",
            onClick: cancelTransferConfirm,
            variant: "secondary"
          },
          {
            label: "Confirm",
            onClick: confirmTransfer,
            variant: "primary"
          }
        ]}
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to transfer this customer to {transferDepartment}?
        </p>
      </Modal>
    </>
  );
}
