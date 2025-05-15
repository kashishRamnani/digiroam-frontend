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

const contactList = () => {
  const dispatch = useDispatch();
  const { contactList, loading } = useSelector((state) => state.settings);
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
      contact: {
        field: "",
        label: "",
        href: "",
      },
    },
  });

  const onSubmit = async (data) => {
    if (!data.contact?.href) delete data.contact.href;

    if (isEditing) {
      data.contact._id = isEditing?._id;
    }
    data.contact.isHidden = isEditing?.isHidden ?? false;
    const result = await dispatch(updateSettings(data));

    if (updateSettings.fulfilled.match(result)) {
      setIsEditing(null);
      setAddNew(false);
      reset();
    }
  };

  const handleEdit = (id) => {
    const contact = contactList.find((s) => s._id === id)
    setValue("contact.field", contact.field);
    setValue("contact.label", contact.label);
    setValue("contact.href", contact.href);
    setIsEditing(contact);
  }

  const toggleVisibility = (id) => {
    let contact = contactList.find((s) => s._id === id);
    if (!contact) return;

    const { href, ...rest } = contact;
    contact = {
      ...rest,
      ...(href !== null && { href }),
      isHidden: !contact.isHidden,
    };
    dispatch(updateSettings({ contact }));
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
          Contact Field
        </label>
        <input
          type="text"
          id="label"
          {...register("contact.field")}
          className={`mt-1 block w-full px-1 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${errors.contact?.field ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.contact?.field && <p className="text-red-600 text-sm">{errors.contact.field.message}</p>}
      </div>

      <div>
        <label htmlFor="label" className="block text-sm font-medium text-gray-700">
          Contact Label
        </label>
        <input
          type="text"
          id="label"
          {...register("contact.label")}
          className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${errors.contact?.label ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.contact?.label && <p className="text-red-600 text-sm">{errors.contact.label.message}</p>}
      </div>

      <div>
        <label htmlFor="href" className="block text-sm font-medium text-gray-700">
          Contact Href link
        </label>
        <input
          type="text"
          id="href"
          {...register("contact.href")}
          className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${errors.contact?.href ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.contact?.href && <p className="text-red-600 text-sm">{errors.contact.href.message}</p>}
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
    <div className="bg-white table-container  shadow-md rounded-lg p-8  mx-4 mt-10">
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
            Create Contact Link
          </button>
        )}
        {(addNew || isEditing) && renderForm()}
      </div>

      <div className="table-container">
        <table className="min-w-full  bg-white table-auto max-w-full">
          <thead className="bg-gray-50">
            <tr className="text-xs font-semibold text-left text-gray-500 uppercase">
              <th className="px-2 py-2">Field</th>
              <th className="px-2 py-2">Label</th>
              <th className="px-2 py-2">Link</th>
              <th className="px-2 py-2">Visibility</th>
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>
          <tbody>

            {contactList.length > 0 ? (
              contactList.map((contact) => (
                <tr key={contact._id} className="border-t">
                  <td className="px-2 py-3 truncate">{contact.field}</td>
                  <td className="px-2 py-3 truncate">{contact.label}</td>
                  <td className="px-2 py-3 truncate">
                    {contact?.href ? <Link to={contact.href} className="text-blue-500 underline">{contact.href}</Link> : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!contact.isHidden}
                        onChange={() => toggleVisibility(contact._id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#FF7F5C] transition-all"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(contact._id)}
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
                  No contacts available.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div >
  );
};

export default contactList;
