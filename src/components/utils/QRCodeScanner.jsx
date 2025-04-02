import React, { useState, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Alert, 
  Divider, 
  Stack,
  IconButton,
  styled,
  CircularProgress
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { loginWithQRAPI, setCurrentUser } from '../../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import jsQR from 'jsqr';

// Styled component for file input
const Input = styled('input')({
  display: 'none',
});

const QRCodeScanner = () => {
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const processQRData = (qrData) => {
    // Log original QR data for debugging
    console.log("Original QR Code Data:", qrData);    
  
    if (!qrData.userId ) {
      setError('Invalid QR code format');
      console.error("Invalid QR code format - missing userId or qrId");
      return;
    }
  
    // Extract only the required fields for API call
    const loginData = {
      userId: qrData.userId,      
    };
    
    console.log("Sending to API:", loginData);
    setIsLoggingIn(true);
  
    toast.promise(
      dispatch(loginWithQRAPI(loginData))
        .then((res) => {
          console.log("API response:", res);
          
          if (!res.error) {
            console.log("Login successful, response:", res.payload);
            
            // Store user information in localStorage
            localStorage.setItem("userId", res.payload.userId);
            localStorage.setItem("userRole", res.payload.userRole);
            
            // Update Redux state with current user
            dispatch(setCurrentUser(res.payload));
            
            // Navigate to home page
            navigate('/');
            setScannerEnabled(false);
            setUploading(false);
          } else {
            // Handle the error case
            console.error("Login error details:", res.error);
            const errorMessage = res.error?.message || res.payload || 'Unknown error occurred';
            setError(`Login failed: ${errorMessage}`);
            throw new Error(errorMessage); // Throw to trigger toast error
          }
        })
        .catch(err => {
          console.error("Login exception:", err);
          setError(`Login failed: ${err.message || 'Unknown error'}`);
          throw err; // Re-throw to trigger toast error
        })
        .finally(() => {
          setIsLoggingIn(false);
        }),
      { 
        pending: "Logging in with QR code...", 
        success: "Logged in successfully!", 
        error: (err) => `Failed to login: ${err.message || 'Unknown error'}` 
      }
    );
  };

  const handleScan = (result) => {
    if (result) {
      try {
        console.log("QR code scanned raw result:", result);
        console.log("QR code scanned text:", result?.text);
        
        const qrData = JSON.parse(result?.text);
        processQRData(qrData);
      } catch (err) {
        setError('Could not parse QR code data');
        console.error("QR code parsing error:", err, "Raw data:", result?.text);
      }
    }
  };

  const handleError = (err) => {
    console.error("Camera error:", err);
    setError('Error accessing camera');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("File selected:", file.name, file.type, file.size);
    setUploading(true);
    setError('');

    // Create an image from the file
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        console.log("Image loaded, dimensions:", img.width, "x", img.height);
        // Create canvas to process the image
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        // Get image data for QR code scanning
        try {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          console.log("Image data extracted, processing with jsQR...");
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            console.log("QR code found in image:", code);
            console.log("QR code data:", code.data);
            try {
              const qrData = JSON.parse(code.data);
              console.log("Parsed QR data:", qrData);
              processQRData(qrData);
            } catch (err) {
              setError('Invalid QR code format in image');
              console.error("QR code parsing error:", err, "Raw data:", code.data);
            }
          } else {
            setError('No QR code found in image');
            console.log("No QR code found in image");
          }
        } catch (err) {
          setError('Error processing image');
          console.error("Image processing error:", err);
        }
        
        setUploading(false);
      };
      
      img.onerror = () => {
        setError('Error loading image');
        console.error("Error loading image");
        setUploading(false);
      };
      
      setUploadedImage(e.target.result);
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      setError('Error reading file');
      console.error("Error reading file");
      setUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const resetUpload = () => {
    console.log("Resetting upload state");
    setUploadedImage(null);
    setUploading(false);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom textAlign="center">
        QR Code Login
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {isLoggingIn && (
        <Box display="flex" justifyContent="center" alignItems="center" my={3}>
          <CircularProgress size={40} />
          <Typography variant="body2" ml={2}>Logging in...</Typography>
        </Box>
      )}

      {!isLoggingIn && !scannerEnabled && !uploading ? (
        <Stack spacing={2} direction="column" sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<CameraAltIcon />}
            onClick={() => {
              setError('');
              setScannerEnabled(true);
            }}
            fullWidth
          >
            Scan QR Code with Camera
          </Button>
          
          <Divider>OR</Divider>
          
          <label htmlFor="qr-code-upload">
            <Input
              accept="image/*"
              id="qr-code-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadFileIcon />}
              fullWidth
              onClick={() => setError('')}
            >
              Upload QR Code Image
            </Button>
          </label>
        </Stack>
      ) : scannerEnabled && !isLoggingIn ? (
        <Box sx={{ position: 'relative', mb: 2 }}>
          <QrReader
            onResult={handleScan}
            onError={handleError}
            constraints={{ facingMode: 'environment' }}
            style={{ width: '100%' }}
          />
          <IconButton 
            sx={{ 
              position: 'absolute', 
              top: 5, 
              right: 5, 
              bgcolor: 'rgba(255,255,255,0.7)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              }
            }}
            onClick={() => setScannerEnabled(false)}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      ) : uploading && uploadedImage && !isLoggingIn ? (
        <Box sx={{ position: 'relative', mb: 2, textAlign: 'center' }}>
          <img 
            src={uploadedImage} 
            alt="Uploaded QR Code" 
            style={{ maxWidth: '100%', maxHeight: '300px' }} 
          />
          <IconButton 
            sx={{ 
              position: 'absolute', 
              top: 5, 
              right: 5, 
              bgcolor: 'rgba(255,255,255,0.7)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              }
            }}
            onClick={resetUpload}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Analyzing QR code...
          </Typography>
        </Box>
      ) : null}

      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
        Scan or upload a valid QR code to log in to your account
      </Typography>
    </Paper>
  );
};

export default QRCodeScanner;