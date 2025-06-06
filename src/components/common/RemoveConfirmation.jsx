const RemoveConfirmationModal = ({
  isVisible,
  onCancel,
  onConfirm,
  title = "Confirm Remove",
  message = "Are you sure you want to remove this item from the cart?",
  confirmLabel = "Remove",
  className = "",
  children,
  isLoading 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className={`bg-white rounded-2xl w-full md:max-w-md max-w-sm px-6 py-7 md:p-8 shadow-lg relative ${className}`}>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-sm text-gray-700 mb-6">{message}</p>
        {children}
        <div className="flex justify-end space-x-3">
          <button
            disabled={isLoading}
            onClick={onCancel}
            className={`px-4 py-2 text-sm bg-gray-300 hover:bg-gray-300 rounded-lg disabled:bg-gray-100 ${isLoading && 'cursor-not-allowed'}`}
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:bg-red-300 ${isLoading && 'cursor-wait'}`}
          >
            {isLoading ? 'Loading...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveConfirmationModal;
