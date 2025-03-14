import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailTemplateSchema } from "../../schemas/allSchema";
import { createTemplate, updateTemplate } from "../../features/email/emailSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpenText, faTimes } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const EditEmailTemplate = ({ initialData, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const quillRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
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
      reset({ ...initialData, updatedAt: new Date().toISOString() });
    }
  }, [initialData?._id, reset]);

  const handleQuillChange = (value) => {
    setValue("body", value);
    trigger("body");
  };

  const handleAttachmentChange = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ];
    const maxFileSize = 25 * 1024 * 1024;
    const validFiles = files.filter((file) => allowedTypes.includes(file.type) && file.size <= maxFileSize);

    if (validFiles.length !== files.length) {
      alert("Some files were invalid or too large. Please upload files under 25MB.");
      event.target.value = "";
    }

    setValue("attachments", validFiles);
    trigger("attachments");
  };

  const onSubmit = async (data) => {
    try {
      const quill = quillRef.current.getEditor(); // Reference to Quill Editor
      data.body = quill.getText(); // Extract plain text without HTML

      let response;
      if (initialData) {
        response = await dispatch(updateTemplate({ id: initialData._id, updatedData: data }));
      } else {
        response = await dispatch(createTemplate(data));
      }

      if (response.type.includes("/fulfilled")) {
        if (typeof onClose === "function") onClose();
        navigate("/email-list");
      }
    } catch (error) {
      console.error("Error submitting template:", error);
    }
  };

  useEffect(() => {
    if (!initialData) reset();
  }, [initialData, reset]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-white p-6 rounded-lg w-full max-w-lg space-y-6 shadow-xl border border-gray-200"
      >
        <button type="button" className="absolute top-3 right-3 text-gray-600 hover:text-gray-800" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>

        <h2 className="text-2xl font-bold text-gray-700 text-center">{initialData ? "Edit Template" : "Create Template"}</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Event Name</label>
          <select {...register("eventName")} className="border p-2 rounded-md w-full mt-1 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Select an event</option>
            <option value="ON_PURCHASE">On Purchase</option>
            <option value="ON_CANCEL">On Cancel</option>
          </select>
          {errors.eventName && <p className="text-red-500 text-xs mt-1">{errors.eventName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            {...register("subject")}
            className="border p-2 rounded-md w-full mt-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Subject"
          />
          {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Body</label>
          <ReactQuill ref={quillRef} value={watch("body")} onChange={handleQuillChange} className="border p-2 rounded-md w-full mt-1" />
          {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Attachments</label>
          <input type="file" multiple onChange={handleAttachmentChange} className="border p-2 rounded-md w-full mt-1 focus:ring-blue-500 focus:border-blue-500" />
          {errors.attachments && <p className="text-red-500 text-xs mt-1">{errors.attachments.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-all duration-300 disabled:bg-gray-400 space-x-2 mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting && <span className="loader mr-2" />}
          <FontAwesomeIcon icon={faEnvelopeOpenText} />
          <span>{initialData ? "Update Template" : "Create Template"}</span>
        </button>
      </form>
    </div>
  );
};

export default EditEmailTemplate;
