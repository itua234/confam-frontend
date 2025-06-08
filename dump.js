import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import loader from './assets/loader.gif'
import info from './assets/icons/info.svg'
import pencil from './assets/icons/pencil.svg'
import cloud_upload from "./assets/icons/cloud-upload.svg"
import { Lock, Landmark, User, ArrowUp, Plus } from 'lucide-react';
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
import { AccessTypeSheet } from './components/AccessTypeSheet';
import { Welcome } from "./components/welcome"
import { Success } from "./components/success"
import { InvalidLink } from "./components/invalid";

const VerificationDocument = ({ 
  doc, 
  isLast,
  onToggleShared, 
  onFileUpload
})  => {
  const getEditAction = (type) => {
    switch (type) {
      case 'NIN': return 'edit-nin';
      case 'BVN': return 'edit-bvn';
      case 'PASSPORT': return 'edit-passport';
      case 'DRIVERS_LICENSE': return 'edit-drivers-license';
      case 'VOTERS_CARD': return 'edit-voters-card';
      default: return 'edit-other';
    }
  };
  const maskText = (text) => {
    if (!text || text.length <= 7) {
      // If the text is null, empty, or too short to mask (e.g., less than 7 digits for 3+4 pattern)
      // return the text as is or handle as an error.
      return text;
    }
    const firstThree = text.substring(0, 3);
    const lastFour = text.substring(text.length - 4);
    const stars = '*'.repeat(text.length - 7); // Calculate the number of stars needed
    return `${firstThree}${stars}${lastFour}`;
  };
  const showRedAsterisk = doc.type === 'NIN' || doc.type === 'BVN';
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      onFileUpload(doc.id, file);
    }
  };

  const handleCheckboxChange = (e) => {
    onToggleShared(doc.id, e.target.checked);
  };

  return (
    <div
      key={doc.id}
      className={`px-3 py-4 flex w-full items-center justify-between ${
        isLast ? '' : 'border-b border-[#E5E5E5]'
      } ${doc.verified ? 'bg-white' : ''}`}
    >
      <div>
        <label htmlFor="name" style={{ fontSize: '14px', fontWeight: 700 }}>
          {doc.type.replace("_", " ")} 
          {showRedAsterisk && <span className="ml-[3px]" style={{ color: 'red' }}>*</span>}
        </label>
        <div className="flex items-center gap-1">
          {doc.verified ? (
            <>
              <span style={{ fontSize: '14px' }}>{maskText(doc.text)}</span>
              <a
                className="p-0 cursor-pointer"
                data-id={doc.id}
                data-action={getEditAction(doc.type)}
                data-field="document"
              >
                <img src={pencil} width="14" alt="Edit" />
              </a>
            </>
          ) : (
            <span style={{ fontSize: '14px' }}>-</span>
          )}
        </div>
      </div>
      <div>
        {doc.verified ? (
          <div>
            <label className="toggle">
              <input
                type="checkbox"
                id={`verified-${doc.id}`}
                name={doc.type.toLowerCase()}
                checked={doc.shared}
                onChange={handleCheckboxChange}
                className="sr-only peer"
              />
              <span className="slider"></span>
            </label>
          </div>
        ) : (
          doc.type != 'NIN' && doc.type != 'BVN' ? (
          <div>
            <label
              htmlFor={`file-${doc.id}`}
              className="upload-btn flex items-center justify-center"
            >
              <ArrowUp size={18} />
              <span className="ml-[8px]">Upload</span>
            </label>
            <input
              type="file"
              id={`file-${doc.id}`}
              name={doc.type.toLowerCase()}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>) : null
        )}
      </div>
    </div>
  );
}

function App() {
  const { kyc_token } = useParams();
  const client = useMemo(() => apiClient("http://localhost:8080/api/v1/"), []);
  // if (!kycToken) {
  //   setError('KYC token missing in URL.');
  //   setLoading(false);
  //   return;
  // }
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAppLoading, setIsAppLoading] = useState(true); 
  
  const [user, setUser] = useState(userData);
  const [documents, setDocuments] = useState(user.verification_documents || []);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [kycLevel, setKycLevel] = useState('tier_1'); 
  const [bankIsRequested, setBankIsRequested] = useState(false);
  const [accessType, setAccessType] = useState(''); // e.g., 'continuous', 'one-time'
  const [activeBottomSheet, setActiveBottomSheet] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const goToStep = (step) => {
    setCurrentStep(step);
  };
  const handleOpenBottomSheet = (sheetName) => {
    setActiveBottomSheet(sheetName);
  };
  const handleCloseBottomSheet = () => {
    setActiveBottomSheet(null);
  };


  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');
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

  // Simulate fetching initial data based on kyc_token
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
        setEmail(response.data.results.customer.email);
        setPhoneNumber(response.data.results.customer.phone);
        setPhoneVerifiedAt(response.data.results.customer.phone_verified_at);
        setKycLevel(response.data.results.kyc_level);
        setBankIsRequested(response.data.results.bank_accounts_requested);
      } catch (error) {
        console.error('Error fetching KYC request:', error);
        setHasError(true);
        setErrorMessage(error.message || 'Failed to load KYC request. Please try again.');
      } finally {
        setIsAppLoading(false);
      }
    };
    fetchRequestData();
  }, []); 

  // const [bankName, setBankName] = useState('');
  // const [accountNumber, setAccountNumber] = useState('');
  // const [accountName, setAccountName] = useState('');

  // New states for webcam and facial recognition
  const webcamRef = useRef(null); // Ref to access the webcam component's methods
  const [imgSrc, setImgSrc] = useState(null); // To store the captured image
  const [faceScanActive, setFaceScanActive] = useState(false); // To control scan process
  const [faceScanStatus, setFaceScanStatus] = useState(''); // To show status messages
  // const [faceScanError, setFaceScanError] = useState(''); // To show error messages
  // const [faceScanResult, setFaceScanResult] = useState(null); // To store the result of the facial scan
  // const [faceScanLoading, setFaceScanLoading] = useState(false); // To show loading state during scan
  // const [faceScanTimeout, setFaceScanTimeout] = useState(null); // To manage timeout for facial scan
  // const [faceScanCountdown, setFaceScanCountdown] = useState(5); // Countdown for facial scan timeout
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
    // This would be an API call to your backend
    // fetch('/api/verify-face', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ image: image }),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   if (data.success) {
    //     setFaceScanStatus('Facial scan successful!');
    //     // Proceed to next step or update user data
    //     setTimeout(() => nextStep(), 2000); // Auto-advance after success
    //   } else {
    //     setFaceScanStatus(`Facial scan failed: ${data.message || 'Please try again.'}`);
    //   }
    // })
    // .catch(error => {
    //   console.error('Facial recognition API error:', error);
    //   setFaceScanStatus('Error during facial scan. Please try again.');
    // });

    // For now, simulate success after a delay
    setTimeout(() => {
      setFaceScanStatus('Facial scan successful!');
      setFaceScanActive(false); // Stop showing live feed once verified (optional)
      //setTimeout(() => nextStep(), 1500); // Auto-advance after a short delay
    }, 2000); // Simulate API call delay
  };

  const [isLoading, setIsLoading] = useState(false);
  
  // Handle file upload
  const handleFileUpload = (docId, file) => {
    setUploadedFiles(prev => ({
      ...prev,
      [docId]: file
    }));
    // Update document verification status
    // setUser(prevUser => ({
    //   ...prevUser,
    //   verification_documents: prevUser.verification_documents.map(doc =>
    //     doc.id === docId 
    //       ? { ...doc, verified: true, text: file.name }
    //       : doc
    //   )
    // }));
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
    if (isAppLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <img src={loader} alt="Loading..." className="w-7 h-7" />
        </div>
      );
    }

    if (hasError) {
      return (
        <InvalidLink message={errorMessage} onRetry={() => setCurrentStep(0)} /> // Reset step to 0 for retry
      );
    }

    switch(currentStep) {
      case 0:
        return <Welcome onContinue={() => {
          if(!phoneNumber || !phone_verified_at){
            goToStep(1);
          }else{
            setActiveBottomSheet("send-otp");
          }
        }} />;
      case 1: 
      return (
        <PhoneInputStep
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          onContinue={() => setActiveBottomSheet("send-otp")}
        />
      )
    case 2: 
      return (
        <>
          <div className="h-full flex flex-col">
            <div>
              <p className="text-center">Confirm the details you want to share with <b>confam.</b></p>
            </div>
            <form className="flex flex-1 flex-col py-[20px]" enctype="multipart/form-data">
              <div className="">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" className="accordion-header">
                    <AccordionTrigger className="accordion-trigger">
                      <AccordionTriggerContent
                        icon={User}           // Pass the User icon component
                        title="Personal Information"
                        subtitle={5+ ' items'} // Dynamic subtitle, e.g., number of items
                        isComplete={true}     // Set to true if this section is completed, false otherwise
                      />
                    </AccordionTrigger>
                    <AccordionContent className="accordion-content bg-white">
                      <div className="">
                        {/* Name */}
                        <div className="py-[12px] px-[18px] border-b border-gray-200">
                          <h6 className="text-[12px]">Full name</h6>
                          <div className="text-[12px] text-gray-500">{user.firstname} {user.lastname}</div>
                        </div>
                        <div className="py-[12px] px-[18px] border-b border-gray-200">
                            <h6 className="text-[12px] font-medium">Phone</h6>
                            <div className="text-[12px] text-gray-500">{user.phone}</div>
                          </div>
                        <div className="py-[12px] px-[18px] border-b border-gray-200">
                          <h6 className="text-[12px] font-medium">Email </h6>
                          <div className="text-[12px] text-gray-500">{user.email}</div>
                        </div>
                        <div className="py-[12px] px-[18px] border-b border-gray-200">
                          <h6 className="text-[12px] font-medium">Date of birth</h6>
                          <div className="text-[12px] text-gray-500">{new Date(user.dob).toLocaleDateString()}</div>
                        </div>
                        <div className="py-[12px] px-[18px]">
                          <h6 className="text-[12px] font-medium">Next of kin</h6>
                          <div className="text-[12px] text-gray-500">
                            osemeilu kelvin
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="accordion-header">
                    <AccordionTrigger className="accordion-trigger">
                      <AccordionTriggerContent
                        icon={Lock}           // Pass the User icon component
                        title="Verification documents"
                        subtitle={5+ ' documents'} // Dynamic subtitle, e.g., number of items
                        isComplete={false}     // Set to true if this section is completed, false otherwise
                      />
                    </AccordionTrigger>
                    <AccordionContent className="accordion-content">
                      {
                        documents.filter(doc => doc.type === "NIN" || doc.type === "BVN")
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
                      {(kycLevel === 'tier_2' || kycLevel === 'tier_3') && (
                        <>
                          <div className="px-3 py-3">
                            <div class="text-[12px]">At least one of these <span className="ml-[2px]" style={{ color: 'red' }}>*</span></div>
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
                  {
                    bankIsRequested && (
                      <AccordionItem value="item-3" className="accordion-header">
                        <AccordionTrigger className="accordion-trigger">
                          <AccordionTriggerContent
                            icon={Landmark}           // Pass the User icon component
                            title="Bank accounts"
                            subtitle={bankAccounts.length+ ' accounts'} // Dynamic subtitle, e.g., number of items
                            isComplete={false}     // Set to true if this section is completed, false otherwise
                          />
                        </AccordionTrigger>
                        <AccordionContent className="bank-accordion-content">
                          {/* <div className="p-3">
                            <div className="mb-3">
                              <label htmlFor="bankName" className="block text-sm font-medium mb-1">Bank Name</label>
                              <input
                                type="text"
                                id="bankName"
                                className="w-full px-3 py-2 border rounded"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                placeholder="e.g., Access Bank"
                              />
                            </div>
                            <div className="mb-3">
                              <label htmlFor="accountNumber" className="block text-sm font-medium mb-1">Account Number</label>
                              <input
                                type="text"
                                id="accountNumber"
                                className="w-full px-3 py-2 border rounded"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                placeholder="0123456789"
                              />
                            </div>
                            <div className="mb-3">
                              <label htmlFor="accountName" className="block text-sm font-medium mb-1">Account Name</label>
                              <input
                                type="text"
                                id="accountName"
                                className="w-full px-3 py-2 border rounded"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                placeholder="John Doe"
                                readOnly // Often read-only after fetching from API
                              />
                            </div>
                          </div> */}
                            {[...Array(2).keys()].map((index) => (
                              <div key={index} className="flex items-center justify-between mb-[20px]">
                                <div className="">
                                  <h5>OSEMEILU ITUA ENDURANCE</h5>
                                  <h6>201989929992</h6>
                                  <h6>United Bank For Africa</h6>
                                </div>
                                <div className="">
                                  <Lock size={18} />
                                </div>
                              </div>
                            ))}
                          <div className="flex flex-1 items-center justify-center">
                            <div className="cursor-pointer w-3/4 h-[100px] flex items-center justify-center border-2 border-dashed border-gray-300 bg-[#F8F8F8]">
                              <Plus size={30} />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  }
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
          {/* <h3 className="mb-4">Choose Access Type & Facial Recognition</h3> */}

          {/* <div className="mb-6">
            <label className="block text-[18px] font-medium mb-2">Select Access Type</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="accessType"
                  value="full"
                  checked={accessType === 'full'}
                  onChange={(e) => setAccessType(e.target.value)}
                  className="mr-2"
                />
                Full Access
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="accessType"
                  value="limited"
                  checked={accessType === 'limited'}
                  onChange={(e) => setAccessType(e.target.value)}
                  className="mr-2"
                />
                Limited Access
              </label>
            </div>
          </div> */}

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
            <div><img src="" alt="Allow" className="" /></div>
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
                    onFinish={() => setActiveBottomSheet("verify-otp")}
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
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default App

// import { useState, useRef, useEffect, useCallback } from 'react';

// export const useOTP = ({ length, currentStep }) => {
//     const [otp, setOtp] = useState(Array(length).fill(''));
//     const [focusedInput, setFocusedInput] = useState(null);
//     // Use an array of refs for web inputs
//     const inputRefs = useRef([]);
//     // Initialize the refs array
//     useEffect(() => {
//         inputRefs.current = inputRefs.current.slice(0, length);
//         for (let i = 0; i < length; i++) {
//             if (!inputRefs.current[i]) {
//                 inputRefs.current[i] = { current: null }; // Initialize with a mutable object
//             }
//         }
//     }, [length]);

//     const handleOTPInputChange = useCallback((index, value, e) => {
//         const newOtp = [...otp];
//         const isWebBackspace = e && e.key === 'Backspace'; // For React web

//         if ((isWebBackspace) && value === '' && index > 0) {
//             newOtp[index] = ''; // Clear current input on backspace if empty
//             if (inputRefs.current[index - 1]?.current) {
//                 inputRefs.current[index - 1].current.focus();
//             }
//         } else if (value.length > 1) {
//             // Handle pasting: fill multiple digits
//             const pastedDigits = value.split('').slice(0, length - index);
//             pastedDigits.forEach((digit, i) => {
//                 if (index + i < length) {
//                     newOtp[index + i] = digit;
//                 }
//             });
//             // Move focus to the last pasted digit or the end
//             const nextFocusIndex = Math.min(length - 1, index + pastedDigits.length - 1);
//             if (inputRefs.current[nextFocusIndex]?.current) {
//                 inputRefs.current[nextFocusIndex].current.focus();
//             }
//         } else {
//             // Normal single digit input
//             newOtp[index] = value;
//             if (value !== '' && index < length - 1 && inputRefs.current[index + 1]?.current) {
//                 inputRefs.current[index + 1].current.focus();
//             } else if (value !== '' && index === length - 1) {
//                 // If last input is filled, unfocus (optional)
//                 inputRefs.current[index].current.blur();
//             }
//         }
//         setOtp(newOtp);
//     }, [otp, length]);

//     const handleKeyDown = useCallback((index, e) => {
//         if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
//             // Prevents clearing the previous input when backspace is pressed on an empty input
//             // and moves focus back. The `handleOTPInputChange` will handle clearing
//             // the previous input's value.
//             inputRefs.current[index - 1]?.current?.focus();
//         }
//     }, [otp]);

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             // Focus the first input on mount
//             if (inputRefs.current[0]?.current) {
//                 inputRefs.current[0].current.focus();
//             }
//         }, 100);

//         return () => clearTimeout(timer);
//     }, [currentStep]); // Run only once on mount

//     return {
//         otp,
//         //setOtp, // Added setOtp to allow external control if needed
//         focusedInput,
//         setFocusedInput,
//         inputRefs, // Renamed 'inputs' to 'inputRefs' for clarity in React web context
//         handleOTPInputChange,
//         handleKeyDown,
//         isComplete: otp.every((digit) => digit !== '')
//     };
// };

// Inside your useOTP.js or where handleOTPInputChange is defined
