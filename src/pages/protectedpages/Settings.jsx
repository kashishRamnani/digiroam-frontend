import DashboardLayout from "../../layouts/DashboardLayout";
import { ContactList, MarkupPriceForm, ServiceLinks } from "../../components";

const Settings = () => {
  return (
    <DashboardLayout
      title="App Settings"
      description="Something that is controlled by the admin"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          <MarkupPriceForm />
        </div>
        <div className="w-full">
          <ContactList />
        </div>
        <div className="w-full">
          <ServiceLinks />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
