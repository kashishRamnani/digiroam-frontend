import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { retrieveSettings, updateSettings } from "../../features";
import { settingsSchema } from "../../schemas/allSchema";
import { Link } from "react-router-dom";

const ServiceLinks = () => {
    const dispatch = useDispatch();
    const { serviceLinks, loading } = useSelector((state) => state.settings);
    const [isEditing, setIsEditing] = useState(false);
    const [addNew, setAddNew] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(settingsSchema),
        defaultValues: { service: { label: "", href: "", isHidden: true } },
    });

    useEffect(() => {
        dispatch(retrieveSettings());
    }, [dispatch]);

    const onSubmit = (data) => {
        data.service.isHidden = !data.service.isHidden;
        dispatch(updateSettings(data));
        reset();
        setAddNew(false);
    };

    const renderAddForm = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                <div>
                    <label htmlFor="label" className="block text-sm font-medium text-gray-700">Serice Label</label>
                    <input
                        type="text" id="label" {...register("service.label")}
                        className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${errors.service?.label ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.service?.label && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.service?.label.message}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="href" className="block text-sm font-medium text-gray-700">Service Href link</label>
                    <input
                        type="text" id="href" {...register("service.href")}
                        className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${errors.service?.href ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.service?.href && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.service?.href.message}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="isHidden" className="me-3 text-sm font-medium text-gray-700">Should be visible instantly? (Show/Hide)</label>
                    <input
                        type="checkbox" className="cursor-pointer" id="isHidden" {...register("service.isHidden")}
                    />
                    {errors.service?.isHidden && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.service?.isHidden.message}
                        </p>
                    )}
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="flex-1 justify-center flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm  font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
                    >
                        <FontAwesomeIcon icon={faSave} className="pe-2" />
                        <span>Save</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => { setAddNew(false); reset() }}
                        className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-400"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                        <span>Close</span>
                    </button>
                </div>
            </form >

        )
    }
    const renderEditForm = (service) => {
        return (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                <div>
                    <label htmlFor="label" className="block text-sm font-medium text-gray-700">Serice Label</label>
                    <input
                        value={service.label}
                        type="text" id="label" {...register("service.label")}
                        className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${errors.service?.label ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.service?.label && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.service?.label.message}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="href" className="block text-sm font-medium text-gray-700">Service Href link</label>
                    <input
                        value={service.href}
                        type="text" id="href" {...register("service.href")}
                        className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${errors.service?.href ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.service?.href && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.service?.href.message}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="isHidden" className="me-3 text-sm font-medium text-gray-700">Should be visible instantly? (Show/Hide)</label>
                    <input
                        value={service.isHidden}
                        type="checkbox" className="cursor-pointer" id="isHidden" {...register("service.isHidden")}
                    />
                    {errors.service?.isHidden && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.service?.isHidden.message}
                        </p>
                    )}
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="flex-1 justify-center flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm  font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
                    >
                        <FontAwesomeIcon icon={faSave} className="pe-2" />
                        <span>Save Changes</span>
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
            </form >

        )
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Service Links</h2>

            {addNew
                ? renderAddForm()
                : <button
                    type="button"
                    onClick={() => setAddNew(true)}
                    className="flex-1 justify-center flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm  font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
                >
                    <FontAwesomeIcon icon={faPlus} className="pe-2" />
                    <span>Share a Service</span>
                </button>
            }

            <div>
                <table className="w-full whitespace-no-wrap">
                    <thead>
                        <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                            <th className="px-4 py-3">Label</th>
                            <th className="px-4 py-3">Link</th>
                            <th className="px-4 py-3">Visibility</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                        {serviceLinks.length > 0 ? (
                            serviceLinks.map((service, index) => (
                                <tr key={service.href} className="text-gray-700">
                                    {isEditing && isEditing == index
                                        ? renderEditForm(service)
                                        : <>
                                            <td className="px-4 py-3">{service.label}</td>
                                            <td className="px-4 py-3 ">
                                                <Link to={service.href}>{service.href}</Link>
                                            </td>
                                            <td className="px-4 py-3">{service.isHidden ? "Hidden" : "Shown"}</td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => setIsEditing(index)}>Edit</button>
                                            </td>
                                        </>}
                                </tr>
                            ))
                        ) : (
                            <tr className="text-gray-700 text-center">
                                <td className="px-4 py-3 text-italic">No Serive</td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default ServiceLinks;
