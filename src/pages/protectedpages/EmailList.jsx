import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTemplates, deleteTemplate } from "../../features/email/emailSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import EditEmailTemplate from "../../components/email/EditEmailTemplate";

const EmailTemplateList = () => {
  const dispatch = useDispatch();
  const { templates = [], loading, error } = useSelector((state) => state.email);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow = showTemplateForm ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showTemplateForm]);

  // Handle template deletion
  const handleDelete = async (id) => {
    try {
      const response = await dispatch(deleteTemplate(id));

      if (!response.payload || response.payload.success === false) {
        throw new Error(response.payload?.message || "Delete failed");
      }

      console.log("Email template deleted successfully.");
    } catch (error) {
      console.error("Error deleting email template:", error.message);
    }
  };

  return (
    <DashboardLayout title="Email Templates" description="All email templates with attachments">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md relative">
        {/* Empty State */}
        {!loading && templates.length === 0 && (
          <p className="text-gray-500 text-center">
            No templates found. Click "Create  Template" to create one.
          </p>
        )}

        {/* Templates List */}
        {templates.map((template) => (
          <div key={template?._id} className="border p-4 rounded-md mb-3 shadow-sm bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">{template.subject}</h2>
            <p className="text-gray-600">{template.body}</p>
            <div className="flex space-x-4 mt-2">
              {/* Edit Button */}
              <button
                onClick={() => {
                  setSelectedTemplate(template); // Set the selected template
                  setShowTemplateForm(true);

                }}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
              >
                Edit
              </button>
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(template?._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Email Template Form (Modal) */}
        {showTemplateForm && (
          <div
            className="fixed inset-0 bg-opacity-50 flex items-center justify-center"
            onClick={() => setShowTemplateForm(false)}
          >
            <div
              className="p-6 rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <EditEmailTemplate initialData={selectedTemplate} onClose={() => setShowTemplateForm(false)} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmailTemplateList;
