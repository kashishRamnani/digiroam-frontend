import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendEmailAction, fetchTemplates } from "../../features/email/emailSlice";
import { fetchUsers } from "../../features/user/allUserSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const SendEmailForm = ({ template, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { templates, loading: templatesLoading } = useSelector((state) => state.email);
  const { users, loading: usersLoading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchUsers());
  }, [dispatch]);

  const [form, setForm] = useState({
    eventName: template?.eventName || "",
    subject: template?.subject || "",
    body: template?.body || "",
    user: "",
    email: "",
    orderNo: "",
    iccid: "",
  });

  useEffect(() => {
    if (templates.length > 0 && !form.eventName) {
      const firstTemplate = templates[0];
      setForm((prev) => ({
        ...prev,
        eventName: firstTemplate.eventName,
        subject: firstTemplate.subject,
        body: firstTemplate.body,
      }));
    }
  }, [templates]);

  const handleUserChange = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = users?.find((user) => user._id === selectedUserId);

    if (selectedUser) {
      setForm((prev) => ({
        ...prev,
        user: selectedUserId,
        email: selectedUser.email,
        body: prev.body
          .replace(/{{Customer_Name}}/g, selectedUser.name || "Customer")
          .replace(/{{Order_No}}/g, selectedUser.orderNo || "")
          .replace(/{{ICCID}}/g, selectedUser.iccid || ""),
        orderNo: selectedUser.orderNo || "",
        iccid: selectedUser.iccid || "",
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) return;

    const emailData = {
      eventName: form.eventName,
      userEmail: form.email,
      orderNo: form.orderNo || null,
      iccid: form.iccid || null,
    };

    try {
      await dispatch(sendEmailAction(emailData)).unwrap();
      onClose?.();
      navigate("/email-list");
    } catch (error) {

    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Send Email</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Name */}
          <label className="block text-sm font-medium text-gray-700">Event Name:</label>
          <input
            name="eventName"
            value={form.eventName}
            className="border p-2 w-full mb-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />

          {/* Select User */}
          <label className="block text-sm font-medium text-gray-700">Choose a User:</label>
          <select
            name="user"
            value={form.user}
            onChange={handleUserChange}
            className="border p-2 rounded-md w-full bg-white"
            disabled={usersLoading || !users?.length}
          >
            <option value="">-- Choose --</option>
            {users?.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>

          {/* Order Number */}
          <label className="block text-sm font-medium text-gray-700">Order Number (Optional):</label>
          <input
            type="text"
            name="orderNo"
            value={form.orderNo}
            onChange={(e) => setForm({ ...form, orderNo: e.target.value })}
            className="border p-2 rounded-md w-full bg-white"
          />

          {/* ICCID */}
          <label className="block text-sm font-medium text-gray-700">ICCID (Optional):</label>
          <input
            type="text"
            name="iccid"
            value={form.iccid}
            className="border p-2 rounded-md w-full bg-white"
            onChange={(e) => setForm({ ...form, iccid: e.target.value })}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="flex w-full  justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
            disabled={templatesLoading || !form.user}
          >
            {templatesLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendEmailForm;
