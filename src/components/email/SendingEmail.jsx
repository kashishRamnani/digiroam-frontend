import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendEmailAction, fetchTemplates } from "../../features/email/emailSlice";
import { fetchUsers } from "../../features/user/allUserSlice";

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
    user: "", // Initially set recipient as empty
  });

  const handleTemplateChange = (e) => {
    const selectedEvent = e.target.value;
    const template = templates.find((t) => t.eventName === selectedEvent);
    if (template) {
      setForm({
        eventName: template.eventName,
        subject: template.subject,
        body: template.body, // Set the template body
        user: "", // Clear the user when template is changed
      });
    }
  };

  const handleUserChange = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = users?.users.find((user) => user._id === selectedUserId);
    if (selectedUser) {
      // Replace placeholders in the email body with the user's name and email
      let updatedBody = form.body;
      updatedBody = updatedBody.replace("{{name}}", selectedUser.name);
      updatedBody = updatedBody.replace("{{eventName}}", form.eventName); // Optionally replace other placeholders
  
      setForm({ 
        ...form, 
        user: selectedUser.name, 
        email: selectedUser.email, 
        body: updatedBody 
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  
    
    const emailData = {
      eventName: form.eventName,   
      userEmail: form.email,       
    };
  
    
    dispatch(sendEmailAction(emailData)); 
  };
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 shadow-lg rounded-lg"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Send an Email</h2>

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

        <label className="block font-semibold mb-1">Choose a User:</label>
        <select
          name="user"
          value={form.user.name}
          onChange={handleUserChange}
          className="border p-2 w-full mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={usersLoading || !Array.isArray(users?.users) || users.users.length === 0}
        >
          <option value="">---- Choose a User ----</option>
          {Array.isArray(users?.users) && users?.users.length > 0 && users.users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>

        <label className="block font-semibold mb-1">Subject:</label>
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="border p-2 w-full mb-3 rounded-md"
        />

        <label className="block font-semibold mb-1">Email Content:</label>
        <textarea
          name="body"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          className="border p-2 w-full mb-3 rounded-md"
          rows="4"
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
  );
};

export default SendEmailForm;
