import { createSlice } from '@reduxjs/toolkit';
//import { KYC_TIER_DOCUMENTS } from '../../lib/utils'; // Adjust path as needed

// Define the initial state
const initialState = {
    customer: null, // Initial user data from API
    identities: [], // Identities from API response
    ninBvnDocs: [], // Derived NIN/BVN docs
    otherIdDocs: [], // Derived other ID docs
    utilityBillDocs: [], // Derived utility bill docs
    bankAccounts: [],
    kycLevel: 'tier_1',
    phoneNumber: '',
    email: '',
    phoneVerifiedAt: null, // Using null for initial state, will be a date string if verified
    bankIsRequested: false,
};

const kycSlice = createSlice({
    name: 'kyc',
    initialState: initialState,
    reducers: {
        // Action to set all initial KYC data after a successful fetch
        setKycData: (state, action) => {
            const {
                customer,
                kyc_level,
                bank_accounts_requested,
            } = action.payload;

            state.customer = customer;
            state.identities = customer.identities;
            state.bankAccounts = customer.bank_accounts;
            state.kycLevel = kyc_level;
            state.phoneNumber = customer.phone;
            state.email = customer.email;
            state.phoneVerifiedAt = customer.phone_verified_at;
            state.bankIsRequested = bank_accounts_requested;

            // Derived identities (recalculate when identities change)
            // const getCombinedIdentities = (requiredTypes) => {
            //     return requiredTypes.map(requiredDoc => {
            //     const existingDoc = state.identities.find(doc => doc.type === requiredDoc.type);
            //     return existingDoc || {
            //         id: requiredDoc.id,
            //         type: requiredDoc.type,
            //         label: requiredDoc.label,
            //         verified: false, // Default for missing/unverified
            //     };
            //     });
            // };

            // state.ninBvnDocs = getCombinedIdentities(KYC_TIER_DOCUMENTS.tier_1);
            // // You'll need to define otherIdDocs and utilityBillDocs similarly if used in Redux
            // state.otherIdDocs = getCombinedIdentities(KYC_TIER_DOCUMENTS.tier_2_additional);
            // state.utilityBillDocs = getCombinedIdentities(KYC_TIER_DOCUMENTS.tier_3_additional);
        },
        // Actions for individual updates if needed
        setPhoneNumber: (state, action) => {
            state.phoneNumber = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setPhoneVerifiedAt: (state, action) => {
            state.phoneVerifiedAt = action.payload;
        },
        // Action to update an identity's properties (e.g., verification status)
        updateIdentity: (state, action) => {
            // const { id, updates } = action.payload;
            // const identityIndex = state.identities.findIndex(identity => identity.id === id);
            // if (identityIndex !== -1) {
            //     state.identities[identityIndex] = { ...state.identities[identityIndex], ...updates };
            //     // Also update derived docs if necessary (though Immer handles this if you modify source)
            //     // For simplicity, re-derive these if individual identity updates affect them
            //     const getCombinedIdentities = (requiredTypes) => { /* ... same logic as above ... */ return requiredTypes.map(requiredDoc => {
            //         const existingDoc = state.identities.find(doc => doc.type === requiredDoc.type);
            //         return existingDoc || {
            //         id: requiredDoc.id,
            //         type: requiredDoc.type,
            //         label: requiredDoc.label,
            //         verified: false, // Default for missing/unverified
            //         };
            //     });
            //     };
            //     state.ninBvnDocs = getCombinedIdentities(KYC_TIER_DOCUMENTS.tier_1);
            //     state.otherIdDocs = getCombinedIdentities(KYC_TIER_DOCUMENTS.tier_2_additional);
            //     state.utilityBillDocs = getCombinedIdentities(KYC_TIER_DOCUMENTS.tier_3_additional);
            // }
        },
        // ... other actions for updating user, bank accounts etc. if needed
    },
});

export const { 
    setKycData, 
    setPhoneNumber, 
    setEmail, 
    setPhoneVerifiedAt, 
    updateIdentity 
} = kycSlice.actions;
export default kycSlice.reducer;