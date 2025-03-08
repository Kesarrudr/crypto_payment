enum StatusEnum {
  idle = "idle",
  loading = "loading",
  success = "success",
  error = "error",
}

interface ValidationErrors {
  username?: string;
  password?: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

export { StatusEnum, type ValidationErrors, type FormErrors };
