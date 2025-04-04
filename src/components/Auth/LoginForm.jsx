// ...existing code...
import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import { Card as MuiCard } from '@mui/material';
import { ReactComponent as TrelloIcon } from '../../assets/trello.svg';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import Zoom from '@mui/material/Zoom';
import Alert from '@mui/material/Alert';
import { useForm } from 'react-hook-form';
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE
} from '../../utils/validators';
import FieldErrorAlert from '../Form/FieldErrorAlert';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { loginUserAPI } from '../../redux/user/userSlice';
import { Tab, Tabs } from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QRCodeScanner from '../utils/QRCodeScanner';

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  let [searchParams] = useSearchParams();
  const registeredEmail = searchParams.get('registeredEmail');
  const verifiedEmail = searchParams.get('verifiedEmail');
  const [loginMethod, setLoginMethod] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setLoginMethod(newValue);
  };

  const submitLogIn = (data) => {
    const { email, password } = data;
    
    toast.promise(
      dispatch(loginUserAPI({ email, password }))
        .then(res => {
          if (!res.error) {
            // ✅ Lưu userId vào localStorage
            localStorage.setItem("userId", res.payload.userId);
            localStorage.setItem("userRole", res.payload.userRole);
            console.log("userId: ", res.payload.userRole);
            
            navigate('/'); // ✅ Chuyển hướng sau khi đăng nhập thành công
          }
        }),
      { pending: "Logging in...", success: "Logged in successfully!", error: "Failed to login!" }
    );
  };
  
  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em' }}>
          <Box sx={{
            margin: '1em',
            display: 'flex',
            justifyContent: 'center',
            gap: 1
          }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}><LockIcon /></Avatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}><TrelloIcon /></Avatar>
          </Box>
          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', color: theme => theme.palette.grey[500] }}>
            Author: AiMier
          </Box>

          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '0 1em' }}>
            {verifiedEmail &&
              <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                Your email&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>minhquang030602@gmail.com</Typography>
                &nbsp;has been verified.<br />Now you can login to enjoy our services! Have a good day!
              </Alert>
            }

            {registeredEmail &&
              <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                An email has been sent to&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>registeredEmail</Typography>
                <br />Please check and verify your account before logging in!
              </Alert>
            }
          </Box>

          <Tabs 
            value={loginMethod} 
            onChange={handleTabChange} 
            centered
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab icon={<LockIcon />} label="Password" />
            <Tab icon={<QrCodeIcon />} label="QR Code" />
          </Tabs>

          {loginMethod === 0 ? (
            // Password login form
            <Box sx={{ padding: '0 1em 1em 1em' }}>
              <Box sx={{ marginTop: '1em' }}>
                <TextField
                  autoFocus
                  fullWidth
                  label="Enter Email..."
                  type="text"
                  variant="outlined"
                  error={!!errors['email']}
                  {...register('email', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: EMAIL_RULE,
                      message: EMAIL_RULE_MESSAGE
                    }
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName={'email'} />
              </Box>

              <Box sx={{ marginTop: '1em' }}>
                <TextField
                  fullWidth
                  label="Enter Password..."
                  type="password"
                  variant="outlined"
                  error={!!errors['password']}
                  {...register('password', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: PASSWORD_RULE,
                      message: PASSWORD_RULE_MESSAGE
                    }
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName={'password'} />
              </Box>
              
              <CardActions sx={{ padding: '1em 0 0 0' }}>
                <Button
                  className='interceptor-loading'
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Login
                </Button>
              </CardActions>
            </Box>
          ) : (
            // QR Code login
            <Box sx={{ padding: '1em' }}>
              <QRCodeScanner />
            </Box>
          )}

          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Typography>New to Trello MERN Stack Advanced?</Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Create account!</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  );
}

export default LoginForm;