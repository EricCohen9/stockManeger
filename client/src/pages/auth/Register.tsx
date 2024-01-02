import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStatus } from "../../redux/slices/userSlice";
import { useState } from "react";
interface FormData {
  name: string;
  email: string;
  password: string;
}
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .matches(/[a-zA-Z].*[a-zA-Z]/, "Name must contain at least two letters"),
  email: Yup.string().required("Email is required").email("Enter a valid email"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
});
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, seterror] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation RegisterUser($email: String!, $password: String!) {
              registerUser(email: $email, password: $password) {
                user {
                  id
                  email
                }
                accessToken
              }
            }
          `,
          variables: {
            email: data.email,
            password: data.password,
          },
        }),
      });

      if (response.status === 500) {
        seterror("Username already exists. Please choose a different username.");
        return;
      }
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      if (jsonResponse.data.registerUser.accessToken) {
        localStorage.setItem("token", jsonResponse.accessToken);
        localStorage.setItem("email", data.email);
        localStorage.setItem("status", JSON.stringify(true));
        dispatch(setStatus(true));
        navigate("/home");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };
  return (
    <>
      <Box
        sx={{
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: "50vw",
            px: 30,
            py: "1%",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Typography variant="h3">Register</Typography>
              <Typography color="text.secondary" variant="body2">
                Already have an account?
                <Link href="/oms">Log In</Link>
              </Typography>
            </Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <TextField {...register("name")} label="Name" error={!!errors.name} helperText={errors.name?.message && errors.name.message} />
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
                <TextField {...register("email")} label="Email" error={!!errors.email} helperText={errors.email?.message && errors.email.message} />
                <TextField {...register("password")} label="Password" type="password" error={!!errors.password} helperText={errors.password?.message && errors.password.message} />
              </Stack>
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Continue
              </Button>
            </form>
          </div>
        </Box>
        <Box
          sx={{
            height: "100vh",
            px: 20,
            py: "10%",
            width: "50vw",
            background: " radial-gradient(50% 50% at 50% 50%, rgb(18, 38, 71) 0%, rgb(9, 14, 35) 100%)",
          }}
        >
          <img src="https://material-kit-react.devias.io/assets/auth-illustration.svg" alt="" />
        </Box>
      </Box>
    </>
  );
};
export default Register;
