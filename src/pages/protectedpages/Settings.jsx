import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  ContactList,
  MarkupPriceForm,
  MinTopupRange,
  ServiceLinks,
} from "../../components";

const Settings = () => {
  return (
    <DashboardLayout
      title="App Settings"
      description="Manage various app settings controlled by the admin."
    >
      <div className="p-4 space-y-6">
        <div>
          <ContactList />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ServiceLinks />

          <div className="grid grid-cols-1 gap-3">
            <MarkupPriceForm />
            <MinTopupRange />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
