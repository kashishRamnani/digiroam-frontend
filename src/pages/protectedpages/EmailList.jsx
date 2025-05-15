import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTemplates,
  deleteTemplate,
  setCurrentPage,
} from "../../features/email/emailSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import Pagination from "../../components/common/Pagination";
import EmailTemplate from "../../components/email/EmailTemplate";
import SendEmailForm from "../../components/email/SendingEmail";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaTrash, FaEdit, FaPaperPlane } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loader } from "../../components"
const EmailTemplateList = () => {
  const dispatch = useDispatch();
  const { templates = [], currentPage, itemsPerPage, isLoading} = useSelector(
    (state) => state.email
  );
  
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
    } catch (error) {
      
    }
  };

  const totalPages = Math.ceil(templates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = templates.slice(startIndex, endIndex);

  return (
    <DashboardLayout>
        {isLoading && <Loader />}
      <div className="px-4 py-6">
        <div className="mb-2 flex justify-between items-center">
          <button
            onClick={() => {
              setSelectedTemplate(null);
              setShowTemplateForm(true);
            }}
            className="flex items-center space-x-2 text-white px-4 py-2 rounded-md"
            style={{ backgroundColor: "var(--secondary-color)" }}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Template</span>
          </button>
        </div>
      </div>

      
        <div className="table-container px-4">
          <table className="min-w-full bg-white table-auto max-w-full">
            <thead>
              <tr>
                {["Event Name", "Subject", "Body", "Attachments", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-2 py-4 text-center text-sm font-semibold text-gray-600 uppercase border-b"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {templates.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
                    No email templates available.
                  </td>
                </tr>
              ) : (
                currentItems.map((template,index) => (
                    
                  <tr key={index }>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {template.eventName}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-900">
                      {template.subject}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-900">
                      {template.body}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {template.attachments ? template.attachments.length : 0}
                    </td>
                    <td className="px-6 py-4 flex gap-4 justify-center">
                      <button
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowTemplateForm(true);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(template._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowSendEmailForm(true);
                        }}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FaPaperPlane size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    

      {templates.length > 0 && (
        <div className="mt-4">
          <Pagination pageCount={totalPages} currentPage={currentPage - 1} onPageChange={handlePageChange} />
        </div>
      )}

      {showTemplateForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <EmailTemplate initialData={selectedTemplate} onClose={() => setShowTemplateForm(false)} />
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
