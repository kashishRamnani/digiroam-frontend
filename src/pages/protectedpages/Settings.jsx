import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { ContactList, MarkupPriceForm, ServiceLinks } from "../../components";

const Settings = () => {
  return (
    <DashboardLayout
      title="App Settings"
      description="Manage various app settings controlled by the admin."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          
          {/* Markup Price Form Card */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Markup Price Settings

            </h2>
            <MarkupPriceForm />
          </div>

          {/* Contact List Card */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Contact List
            </h2>
            <ContactList />
          </div>
{/* 
          {/* Service Links Card */}
         
            <ServiceLinks />

          
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
