import DashboardLayout from "../../layouts/DashboardLayout";
import { MarkupPriceForm } from "../../components";

const MarkupPrice = () => {
  return (
    <DashboardLayout
      title="Markup Price"
      description="The markup price for eSim plans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          <MarkupPriceForm />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarkupPrice;
