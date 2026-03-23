import { FieldError } from "./types";

export const createFieldError = (error: string, formValues: any) => {
  let errorData: FieldError = {
    field: "",
    msg: error,
    input: "",
  };

  if (error.toLowerCase().includes("username")) {
    errorData.field = "username";
    errorData.input = formValues.username;
  } else if (error.toLowerCase().includes("password")) {
    errorData.field = "password";
    errorData.input = formValues.password;
  } else {
    errorData.field = "unknown";
  }

  return errorData;
};
