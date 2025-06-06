
import info from '../assets/icons/info.svg'

export const InvalidLink = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center h-full pb-[20px] text-center">
        <img src={info} className="mb-2 w-[50px] h-[50px]" /> 
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