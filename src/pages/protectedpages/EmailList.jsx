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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaTrash, FaEdit, FaPaperPlane } from "react-icons/fa";
import { Loader } from "../../components";

const EmailTemplateList = () => {
  const dispatch = useDispatch();
  const { templates = [], currentPage, itemsPerPage = 10, isLoading } = useSelector(
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
      alert("Failed to delete template.");
    }
  };

const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentItems = templates.slice(startIndex, endIndex);
const totalPages = Math.ceil(templates.length / itemsPerPage);

  return (
    <DashboardLayout>
      {isLoading && <Loader />}
      <div className="relative px-4 py-6">
       <h2 className="text-2xl font-bold mb-4 text-gray-700">Email Templates</h2>
        {/* <button
          onClick={() => {
            setSelectedTemplate(null);
            setShowTemplateForm(true);
          }}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50 transition-all duration-300"
          title="Add Template"
        >
          <FontAwesomeIcon icon={faPlus} size="lg" />
        </button> */}
         <div className="px-4 py-4">
        <div className="mb-2 flex justify-between items-center ">
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
        <div className="grid grid-cols-1 md:grid-cols-2 p-4 lg:grid-cols-3 gap-6">
          {currentItems.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No email templates available.
            </div>
          ) : (
            currentItems.map((template) => (
              <div key={template._id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{template.eventName}</h3>
                <p className="text-sm text-gray-600 truncate">
                  <span className="font-medium">Subject:</span> {template.subject}
                </p>
                <p className="text-sm text-gray-600 mt-1 truncate">
                  <span className="font-medium">Body:</span> {template.body}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Attachments:</span>{" "}
                  {template.attachments ? template.attachments.length : 0}
                </p>

                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowTemplateForm(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(template._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <FaTrash size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowSendEmailForm(true);
                    }}
                    className="text-green-500 hover:text-green-700"
                    title="Send Email"
                  >
                    <FaPaperPlane size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {templates.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              pageCount={totalPages}
              currentPage={currentPage - 1}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {showTemplateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <EmailTemplate initialData={selectedTemplate} onClose={() => setShowTemplateForm(false)} />
        </div>
      )}

      {showSendEmailForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <SendEmailForm template={selectedTemplate} onClose={() => setShowSendEmailForm(false)} />
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmailTemplateList;
