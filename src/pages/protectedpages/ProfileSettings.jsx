import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faClock,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useTranslation } from "react-i18next";
import { ProfileForm, PasswordForm } from "../../components";
import {
  getMyProfile,
  updateProfile,
  resetProfileState,
} from "../../features/user/userSlice";
import { fetchCountries } from "../../features/countries/countriesSlice";

const ProfileSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, profileUpdated, passwordChanged, loading } = useSelector(
    (state) => state.userProfile
  );
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name.substring(0, 2).toUpperCase());
    }
  }, [user]);

  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(fetchCountries());
  }, []);

  useEffect(() => {
    if (profileUpdated || passwordChanged) {
      dispatch(resetProfileState());
    }
  }, [profileUpdated, passwordChanged]);

  const onSubmitProfile = async (data) => {
    const result = await dispatch(updateProfile(data));
    if (updateProfile.fulfilled.match(result)) {
      dispatch(getMyProfile());
    }
  };

  return (
    <DashboardLayout
      title={t("profileSettings.title")}
      description={t("profileSettings.description")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6 hidden lg:block">
              <div
                className="relative w-48 h-48 text-4xl mx-auto flex rounded-full items-center justify-center text-white font-semibold"
                style={{ backgroundColor: "var(--primary-color)" }}
              >
                {userName}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Activity Overview
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={faChartLine}
                      className="text-primary"
                    />
                    <span className="text-gray-600">Total Purchases</span>
                  </div>
                  <span className="font-semibold">124</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faClock} className="text-primary" />
                    <span className="text-gray-600">Purchased Plans</span>
                  </div>
                  <span className="font-semibold">256</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="text-primary"
                    />
                    <span className="text-gray-600">Member Since</span>
                  </div>
                  <span className="font-semibold">Jan 2024</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <ProfileForm profile={profile} onSubmit={onSubmitProfile} />
            <PasswordForm />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSettings;
