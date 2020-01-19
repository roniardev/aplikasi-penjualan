import React, { useRef, useState } from 'react';

import TextField from '@material-ui/core/TextField';
import {useFirebase} from '../../../components/FirebaseProvider';
import { useSnackbar } from 'notistack';

function UserSettings() {
    const {user} = useFirebase();
    const displayNameRef = useRef();
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState({
        displayName:''
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
    return <>
        <TextField id="displayName" name="displayName" label="Nama" inputProps={{
            ref: displayNameRef,
            onBlur: saveDisplayName
        }} disabled={isSubmitting} defaultValue={user.displayName} helperText={error.displayName} error={error.displayName? true:false} />
    </>
};

export default UserSettings;