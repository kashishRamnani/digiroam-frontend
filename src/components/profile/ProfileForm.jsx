import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faSave,
  faEdit,
  faTimes,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { profileSchema } from "../../schemas/allSchema";
import { useSelector } from "react-redux";

const ProfileForm = ({ profile, onSubmit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { countries } = useSelector((state) => state.countries);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
      phoneNumber: profile?.phoneNumber || "",
      address: profile?.address || "",
      countryID: profile?.countryID || "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
        countryID: profile.countryID || "",
      });
    }
  }, [profile, reset]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmitWrapper = (data) => {
    onSubmit(data);
    setIsEditing(false);
  };

  const renderViewMode = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <p className="text-lg font-semibold break-words">{profile?.name}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <p className="text-lg font-semibold break-words">{profile?.email}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <p className="text-lg font-semibold break-words">
            {profile?.phoneNumber || "Not provided"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Address</label>
          <p className="text-lg font-semibold break-words">
            {profile?.address || "Not provided"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Country</label>
          <p className="text-lg font-semibold break-words">
            {countries.find((c) => c._id === profile?.countryID)?.countryName ||
              "Not provided"}
          </p>
        </div>
      </div>
      <button
        onClick={handleEdit}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors flex items-center justify-center space-x-2"
      >
        <FontAwesomeIcon icon={faEdit} />
        <span>Edit Profile</span>
      </button>
    </div>
  );

  const renderEditMode = () => (
    <form onSubmit={handleSubmit(onSubmitWrapper)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Name *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faUser} className="text-gray-400" />
            </div>
            <input
              {...register("name")}
              className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
            </div>
            <input
              {...register("email")}
              className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
            </div>
            <input
              {...register("phoneNumber")}
              className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-gray-400"
              />
            </div>
            <input
              {...register("address")}
              className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Country</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faGlobe} className="text-gray-400" />
            </div>
            <select
              {...register("countryID")}
              className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country._id} value={country._id}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors flex items-center justify-center space-x-2"
        >
          <FontAwesomeIcon icon={faSave} />
          <span>Save Changes</span>
        </button>
        <button
          type="button"
          onClick={handleCancel}
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Profile Information
      </h2>
      {isEditing ? renderEditMode() : renderViewMode()}
    </div>
  );
};

export default ProfileForm;
