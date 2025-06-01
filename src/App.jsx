import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import upload from './assets/icons/cloud-upload.svg'
import loader from './assets/loader.gif'
import eye from './assets/icons/eye-off.svg'
import info from './assets/icons/info.svg'
import shield from './assets/icons/shield-check.svg'
import check_circle from './assets/icons/shield-check.svg'
import pencil from './assets/icons/pencil.svg'
import cloud_upload from "./assets/icons/cloud-upload.svg"
import { Lock, Landmark, User, ArrowUp, Plus } from 'lucide-react';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
// import { useAccount } from 'wagmi'
// import { QueryClient } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Webcam from 'react-webcam';
import userData from "../user.json";
import { useOTP } from './hooks/useOTP'; 
import { useResendTimer } from './hooks/useResendTimer';
import { PhoneInputStep } from './components/PhoneInputStep';
import { OtpInput } from './components/OtpInput';
import AccordionTriggerContent from './components/ui/accordion-trigger-content';
import apiClient from './api/client';


// --- Error Section Component (New) ---
const ErrorSection = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-full pb-[20px] text-center">
    <img src={info} className="mb-2 w-[50px] h-[50px]" /> {/* Example error icon */}
    <h3 className="text-xl font-semibold mb-2">Invalid link</h3>
    <p className="text-gray-700 mb-6">Invalid request, please check and try again</p>
    {onRetry && (
      <div className="mt-auto w-full">
        <p className="text-gray-700 text-[12px]">Interested in knowing why Confam is involved?</p>
        <button onClick={onRetry} className="primary-button">
          Learn More
        </button>
      </div>
    )}
  </div>
);

const Welcome = ({ onContinue }) => {
  return (
    <div className="flex flex-col">
      <div className="text-center">
        <div className="flex justify-center mb-[10px]">
          <img src={eye} alt="" className="feature-icon" />
        </div>
        <h3>To continue, we need to verify your identity</h3>
      </div>

      <div className="my-4 rounded-2 border" style={{ padding: "20px 25px" }}>
        <div className="flex items-center mb-3">
          <img src={eye} alt="" className="feature-icon" />
          <div className="feature-text">
            <b>How Confam verifies your identity.</b> Confam checks the data you provide against approved databases.
          </div>
        </div>

        <div className="flex items-center mb-3">
          <img src={shield} alt="" className="feature-icon" />
          <div className="feature-text">
            <b>Fast and secure.</b> Your data is encrypted and will never be made accessible to unauthorized third parties.
          </div>
        </div>

        <div className="flex items-center">
          <div className="feature-text">
            Allow is authorized and regulated by the<b> National Data Privacy Board (NDPB).</b>
          </div>
        </div>
      </div>

      <div className="footer-text m-[10px]">
        By clicking 'Continue' you agree to <a href="#">Allow's End-user Policy</a>.<br />
      </div>
      <button onClick={onContinue} className="primary-button">
        Continue
      </button>
    </div>
  );
}

const Success = ({}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <img src={check_circle} alt="" className="feature-icon" />
      <div className="mt-2 text-center">
        <h4 className="">
          Verification data submitted successfully!
        </h4>
      </div>
      <div className="mt-2 text-center">
        <p className="mb-0 feature-text">
          Redirecting you in <span id="countdown">5</span> seconds.
        </p>
      </div>
    </div>
  )
}

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

  // --- NEW STATE FOR ERROR HANDLING ---
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAppLoading, setIsAppLoading] = useState(true); // To show loading state for the whole app
  const [kycLevel, setKycLevel] = useState('tier_1'); // To store KYC tier if needed
  const [bankIsRequested, setBankIsRequested] = useState(false);
  
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
  }, []); // Re-run effect if ID changes

  // const queryClient = new QueryClient();
  const [user, setUser] = useState(userData);
  const [documents, setDocuments] = useState(user.verification_documents || []);
  const [uploadedFiles, setUploadedFiles] = useState({});


  const [phoneNumber, setPhoneNumber] = useState('+2348114800769');
  const [otpMethod, setOtpMethod] = useState(''); // e.g., 'sms', 'email', 'whatsapp'
  const {
    otp,
    inputRefs,
    handleOTPInputChange,
    handleKeyDown,
    isComplete,
    focusedInput,
    setFocusedInput
  } = useOTP({ length: 6, currentStep });


  // const [addressLine1, setAddressLine1] = useState('');
  // const [city, setCity] = useState('');
  // const [state, setState] = useState('');
  // const [zipCode, setZipCode] = useState('');
  // const [country, setCountry] = useState('Nigeria');

  // const [bankName, setBankName] = useState('');
  // const [accountNumber, setAccountNumber] = useState('');
  // const [accountName, setAccountName] = useState('');
  const [bankAccounts, setBankAccounts] = useState([]);

  const [accessType, setAccessType] = useState(''); // e.g., 'full', 'limited'

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
        <ErrorSection message={errorMessage} onRetry={() => setCurrentStep(0)} /> // Reset step to 0 for retry
      );
    }

    switch(currentStep) {
      case 0:
        return <Welcome onContinue={nextStep} />;
      case 1: 
      return (
        <PhoneInputStep
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          onContinue={nextStep}
          otpMethod={otpMethod}
          setOtpMethod={setOtpMethod}
        />
      )
    case 2:
      return (
        <OtpInput
          phoneNumber={phoneNumber}
          otp={otp}
          inputRefs={inputRefs}
          focusedInput={focusedInput}
          setFocusedInput={setFocusedInput}
          handleOTPInputChange={handleOTPInputChange}
          handleKeyDown={handleKeyDown}
          onContinue={nextStep}
          otpMethod={otpMethod}
        />
      )
    case 3: 
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
                    <AccordionContent className="accordion-content">
                      <div className="p-3 space-y-3">
                        {/* Name */}
                        <div className="py-2 border-b border-gray-100">
                          <div className="text-sm font-medium">Full Name</div>
                          <div className="text-xs text-gray-500">{user.firstname} {user.lastname}</div>
                        </div>
                        {/* Email */}
                        <div className="py-2 border-b border-gray-100">
                          <div className="text-sm font-medium">Email Address</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                        {/* Phone */}
                        <div className="py-2 border-b border-gray-100">
                          <div className="text-sm font-medium">Phone Number</div>
                          <div className="text-xs text-gray-500">{user.phone}</div>
                        </div>
                        {/* Date of Birth */}
                        <div className="py-2 border-b border-gray-100">
                          <div className="text-sm font-medium">Date of Birth</div>
                          <div className="text-xs text-gray-500">{new Date(user.dob).toLocaleDateString()}</div>
                        </div>
                        {/* Address */}
                        <div className="py-2">
                          <div className="text-sm font-medium">Address</div>
                          <div className="text-xs text-gray-500">
                            {user.address}, {user.city}, {user.state} {user.zip_code}
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
    case 4:
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
    case 5: 
      return <Success />;
      default:
        return null;
    }
  }

  return (
    <>
      <div className="modal-overlay">
        <div className="relative modal-content bg-white rounded-3">
          <div className="header-bar">
            <div><img src="" alt="Allow" className="" /></div>
            <div><button className="" type="button">x</button></div>
          </div>
          <div className="scroll-container">
            <div className="h-full flex flex-col">
              {renderStepContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App