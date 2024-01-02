import React from "react";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, InputAdornment, Link, Stack, TextField, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { setStatus, setUser } from "../../redux/slices/userSlice";
import { validationSchema, validationEmail, FetchRecover, FetchComparePassword, FetchResetPassword } from "../../logic/logicLogin";
import { FormData } from "../../interface/loginInterface";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [titleDialog, setTitleDialog] = useState("Recover Password");
  const [messageDialog, setMessageDialogDialog] = useState("To recover the password, please enter your email address here.We will send a temporary password.");
  const [inputDialog, setInputDialog] = useState("Email");
  const [valueInput, setValueInput] = useState<string>("");
  const [buttonDialog, setButtonDialogDialog] = useState("recover");
  const [typeDialog, setTypeDialog] = useState("email");
  const [loginError, setLoginError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation LoginUser($email: String!, $password: String!) {
              loginUser(email: $email, password: $password) {
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

      const json = await response.json();

      console.log(json);

      if (json.data && json.data.loginUser && json.data.loginUser.accessToken) {
        const { user, accessToken } = json.data.loginUser;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", user.email);
        localStorage.setItem("status", JSON.stringify(true));
        dispatch(setStatus(true));
        dispatch(setUser(user.email));
        navigate("/home");
      } else {
        setLoginError(json.errors ? json.errors[0].message : "Login failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRecoverPassword = () => {
    if (buttonDialog === "recover" && validationEmail.isValidSync({ email: valueInput })) {
      FetchRecover({ valueInput });
      setTitleDialog("Enter Password");
      setMessageDialogDialog("We sent you a temporary password to your email, enter it here");
      setInputDialog("Enter Password");
      setButtonDialogDialog("send");
      setTypeDialog("code");
      setValueInput("");
    } else if (buttonDialog === "send") {
      FetchComparePassword({ valueInput });
      setTitleDialog("Choose new password");
      setMessageDialogDialog("Choose a new permanent password. The password will be used by you to enter the website");
      setInputDialog("Enter New Password");
      setButtonDialogDialog("choose");
      setTypeDialog("code");
      setValueInput("");
    } else if (buttonDialog === "choose") {
      FetchResetPassword({ valueInput });
      setOpen(false);
    } else {
      console.log("Email not validated", valueInput);
    }
  };

  const handleClickOpenForgotPassword = () => {
    setOpen(true);
  };

  const handleCloseForgotPassword = () => {
    setOpen(false);
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
            <Stack spacing={5} sx={{ mb: 3 }}>
              <Typography variant="h3">Login</Typography>
              <Typography color="text.secondary" variant="body2">
                Don't have an account?
                <Link href="/oms/register">Register</Link>
              </Typography>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={5}>
                <TextField {...register("email")} label="Email" error={!!errors.email} helperText={errors.email?.message && errors.email.message} />

                <TextField
                  sx={{ background: "#e3f2fd" }}
                  {...register("password")}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  error={!!errors.password}
                  helperText={errors.password?.message && errors.password.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              <Fragment>
                <Button variant="text" onClick={handleClickOpenForgotPassword}>
                  Forgot Password?
                </Button>
                <Dialog open={open} onClose={handleCloseForgotPassword}>
                  <DialogTitle>{titleDialog}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>{messageDialog}</DialogContentText>

                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label={inputDialog}
                      type={typeDialog}
                      fullWidth
                      variant="standard"
                      value={valueInput}
                      onChange={(e) => setValueInput(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseForgotPassword}>Cancel</Button>
                    <Button onClick={handleRecoverPassword}>{buttonDialog}</Button>
                  </DialogActions>
                </Dialog>
              </Fragment>
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Continue
              </Button>
            </form>
            <p>{loginError}</p>
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

export default Login;
