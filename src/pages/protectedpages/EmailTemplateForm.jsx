import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailTemplateSchema } from "../../schemas/allSchema";
import { createTemplate, updateTemplate } from "../../features/email/emailSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";
<<<<<<< HEAD:src/components/email/EmailTemplateForm.jsx
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
=======
import DashboardLayout from "../../layouts/DashboardLayout";
>>>>>>> 12e06a2ceba6cc4cd1aef5299e4bba4c94f465b6:src/pages/protectedpages/EmailTemplateForm.jsx

const EmailTemplateForm = ({ initialData, onClose }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      _id: initialData?._id || "",
      eventName: initialData?.eventName || "",
      subject: initialData?.subject || "",
      body: initialData?.body || "",
      attachments: initialData?.attachments || [],
    },
  });

  useEffect(() => {
    if (initialData?._id) {
      reset({
        ...initialData,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [initialData?._id, reset]);

  const handleAttachmentChange = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = ["application/pdf", "application/docx", "application/pptx", "application/txt"];
    const maxFileSize = 25 * 1024 * 1024;

    const validFiles = files.filter(
      (file) => allowedTypes.includes(file.type) && file.size <= maxFileSize
    );

    if (validFiles.length !== files.length) {
      alert("Some files were invalid or too large. Please upload files under 5MB.");
      event.target.value = "";
    }

    setValue("attachments", validFiles);
  };

  const onSubmit = async (data) => {
    try {
      let response;
      if (initialData) {
        response = await dispatch(updateTemplate({ id: initialData._id, updatedData: data }));
      } else {
        response = await dispatch(createTemplate(data));
      }

      if (response.type === 'email/createTemplate/fulfilled' || response.type === 'email/updateTemplate/fulfilled') {
        alert('Template saved successfully!');
      } else {
        alert('Error saving template!');
      }

      if (typeof onClose === "function") {
        onClose();
      }
    } catch (error) {
      alert('Failed to save template. Please try again.');
    }
  };

  useEffect(() => {
    if (!initialData) {
      reset();
    }
  }, [initialData, reset]);

  return (
<<<<<<< HEAD:src/components/email/EmailTemplateForm.jsx
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
=======
    <DashboardLayout title="Create Email Template" description="Form to create a new event specific email template">
      <div className="flex items-center justify-center min-h-screen">
>>>>>>> 12e06a2ceba6cc4cd1aef5299e4bba4c94f465b6:src/pages/protectedpages/EmailTemplateForm.jsx
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-white p-6 rounded-lg w-full max-w-lg space-y-5 shadow-lg"
      >
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>

        <div>
          <label className="text-sm font-medium text-gray-700">Event Name</label>
          <select {...register("eventName")} className="border p-2 rounded-md w-full mt-1">
            <option value="">Select an event</option>
            <option value="ON_PURCHASE">On Purchase</option>
            <option value="ON_CANCEL">On Cancel</option>
          </select>
          {errors.eventName && <p className="text-red-500 text-xs mt-1">{errors.eventName.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Subject</label>
          <input
            {...register("subject")}
            className="border p-2 rounded-md w-full mt-1"
            placeholder="Enter Subject"
            aria-invalid={errors.subject ? "true" : "false"}
            aria-describedby={errors.subject ? "subject-error" : undefined}
          />
          {errors.subject && (
            <p id="subject-error" className="text-red-500 text-xs mt-1" aria-live="assertive">
              {errors.subject.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Body</label>
          <ReactQuill
            value={watch("body")}
            onChange={(value) => setValue("body", value)}
            className="border p-2 rounded-md w-full mt-1"
            placeholder="Enter email body"
          />
          {errors.body && <p className="text-red-500 text-xs mt-1" aria-live="assertive">{errors.body.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Attachments</label>
          <input
            type="file"
            multiple
            onChange={handleAttachmentChange}
            className="border p-2 rounded-md w-full mt-1"
          />
          {errors.attachments && (
            <p className="text-red-500 text-xs mt-1" aria-live="assertive">{errors.attachments.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 mt-4"
          disabled={isSubmitting || Object.keys(errors).length > 0}
        >
          {isSubmitting && (
            <span className="loader mr-2" style={{ visibility: isSubmitting ? "visible" : "hidden" }} />
          )}
          <FontAwesomeIcon icon={faPaperPlane} />
          <span>{initialData ? "Update Template" : "Create Template"}</span>
        </button>
      </form>
    </div>
    </DashboardLayout>
  );
};

export default EmailTemplateForm;
