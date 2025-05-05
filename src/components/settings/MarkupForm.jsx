import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { retrieveSettings, updateSettings } from "../../features";
import { settingsSchema } from "../../schemas/allSchema";

const MarkupPriceForm = () => {
    const dispatch = useDispatch();
    const { pricePercentage } = useSelector((state) => state.settings);
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(settingsSchema),
        defaultValues: { pricePercentage: 0 },
    });

    useEffect(() => {
        dispatch(retrieveSettings());
    }, [dispatch]);

    useEffect(() => {
        if (pricePercentage !== undefined) {
            reset({ pricePercentage });
        }
    }, [pricePercentage, reset]);

    const onSubmit = (data) => {

        dispatch(updateSettings(data));
        setIsEditing(false);
    };

    return (
        <div className="bg-white shadow-md lg:h-[70%] rounded-lg p-6  mx-4 mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Markup Percentage (%)</h2>

            {!isEditing ? (
                <div className="flex justify-between items-center">
                    <p className="text-lg text-gray-700 mt-4">
                        Current Markup <strong>{pricePercentage}%</strong>
                    </p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 ml-4 mt-4 justify-center flex items-center py-2 px-2 border border-transparent rounded-md shadow-sm  font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                        <span>Edit</span>
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                    <label className="text-sm font-medium text-gray-700">Set Markup Percentage (%)</label>
                    <input
                        {...register("pricePercentage")}
                        className={`pl-10 w-full rounded-md border bg-white py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary ${errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.pricePercentage && (
                        <p className="text-red-500 text-sm">{errors.pricePercentage.message}</p>
                    )}

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="flex-1 justify-center flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm  font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
                        >
                            <FontAwesomeIcon icon={faSave} className="me-3" />
                            <span className="ms-3">Save</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-400"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                            <span>Cancel</span>
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default MarkupPriceForm;
