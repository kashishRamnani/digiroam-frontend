const RemoveConfirmationModal = ({
  isVisible,
  onCancel,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  className = "",
  children,
  isLoading,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`bg-white rounded-lg w-full md:max-w-md max-w-sm p-6 relative ${className}`}>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          {children && <div className="pt-2">{children}</div>}
          <div className="pt-4 flex justify-end gap-3">
            <button
              disabled={isLoading}
              onClick={onCancel}
              className={`px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"}`}
            // className={`px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors rounded-lg disabled:bg-red-300 disabled:cursor-wait`}
            >
              {isLoading ? "Please wait..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveConfirmationModal;
