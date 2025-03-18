import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { z } from "zod";
import { retrieveSettings, updateSettings } from "../../features";

const schema = z.object({
    pricePercentage: z.string().min(0).max(100, "Must be between 0 and 100"),
});

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
        resolver: zodResolver(schema),
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

    const viewMood = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">The markup price is {pricePercentage}% on each eSim plan</h2>
            <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors flex items-center justify-center space-x-2"
            >
                <FontAwesomeIcon icon={faEdit} />
                <span>Edit</span>
            </button>
        </div>
    );

    const editMood = () => (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="text-sm font-medium text-gray-700">Price Percentage (%)</label>
                <select
                    {...register("pricePercentage")}
                    className={`w-full rounded-md border py-2 px-3 text-sm focus:ring-primary outline-none ${errors.pricePercentage ? "border-red-500" : "border-gray-300"}`}
                >
                    {[...Array(100).keys()].map(i => (
                        <option key={i + 1} value={i + 1}>{i + 1}%</option>
                    ))}
                </select>
                {errors.pricePercentage && (
                    <p className="text-red-500 text-xs mt-1">{errors.pricePercentage.message}</p>
                )}
            </div>
            <div className="flex space-x-4">
                <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors flex items-center justify-center space-x-2"
                >
                    <FontAwesomeIcon icon={faSave} />
                    <span>Save</span>
                </button>
                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                >
                    <FontAwesomeIcon icon={faTimes} />
                    <span>Cancel</span>
                </button>
            </div>
        </form>
    );

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {isEditing ? editMood() : viewMood()}
        </div>
    );
};

export default MarkupPriceForm;