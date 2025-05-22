import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailTemplateSchema } from "../../schemas/allSchema";
import { createTemplate, updateTemplate, fetchTemplates } from "../../features/email/emailSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpenText, faTimes } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const EmailTemplate = ({ initialData, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const quillRef = useRef(null);

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
  const allEvents = ["ON_LOGIN", "ON_PASSWORD_CHANGE", "ON_PURCHASE", "ON_CANCEL", "ON_USAGE_80", "ON_1D_VALIDITY", "ON_EXPIRED", "ON_DISCOUNT", "ON_ACTIVATION_REMINDER"];

  const existingEventNames = templates.map((template) => template.eventName);
  const availableEvents = allEvents.filter(
    (event) => !existingEventNames.includes(event) || event === initialData?.eventName
  );


  useEffect(() => {
    if (initialData?.body) {
      setValue("body", initialData.body);
    }
  }, [initialData?.body, setValue]);

  const handleAttachmentChange = (event) => {
    const files = Array.from(event.target.files);
    setValue("attachments", files);
    trigger("attachments");
  };


  const onSubmit = async (data) => {

    data.body = quillRef.current?.getData() || data.body;

    const action = initialData
      ? updateTemplate({ id: initialData._id, updatedData: data })
      : createTemplate(data);

    await dispatch(action);
    dispatch(fetchTemplates());
    onClose?.();
    navigate("/email-list");
  };

 return(
       <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 px-8 sm:px-8"
      role="dialog"
      aria-labelledby="cart-modal-title"
      aria-hidden={!initialData}
    >
      <div className="bg-white rounded-lg p-3   w-full sm:w-3/4 lg:max-w-3xl md:ml-[15%] lg:left-[20%]shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 id="cart-modal-title" className="text-lg pt-3 sm:text-xl font-semibold">
                    {initialData ? "Edit Template" : "Create Template"}
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close cart modal"
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
          {!initialData ? (
            <div>
              <label className="block text-sm font-medium text-gray-600">Event Name  <span className="text-red-500">*</span></label>
              <select
                {...register("eventName")}
                className="border bg-white p-2 rounded-lg w-full mt-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select an event</option>
                {availableEvents.map((event) => (
                  <option key={event} value={event}>
                    {event.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              {errors.eventName && (
                <p className="text-red-500 text-xs mt-1">{errors.eventName.message}</p>
              )}
            </div>
          ) : (
            /* Show event name as plain text in Edit mode */
            <div>
              <label className="block text-sm font-medium text-gray-600">Event Name
                <span className="text-red-500">*</span>
              </label>
              <p className="border p-1 rounded-lg w-full mt-1 bg-gray-100">
                {initialData.eventName.replace(/_/g, " ")}
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm p-1 font-medium text-gray-700">Subject
              <span className="text-red-500">*</span>
            </label>
            <input
              {...register("subject")}
              className="border p-2  rounded-md w-full bg-white"
              placeholder="Enter Subject"
            />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Attachments  </label>
            <input type="file" multiple onChange={handleAttachmentChange} max={5} className="border p-2 rounded-md w-full mt-1 focus:ring-blue-500 focus:border-blue-500" />
            {errors.attachments && <p className="text-red-500 text-xs mt-1">{errors.attachments.message}</p>}
          </div>

          {/* Body (ReactQuill) */}

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Body  <span className="text-red-500">*</span></label>
            <div className="quill-wrapper">
              
              <CKEditor
              className="border p-2 rounded-md w-full mt-1 focus:ring-blue-500 focus:border-blue-500"
                editor={ClassicEditor}
                data={watch("body")}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setValue("body", data);
                  trigger("body");
                }}
                onReady={(editor) => {
                  quillRef.current = editor;
                }}
              />

            </div>
            {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex py-2  justify-end space-x-4">
            <button
              type="button"
              className="px-4  bg-gray-500 text-white rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
            >
              <FontAwesomeIcon icon={faEnvelopeOpenText} className="mr-2 " />
              {initialData ? "Update Template" : "Create Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailTemplate;
