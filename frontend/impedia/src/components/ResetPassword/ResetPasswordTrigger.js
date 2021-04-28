import React, { useEffect } from 'react';
import axios from 'axios';
import ResetForm from './ResetForm';
import AdminLoginPic from '../../assets/Login/adminLogin.svg'
import  { useHistory} from 'react-router-dom';
import { useCookies } from 'react-cookie';

const ResetPasswordTrigger = () => {

    const [EmailValues, setEmailValues] = React.useState('');
    const [TypeValues, setTypeValues] = React.useState('');

    const [openAlert, setOpenAlert] = React.useState(false);
    const [successAlert, setSuccessAlert] = React.useState(false);

    const submitFunction = async (e) => {
        e.preventDefault();

        const body = {
            email: EmailValues,
            type: TypeValues
        }

        console.log(body);
        
        axios.post('/reset-password/trigger',body)
        .then((res)=>{
            if(res.status === 200){
                setSuccessAlert(true);
            }
        })
        .catch((err)=>{
            if(err.response.status === 400 || err.response.status === 404)
                setOpenAlert(true);
        });
        
    }

    return (
        <>
            <ResetForm 
                EmailValues={EmailValues} 
                TypeValues={TypeValues}
                setEmailValues={setEmailValues}
                setTypeValues={setTypeValues}
                submitFunction={submitFunction}
                loginImage={AdminLoginPic}
                openAlert={openAlert}
                successAlert={successAlert}
                setOpenAlert={setOpenAlert}
                setSuccessAlert={setSuccessAlert}
            />
        </>
    )
}

export default ResetPasswordTrigger;
