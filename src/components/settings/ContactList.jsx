import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { retrieveSettings, updateSettings } from "../../features";
import { settingsSchema } from "../../schemas/allSchema";

const ContactList = () => {
    const dispatch = useDispatch();
    const { contactList } = useSelector((state) => state.settings);
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(settingsSchema),
        defaultValues: { contact: { field: "", label: "", href: "", isHidden: true } },
    });

    useEffect(() => {
        dispatch(retrieveSettings());
    }, [dispatch]);

    const onSubmit = (data) => {
        data.contact.isHidden = !data.contact.isHidden;
        dispatch(updateSettings(data));
        reset();
        // setIsEditing(false);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Contact List</h2>

            {/* Form to add a new one */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                <div>
                    <label htmlFor="field" className="block text-sm font-medium text-gray-700">Field Name</label>
                    <input
                        type="text" id="field" {...register("contact.field")}
                        className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${errors.contact?.field ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.contact?.field && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.contact?.field.message}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="label" className="block text-sm font-medium text-gray-700">Field Label</label>
                    <input
                        type="text" id="label" {...register("contact.label")}
                        className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${errors.contact?.label ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.contact?.label && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.contact?.label.message}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="href" className="block text-sm font-medium text-gray-700">Field Href Link (Optional)</label>
                    <input
                        type="text" id="href" {...register("contact.href")}
                        className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${errors.contact?.href ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.contact?.href && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.contact?.href.message}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="isHidden" className="me-3 text-sm font-medium text-gray-700">Should be visible instantly? (Show/Hide)</label>
                    <input
                        type="checkbox" className="cursor-pointer" id="isHidden" {...register("contact.isHidden")}
                    />
                    {errors.contact?.isHidden && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.contact?.isHidden.message}
                        </p>
                    )}
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="flex-1 justify-center flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm  font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
                    >
                        <FontAwesomeIcon icon={faSave} />
                        <span>Save</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactList;
