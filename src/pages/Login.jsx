import React from "react";
import "../styles/Auth.css";
import CustomTextInput from "../components/FormComponents/CustomTextInput";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { LoginUser } from "../Services/AuthApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/routes";
import { notify } from "../utils/Notification";

const Login = () => {
  const method = useForm({
    defaultValues: {
      userName: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  //===========================UseMutation Function===============================
  const Login = useMutation({
    mutationFn: LoginUser,
    onSuccess: (data) => {
      console.log(data);
      if (data.success) {
        localStorage.setItem("userID", JSON.stringify(data.data[0].UserID));
        localStorage.setItem("fullName", JSON.stringify(data.data[0].FullName));
        navigate(ROUTES.HOME);
        notify("success", "Login successfully");
      } else {
        notify("error", data.message);
      }
    },
  });
  const onsubmit = (data) => {
    Login.mutate(data);
  };
  return (
    <div>
      <div class="container">
        <div class="screen">
          <div class="screen__content">
            <form class="auth" onSubmit={method.handleSubmit(onsubmit)}>
              <div class="auth__field">
                <i class="auth__icon fas fa-user"></i>
                <CustomTextInput
                  name="userName"
                  label="UserName"
                  placeHolder="Enter your email"
                  control={method.control}
                  rules={{ required: "Email is required" }}
                />
              </div>
              <div class="auth__field">
                <i class="auth__icon fas fa-lock"></i>
                <CustomTextInput
                  name="password"
                  label="Password"
                  type="password"
                  placeHolder="Enter your password"
                  control={method.control}
                  rules={{ required: "Password is required" }}
                />
              </div>
              <button class="button auth__submit">
                <span class="button__text">Log In Now</span>
                <i class="button__icon fas fa-chevron-right"></i>
              </button>
            </form>
          </div>
          <div class="screen__background">
            <span class="screen__background__shape screen__background__shape4"></span>
            <span class="screen__background__shape screen__background__shape3"></span>
            <span class="screen__background__shape screen__background__shape2"></span>
            <span class="screen__background__shape screen__background__shape1"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
