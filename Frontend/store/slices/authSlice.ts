import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import api, { setAccessToken } from "@/lib/api";
import { normalizeUser, type AuthUser } from "@/lib/user-normalize";

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk("auth/login", async (payload: { email: string; password: string }) => {
  const res = await api.post("/auth/login", payload);
  localStorage.setItem("refreshToken", res.data.refreshToken);
  setAccessToken(res.data.accessToken);
  const u = normalizeUser(res.data.user as Record<string, unknown>);
  if (!u) throw new Error("Invalid user payload");
  return u;
});

export const signup = createAsyncThunk(
  "auth/signup",
  async (payload: { name: string; email: string; password: string }) => {
    const res = await api.post("/auth/signup", payload);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    setAccessToken(res.data.accessToken);
    const u = normalizeUser(res.data.user as Record<string, unknown>);
    if (!u) throw new Error("Invalid user payload");
    return u;
  }
);

export const restoreSession = createAsyncThunk("auth/restore", async (_, { rejectWithValue }) => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return rejectWithValue("no_refresh");
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const refreshRes = await axios.post(`${base}/auth/refresh`, { refreshToken });
    setAccessToken(refreshRes.data.accessToken);
    const me = await api.get("/users/me");
    const u = normalizeUser(me.data as Record<string, unknown>);
    if (!u) return rejectWithValue("bad_me");
    return u;
  } catch {
    return rejectWithValue("restore_failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutLocally: (state) => {
      state.user = null;
      localStorage.removeItem("refreshToken");
      setAccessToken("");
    },
    setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
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
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
      });
  },
});

export const { logoutLocally, setAuthUser } = authSlice.actions;
export default authSlice.reducer;
