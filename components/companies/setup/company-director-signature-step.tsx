import { FileUploadField } from "@/components/companies/setup/file-upload-field";

export function CompanyDirectorSignatureStep() {
  return (
    <div className="space-y-4">
      <FileUploadField
        label="Director signature upload"
        name="signatureFile"
        accept="image/*"
        hint="Optional. Used for generated documents and approval workflows."
      />
    </div>
  );
}
