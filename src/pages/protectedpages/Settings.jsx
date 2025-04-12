import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { ContactList, MarkupPriceForm, ServiceLinks } from "../../components";

const Settings = () => {
  return (
    <DashboardLayout
      title="App Settings"
      description="Manage various app settings controlled by the admin."
    >
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-2 gap-6 items-start">
        <ContactList />
        <ServiceLinks />
        <MarkupPriceForm />
      </div>

    </DashboardLayout>
  );
};

export default Settings;
