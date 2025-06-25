import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { retrieveSettings, updateSettings } from "../../features";
import { settingsSchema } from "../../schemas/allSchema";
import getCurrencySymbol from "../../utils/helpers/getCurrencySymbol";

const MinTopupRange = () => {
    const dispatch = useDispatch();
    const { minTopupRange, loading } = useSelector((state) => state.settings);
    const [isEditing, setIsEditing] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(settingsSchema),
        defaultValues: { minTopupRange: 5 },
    });

    useEffect(() => {
        dispatch(retrieveSettings());
    }, [dispatch]);

    useEffect(() => {
        if (minTopupRange !== minTopupRange);
        reset({ minTopupRange })
    }, [minTopupRange, reset])

    const onSubmit = (data) => {
        dispatch(updateSettings(data));
        setIsEditing(false);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Minimum Wallet Top-up Amount (USD)</h2>
            {!isEditing ? (
                <div className="flex justify-between items-center gap-4">
                    <p className="text-lg text-gray-700">
                        Currently:  <strong>{getCurrencySymbol('USD')}{minTopupRange}</strong>
                    </p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="max-w-[40%] flex-1 justify-center flex items-center space-x-2 py-2 px-2 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                        <span>Edit</span>
                    </button>

                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                    <label className="text-sm font-medium text-gray-700">Update Minimum Wallet Top-up Amount (USD)</label>
                    <input
                        {...register("minTopupRange")}
                        className={`pl-4 w-full rounded-md border bg-white py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary ${errors.name ? 'border-red-500' : 'border-gray-300'
                            }`} />
                    {errors.minTopupRange && (
                        <p className="text-red-500 text-sm">{errors.minTopupRange.message}</p>
                    )}
                    <div className="flex justify-end space-x-4">
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-1 justify-center flex items-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"

                        >
                            <FontAwesomeIcon icon={faSave} />
                            <span>{loading ? "Updating..." : 'Save Changes'}</span>

                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="flex-1 bg-gray-300  text-gray-700 px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-400"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                            <span>Cancel</span>
                        </button>

                    </div>

                </form>
            )}

        </div>
    )


}
export default MinTopupRange;