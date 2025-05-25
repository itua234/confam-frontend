import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import upload from './assets/icons/cloud-upload.svg'
import eye from './assets/icons/eye-off.svg'
import shield from './assets/icons/shield-check.svg'
import check_circle from './assets/icons/shield-check.svg'
import pencil from './assets/icons/pencil.svg'
import cloud_upload from "./assets/icons/cloud-upload.svg"
// import './App.css'
// import { ConnectButton } from '@rainbow-me/rainbowkit';
// import { useAccount } from 'wagmi'
// import { QueryClient } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import userData from "../user.json";

const VerificationDocument = ({ 
  doc, 
  isLast,
  onToggleVerified, 
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
  const showRedAsterisk = doc.type === 'NIN' || doc.type === 'BVN';
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      onFileUpload(doc.id, file);
    }
  };

  const handleCheckboxChange = (e) => {
    //onToggleVerified(doc.id, e.target.checked);
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
              <span style={{ fontSize: '14px' }}>{doc.text}</span>
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
                checked={doc.verified}
                // data-doc-id={doc.id}
                // data-doc-type={doc.type}
                onChange={handleCheckboxChange}
                className="sr-only peer"
              />
              <span className="slider"></span>
            </label>
          </div>
        ) : (
          <div>
            <label
              htmlFor={`file-${doc.id}`}
              className="upload-btn flex items-center justify-center"
            >
              <span>Upload</span>
            </label>
            <input
              type="file"
              id={`file-${doc.id}`}
              name={doc.type.toLowerCase()}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(userData);
  const [uploadedFiles, setUploadedFiles] = useState({});

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
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
  const handleToggleVerified = (docId, isChecked) => {
    // setUser(prevUser => ({
    //   ...prevUser,
    //   verification_documents: prevUser.verification_documents.map(doc =>
    //     doc.id === docId 
    //       ? { ...doc, verified: isChecked }
    //       : doc
    //   )
    // }));
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
    switch(currentStep) {
      case 0:
        return (
          <>
            <div className="flex flex-col">
              <div className="text-center">
                  <h3 className="">
                      To continue, we need to verify your identity
                  </h3>
              </div>

              <div className="my-4 rounded-2 border" style={{ padding: "20px 25px" }}>
                  <div className="flex items-center mb-3">
                      <img src={eye} alt="" className="feature-icon" />
                      <div className="feature-text">
                          <b>How Confam verifies your identity.</b> Confam checks the data you provide againts approved databases.
                      </div>
                  </div>

                  <div className="flex items-center mb-3">
                      <img src={shield} alt="" className="feature-icon" />
                      <div className="feature-text">
                          <b>Fast and secure.</b>
                          Your data is encrypted and will never be made accessible to unauthorized third parties.
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
              <button 
              onClick={nextStep}
              className="primary-button mt-auto">
                Continue
              </button>
            </div>
          </>
        )
      case 1: 
      return (
        <>
          <div className="" id="step1">
            <div className="text-center mb-4">
              <h3>Personal Information</h3>
            </div>
            <form>
              <div className="mb-3">
                <label
                  htmlFor="phone"
                  className="block text-[18px] font-medium"
                >
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  className="w-full px-[20px] py-[14px] border bg-transparent border-[#E5E5E5] focus:outline-none" 
                  id="phone" 
                  placeholder="Enter phone number" 
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Preferred OTP Method</label>
                <div className="d-flex gap-3">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="otpMethod" id="smsOtp" value="sms" checked />
                      <label className="form-check-label" htmlFor="smsOtp">
                        SMS
                      </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="otpMethod" id="emailOtp" value="email" />
                        <label className="form-check-label" htmlFor="emailOtp">
                            Email
                        </label>
                    </div>
                </div>
              </div>

              <button 
                onClick={nextStep}
                className="primary-button">
                Continue
              </button>
            </form>
          </div>
        </>
      )
    case 2: 
      return (
        <>
          <div className="">
            <div>
              <p className="text-center">Confirm the details you want to share with <b>confam.</b></p>
            </div>
            <form enctype="multipart/form-data">
              <div className="">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" className="accordion-header">
                    <AccordionTrigger className="accordion-trigger">
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="rounded-full flex items-center justify-center h-[35px] w-[35px] border border-[#bbb]">
                              <img src={cloud_upload} className="" width="18" />
                            </div>
                            <div className="flex flex-col mx-2">
                              <span className="">Personal Information</span>
                              <span className="text-[12px]">5 items</span>
                            </div>
                        </div>
                        <div className="">
                          <div className="flex items-center justify-center w-[20px] h-[20px] rounded-full bg-[#222831]">
                            <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          {/* <img src={cloud_upload} className="" width="18" /> */}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="accordion-content">
                      Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="accordion-header">
                    <AccordionTrigger className="accordion-trigger">
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="rounded-full flex items-center justify-center h-[35px] w-[35px] border border-[#bbb]">
                              <img src={cloud_upload} className="" width="18" />
                            </div>
                            <div className="flex flex-col mx-2">
                              <span className="">Verification documents</span>
                              <span className="text-[12px]">5 documents</span>
                            </div>
                        </div>
                        <div className="">
                          <img src={cloud_upload} className="" width="18" />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="accordion-content">
                      {
                        user.verification_documents
                        .filter(doc => doc.type === "NIN" || doc.type === "BVN")
                        .map((doc, index, arr) => (
                          <VerificationDocument
                            key={doc.id}
                            doc={doc}
                            isLast={index === arr.length - 1}
                            onFileUpload={handleFileUpload}
                          />
                        ))
                      }
                      <div className="px-3 py-3">
                        <div class="text-[12px]">At least one of these <span className="ml-[2px]" style={{ color: 'red' }}>*</span></div>
                      </div>
                      {
                        user.verification_documents
                        .filter(doc => doc.type !== "NIN" && doc.type !== "BVN")
                        .map((doc, index, arr) => (
                          <VerificationDocument
                            key={doc.id}
                            doc={doc}
                            isLast={index === arr.length - 1}
                            onFileUpload={handleFileUpload}
                          />
                        ))
                      }
                    </AccordionContent>
                  </AccordionItem>
                  {
                    !user.bank_accounts && (
                      <AccordionItem value="item-3" className="accordion-header">
                        <AccordionTrigger className="accordion-trigger">
                          <div className="w-full flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="rounded-full flex items-center justify-center h-[35px] w-[35px] border border-[#bbb]">
                                  <img src={cloud_upload} className="" width="18" />
                                </div>
                                <div className="flex flex-col mx-2">
                                  <span className="">Bank accounts</span>
                                  <span className="text-[12px]">2 accounts</span>
                                </div>
                            </div>
                            <div className="">
                              <img src={cloud_upload} className="" width="18" />
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="accordion-content">
                          Yes. It's animated by default, but you can disable it if you prefer.
                        </AccordionContent>
                      </AccordionItem>
                     )
                  }
                </Accordion>
              </div>
              <div className="mt-3 w-full">
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
        <>
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
        </>
      )
      default:
        return null;
    }
  }

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content bg-white rounded-3">
          <div className="scroll-container">
            <div className="flex flex-row justify-between items-center mb-[30px]" style={{border: "2px solid red"}}>
              <div><img src="" alt="Allow" className="" /></div>
              <div><button className="" type="button">x</button></div>
            </div>
            <div className="overflow-hidden relative flex flex-col">
              {renderStepContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App