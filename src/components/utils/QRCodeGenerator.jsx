import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/user/userSlice';

const QRCodeGenerator = () => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser?.userId) {
      const generateQRData = () => {
        const qrId = uuidv4();
        const data = {
          userId: currentUser.userId,
          qrId: qrId
        };
        setQrData(data);
        setLoading(false);
      };

      generateQRData();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', maxWidth: 300, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Your Login QR Code
      </Typography>
      <Box sx={{ my: 2 }}>
        {qrData && (
          <QRCode 
            value={JSON.stringify(qrData)} 
            size={200}
            level={"H"}
            includeMargin={true}
          />
        )}
      </Box>
      <Typography variant="body2" color="text.secondary">
        Scan this QR code with the mobile app to log in
      </Typography>
    </Paper>
  );
};

export default QRCodeGenerator;