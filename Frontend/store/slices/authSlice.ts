import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { setAccessToken } from "@/lib/api";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }) => {
    const res = await api.post("/auth/login", payload);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    setAccessToken(res.data.accessToken);
    return res.data.user as User;
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (payload: { name: string; email: string; password: string }) => {
    const res = await api.post("/auth/signup", payload);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    setAccessToken(res.data.accessToken);
    return res.data.user as User;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutLocally: (state) => {
      state.user = null;
      localStorage.removeItem("refreshToken");
      setAccessToken("");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Signup failed";
      });
  },
});

export const { logoutLocally } = authSlice.actions;
export default authSlice.reducer;
