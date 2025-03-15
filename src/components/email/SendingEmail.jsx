import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendEmailAction, fetchTemplates } from "../../features/email/emailSlice";
import { fetchUsers } from "../../features/user/allUserSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const SendEmailForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { templates, message, loading, error } = useSelector((state) => state.email);
  const { users, loading: usersLoading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchUsers());
  }, [dispatch]);

  const [form, setForm] = useState({
    eventName: "",  // Will be auto-filled by the first template's event name.
    subject: "",
    body: "",
    user: "",
    email: "",
    orderNo: "", // Optional
    iccid: "", // Optional
  });

  const [formError, setFormError] = useState("");

  // Automatically select the first template if available
  useEffect(() => {
    if (templates.length > 0 && !form.eventName) {
      const firstTemplate = templates[0];
      setForm({
        eventName: firstTemplate.eventName,
        subject: firstTemplate.subject,
        body: firstTemplate.body,
        user: "",
        email: "",
        orderNo: "",
        iccid: "",
      });
    }
  }, [templates, form.eventName]);

  const handleTemplateChange = (e) => {
    const selectedEvent = e.target.value;
    const template = templates.find((t) => t.eventName === selectedEvent);
    if (template) {
      setForm({
        eventName: template.eventName,
        subject: template.subject,
        body: template.body,
        user: "",
        email: "",
        orderNo: "",
        iccid: "",
      });
    }
  };

  const handleUserChange = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = users?.users.find((user) => user._id === selectedUserId);

    if (selectedUser) {
      let updatedBody = form.body
        .replace("{{Customer_Name}}", selectedUser.name || "Customer")
        .replace("{{OrderNo}}", selectedUser.orderNo || "N/A")
        .replace("{{ICCID}}", selectedUser.iccid || "N/A");

      setForm({
        ...form,
        user: selectedUser.name,
        email: selectedUser.email,
        body: updatedBody,
        orderNo: selectedUser.orderNo || "",
        iccid: selectedUser.iccid || "",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const validEventNames = [
      "ON_LOGIN", "ON_PASSWORD_CHANGE", "ON_PURCHASE", "ON_CANCEL",
      "ON_USAGE_80", "ON_1D_VALIDITY", "ON_EXPIRED", "ON_DISCOUNT",
      "ON_ACTIVATION_REMINDER"
    ];
  
    // Assign a default event if not selected
    if (!form.eventName) {
      const defaultEvent = validEventNames[0]; // Choose the first valid event
      setForm((prevForm) => ({ ...prevForm, eventName: defaultEvent }));
    }
  
    const selectedEvent = form.eventName || validEventNames[0]; // Use default if empty
  
    if (!validEventNames.includes(selectedEvent)) {
      setFormError("Invalid event.");
      return;
    }
  
    if (!form.email) {
      alert("Please select a user before sending the email.");
      return;
    }
  
    setFormError("");
  
    const emailData = {
      eventName: selectedEvent,
      userEmail: form.email,
      orderNo: form.orderNo || null,  
      iccid: form.iccid || null,     
    };
  
    dispatch(sendEmailAction(emailData));
  };

  useEffect(() => {
    if (message) {
      alert("Email sent successfully!");
      setForm({
        eventName: "",
        user: "",
        email: "",
        orderNo: "",
        iccid: "",
      });
    }
  }, [message]);

  return (
    <div className="flex items-center justify-center h-auto py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 shadow-lg rounded-lg relative"
      >
        {/* Close Button */}
        {onClose && (
          <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-800" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        )}

        <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">Send Email</h2>


        {/* Select Event */}
        <label className="block font-semibold text-sm mb-1">Select Event:</label>
        <select
          name="eventName"
          value={form.eventName}
          onChange={handleTemplateChange}
          className="border p-2 w-full mb-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading || templates.length === 0}
        >
          <option value="">-- Choose --</option>
          {templates.map((template) => (
            <option key={template._id} value={template.eventName}>
              {template.eventName}
            </option>
          ))}
        </select>
        {formError && <p className="text-red-500 text-xs">{formError}</p>}

        {/* Select User */}
        <label className="block font-semibold text-sm mb-1">Choose a User:</label>
        <select
          name="user"
          value={form.user.name}
          onChange={handleUserChange}
          className="border p-2 w-full mb-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={usersLoading || !Array.isArray(users?.users) || users.users.length === 0}
        >
          <option value="">-- Choose --</option>
          {Array.isArray(users?.users) &&
            users.users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
        </select>

        {/* Optional Order Number */}
        <label className="block font-semibold text-sm mb-1">Order Number (Optional):</label>
        <input
          type="text"
          name="orderNo"
          value={form.orderNo}
          onChange={(e) => setForm({ ...form, orderNo: e.target.value })}
          className="border p-2 w-full mb-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Optional ICCID */}
        <label className="block font-semibold text-sm mb-1">ICCID (Optional):</label>
        <input
          type="text"
          name="iccid"
          value={form.iccid}
          onChange={(e) => setForm({ ...form, iccid: e.target.value })}
          className="border p-2 w-full mb-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default SendEmailForm;
