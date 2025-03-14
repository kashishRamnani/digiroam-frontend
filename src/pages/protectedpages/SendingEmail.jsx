import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendEmailAction, fetchTemplates } from "../../features/email/emailSlice";
import { fetchUsers } from "../../features/user/allUserSlice";
import DashboardLayout from "../../layouts/DashboardLayout";

const SendEmailForm = () => {
  const dispatch = useDispatch();
  const { templates, message, loading, error } = useSelector((state) => state.email);
  const { users, loading: usersLoading, error: usersError } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchUsers());
  }, [dispatch]);

  const [form, setForm] = useState({
    eventName: "",
    subject: "",
    body: "",
    user: "",
    email: "",
  });

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
      });
    }
  };

  const handleUserChange = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = users?.users.find((user) => user._id === selectedUserId);

    if (selectedUser) {
      console.log("Selected User:", selectedUser);

      let updatedBody = form.body
      .replace("{customerName}", selectedUser.name || "Customer")
      .replace("{planName}", selectedUser.planName || "Default Plan")
      .replace("{country}", selectedUser.country || "Default Country")
      .replace("{days}", selectedUser.days || "X")
      .replace("{dataLimit}", selectedUser.dataLimit || "Unlimited")
      .replace("{View Activation Guide}", "support@roamdigi.com")
      .replace("{supportEmail}", "support@roamdigi.com");
    
      setForm({
        ...form,
        user: selectedUser.name,
        email: selectedUser.email,
        body: updatedBody,
      });

      console.log("Updated Email:", selectedUser.email);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data Before Submission:", form);

    if (!form.email) {
      alert("Please select a user before sending the email.");
      return;
    }

    const emailData = {
      eventName: form.eventName,
      userEmail: form.email,
      
    };

    dispatch(sendEmailAction(emailData));
  };

  return (
    <DashboardLayout title="Send Email To User" description="Send an email to any user">
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white p-6 shadow-lg rounded-lg"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Send an Email</h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && <p className="text-green-500 text-sm text-center">{message}</p>}

          {/* Select Email Type */}
          <label className="block font-semibold mb-1">Select Email Type:</label>
          <select
            name="eventName"
            value={form.eventName}
            onChange={handleTemplateChange}
            className="border p-2 w-full mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading || templates.length === 0}
          >
            <option value="">-- Choose an Event Name --</option>
            {templates.map((template) => (
              <option key={template._id} value={template.eventName}>
                {template.eventName}
              </option>
            ))}
          </select>

          {/* Choose a User */}
          <label className="block font-semibold mb-1">Choose a User:</label>
          <select
            name="user"
            value={form.user.name}
            onChange={handleUserChange}
            className="border p-2 w-full mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={usersLoading || !Array.isArray(users?.users) || users.users.length === 0}
          >
            <option value="">---- Choose a User ----</option>
            {Array.isArray(users?.users) &&
              users?.users.length > 0 &&
              users.users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
          </select>

          {/* Subject */}
          <label className="block font-semibold mb-1">Subject:</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="border p-2 w-full mb-3 rounded-md"
          />

          {/* Email Content */}
          <label className="block font-semibold mb-1">Email Content:</label>
          <textarea
            name="body"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            className="border p-2 w-full mb-3 rounded-md"
            rows="4"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-all duration-300 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default SendEmailForm;
