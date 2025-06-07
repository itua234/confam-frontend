import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    uploadedFiles: {}, // Stores File objects (or base64 strings if you prefer)
    // This 'documents' array might need to come from the API response
    // or be derived/merged if it's about what the user has already uploaded
    // For now, let's assume it represents shared status of initially present documents
    userVerificationDocuments: [], // This could be populated from initial API fetch
};

const documentsSlice = createSlice({
    name: 'documents',
    initialState: initialState,
    reducers: {
        setUploadedFile: (state, action) => {
            const { docId, file } = action.payload;
            state.uploadedFiles[docId] = file;
        },
        toggleDocumentShare: (state, action) => {
            const { docId, isShared } = action.payload;
            const docIndex = state.userVerificationDocuments.findIndex(doc => doc.id === docId);
            if (docIndex !== -1) {
                state.userVerificationDocuments[docIndex].shared = isShared;
            }
        },
        // Action to set initial verification documents from API
        setUserVerificationDocuments: (state, action) => {
            state.userVerificationDocuments = action.payload;
        },
        // You might also want an action to clear uploaded files if a step is revisited
        clearUploadedFile: (state, action) => {
            delete state.uploadedFiles[action.payload]; // action.payload should be docId
        },
        clearAllUploadedFiles: (state) => {
            state.uploadedFiles = {};
        }
    },
});

export const {
    setUploadedFile,
    toggleDocumentShare,
    setUserVerificationDocuments,
    clearUploadedFile,
    clearAllUploadedFiles
} = documentsSlice.actions;

export default documentsSlice.reducer;