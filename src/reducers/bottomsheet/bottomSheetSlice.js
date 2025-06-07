import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeBottomSheet: null, // e.g., "upload-address", "send-otp", "verify-otp"
};

const bottomSheetSlice = createSlice({
    name: 'bottomSheet',
    initialState: initialState,
    reducers: {
        openBottomSheet: (state, action) => {
            state.activeBottomSheet = action.payload;
        },
        closeBottomSheet: (state) => {
            state.activeBottomSheet = null;
        },
    },
});

export const { 
    openBottomSheet, 
    closeBottomSheet 
} = bottomSheetSlice.actions;
export default bottomSheetSlice.reducer;