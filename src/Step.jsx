import { useState } from 'react'

function App() {
  const [currentStep, setCurrentStep] = useState(1);
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2 className="text-2xl font-bold mb-4">Step 1: Welcome</h2>
            <p className="text-gray-600 mb-6">
              Welcome to our multistep process. Let's get started with setting up your account.
            </p>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Enter your name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h2 className="text-2xl font-bold mb-4">Step 2: Preferences</h2>
            <p className="text-gray-600 mb-6">
              Tell us about your preferences to customize your experience.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose your plan:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="plan" value="basic" className="mr-2" />
                    Basic Plan - $9/month
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="plan" value="pro" className="mr-2" />
                    Pro Plan - $19/month
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="plan" value="enterprise" className="mr-2" />
                    Enterprise Plan - $49/month
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h2 className="text-2xl font-bold mb-4">Step 3: Verification</h2>
            <p className="text-gray-600 mb-6">
              We need to verify your information before proceeding.
            </p>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Verification Code</h3>
                <p className="text-blue-600 text-sm">
                  We've sent a code to your email. Please enter it below.
                </p>
              </div>
              <input 
                type="text" 
                placeholder="Enter verification code"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-content">
            <h2 className="text-2xl font-bold mb-4">Step 4: Complete</h2>
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-800">All Set!</h3>
                <p className="text-gray-600">
                  Your account has been successfully set up. You're ready to get started!
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="modal-overlayy">
        <div className="al-modal-content bg-white rounded-3">
          <div className="">
            <img src="" alt="Allow" className="mono-logo" />
            <button className="close-button"></button>
          </div>
          <div className="content-box position-relative p-6">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                {[...Array(totalSteps)].map((_, index) => {
                  const stepNumber = index + 1;
                  return (
                    <div key={stepNumber} className="flex items-center">
                      <button
                        onClick={() => goToStep(stepNumber)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          stepNumber === currentStep
                            ? 'bg-blue-600 text-white'
                            : stepNumber < currentStep
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {stepNumber < currentStep ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          stepNumber
                        )}
                      </button>
                      {stepNumber < totalSteps && (
                        <div className={`h-1 w-12 mx-2 ${
                          stepNumber < currentStep ? 'bg-green-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500">
                Step {currentStep} of {totalSteps}
              </p>
            </div>

            {/* Step Content */}
            <div className="min-h-[300px]">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              
              <div className="flex space-x-3">
                {currentStep < totalSteps ? (
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => alert('Process completed!')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

 {/* <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-full px-[20px] py-[24px] rounded-none justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                    >
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Date of Birth</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                    <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    // Add this prop to enable dropdowns for month and year
                    captionLayout="dropdown-years"
                    fromYear={1950} // Optional: define a year range for dropdowns
                    toYear={2050}
                    />
                </PopoverContent>
            </Popover> */}