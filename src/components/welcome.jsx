import eye from '../assets/icons/eye-off.svg'
import shield from '../assets/icons/shield-check.svg'
import ButtonWithLoader from './ButtonWithLoader';
import { useSelector, useDispatch } from 'react-redux';
import {
  openBottomSheet
} from '../reducers/bottomsheet/bottomSheetSlice';
import {
  setCurrentStep,
   setLoading
} from '../reducers/ui/uiSlice';

export default function Welcome () {
    const dispatch = useDispatch();
    const { phoneVerifiedAt } = useSelector((state) => state.kyc); 
    const { loading } = useSelector((state) => state.ui); 
   
    const handleClick = () => {
        dispatch(setLoading(true));
        setTimeout(() => {
            dispatch(setLoading(false));
            if(!phoneVerifiedAt){
                dispatch(setCurrentStep(1));
            }else{
                dispatch(openBottomSheet("send-otp"));
            }
        }, 1000); 
    }

    return (
        <div className="flex flex-1 flex-col justify-between pb-[50px]">

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

            <div className="">
                <div className="footer-text m-[10px]">
                By clicking 'Continue' you agree to <a href="#">Allow's End-user Policy</a>.<br />
                </div>
                <ButtonWithLoader
                    onClick={handleClick}
                    disabled={loading}
                    isLoading={loading} 
                    className="mt-auto" 
                >
                    Continue
                </ButtonWithLoader>
            </div>
        </div>
    );
}