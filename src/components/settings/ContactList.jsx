import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPlus } from "@fortawesome/free-solid-svg-icons";
import { retrieveSettings, updateSettings } from "../../features";
import { settingsSchema } from "../../schemas/allSchema";

const ContactList = () => {
  const dispatch = useDispatch();
  const { contactList } = useSelector((state) => state.settings);
  const [showForm, setShowForm] = useState(false); // Toggle state

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      contact: { field: "", label: "", href: "", isHidden: true },
    },
  });

  useEffect(() => {
    dispatch(retrieveSettings());
  }, [dispatch]);

  const onSubmit = (data) => {
    data.contact.isHidden = !data.contact.isHidden;
    dispatch(updateSettings(data));
    reset();
    setShowForm(false); // hide form after submission
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Contact List</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#FF7F5C] hover:bg-[#f67a55]/90 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm flex items-center gap-2 transition-all duration-200"
        >
          <FontAwesomeIcon icon={faPlus} />
          {showForm ? "Cancel" : "Add Contact"}
        </button>
      </div>

      <table className="w-full table-auto mt-4 border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Field</th>
            <th className="py-2 px-4 border-b">Label</th>
            <th className="py-2 px-4 border-b">Link</th>
            <th className="py-2 px-4 border-b">Visibility</th>
          </tr>
        </thead>
        <tbody>
          {contactList?.map((contact, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{contact.field}</td>
              <td className="py-2 px-4 border-b">{contact.label}</td>
              <td className="py-2 px-4 border-b">
                {contact.href ? <a href={contact.href} className="text-[#FF7F5C]">{contact.href}</a> : "N/A"}
              </td>
              <td className="py-2 px-4 border-b">{contact.isHidden ? "Hidden" : "Visible"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 mt-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Field Name
            </label>
            <input
              type="text"
              {...register("contact.field")}
              className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${errors.contact?.field ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.contact?.field && <p className="mt-2 text-sm text-red-600">{errors.contact?.field.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Field Label</label>
            <input
              type="text"
              {...register("contact.label")}
              className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${errors.contact?.label ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.contact?.label && <p className="mt-2 text-sm text-red-600">{errors.contact?.label.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Field Href Link (Optional)</label>
            <input
              type="text"
              {...register("contact.href")}
              className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${errors.contact?.href ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.contact?.href && <p className="mt-2 text-sm text-red-600">{errors.contact?.href.message}</p>}
          </div>

          {/* Toggle Switch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Should be visible instantly? (Show/Hide)</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("contact.isHidden")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#FF7F5C] transition-all"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
            </label>
            {errors.contact?.isHidden && <p className="mt-2 text-sm text-red-600">{errors.contact?.isHidden.message}</p>}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 justify-center flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactList;
