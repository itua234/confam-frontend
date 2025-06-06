import { maskText, getEditAction} from '../lib/utils'; 
import pencil from '../assets/icons/pencil.svg'

export const IdentityBox = ({ 
  identity, 
  isLast,
  onToggleShared, 
  onFileUpload
})  => {
    const handleCheckboxChange = (e) => {
        onToggleShared(identity.id, e.target.checked);
    };

    return (
        <div
        key={identity.id}
        className={`px-3 py-4 flex w-full items-center justify-between ${
            isLast ? '' : 'border-b border-[#E5E5E5]'
        } ${identity.verified ? 'bg-white' : ''}`}
        >
            <div>
                <label htmlFor="name" style={{ fontSize: '14px', fontWeight: 700 }}>
                    {identity.type.replace("_", " ")} 
                    <span className="ml-[3px]" style={{ color: 'red' }}>*</span>
                </label>
                <div className="flex items-center gap-1">
                {identity.verified ? (
                    <>
                    <span style={{ fontSize: '14px' }}>{maskText(identity.value)}</span>
                    <a
                        className="p-0 cursor-pointer"
                        data-id={identity.id}
                        data-action={getEditAction(identity.type)}
                        data-field="identity"
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
                {identity.verified ? (
                <div>
                    <label className="toggle">
                    <input
                        type="checkbox"
                        id={`verified-${identity.id}`}
                        name={identity.type.toLowerCase()}
                        checked={identity.is_shareable}
                        onChange={handleCheckboxChange}
                        className="sr-only peer"
                    />
                    <span className="slider"></span>
                    </label>
                </div>
                ) : (
                    <div>
                        <button className="edit-btn flex items-center justify-center">
                            <img src={pencil} width="14" alt="Edit" />
                            <span className="ml-[8px]">Edit</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}