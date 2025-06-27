import { DocumentService } from '@/services/DocumentService';
import { WebViewerInstance } from '@pdftron/webviewer';
import { Ref, useEffect, useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Upload } from 'lucide-react';

interface WordEditorPDFTronWebviewerProps { }

const WordEditorPDFTronWebviewer: React.FC<WordEditorPDFTronWebviewerProps> = () => {
  const viewer: Ref<HTMLDivElement | any> = useRef(null);
  const [webviewerInstance, setWebViewerInstance] = useState<WebViewerInstance | any>(null);
  // File upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;

    import('@pdftron/webviewer').then((module) => {
      if (!isMounted) return;

      const WebViewer = module.default;
      WebViewer(
        {
          path: '/lib/webviewer',
          licenseKey: 'demo:1750703156803:61d6f78903000000007cbdb6326f34d4a7d51c3574a922029fd41d2897',
          enableOfficeEditing: true,
          isReadOnly: false,
          enableFilePicker: true,
          fullAPI: true,
          disabledElements: [
            'downloadButton',
            'printButton',
            'searchButton',
          ]
        },
        viewer.current,
      ).then((instance: WebViewerInstance) => {
        if (!isMounted) {
          instance.UI.closeDocument();
          return;
        }

        const { documentViewer } = instance.Core;

        instance.UI.setTheme('light');

        // Enable office editing features by default
        instance.UI.enableFeatures([instance.UI.Feature.ContentEdit]);

        documentViewer.addEventListener('documentLoaded', () => {
          if (!isMounted) return;

          // Re-enable editing features after document load
          instance.UI.enableFeatures([instance.UI.Feature.ContentEdit]);
          instance.UI.setToolMode('TextSelect');
        });

        setWebViewerInstance(instance);
      });
    });

    return () => {
      isMounted = false;
      if (webviewerInstance) {
        webviewerInstance.UI.closeDocument();
      }
    };
  }, []);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name);

      try {
        const response = await DocumentService.processDocument(file, 'XML');

        // Convert the buffer to a Blob with the correct DOCX MIME type
        const docxBlob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        // Create a URL for the blob
        const newBlobUrl = URL.createObjectURL(docxBlob);

        // Load the blob URL into the WebViewer with office editing enabled
        if (webviewerInstance) {
          await webviewerInstance.UI.loadDocument(newBlobUrl, {
            filename: file.name,
            extension: 'docx'
          });

          // Enable office editing mode
          webviewerInstance.UI.enableFeatures([webviewerInstance.UI.Feature.ContentEdit]);
          webviewerInstance.UI.setToolMode('TextSelect');
        }
      } catch (error) {
        console.error('Error processing document:', error);
      }
    }
  };

  const handleModifyFile = async () => {
    if (!webviewerInstance) {
      console.error('WebViewer instance not available');
      return;
    }

    try {
      console.log('Extracting current document content...');

      // Get the current document from the viewer
      const { documentViewer } = webviewerInstance.Core;
      const doc = documentViewer.getDocument();

      let file: File;

      if (!doc) {
        console.log('No document loaded in viewer, using originally selected file...');

        // If no document is loaded but we have a selected file, use that
        if (!selectedFile) {
          console.error('No document loaded and no file selected');
          return;
        }

        file = selectedFile;
      } else {
        // Get document data as ArrayBuffer
        const data = await doc.getFileData({
          // Ensure we get the document in a format suitable for backend processing
          downloadType: 'office'
        });

        // Convert ArrayBuffer to File object for backend processing
        file = new File([data], selectedFile?.name || 'document.docx', {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
      }

      console.log('Sending document to backend for processing...');

      // Send the current document content to backend for processing
      const response = await DocumentService.processDocument(file, 'XML');

      // Convert the response buffer to a Blob with the correct DOCX MIME type
      const docxBlob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      // Create a URL for the blob
      const updatedBlobUrl = URL.createObjectURL(docxBlob);

      console.log('Loading updated document back into editor...');

      // Load the processed document back into the WebViewer
      await webviewerInstance.UI.loadDocument(updatedBlobUrl, {
        filename: selectedFile?.name || 'modified_document.docx',
        extension: 'docx'
      });

      // Re-enable office editing mode
      webviewerInstance.UI.enableFeatures([webviewerInstance.UI.Feature.ContentEdit]);
      webviewerInstance.UI.setToolMode('TextSelect');

      console.log('Document successfully modified and updated');

    } catch (error) {
      console.error('Error modifying document:', error);
    }
  };

  return (
    <div className="border border-input rounded-lg flex-1 h-full relative overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".docx,.doc,.pdf,.txt"
        style={{ display: 'none' }}
      />
      <style jsx global>{`
        .webviewer {
          height: 100% !important;
          overflow: hidden !important;
        }
        .HeaderItems {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 10 !important;
          background: white !important;
        }
        .DocumentContainer {
          height: 100% !important;
          padding-top: 40px !important; /* Adjust this value based on your toolbar height */
          overflow-y: auto !important;
        }
      `}</style>
      <div className="webviewer h-full" ref={viewer}></div>
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          className=""
          onClick={handleFileUpload}
          startIcon={<Upload className="w-4 h-4" />}
        >
          {selectedFile ? `Selected: ${selectedFile.name}` : 'Upload File'}
        </Button>
        <Button
          className=""
          onClick={handleModifyFile}
          startIcon={<Upload className="w-4 h-4" />}
        >
          Modify File
        </Button>
      </div>
    </div>
  );
};

export default WordEditorPDFTronWebviewer;
