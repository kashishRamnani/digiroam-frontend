import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendEmailAction, fetchTemplates } from "../../features/email/emailSlice";
import DashboardLayout from "../../layouts/DashboardLayout";

const SendEmailForm = () => {
  const dispatch = useDispatch();
  const { templates, message, loading, error } = useSelector((state) => state.email);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const [form, setForm] = useState({
    eventName: "",
    recipient: "",
    subject: "",
    body: "",
  });

  const handleTemplateChange = (e) => {
    const selectedEvent = e.target.value;
    const template = templates.find((t) => t.eventName === selectedEvent);
    if (template) {
      setForm({
        eventName: template.eventName,
        subject: template.subject,
        body: template.body,
        recipient: form.recipient,
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendEmailAction(form));
  };

  return (
    <DashboardLayout title="Send Email To User" description="Send an email to any user">
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white p-6 shadow-lg rounded-lg"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Send an Email
          </h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && <p className="text-green-500 text-sm text-center">{message}</p>}

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

          <label className="block font-semibold mb-1">Recipient Email:</label>
          <input
            type="email"
            name="recipient"
            value={form.recipient}
            onChange={handleChange}
            placeholder="Enter recipient email"
            className="border p-2 w-full mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <label className="block font-semibold mb-1">Subject:</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            className="border p-2 w-full mb-3 rounded-md bg-gray-100 cursor-not-allowed"
            readOnly
          />

          <label className="block font-semibold mb-1">Email Content:</label>
          <textarea
            name="body"
            value={form.body}
            className="border p-2 w-full mb-3 rounded-md bg-gray-100 cursor-not-allowed"
            rows="4"
            readOnly
          />

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
