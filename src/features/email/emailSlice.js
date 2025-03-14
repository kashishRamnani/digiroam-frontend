import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

// Fetch email templates
export const fetchTemplates = createAsyncThunk(
  'email/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/email-templates');
<<<<<<< HEAD
      console.log('Fetched templates:', response.data); // Log the response data
      return response.data.emailTemplates || []; // Return the emailTemplates array explicitly
=======
      return Array.isArray(response.data) ? response.data : [];
>>>>>>> 12e06a2ceba6cc4cd1aef5299e4bba4c94f465b6
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch templates');
    }
  }
);

export const createTemplate = createAsyncThunk(
  "email/createTemplate",
  async (templateData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      const { eventName, subject, body, attachments } = templateData;

      formData.append("eventName", eventName);
      formData.append("subject", subject);
      formData.append("body", body);

<<<<<<< HEAD
      if (attachments?.length > 0) {
        const uploadedFileUrls = [];

        // Upload each file using axiosInstance
        for (let file of attachments) {
          const fileFormData = new FormData();
          fileFormData.append("file", file);

          const fileUploadResponse = await axiosInstance.post("uploads", fileFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          // Assuming the server responds with the file URL
          if (fileUploadResponse?.data?.fileUrl) {
            uploadedFileUrls.push(fileUploadResponse.data.fileUrl);
          } else {
            throw new Error("File upload failed");
          }
        }

        // Append the uploaded file URLs to the form data
        uploadedFileUrls.forEach((fileUrl) => {
          formData.append("attachments[]", fileUrl);
=======
      if (attachments?.length === 1) {
        formData.append("attachments", attachments[0]);
      } else if (attachments?.length > 1) {
        attachments.forEach((file) => {
          formData.append("attachments[]", file);
>>>>>>> 12e06a2ceba6cc4cd1aef5299e4bba4c94f465b6
        });
      }

      const response = await axiosInstance.post("/email-templates", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error during form submission:", error);
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
      const response = await axiosInstance.post('/email/send', { eventName, params,userEmail });
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
    loading: false,
    successMessage: '',
    error: null,
  },
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = '';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
        showSuccessToast('Templates loaded successfully!');
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showErrorToast(action.payload);
      })

      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.push(action.payload);
        state.successMessage = 'Template created successfully!';
        showSuccessToast(state.successMessage);
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showErrorToast(action.payload);
      })

      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.templates.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.templates[index] = action.payload;
        state.successMessage = 'Template updated successfully!';
        showSuccessToast(state.successMessage);
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showErrorToast(action.payload);
      })

      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.filter((t) => t._id !== action.payload);
        state.successMessage = 'Template deleted successfully!';
        showSuccessToast(state.successMessage);
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showErrorToast(action.payload);
      })

      .addCase(sendEmailAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendEmailAction.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Email sent successfully!';
        showSuccessToast(state.successMessage);
      })
      .addCase(sendEmailAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showErrorToast(action.payload);
      });
  },
});

export const { clearSuccessMessage, clearError } = emailSlice.actions;
export default emailSlice.reducer;
