import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const CityEnum = z.enum(["Chandigarh","Mohali","Zirakpur","Panchkula","Other"]);
export const PropertyTypeEnum = z.enum(["Apartment","Villa","Plot","Office","Retail"]);
export const BHKEnum = z.enum(["BHK1","BHK2","BHK3","BHK4","Studio"]);
export const PurposeEnum = z.enum(["Buy","Rent"]);
export const TimelineEnum = z.enum(["M0_3m","M3_6m","GT>6m","Exploring"]);
export const SourceEnum = z.enum(["Website","Referral","Walk_in","Call","Other"]);
export const StatusEnum = z.enum(["New","Qualified","Contacted","Visited","Negotiation","Converted","Dropped"]);

const base = {
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal("")).optional(),
  phone: z.string().regex(/^\d{10,15}$/, "Phone must be 10-15 digits"),
  city: CityEnum,
  propertyType: PropertyTypeEnum,
  purpose: PurposeEnum,
  budgetMin: z.number().int().nonnegative().optional().nullable(),
  budgetMax: z.number().int().nonnegative().optional().nullable(),
  timeline: TimelineEnum,
  source: SourceEnum,
  notes: z.string().max(1000).optional().nullable(),
  tags: z.array(z.string()).optional(),
  status: StatusEnum.optional()
};

export const createBuyerSchema = z.object({
  ...base,
  bhk: z.string().optional() // we'll refine below
}).superRefine((data, ctx) => {
  if (["Apartment", "Villa"].includes(data.propertyType)) {
    if (!data.bhk) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "BHK required for Apartment/Villa", path: ["bhk"]});
    else if (!["BHK1","BHK2","BHK3","BHK4","Studio"].includes(data.bhk)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid BHK", path: ["bhk"]});
  }

  if (data.budgetMin != null && data.budgetMax != null && data.budgetMax < data.budgetMin) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "budgetMax must be >= budgetMin", path: ["budgetMax"] });
  }
});
export type BuyerInput = z.infer<typeof createBuyerSchema>;