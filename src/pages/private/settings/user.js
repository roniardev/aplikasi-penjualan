import React, { useRef, useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {useFirebase} from '../../../components/FirebaseProvider';
import { useSnackbar } from 'notistack';

import isEmail from 'validator/lib/isEmail';

import useStyles from './styles/user';
function UserSettings() {
    const classes = useStyles();
    const {user} = useFirebase();
    const displayNameRef = useRef();
    const emailRef = useRef();
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState({
        displayName:'',
        email: ''
    })
    const {enqueueSnackbar} = useSnackbar();
    const saveDisplayName = async e => {
        const displayName = displayNameRef.current.value;
        console.log(displayName);
        if(!displayName) {
            setError({
                displayName: 'Nama Wajib Diisi'
            })
        }else if(displayName !== user.displayName){
            setError({ displayName: ''})
            setSubmitting(true);
            await user.updateProfile({
                displayName
            });
            setSubmitting(false);
            enqueueSnackbar('Data pengguna berhasil diperbarui', {variant: 'success'})
        }
    }
    const updateEmail = async e  => {
        const email = emailRef.current.value;
        if(!email) {
            setError({
                email: 'Email wajib diisi'
            })
        }else if(!isEmail(email)){
            setError({
                email: 'Email tidak valid'
            })
        }else if(email !== user.email){
            setError({
                email: ''
            })
            setSubmitting(true);
            try {
                await user.updateEmail(email);
                enqueueSnackbar('Email berhasil diperbarui', {variant: 'success'});
            } catch (error) {
                let emailError = '';
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        emailError = 'Email sudah digunakan oleh pengguna lain'
                        break;
                    case 'auth/invalid-email':
                        emailError = 'Email tidak valid'
                        break;
                    case 'auth/requires -recent-login':
                        emailError = 'silahkan login ulang untuk memperbarui Email'
                        break;

                    default:
                        emailError = 'Terjadi kesalahan, silahkan coba lagi'
                        break;
                }
                setError({
                    email: emailError
                })
            }
            setSubmitting(false)
        }
    }
    const sendEmailVerification = async e => {
        const actionCodeSettings = {
            url: `${window.location.origin}/login`
        }
        setSubmitting(true);
        await user.sendEmailVerification(actionCodeSettings);
        enqueueSnackbar(`Email verifikasi telah dikirimkan ke ${emailRef.current.value}`, {variant: 'success'})
        setSubmitting(false);
    }
    return <div className={classes.userSettings}>
        <TextField margin="normal" id="displayName" name="displayName" label="Nama" inputProps={{
            ref: displayNameRef,
            onBlur: saveDisplayName
        }} disabled={isSubmitting} defaultValue={user.displayName} helperText={error.displayName} error={error.displayName? true:false} />
        <TextField margin="normal" id="email" name="email" label="Email" defaultValue={user.email} inputProps={{
            ref: emailRef,
            onBlur: updateEmail
        }} helperText={error.email} error={error.email?true:false} disabled={isSubmitting} />
        {user.emailVerified ?
        <Typography variant="subtitle1" color="primary">Email sudah terverifikasi</Typography>
        :
        <Button onClick={sendEmailVerification} disabled={isSubmitting} variant="outlined">Kirim Email Verifikasi</Button>
         }
    </div>
};

export default UserSettings;