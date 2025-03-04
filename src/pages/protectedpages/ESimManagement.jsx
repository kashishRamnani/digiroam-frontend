import React from "react";
import { useSelector, useDispatch } from "react-redux";
import DashboardLayout from "../../layouts/DashboardLayout";

const ESimManagement = () => {
  const { isLoading } = useSelector((state) => state.plans);
  return (
    <DashboardLayout>
      {isLoading && <Loader />}
      <div className="container mx-auto px-6 py-8">
        <h3 className="text-3xl font-medium text-gray-700">
          Manage your eSim Effectively!!
        </h3>
        <div className="mt-8">
          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="text-gray-700">
                      <td className="px-4 py-3">
                        <div className="flex items-center text-sm">
                          <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                            <div
                              className="absolute inset-0 rounded-full shadow-inner"
                              aria-hidden="true"
                              style={{
                                backgroundColor: "var(--primary-color)",
                              }}
                            ></div>
                          </div>
                          <div>
                            <p className="font-semibold">Client {item}</p>
                            <p className="text-xs text-gray-600">Developer</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">$ {item * 100}</td>
                      <td className="px-4 py-3 text-xs">
                        <span
                          className="px-2 py-1 font-semibold leading-tight rounded-full"
                          style={{
                            backgroundColor: "var(--primary-color)",
                            color: "white",
                          }}
                        >
                          Approved
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date().toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ESimManagement;
