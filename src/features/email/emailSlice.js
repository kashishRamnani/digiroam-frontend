import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

// Fetch email templates
export const fetchTemplates = createAsyncThunk(
  'email/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/email-templates');
      return response.data.emailTemplates || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch templates');
    }
  }
);

// Create email template
export const createTemplate = createAsyncThunk(
  "email/createTemplate",
  async ({ eventName, subject, body, attachments }, { rejectWithValue }) => {
    try {
      if (!eventName || !subject || !body) {
        return rejectWithValue("Event Name, Subject, and Body are required.");
      }

      const formData = new FormData();
      formData.append("eventName", eventName);
      formData.append("subject", subject);
      formData.append("body", body);

      if (attachments?.length > 0) {
        // Upload all files in parallel
        const uploadPromises = attachments.map(async (file) => {
          const fileFormData = new FormData();
          fileFormData.append("file", file);

          const fileUploadResponse = await axiosInstance.post("uploads", fileFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (fileUploadResponse?.data?.fileUrl) {
            return fileUploadResponse.data.fileUrl;
          } else {
            throw new Error("File upload failed");
          }
        });

       
        const uploadedFileUrls = await Promise.all(uploadPromises);

        // Append all file URLs to the form data
        uploadedFileUrls.forEach((url) => {
          formData.append("attachments[]", url);
        });
      }

      const response = await axiosInstance.post("/email-templates", formData, {
        headers: { "Content-Type": "multipart/form-data", Accept: "application/json" },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "An error occurred while creating the template");
    }
  }
);


// Update an email template
export const updateTemplate = createAsyncThunk(
  'email/updateTemplate',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/email-templates/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update template');
    }
  }
);

// Delete an email template
export const deleteTemplate = createAsyncThunk(
  'email/deleteTemplate',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/email-templates/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete template');
    }
  }
);

// Send email
export const sendEmailAction = createAsyncThunk(
  'email/sendEmail',
  async ({ eventName, params, userEmail }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/email/send', { eventName, params, userEmail });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send email');
    }
  }
);

// Email slice
const emailSlice = createSlice({
  name: 'email',
  initialState: {
    templates: [],
    currentPage: 1,
    itemsPerPage: 10,
    isLoading: false,
    successMessage: '',
    error: null,
  },
  reducers: {
    clearSuccessMessage: (state) => { state.successMessage = ''; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => { 
        state.isLoading = true; })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
       
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        showErrorToast(action.payload);
      })

      .addCase(createTemplate.pending, (state) => { state.isLoading = true; })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates.push(action.payload);
       
       
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        showErrorToast(action.payload);
      })

      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.templates.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.templates[index] = action.payload;
        state.successMessage = 'Template updated successfully!';
        showSuccessToast(state.successMessage);
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = state.templates.filter((t) => t._id !== action.payload);
        state.successMessage = 'Template deleted successfully!';
        showSuccessToast(state.successMessage);
      })

      .addCase(sendEmailAction.fulfilled, (state) => {
        state.isLoading = false;
        state.successMessage = 'Email sent successfully!';
        showSuccessToast(state.successMessage);
      });
  },
});

export const { clearSuccessMessage, clearError,setCurrentPage  } = emailSlice.actions;
export default emailSlice.reducer;
