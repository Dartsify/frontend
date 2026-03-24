import { FieldError } from "./types";

// PLUS UTILISÉ
export const createFieldError = (error: string, formValues: any) => {
  let errorData: FieldError = {
    field: "",
    message: error,
    value: "",
  };

  if (error.toLowerCase().includes("username")) {
    errorData.field = "username";
    errorData.value = formValues.username;
  } else if (error.toLowerCase().includes("password")) {
    errorData.field = "password";
    errorData.value = formValues.password;
  } else {
    errorData.field = "unknown";
  }

  return errorData;
};
