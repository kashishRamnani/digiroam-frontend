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

const ServiceLinks = () => {
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

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Markup Price Settings</h2>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Markup Price Settings</h2>

            {!isEditing ? (
                <div className="flex justify-between items-center">
                    <p className="text-lg text-gray-700">
                        Current Markup Price: <strong>{pricePercentage}%</strong>
                    </p>
                    <button
                        onClick={() => setIsEditing(true)}
                       className="flex-1 ml-4 justify-center flex items-center py-2 px-2 border border-transparent rounded-md shadow-sm  font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                        <span>Edit</span>
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                    <label className="text-sm font-medium text-gray-700">Set Markup Percentage</label>
                    <select
                        {...register("pricePercentage")}
                        className="border rounded-md py-2 px-3 focus:ring focus:ring-blue-300"
                    >
                         {[...Array(100).keys()].map(i => (
                        <option key={i + 1} value={i + 1}>{i + 1}%</option>
                    ))}
                       
                    </select>
                    {errors.pricePercentage && (
                        <p className="text-red-500 text-sm">{errors.pricePercentage.message}</p>
                    )}

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="flex-1 justify-center flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm  font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
                        >
                            <FontAwesomeIcon icon={faSave} />
                            <span>Save</span>
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

export default ServiceLinks;
