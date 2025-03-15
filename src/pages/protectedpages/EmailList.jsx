import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTemplates, deleteTemplate, setCurrentPage } from "../../features/email/emailSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import Pagination from "../../components/common/Pagination";
import EditEmailTemplate from "../../components/email/EditEmailTemplate";
import SendEmailForm from "../../components/email/SendingEmail";
import { FaPlus, FaTrash, FaEdit, FaPaperPlane } from "react-icons/fa";

const EmailTemplateList = () => {
  const dispatch = useDispatch();
  const { templates = [], currentPage, itemsPerPage } = useSelector((state) => state.email);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showSendEmailForm, setShowSendEmailForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow = showTemplateForm || showSendEmailForm ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showTemplateForm, showSendEmailForm]);

  const handlePageChange = ({ selected }) => {
    dispatch(setCurrentPage(selected + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const totalPages = Math.ceil(templates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = templates.slice(startIndex, endIndex);

  return (
    <DashboardLayout title="Email Templates" description="All email templates with attachments">
      <div className="container mx-auto overflow-x-auto px-6 py-8">
        <table className="min-w-full bg-white ">
          <thead>
            <tr>
              {["Event Name", "Subject", "Body", "Attachments", "Actions"].map((header) => (
                <th key={header} className="px-6 py-6 text-center text-sm font-semibold text-gray-600 uppercase border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 ">
            {currentItems.map((template) => (
              <tr key={template.id}>
                <td className="px-6 py-6 whitespace-nowrap text-gray-900">{template.eventName}</td>
                <td className="px-6 py-4 max-w-xs truncate text-gray-900">{template.subject}</td>
                <td className="px-6 py-4 max-w-xs truncate text-gray-900">{template.body}</td>
                <td className="px-6 py-4 text-gray-900">{template.attachments ? template.attachments.length : 0}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => { setSelectedTemplate(template); setShowTemplateForm(true); }} className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(template._id)} className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600">
                    <FaTrash />
                  </button>
                  <button onClick={() => { setSelectedTemplate(template); setShowSendEmailForm(true); }} className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600">
                    <FaPaperPlane />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {templates.length > 0 && (
        <div className="mt-4">
          <Pagination pageCount={totalPages} currentPage={currentPage - 1} onPageChange={handlePageChange} />
        </div>
      )}

<div className="flex justify-end m-4">
  <button
    onClick={() => {
      setSelectedTemplate(null);
      setShowTemplateForm(true);
    }}
    className="w-12 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center justify-center"
  >
    <FaPlus />
  </button>
</div>


      {showTemplateForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <EditEmailTemplate initialData={selectedTemplate} onClose={() => setShowTemplateForm(false)} />
        </div>
      )}

      {showSendEmailForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <SendEmailForm template={selectedTemplate} onClose={() => setShowSendEmailForm(false)} />
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmailTemplateList;
