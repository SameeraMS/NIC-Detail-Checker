/* eslint-disable no-unused-vars */
import {useState, useEffect} from 'react'
import { TextField, Button, IconButton, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import infoImage from '../../assets/infoImg.png'
import './Details.css'
import Card from '../Card/card.jsx'
import CloseIcon from '@mui/icons-material/Close';
import {validateNic,infoNic} from 'lanka-nic-2019'
import { useNavigate } from 'react-router-dom'
import emailjs from '@emailjs/browser'

export default function Details(){
    const navigate=useNavigate();
    const [nicNO,setNicNO]=useState('NA');
    const [gender,setGender]=useState('NA');
    const [birthDay,setBirthday]=useState("NA");
    const [error,setError]=useState("none");
    const [location, setLocation] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    // Initialize EmailJS
    useEffect(() => {
        emailjs.init("4lKVgr25Ve65PK_4U"); // Replace with your EmailJS public key
    }, []);

    // Get location from IP
    const getLocation = async () => {
        try {
            // Get IP-based location from ipapi.co (no API key required for basic usage)
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) throw new Error('Failed to fetch location');
            const data = await response.json();
            if (data.latitude && data.longitude) {
                console.log('Latitude:', data.latitude, 'Longitude:', data.longitude);
                return `${data.latitude},${data.longitude} (City: ${data.city}, Country: ${data.country_name})`;
            } else {
                return `Location not available (IP: ${data.ip || 'unknown'})`;
            }
        } catch (err) {
            console.error('IP location error:', err);
            return 'Location not available';
        }
    };

    const sendEmail = async (nic, userLocation) => {
        try {
            // const message = {
            //     // to_email: 'madushansameera499@gmail.com', // Replace with your email
            //     nic_number: nic,
            //     location: userLocation
            // };

            const formData = {
            name: nic,
            email: 'email',
            message: userLocation
        };

            await emailjs.send(
                'service_2p0lp99', // Replace with your EmailJS service ID
                'template_exxi30t', // Replace with your EmailJS template ID
                formData
            );

            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    async function handleConfirm() {
        setOpenDialog(false);
        const userLocation = await getLocation();
        await sendEmail(nicNO, userLocation);
    }

    function submit(){
        if(!validateNic(nicNO)){
            setError("flex");
            setBirthday("NA");
            setGender("NA");
        }else{
            setError("none");
            const {birthday,gender}=infoNic(nicNO);
            setBirthday(birthday);
            setGender(gender);
            setOpenDialog(true);
        }
    }

    return(
        <>
            <div className="main">
                <div className="top">
                    <div className="imagewithclose">
                        <img src={infoImage} alt="No" className='topimage'/><br />
                        <IconButton aria-label="delete" className='close' onClick={()=>navigate("/")}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
                
                <div className="inputs">
                    
                    <TextField onChange={(e) => setNicNO(e.target.value)} id="outlined-basic"  className='nic' label="Enter NIC No" variant="outlined" color="success"/>
                    <Button variant="contained" onClick={()=>submit()} color="success" className='submitbutton'>
                        Submit
                    </Button>
                    <Alert severity="error" sx={{
                        width:300,
                        display:error
                    }}>Invalid NIC number</Alert>
                    <Card title={"NIC No"} value={nicNO}></Card>
                    <Card title={"Birthday"} value={birthDay}></Card>
                    <Card title={"Gender"} value={gender}></Card>
                    <br />
                </div>
            </div>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Submission"}
                </DialogTitle>
                <DialogContent>
                    Are you sure you want to submit this NIC number?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="success" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}