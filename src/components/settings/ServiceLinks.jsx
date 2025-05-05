import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { retrieveSettings, updateSettings } from "../../features";
import { settingsSchema } from "../../schemas/allSchema";
import { Link } from "react-router-dom";

const ServiceLinks = () => {
  const dispatch = useDispatch();
  const { serviceLinks, loading } = useSelector((state) => state.settings);
  const [isEditing, setIsEditing] = useState(null);
  const [addNew, setAddNew] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      service: {
        label: "",
        href: "",
      },
    },
  });

  useEffect(() => {
    dispatch(retrieveSettings());
  }, [dispatch]);

  const onSubmit = async (data) => {
    if (isEditing) {
      data.service._id = isEditing?._id;
    }
    data.service.isHidden = isEditing?.isHidden ?? false;
    const result = await dispatch(updateSettings(data));

    if (updateSettings.fulfilled.match(result)) {
      setIsEditing(null);
      setAddNew(false);
      reset();
    }
  };

  const handleEdit = (id) => {
    const service = serviceLinks.find((s) => s._id === id)
    setValue("service.label", service.label);
    setValue("service.href", service.href);
    setIsEditing(service);
  }

  const toggleVisibility = (id) => {
    const service = serviceLinks.find((s) => s._id === id);
    dispatch(updateSettings({ service: { ...service, isHidden: !service.isHidden } }))

  };

  const handleCloseForm = () => {
    setAddNew(false);
    setIsEditing(null);
    reset();
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      <div>
        <label htmlFor="label" className="block text-sm font-medium text-gray-700">
          Service Label
        </label>
        <input
          type="text"
          id="label"
          {...register("service.label")}
          className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${errors.service?.label ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.service?.label && <p className="text-red-600 text-sm">{errors.service.label.message}</p>}
      </div>

      <div>
        <label htmlFor="href" className="block text-sm font-medium text-gray-700">
          Service Href link
        </label>
        <input
          type="text"
          id="href"
          {...register("service.href")}
          className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${errors.service?.href ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.service?.href && <p className="text-red-600 text-sm">{errors.service.href.message}</p>}
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center py-2 px-4 bg-primary text-white rounded-md shadow-sm hover:bg-[#f67a55]/90 transition"
        >
          <FontAwesomeIcon icon={faSave} className="pe-2" />
          <span>{isEditing ? "Save Changes" : "Create"}</span>
        </button>

        <button
          type="button"
          onClick={handleCloseForm}
          className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-400"
        >
          <FontAwesomeIcon icon={faTimes} />
          <span>Cancel</span>
        </button>
      </div>
    </form>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6  mx-4 mt-10">
      <div className="mb-6">
        {!addNew && !isEditing && (
          <button
            type="button"
            onClick={() => {
              setAddNew(true);
              reset();
            }}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-[#f67a55]/90 transition"
            disabled={addNew || isEditing}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create Follow Us Link
          </button>
        )}
        {(addNew || isEditing) && renderForm()}
      </div>

      <div className="table-container">
      <table className="min-w-full bg-white table-auto max-w-full">
        <thead className="bg-gray-50">
          <tr className="text-xs font-semibold text-left text-gray-500 uppercase">
            <th className="px-1 py-2">Label</th>
            <th className="px-1 py-2" >Link</th>
            <th className="px-1 py-2">Visibility</th>
            <th className="px-1 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {serviceLinks.length > 0 ? (
            serviceLinks.map((service) => (
              <tr key={service._id} className="border-t">
                <td className="px-4 py-3 truncate">{service.label}</td>
                <td className="px-4 py-3 truncate">
                  <Link to={service.href} className="text-blue-500 underline">
                    {service.href}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!service.isHidden}
                      onChange={() => toggleVisibility(service._id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#FF7F5C] transition-all"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleEdit(service._id)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <FaEdit size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center px-4 py-4 text-gray-500">
                No services available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div >
  );
};

export default ServiceLinks;
