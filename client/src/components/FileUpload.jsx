import { Upload } from 'lucide-react';
import { Button } from "./ui/button";

export default function FileUpload({ onFileSelect, multiple = false, accept = "*" }) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    onFileSelect(files);
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        multiple={multiple}
        accept={accept}
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button variant="outline" className="cursor-pointer" asChild>
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Upload Files</span>
          </div>
        </Button>
      </label>
    </div>
  );
} 