const RemoveConfirmationModal = ({
  isVisible,
  onCancel,
  onConfirm,
  title = "Confirm Remove",
  message = "Are you sure you want to remove this item from the cart?",
  confirmLabel = "Remove",
  className = ""
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg w-full max-w-md p-8 shadow-lg relative ${className}`}>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-sm text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveConfirmationModal;
