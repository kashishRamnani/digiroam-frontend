import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailTemplateSchema } from "../../schemas/allSchema";
import { createTemplate, updateTemplate, fetchTemplates } from "../../features/email/emailSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpenText, faTimes } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const EditEmailTemplate = ({ initialData, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const quillRef = useRef(null);

  // Get templates from Redux
  const templates = useSelector((state) => state.email.templates || []);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: initialData || {
      _id: "",
      eventName: "",
      subject: "",
      body: "",
      attachments: [],
    },
  });

  const allEvents =  ["ON_LOGIN", "ON_PASSWORD_CHANGE", "ON_PURCHASE", "ON_CANCEL", "ON_USAGE_80", "ON_1D_VALIDITY", "ON_EXPIRED", "ON_DISCOUNT", "ON_ACTIVATION_REMINDER"]

  const existingEventNames = templates.map((template) => template.eventName);
  const availableEvents = allEvents.filter(
    (event) => !existingEventNames.includes(event) || event === initialData?.eventName
  );

  useEffect(() => {
    if (initialData?.body) {
      setValue("body", initialData.body.trim());
    }
  }, [initialData?.body, setValue]);
 
  
  const handleQuillChange = (value) => {
    setValue("body", value);
    trigger("body");
  };
  const onSubmit = async (data) => {
    data.body = quillRef.current?.getEditor()?.getText().trim() || data.body;
  
    const action = initialData
      ? updateTemplate({ id: initialData._id, updatedData: data })
      : createTemplate(data);
  
    await dispatch(action);
    dispatch(fetchTemplates());
    onClose?.();
    navigate("/email-list");
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-lg space-y-6 shadow-xl border border-gray-200">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>

        <h2 className="text-2xl font-bold text-gray-700 text-center">
          {initialData ? "Edit Template" : "Create Template"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Event Name</label>
            <select
              {...register("eventName")}

              className="border p-2 rounded-lg w-full mt-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an event</option>
              {availableEvents.map((event) => (
                <option key={event} value={event}>{event.replace(/_/g, " ")}</option>
              ))}
            </select>
            {errors.eventName && (
              <p className="text-red-500 text-xs mt-1">{errors.eventName.message}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              {...register("subject")}
              className="border p-2 rounded-md w-full"
              placeholder="Enter Subject"
            />
            {errors.subject && (
              <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
            )}
          </div>

          {/* Body (ReactQuill) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Body</label>
            <ReactQuill
              ref={quillRef}
              value={watch("body")}
              onChange={handleQuillChange}
               className=" h-40 overflow-y-auto"
            />
            {errors.body && (
              <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
            >
              <FontAwesomeIcon icon={faEnvelopeOpenText} className="mr-2" />
              {initialData ? "Update Template" : "Create Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmailTemplate;
