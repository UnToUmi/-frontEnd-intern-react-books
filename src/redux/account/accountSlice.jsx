import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuth: false,
    isLoading: true,
    tempAvatar: "",
    user: {
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: ""
    },
};


export const accountSlice = createSlice({
    name: 'account',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        handleLoginAction: (state, action) => {
            state.isAuth = true;
            state.isLoading = false;
            state.user = action.payload;
        },
        handleGetAccountAction: (state, action) => {

            state.isAuth = true;
            state.isLoading = false;
            state.user = action.payload.user;
        },
        handleLogoutAction: (state, action) => {
            localStorage.removeItem('access_token');
            state.isAuth = false;
            state.user = {
                email: "",
                phone: "",
                fullName: "",
                role: "",
                avatar: "",
                id: ""
            };
        },
        handleUpdateUserInfoAction: (state, action) => {
            state.user.avatar = action.payload.avatar;
            state.user.phone = action.payload.phone;
            state.user.fullName = action.payload.fullName;
        },
        handleUploadAvatarAction: (state, action) => {
            state.tempAvatar = action.payload.avatar;
        },
        handleChangeAvatarWhenClose: (state, action) => {
            state.user.avatar = action.payload.avatar;
        }

    },

    extraReducers: (builder) => {

    },
});

export const { handleLoginAction,
    handleGetAccountAction,
    handleLogoutAction,
    handleUpdateUserInfoAction,
    handleUploadAvatarAction,
    handleChangeAvatarWhenClose,
} = accountSlice.actions;

export default accountSlice.reducer;
