import * as z from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Phone number must be in E.164 format (e.g., +1234567890) or a valid international format"
    )
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  countryID: z.string().optional(),
});

export const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const dataPackagesSchema = z.object({
  locationCode: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  slug: z.string().optional().nullable(),
  packageCode: z.string().optional().nullable(),
  iccid: z.string().optional().nullable(),
});

export const filterProductSchema = z.object({
  locationCode: z.string().optional(),
  type: z.string().optional(),
});
export const emailTemplateSchema = z.object({
  eventName: z.enum(["ON_PURCHASE", "ON_CANCEL"], {
    errorMap: () => ({ message: "Invalid event. Choose 'ON_PURCHASE' or 'ON_CANCEL'." }),
  }),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
  attachments: z.array(z.any()).optional(),
 
});

export const sendEmailSchema = z.object({
  recipient: z.string().email("Invalid email format"), 
  eventName: z.string().min(1, "Event name is required"),
  params: z.record(z.string().min(1, "Value is required")),
})
