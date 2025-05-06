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
  eventName: z.string().min(1, "Select any EventName."),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
  attachments: z.array(z.any()).optional(),
});

export const settingsSchema = z.object({
  pricePercentage: z
    .string().min(1).max(100).optional(),

  service: z
    .object({
      label: z
        .string()
        .min(2, "Label must be at least 2 characters long")
        .max(70, "Label must not exceed the 70 characters"),

      href: z
        .string()
        .min(5, "Href must be at least 5 characters long")
        .max(100, "Href must not exceed 100 characters"),

      isHidden: z.boolean().optional(),
    }).optional(),

  contact: z
    .object({
      field: z
        .string()
        .min(2, "Field must be at least 2 characters long")
        .max(20, "Field must not exceed the 20 characters"),

      label: z
        .string()
        .min(2, "Label must be at least 2 characters long")
        .max(70, "Label must not exceed the 70 characters"),

      href: z
        .string()
        .trim()
        .min(5, "Href must be at least 5 characters long")
        .max(100, "Href must not exceed 100 characters")
        .optional()
        .or(z.literal("")),

      isHidden: z.boolean().optional(),
    }).optional(),
});
