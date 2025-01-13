import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { RootState } from "../store";
import toast from "react-hot-toast";

import {
  ForgotPasswordType,
  LoginType,
  SignUpType,
  UserType,
} from "../definitions";

import {
  signIn,
  signUp,
  signInGoogle,
  signInToken,
  signOut,
  verifyOtp,
  forgotPasswordSendOtpApi,
  forgotPasswordVerifyOtpApi,
} from "../api/index";

interface CounterState {
  loading: boolean;
  isAuthenticated: boolean;
  user: UserType | null;
  verificationRequired: boolean;
  verificationUserID: UserType["userId"] | string;
}

const initialState: CounterState = {
  loading: true,
  isAuthenticated: false,
  user: null,
  verificationRequired: false,
  verificationUserID: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SET_USER: (state, action) => {
      state.isAuthenticated = true;
      state.verificationRequired = false;
      state.verificationUserID = "";
      state.user = { ...state.user, ...action.payload };
    },
    SET_LOADING: (state) => {
      state.loading = true;
    },
    SET_LOADING_FALSE: (state) => {
      state.loading = false;
    },
    LOGOUT_USER: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.verificationRequired = false;
      state.verificationUserID = "";
    },
    UPDATE_NAME: (state, action) => {
      if (state.user) state.user.name = action.payload;
    },
    UPDATE_BIO: (state, action) => {
      if (state.user) state.user.bio = action.payload;
    },
    SET_VERIFICATION_REQUIRED: (state, action) => {
      state.verificationUserID = action.payload;
      state.verificationRequired = true;
    },
  },
});

export const logout = () => async (dispatch: Dispatch) => {
  toast.loading("Logging out", { id: "logout" });
  dispatch(userSlice.actions.SET_LOADING());
  signOut()
    .then(() => {
      dispatch(userSlice.actions.LOGOUT_USER());
      toast.success("Logged out");
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch(userSlice.actions.SET_LOADING_FALSE());
      toast.dismiss("logout");
    });
};

export const login = (loginValues: LoginType) => async (dispatch: Dispatch) => {
  if (!loginValues.email || !loginValues.password) {
    return toast.error("Email and Password are required");
  }
  dispatch(userSlice.actions.SET_LOADING());
  signIn(loginValues)
    .then(() => {
      dispatch(loadUser());
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch(userSlice.actions.SET_LOADING_FALSE());
    });
};

export const register =
  (signupValues: SignUpType) => async (dispatch: Dispatch) => {
    toast.loading("Registering", { id: "register" });
    dispatch(userSlice.actions.SET_LOADING());
    signUp(signupValues)
      .then((res) => {
        const id = res.data.userId;
        dispatch(userSlice.actions.SET_VERIFICATION_REQUIRED(id));
        toast.success("Email Sent", { id: "register" });
      })
      .catch((err) => {
        console.log(err);
        toast.dismiss("register");
      })
      .finally(() => {
        dispatch(userSlice.actions.SET_LOADING_FALSE());
      });
  };

export const loginGoogle = (token: string) => async (dispatch: Dispatch) => {
  dispatch(userSlice.actions.SET_LOADING());
  signInGoogle(token)
    .then(() => dispatch(loadUser()))
    .catch((err) => console.log(err))
    .finally(() => dispatch(userSlice.actions.SET_LOADING_FALSE()));
};

export const forgotPasswordSendOtp =
  (forgotPasswordValues: ForgotPasswordType, setPage: any) =>
  async (dispatch: Dispatch) => {
    toast.loading("Sending OTP", { id: "forgotPassword" });
    dispatch(userSlice.actions.SET_LOADING());
    const { email } = forgotPasswordValues;
    forgotPasswordSendOtpApi(email)
      .then(() => {
        toast.success("OTP Sent", { id: "forgotPassword" });
        setPage(1);
      })
      .catch((err) => {
        console.log(err);
        toast.dismiss("forgotPassword");
      })
      .finally(() => {
        dispatch(userSlice.actions.SET_LOADING_FALSE());
      });
  };

export const forgotPasswordVerifyOtp =
  (forgotPasswordValues: ForgotPasswordType) => async (dispatch: Dispatch) => {
    toast.loading("Verifying OTP", { id: "forgotPassword" });
    dispatch(userSlice.actions.SET_LOADING());
    forgotPasswordVerifyOtpApi(forgotPasswordValues)
      .then(() => {
        toast.success("Password changed successfully", { id: "forgotPassword" });
        dispatch(loadUser());
      })
      .catch((err) => {
        console.log(err);
        toast.dismiss("forgotPassword");
      })
      .finally(() => {
        dispatch(userSlice.actions.SET_LOADING_FALSE());
      });
  };

export const verification =
  (otp: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const verificationRequired = getState().user.verificationRequired;
    if (!verificationRequired) return toast.error("Something went wrong");
    const userId = getState().user.verificationUserID;
    if (!userId) return toast.error("User Not Found");

    toast.loading("Verifying", { id: "verification" });
    dispatch(userSlice.actions.SET_LOADING());
    verifyOtp({ userId, otp })
      .then(() => {
        dispatch(loadUser());
        toast.success("Registered Successfully", { id: "verification" });
      })
      .catch((err) => {
        console.log(err);
        toast.dismiss("verification");
      })
      .finally(() => {
        dispatch(userSlice.actions.SET_LOADING_FALSE());
      });
  };

export const loadUser = () => async (dispatch: Dispatch) => {
  const isLoggedIn = document.cookie.split(";").some((cookie) => {
    const [key] = cookie.split("=");
    return key.trim() === "userId";
  });

  if (!isLoggedIn) {
    return dispatch(userSlice.actions.SET_LOADING_FALSE());
  }

  dispatch(userSlice.actions.SET_LOADING());
  signInToken()
    .then((res) => {
      const user = res.data;
      toast.success("Logged in", { id: "loadUser" });
      dispatch(userSlice.actions.SET_USER(user));
    })
    .catch((error) => console.log(error))
    .finally(() => dispatch(userSlice.actions.SET_LOADING_FALSE()));
};

export const updateUser = (user: UserType) => async (dispatch: Dispatch) => {
  dispatch(userSlice.actions.SET_USER(user));
};

export const selectUserState = (state: RootState) => state.user;

export default userSlice.reducer;
