const RemoveConfirmationModal = ({ isVisible, onCancel, onConfirm }) => {
  if (!isVisible) return null;

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center top-0 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg items-center max-w-md w-full p-8 relative">
        <h2 className="text-lg font-semibold mb-4">Confirm Remove</h2>
        <p className="text-sm text-gray-700 mb-6">
          Are you sure you want to remove this item from the cart?
        </p>
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
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveConfirmationModal;
