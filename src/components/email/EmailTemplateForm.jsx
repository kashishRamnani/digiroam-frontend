import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailTemplateSchema } from "../../schemas/allSchema";
import { createTemplate, updateTemplate } from "../../features/email/emailSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";

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
    const allowedTypes = ["application/pdf"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter(
      (file) => allowedTypes.includes(file.type) && file.size <= maxFileSize
    );

    if (validFiles.length !== files.length) {
      alert("Some files were invalid or too large. Please upload files under 5MB.");
      event.target.value = ""; // Reset the file input if files are invalid
    }

    setValue("attachments", validFiles);
  };

  const onSubmit = async (data) => {
    console.log("Form Data Submitted:", data); // Log the form data
    try {
      let response;
      if (initialData) {
        console.log("Updating Template with ID:", initialData._id);
        response = await dispatch(updateTemplate({ id: initialData._id, updatedData: data }));
      } else {
        console.log("Creating New Template");
        response = await dispatch(createTemplate(data)); // Log the API call
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
      console.error("Error submitting template:", error);
      alert('Failed to save template. Please try again.');
    }
  };

  useEffect(() => {
    if (!initialData) {
      reset(); // Clear form on close
    }
  }, [initialData, reset]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-white p-6 rounded-lg w-96 space-y-5 shadow-md"
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
          <select {...register("eventName")} className="border p-2 rounded-md w-full">
            <option value="">Select an event</option>
            <option value="ON_PURCHASE">On Purchase</option>
            <option value="ON_CANCEL">On Cancel</option>
          </select>
          {errors.eventName && <p className="text-red-500">{errors.eventName.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Subject</label>
          <input
            {...register("subject")}
            className="border p-2 rounded-md w-full"
            placeholder="Enter Subject"
            aria-invalid={errors.subject ? "true" : "false"}
            aria-describedby={errors.subject ? "subject-error" : undefined}
          />
          {errors.subject && <p id="subject-error" className="text-red-500" aria-live="assertive">{errors.subject.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Body</label>
          <textarea
            {...register("body")}
            className="border p-2 rounded-md w-full"
            rows="4"
            placeholder="Enter email body"
          ></textarea>
          {errors.body && <p className="text-red-500" aria-live="assertive">{errors.body.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Attachments</label>
          <input
            type="file"
            multiple
            onChange={handleAttachmentChange}
            className="border p-2 rounded-md w-full"
          />
          {errors.attachments && <p className="text-red-500" aria-live="assertive">{errors.attachments.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors flex items-center justify-center space-x-2"
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
  );
};

export default EmailTemplateForm;
