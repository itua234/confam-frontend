import { configureStore } from '@reduxjs/toolkit';
import kycReducer from './kyc/kycSlice';
import uiReducer from './ui/uiSlice';
//import documentsReducer from '../features/documents/documentsSlice';
import bottomSheetReducer from './bottomsheet/bottomSheetSlice';

export const store = configureStore({
    reducer: {
        kyc: kycReducer,
        ui: uiReducer,
        // documents: documentsReducer,
        bottomSheet: bottomSheetReducer,
    }
});

export default store;