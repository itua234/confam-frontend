// components/VerificationDocumentsAccordion.tsx
import React from 'react';
import { Lock } from 'lucide-react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import AccordionTriggerContent from './AccordionTriggerContent';
import VerificationDocument from './VerificationDocument'; // Your existing component

export default function VerificationDocumentsAccordion({
  documents,
  kycLevel,
  onFileUpload,
  onToggleShare,
}) {
  // Logic to determine if this section is complete based on documents and kycLevel
  const isComplete = false; // Implement your actual logic here

  const ninBvnDocs = documents.filter(doc => doc.type === "NIN" || doc.type === "BVN");
  const otherIdDocs = documents.filter(doc => doc.type !== "NIN" && doc.type !== "BVN" && doc.type !== "Utility Bill");
  const utilityBillDocs = documents.filter(doc => doc.type === "Utility Bill");

  return (
    <AccordionItem value="item-2" className="accordion-header">
      <AccordionTrigger className="accordion-trigger">
        <AccordionTriggerContent
          icon={Lock}
          title="Verification documents"
          subtitle={`${documents.length} documents`} // Dynamic subtitle
          isComplete={isComplete}
        />
      </AccordionTrigger>
      <AccordionContent className="accordion-content">
        {ninBvnDocs.map((doc, index, arr) => (
          <VerificationDocument
            key={doc.id}
            doc={doc}
            isLast={index === arr.length - 1}
            onFileUpload={onFileUpload}
            onToggleShared={onToggleShare}
          />
        ))}

        {(kycLevel === 'tier_2' || kycLevel === 'tier_3') && (
          <>
            <div className="px-3 py-3">
              <div className="text-[12px]">At least one of these <span className="ml-[2px]" style={{ color: 'red' }}>*</span></div>
            </div>
            {otherIdDocs.map((doc, index, arr) => (
              <VerificationDocument
                key={doc.id}
                doc={doc}
                isLast={index === arr.length - 1}
                onFileUpload={onFileUpload}
                onToggleShared={onToggleShare}
              />
            ))}
          </>
        )}

        {(kycLevel === 'tier_3') && (
          <>
            <div className="px-3 py-3">
              <div className="text-[12px]">Address Verification <span className="ml-[2px]" style={{ color: 'red' }}>*</span></div>
            </div>
            {utilityBillDocs.map((doc, index, arr) => (
              <VerificationDocument
                key={doc.id}
                doc={doc}
                isLast={index === arr.length - 1}
                onFileUpload={onFileUpload}
                onToggleShared={onToggleShare}
              />
            ))}
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}