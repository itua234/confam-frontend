import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { maskText, getEditAction, KYC_TIER_DOCUMENTS } from './lib/utils'; 
import loader from './assets/loader.gif'
import pencil from './assets/icons/pencil.svg'
import cloud_upload from "./assets/icons/cloud-upload.svg"
import { Lock } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Webcam from 'react-webcam';
import userData from "../user.json";
import { useOTP } from './hooks/useOTP'; 
import { PhoneInputStep } from './components/PhoneInputStep';
import AccordionTriggerContent from './components/ui/accordion-trigger-content';
import apiClient from './api/client';
import { SendOtpBottomSheet } from './components/SendOtpBottomSheet';
import { VerifyOtpBottomSheet } from './components/VerifyOtpBottomSheet'; 
import { UploadPassportSheet } from './components/bottomsheets/upload-passport'; 
import { UploadAddressSheet } from './components/bottomsheets/upload-address'; 

import { AccessTypeSheet } from './components/AccessTypeSheet';
import { Welcome } from "./components/welcome"
import { Success } from "./components/success"
import { InvalidLink } from "./components/invalid";
import BankAccountsAccordion from "./components/accordions/bank-accounts"
import PersonalInformationAccordion from "./components/accordions/personal-information"
import { VerificationDocument } from "./components/verification-document"
import { IdentityBox } from "./components/identity-box"

// Import hooks from react-redux and actions from your slice
import { useSelector, useDispatch } from 'react-redux';
import {
  setIsAppLoading,
  setAppIsReady,
  setisAuthenticated,
  setAppError,
  setCurrentStep,
  nextStep,
  prevStep,
  resetAppUI,
} from './reducers/ui/uiSlice';
import {
  setKycData, 
  //updateIdentity 
} from './reducers/kyc/kycSlice';
import {
  openBottomSheet,
  closeBottomSheet,
} from './reducers/bottomsheet/bottomSheetSlice';

function App() {
  const dispatch = useDispatch();
  const { kyc_token } = useParams();
  const client = useMemo(() => apiClient("http://localhost:8080/api/v1/"), []);
 
  const {
    isAuthenticated,
    appIsReady,
    // errorMessage,
    currentStep
  } = useSelector((state) => state.ui); 
  const { activeBottomSheet } = useSelector((state) => state.bottomSheet); 
  const { 
    phoneNumber, 
    email,
    kycLevel,
    bankIsRequested,
    bankAccounts
  } = useSelector((state) => state.kyc); 

  const [errorMessage, setErrorMessage] = useState('');
  
  const [user, setUser] = useState(userData);
  const [identities, setIdentities] = useState([]);
  const [ninBvnDocs, setNinBvnDocs] = useState([]);
  const [documents, setDocuments] = useState(user.verification_documents || []);
  // const [bankAccounts, setBankAccounts] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});
  // const [kycLevel, setKycLevel] = useState('tier_1'); 
  // const [bankIsRequested, setBankIsRequested] = useState(false);
  const [accessType, setAccessType] = useState(''); // e.g., 'continuous', 'one-time'
 
  const nextStep = () => dispatch(nextStep());
  const prevStep = () => dispatch(prevStep());
  const goToStep = (step) => dispatch(setCurrentStep(step));
  const handleOpenBottomSheet = (sheetName) => {
    dispatch(openBottomSheet(sheetName))
  };
  const handleCloseBottomSheet = () => {
    dispatch(closeBottomSheet())
  };
  // const [email, setEmail] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState('');
  const [phone_verified_at, setPhoneVerifiedAt] = useState(false); // To track if phone is verified
  const [otpMethod, setOtpMethod] = useState(''); // e.g., 'sms', 'email'
  const {
    otp,
    inputRefs,
    handleOTPInputChange,
    handleKeyDown,
    isComplete,
    focusedInput,
    setFocusedInput
  } = useOTP({ length: 6, currentStep });

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await client.get(`/allow/${kyc_token}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${kyc_token}`,
          },
        });
        //console.log('App config:', response.data);
        setIdentities(response.data.results.customer.identities);
        
        dispatch(setKycData(response.data.results));
        dispatch(setisAuthenticated(true));
      } catch (error) {
        console.error('Error fetching KYC request:', error);
        //setErrorMessage(error.message || 'Failed to load KYC request. Please try again.');
      } finally {
        //setIsAppLoading(false);
        dispatch(setAppIsReady(true));
      }
    };
    fetchRequestData();
  }, []); 

  const webcamRef = useRef(null); 
  const [imgSrc, setImgSrc] = useState(null); // To store the captured image
  const [faceScanActive, setFaceScanActive] = useState(false); // To control scan process
  const [faceScanStatus, setFaceScanStatus] = useState(''); // To show status messages
  // Function to capture an image from the webcam
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      console.log('Captured image:', imageSrc); // Base64 encoded image
      setFaceScanStatus('Image captured. Analyzing...');
      // In a real application, you would send imageSrc to your backend for facial recognition
      simulateFaceRecognition(imageSrc); // Call a function to simulate/initiate backend process
    }
  }, [webcamRef]);
  // Simulate sending image to backend and getting a response
  const simulateFaceRecognition = (image) => {
    setTimeout(() => {
      setFaceScanStatus('Facial scan successful!');
      setFaceScanActive(false); // Stop showing live feed once verified (optional)
    }, 2000); 
  };

  useEffect(() => {
    const getCombinedIdentities = (requiredTypes) => {
      return requiredTypes.map(requiredDoc => {
        const existingDoc = identities.find(doc => doc.type === requiredDoc.type);
        return existingDoc || {
          id: requiredDoc.id,
          type: requiredDoc.type,
          label: requiredDoc.label,
          verified: false
        };
      });
    };
    setNinBvnDocs(getCombinedIdentities(KYC_TIER_DOCUMENTS.tier_1));
  }, [identities])
  console.log("doc", ninBvnDocs);
  
  // Handle file upload
  const handleFileUpload = (docId, file) => {
    setUploadedFiles(prev => ({
      ...prev,
      [docId]: file
    }));
    console.log(`File uploaded for document ${docId}:`, file.name);
  };

  // Handle checkbox toggle
  const handleToggleShare = (docId, isShared) => {
    setDocuments(prev => 
      prev.map(doc =>
        doc.id === docId 
          ? { ...doc, shared: isShared }
          : doc
      )
    );
    console.log(`Document ${docId} verif`);
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('Form submitted with:', {
    //   phoneNumber,
    //   otpMethod,
    //   uploadedFiles,
    //   userDocuments: user.verification_documents
    // });
    nextStep();
  };

  const renderStepContent = () => {
    if (!appIsReady) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <img src={loader} alt="Loading..." className="w-7 h-7" />
        </div>
      );
    }
    if (!isAuthenticated) {
      return (
        <InvalidLink message={errorMessage} onRetry={() => console.log("")} /> // Reset step to 0 for retry
      );
    }

    switch(currentStep) {
      case 0:
        return <Welcome onContinue={() => {
          if(!phoneNumber || !phone_verified_at){
            goToStep(1);
          }else{
            handleOpenBottomSheet("send-otp");
          }
        }} />;
      case 1: 
      return <PhoneInputStep onContinue={() => handleOpenBottomSheet("send-otp")}/>
    case 2: 
      return (
        <>
          <div className="h-full flex flex-col">
            <div>
              <p className="text-center">Confirm the details you want to share with <b>confam.</b></p>
            </div>
            <form className="flex flex-1 flex-col py-[20px]" encType="multipart/form-data">
              <div className="">
                <Accordion type="single" collapsible>
                  <PersonalInformationAccordion customer={user} />

                  <AccordionItem value="item-2" className="accordion-header">
                    <AccordionTrigger className="accordion-trigger">
                      <AccordionTriggerContent
                        icon={Lock}           
                        title="Verification documents"
                        subtitle={5+ ' documents'} 
                        isComplete={false}    
                      />
                    </AccordionTrigger>
                    <AccordionContent className="accordion-content">
                      {
                        ninBvnDocs
                        .map((doc, index, arr) => (
                          <IdentityBox
                            key={doc.id}
                            identity={doc}
                            isLast={index === arr.length - 1}
                            onFileUpload={handleFileUpload}
                            onToggleShared={handleToggleShare}
                          />
                        ))
                      }
                      {(kycLevel === 'tier_2' || kycLevel === 'tier_3') && (
                        <>
                          <div className="px-3 py-3">
                            <div className="text-[12px]">At least one of these <span className="ml-[2px]" style={{ color: 'red' }}>*</span></div>
                          </div>
                          {
                            documents.filter(doc => doc.type !== "NIN" && doc.type !== "BVN" && doc.type !== "Utility Bill")
                            .map((doc, index, arr) => (
                              <VerificationDocument
                                key={doc.id}
                                doc={doc}
                                isLast={index === arr.length - 1}
                                onFileUpload={handleFileUpload}
                                onToggleShared={handleToggleShare}
                              />
                            ))
                          }
                        </>
                      )}
                      {(kycLevel === 'tier_3') && (
                        <>
                          <div className="px-3 py-3">
                            <div className="text-[12px]">Address Verification <span className="ml-[2px]" style={{ color: 'red' }}>*</span></div>
                          </div>
                          {
                            documents.filter(doc => doc.type === "Utility Bill")
                            .map((doc, index, arr) => (
                              <VerificationDocument
                                key={doc.id}
                                doc={doc}
                                isLast={index === arr.length - 1}
                                onFileUpload={handleFileUpload}
                                onToggleShared={handleToggleShare}
                              />
                            ))
                          }
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  {bankIsRequested && (
                    <BankAccountsAccordion bankAccounts={bankAccounts} />
                  )}
                </Accordion>
              </div>
              <div className="mt-auto w-full">
                <button 
                onClick={nextStep}
                className="primary-button flex items-center justify-center w-full">
                  <span>Grant Permission</span>
                </button>
              </div>
            </form>
          </div>
        </>
      )
    case 3:
      return (
        <div className="h-full flex flex-col">
          <div className="flex flex-1 flex-col pb-[20px] text-center items-center">
            <h4 className="mb-2">Facial Recognition</h4>
            <p className="text-sm text-gray-600 mb-4">Please position your face clearly in the camera for verification.</p>
            
            {/* Webcam Component */}
            {!faceScanActive ? (
              <div className="w-[200px] h-[200px] rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 relative">
                {imgSrc ? (
                  <img src={imgSrc} alt="Captured Face" className="w-full h-full object-cover" />
                ) : (
                  <p className="text-gray-500">Click "Start Scan" to activate camera</p>
                )}
                {imgSrc && (
                  <button
                    onClick={() => {
                      setImgSrc(null); // Clear previous image
                      setFaceScanActive(true); // Restart scan
                      setFaceScanStatus('');
                    }}
                    className="border-2 border-[#E5E5E5] absolute top-2 right-2 p-1 bg-white rounded-full text-gray-700 hover:text-gray-900"
                    title="Retake photo"
                  >
                    <img src={pencil} width="16" alt="Retake" />
                  </button>
                )}
              </div>
            ) : (
              <div className="w-[200px] h-[200px] rounded-full bg-black flex items-center justify-center overflow-hidden mb-4">
              {/* <div className="w-full h-64 bg-black flex items-center justify-center rounded-lg overflow-hidden mb-4"> */}
                <Webcam
                  audio={false} // No audio needed for facial recognition
                  ref={webcamRef}
                  screenshotFormat="image/jpeg" // Or "image/png"
                  width={400} // Adjust as needed, but let CSS handle the display
                  height={300} // Adjust as needed
                  videoConstraints={{
                    facingMode: "user" // Use front camera
                  }}
                  className="w-full h-full object-cover" // Ensure it fits the container
                />
              </div>
            )}

            {faceScanStatus && <p className="text-sm mt-2">{faceScanStatus}</p>}
            {/* Buttons for facial scan */}
              <div className="flex justify-center gap-4 mt-4">
                {!faceScanActive && !imgSrc && ( // Only show "Start Scan" initially
                  <button
                    onClick={() => setFaceScanActive(true)}
                    className="secondary-button"
                  >
                    Start Facial Scan
                  </button>
                )}
                {faceScanActive && ( // Show "Capture Photo" when camera is active
                  <button
                    onClick={capture}
                    className="primary-button"
                  >
                    Capture Photo
                  </button>
                )}
                {imgSrc && !faceScanActive && ( // Show "Verify Photo" after capture
                   <button
                     onClick={() => simulateFaceRecognition(imgSrc)} // Pass captured image
                     className="primary-button"
                   >
                     Verify Photo
                   </button>
                )}
              </div>
              <button
                onClick={nextStep}
                className="primary-button mt-auto w-full"
                disabled={!imgSrc || faceScanActive} // Disable if no image captured or scan active
              >
                Continue
              </button>
            </div>
          
        </div>
      )
    case 4: 
      return <Success />;
      default:
        return null;
    }
  }

  return (
    <>
      <div className="modal-overlay z-[1000]">
        <div className="!relative modal-content bg-white rounded-3 z-[1001]">
          <div className="header-bar">
            <div><img alt="Allow" className="" /></div>
            <div><button className="" type="button">x</button></div>
          </div>
          <div className="scroll-container">
            <div className="h-full flex flex-col">
              {renderStepContent()}
            </div>
          </div>

          {activeBottomSheet && ( // Render an overlay behind the active bottom sheet
            <div
              className="h-full rounded-[12px] w-full absolute top-0 left-0 bg-black/10 backdrop-blur-sm" // Z-index higher than modal, lower than sheet
              onClick={handleCloseBottomSheet} // Click overlay to close sheet
            >
              <div className="bg-white min-h-[100px] h-auto w-full absolute bottom-0 rounded-[12px]">
                <div className=" flex justify-center mt-[20px]">
                  <span className="h-[5px] w-[50px] bg-gray-100 rounded-[5px]"></span>
                </div>
                {activeBottomSheet === 'verify-otp' && (
                  <VerifyOtpBottomSheet
                    phoneNumber={phoneNumber}
                    otp={otp}
                    inputRefs={inputRefs}
                    focusedInput={focusedInput}
                    setFocusedInput={setFocusedInput}
                    handleOTPInputChange={handleOTPInputChange}
                    handleKeyDown={handleKeyDown}
                    onContinue={() => {
                      goToStep(2);
                      handleCloseBottomSheet();
                    }}
                    otpMethod={otpMethod}
                  />
                )}
                {activeBottomSheet === 'send-otp' && (
                  <SendOtpBottomSheet 
                    email={email}
                    phoneNumber={phoneNumber}
                    onFinish={() => handleOpenBottomSheet("verify-otp")}
                  />
                )}
                {activeBottomSheet === 'access-type' && (
                  <AccessTypeSheet 
                    accessType={accessType}
                    setAccessType={setAccessType}
                    onClose={handleCloseBottomSheet} 
                    goToStep={goToStep}
                  />
                )}
                {activeBottomSheet === 'upload-passport' && (
                  <UploadPassportSheet 
                    accessType={accessType}
                    setAccessType={setAccessType}
                    onClose={handleCloseBottomSheet} 
                    goToStep={goToStep}
                  />
                )}
                {activeBottomSheet === 'upload-address' && (
                  <UploadAddressSheet 
                    accessType={accessType}
                    setAccessType={setAccessType}
                    onClose={handleCloseBottomSheet} 
                    goToStep={goToStep}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App