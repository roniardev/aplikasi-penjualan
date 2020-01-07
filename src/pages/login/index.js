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

function Login(props) {
    const {location} = props;
    const classes = useStyles();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const {auth, user, loading} = useFirebase();

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
        email: '',
        password: ''
    })

    const [isSubmitting, setSubmitting] = useState(false);

    const validate = () => {
        const newError = {...error}

        if(!form.email) {
            newError.email = 'Email wajib diisi';
        }else if(!isEmail(form.email)) {
            newError.email = 'Email tidak valid';
        }

        if(!form.password) {
            newError.password = 'Password wajib diisi';
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
                setSubmitting(true);
                await
                auth.signInWithEmailAndPassword(form.email, form.password)
            }catch(e){
                const newError = {};

                switch(e.code) {
                    case 'auth/user-not-found':
                     newError.email = 'User belum terdaftar'
                    break;
                    case 'auth/invalid-email':
                      newError.email = 'Email tidak valid'
                    break;
                    case 'auth/wrong-password':
                      newError.password = 'Password salah'
                    break;
                    case 'auth/user-disabled':
                      newError.email = 'Pengguna diblokir'
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
        const redirectTo = location.state && location.state.from && location.state.from.pathname? location.state.from.pathname : '/';
        return <Redirect to={redirectTo} />
    }

    return (
    <Container maxWidth="xs">
        <Paper className={classes.paper}>
            <Typography variant="h5" component="h1" className={classes.title}>Login</Typography>
            <form noValidate onSubmit={handleSubmit}>
                <TextField helperText={error.email}  onChange={handleFunc} fullWidth type="email" id="email" name="email" label="Alamat Email" margin="normal" value={form.email} error={error.email?true:false} disabled={isSubmitting} required />
                <TextField helperText={error.password}  type="password" id="password" name="password" label="Password" margin="normal" value={form.password} onChange={handleFunc} error={error.password?true:false} disabled={isSubmitting} required fullWidth />
            <Grid container className={classes.buttons}>
                <Grid item xs>
                    <Button type="submit" size="large" color="primary" variant="contained" disabled={isSubmitting}>Login</Button>
                </Grid>
                <Grid item>
                    <Button component={Link} to="/register" size="large" variant="contained" disabled={isSubmitting}>Daftar</Button>
                </Grid>
            </Grid>
            <div className={classes.forgot}>
                <Typography component={Link} to="/forgot">
                    Lupa password ?
                </Typography>
            </div>
            </form>
        </Paper>
    </Container>
    )
}

export default Login;