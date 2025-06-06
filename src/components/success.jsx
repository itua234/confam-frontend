import React from 'react';
import check_circle from '../assets/icons/shield-check.svg'

export const Success = ({}) => {
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