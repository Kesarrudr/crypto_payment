import z from "zod";

// Schema for registering a merchant
const RegisterMerchantSchema = z.object({
  username: z
    .string()
    .nonempty("Username can't be empty")
    .max(10, "Username can be a maximum of 10 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(10, "Password can be a maximum of 10 characters")
    .nonempty("Password is required"),
});

const MerchantDetialsSchema = z.object({
  username: z.string().nonempty("Username can't be empty"),
  publickey: z.string().nonempty("Must Provide a public Key"),
  mint: z.string().nonempty("Must provide a mint address"),
});

const MerchantUserNameQuery = z
  .object({
    username: z.string().nonempty("Can't be empty"),
  })
  .strict("not a valid query");

type merchantDetialsType = z.infer<typeof MerchantDetialsSchema>;
type merchantUserNameType = z.infer<typeof MerchantUserNameQuery>;
type RegisterMerchantType = z.infer<typeof RegisterMerchantSchema>;

// Export schemas
export {
  RegisterMerchantSchema,
  MerchantDetialsSchema,
  MerchantUserNameQuery,
  type merchantUserNameType,
  type merchantDetialsType,
  type RegisterMerchantType,
};
