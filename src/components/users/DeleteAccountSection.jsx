import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { RemoveConfirmationModal } from '../index'

const DeleteAccountSection = ({ onConfirmDelete, isLoading, handleClose }) => {
    const [showFinalConfirm, setShowFinalConfirm] = useState(false);
    const { register, handleSubmit, getValues, setError, formState: { errors } } = useForm();

    const handleConfirmation = async (password) => {
        const hasExecuted = await onConfirmDelete(password);
        if (hasExecuted) setShowFinalConfirm(false);
    }

    const onSubmit = () => {
        const password = getValues("password");
        if (!password) {
            setError("password", { type: "manual", message: "Password is required" });
            return;
        } setShowFinalConfirm(true);
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-labelledby="Deleting Account"
        // aria-hidden={!isAddToCartOpen}
        >
            <div className="bg-white rounded-lg items-center max-w-md w-full p-8 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
                >
                    &times;
                </button>

                <h3 className="text-2xl font-semibold mb-4 text-red-500">Delete Account</h3>
                <p className="text-sm text-gray-700 mb-4">
                    Deleting your account is permanent and will remove all your personal data.{" "}
                    <strong>This action cannot be undone.</strong>
                </p>
                <p className="text-sm text-gray-700 mb-6">
                    To continue, please confirm your password.
                </p>

                <div className="mb-3">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your account password"
                        className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.password ? "border-red-500" : "border-gray-300"
                            }`}
                        {...register("password", { required: "Password is required" })}
                    />
                    {errors.password && (
                        <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit(onSubmit)}
                        className={`w-full px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors rounded-lg ${isLoading && "opacity-60 cursor-not-allowed"}`}
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Final Confirmation Modal */}
            <RemoveConfirmationModal
                isVisible={showFinalConfirm}
                onCancel={() => setShowFinalConfirm(false)}
                onConfirm={() => {
                    const password = getValues("password");
                    handleConfirmation(password);
                }}
                title="Confirm Deletion"
                message="Are you absolutely sure you want to permanently delete your account? This action is irreversible. You will lose all access to your wallet, and all your eSIMs will be permanently cancelled."
                confirmLabel="Yes, Delete Permanently"
                isLoading={isLoading}
            />
        </div>
    );
};

export default DeleteAccountSection;
