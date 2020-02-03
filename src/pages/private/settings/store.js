import React, { useState } from "react";
//Material UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
//Style
import useStyles from "./styles/store";
//validator
import isURL from "validator/lib/isURL";
//Firebase hooks
import { useFirebase } from "../../../components/FirebaseProvider";
//snackbar
import { useSnackbar } from "notistack";

function StoreSettings() {
  //snackbar
  const { enqueueSnackbar } = useSnackbar();
  //FirebaseProvider
  const { firestore, user } = useFirebase();
  const tokoDoc = firestore.doc(`toko/${user.uid}`);
  //styles
  const classes = useStyles();
  //Set error
  const [error, setError] = useState({
    nama: "",
    alamat: "",
    telepon: "",
    website: ""
  });
  //Set Form
  const [form, setForm] = useState({
    nama: "",
    alamat: "",
    telepon: "",
    website: ""
  });
  //State kondisi submitting
  const [isSubmitting, setSubmitting] = useState(false);
  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  //Validasi
  const validate = () => {
    const newError = { ...error };

    if (!form.nama) {
      newError.nama = "Nama wajib diisi";
    }
    if (!form.alamat) {
      newError.alamat = "Alamat wajib diisi";
    }
    if (!form.telepon) {
      newError.telepon = "No telepon toko wajib diisi";
    }
    if (!form.website) {
      newError.website = "Website wajib diisi";
    } else if (!isURL(form.website)) {
      newError.website = "Website tidak valid";
    }
    return newError;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const findErrors = validate();
    if (Object.values(findErrors).some(err => err !== "")) {
      setError(findErrors);
    } else {
      setSubmitting(true);
      try {
        await tokoDoc.set(form, { merge: true });
        enqueueSnackbar("Data toko berhasil disimpan", { variant: "success" });
      } catch (e) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
      setSubmitting(false);
    }
  };
  return (
    <div className={classes.storeSettings}>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          id="nama"
          name="nama"
          label="Nama Toko"
          margin="normal"
          value={form.nama}
          onChange={handleChange}
          error={error.nama ? true : false}
          helperText={error.nama}
          disabled={isSubmitting}
          fullWidth
          required
        />
        <TextField
          id="alamat"
          name="alamat"
          label="Alamat Toko"
          margin="normal"
          value={form.alamat}
          onChange={handleChange}
          error={error.alamat ? true : false}
          helperText={error.alamat}
          disabled={isSubmitting}
          multiline
          rowsMax={3}
          fullWidth
          required
        />
        <TextField
          id="telepon"
          name="telepon"
          label="Nomor Telepon Toko"
          margin="normal"
          value={form.telepon}
          onChange={handleChange}
          error={error.telepon ? true : false}
          helperText={error.telepon}
          disabled={isSubmitting}
          fullWidth
          required
        />
        <TextField
          id="website"
          name="website"
          label="Website Toko"
          margin="normal"
          value={form.website}
          onChange={handleChange}
          error={error.website ? true : false}
          helperText={error.website}
          disabled={isSubmitting}
          fullWidth
          required
        />
        <Button
          className={classes.actionButton}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          type="submit"
        >
          Simpan
        </Button>
      </form>
    </div>
  );
}

export default StoreSettings;
