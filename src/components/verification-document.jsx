
import { Lock, Landmark, User, ArrowUp, Plus } from 'lucide-react';
import { maskText, getEditAction} from '../lib/utils'; 
import pencil from '../assets/icons/pencil.svg'

export const VerificationDocument = ({ 
  doc, 
  isLast,
  onToggleShared, 
  onFileUpload
})  => {
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