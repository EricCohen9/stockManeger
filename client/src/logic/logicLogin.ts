import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client/core";
import { SubmitHandler } from "react-hook-form";
import * as Yup from "yup";
import { ForgotPasswordData } from "../interface/loginInterface";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Enter a valid email"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
});

const validationEmail = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Enter a valid email"),
});

const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

const COMPARE_PASSWORD_MUTATION = gql`
  mutation ComparePassword($email: String!, $code: String!) {
    comperepassword(email: $email, code: $code)
  }
`;

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($email: String!, $password: String!) {
    resetPassword(email: $email, password: $password) {
      success
      message
    }
  }
`;

const FetchRecover: SubmitHandler<ForgotPasswordData> = async (data) => {
  const [forgotPassword] = useMutation(FORGOT_PASSWORD_MUTATION);

  try {
    const result = await forgotPassword({
      variables: {
        email: data.valueInput,
      },
    });

    console.log(result);
    localStorage.setItem("EmailVerification", data.valueInput);
  } catch (error: any) {
    console.error("Error sending ForgotPassword mutation:", error.message);
  }
};

const FetchComparePassword: SubmitHandler<ForgotPasswordData> = async (data) => {
  const EmailVerification = localStorage.getItem("EmailVerification");
  const [comparePassword] = useMutation(COMPARE_PASSWORD_MUTATION);

  try {
    const result = await comparePassword({
      variables: {
        email: EmailVerification,
        code: data.valueInput,
      },
    });

    console.log(result);
  } catch (error: any) {
    console.error("Error sending ComparePassword mutation:", error.message);
  }
};

const FetchResetPassword: SubmitHandler<ForgotPasswordData> = async (data) => {
  const EmailVerification = localStorage.getItem("EmailVerification");
  const [resetPassword] = useMutation(RESET_PASSWORD_MUTATION);

  try {
    const result = await resetPassword({
      variables: {
        email: EmailVerification,
        password: data.valueInput,
      },
    });

    console.log(result);
  } catch (error: any) {
    console.error("Error sending ResetPassword mutation:", error.message);
  }
};

export { validationSchema, validationEmail, FetchRecover, FetchComparePassword, FetchResetPassword };
