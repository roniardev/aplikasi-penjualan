import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import useStyles from './styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import {Link, Redirect} from 'react-router-dom';

import isEmail from 'validator/lib/isEmail';

import {useFirebase} from '../../components/FirebaseProvider';

import AppLoading from '../../components/AppLoading';

import {useSnackbar} from 'notistack';

function Forgot() {
    const classes = useStyles();
    const [form, setForm] = useState({
        email: ''
    });

    const {auth, user, loading} = useFirebase();
    const {enqueueSnackbar} = useSnackbar();
    
    const handleFunc = e => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })

        setError({
            ...error,
            [e.target.name] : ''
        })
    }

    const [error, setError] = useState({
        email: ''
    })

    const [isSubmitting, setSubmitting] = useState(false);

    const validate = () => {
        const newError = {...error}

        if(!form.email) {
            newError.email = 'Email wajib diisi';
        }else if(!isEmail(form.email)) {
            newError.email = 'Email tidak valid';
        }

        return newError;
    }

    const handleSubmit = async e => {
        e.preventDefault();

        const findErrors = validate();
        if(Object.values(findErrors).some(err => err !== '')){
            setError(findErrors);
        }else{
            try{
                const actionCodeSettings = {
                    url: `${window.location.origin}/login`
                };
                setSubmitting(true);
                await
                auth.sendPasswordResetEmail(form.email, actionCodeSettings);
                enqueueSnackbar(`Cek kotak masuk atau spam email : ${form.email}, sebuah link untuk me-reset password sudah dikirimkan`, {
                    variant: 'success'
                })
                setSubmitting(false);
            }catch(e){
                const newError = {};

                switch(e.code) {
                    case 'auth/user-not-found':
                     newError.email = 'Email tidak terdaftar'
                    break;
                    case 'auth/invalid-email':
                      newError.email = 'Email tidak valid'
                    break;
                    default:
                      newError.email = "Terjadi kesalahan, silahkan coba lagi"
                    break;

                }

                setError(newError);
                setSubmitting(false);
            }

        }
    }

    if(loading) {
        return <AppLoading />
    }

    if(user) {
        return <Redirect to="/" />
    }

    return (
    <Container maxWidth="xs">
        <Paper className={classes.paper}>
            <Typography variant="h5" component="h1" className={classes.title}>Lupa Password</Typography>
            <form noValidate onSubmit={handleSubmit}>
                <TextField helperText={error.email}  onChange={handleFunc} fullWidth type="email" id="email" name="email" label="Alamat Email" margin="normal" value={form.email} error={error.email?true:false} disabled={isSubmitting} required />
            <Grid container className={classes.buttons}>
                <Grid item xs>
                    <Button type="submit" size="large" color="primary" variant="contained" disabled={isSubmitting}>Kirim</Button>
                </Grid>
                <Grid item>
                    <Button component={Link} to="/login" size="large" variant="contained" disabled={isSubmitting}>Login</Button>
                </Grid>
            </Grid>
            </form>
        </Paper>
    </Container>
    )
}

export default Forgot;