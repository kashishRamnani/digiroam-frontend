import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { ContactList, MarkupPriceForm, MinTopupRange, ServiceLinks } from "../../components";

const Settings = () => {
  return (
    <DashboardLayout
      title="App Settings"
      description="Manage various app settings controlled by the admin."
    >
      <div className="grid lg:grid-cols-1 items-start">
        <ContactList />
        <div className="grid lg:grid-cols-2">
        <ServiceLinks />
        <MarkupPriceForm />
         <MinTopupRange/>

        </div>
        
      </div>
     
    </DashboardLayout>
  );
};

export default Settings;
