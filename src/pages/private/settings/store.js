import React, { useState, useEffect } from "react";
//Material UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
//Style
import useStyles from "./styles/store";
//validator
import isURL from "validator/lib/isURL";
//Firebase hooks
import { useFirebase } from "../../../components/FirebaseProvider";
import { useDocument } from "react-firebase-hooks/firestore";
//snackbar
import { useSnackbar } from "notistack";
//AppPageLoading
import AppPageLoading from "../../../components/AppPageLoading";
//React router
import { Prompt } from "react-router-dom";

function StoreSettings() {
  //snackbar
  const { enqueueSnackbar } = useSnackbar();
  //FirebaseProvider
  const { firestore, user } = useFirebase();
  const tokoDoc = firestore.doc(`toko/${user.uid}`);
  const [snapshot, loading] = useDocument(tokoDoc);
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
  //State kondisi change
  const [isSomethingChange, setSomethingChange] = useState(false);
  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError({
      [e.target.name]: ""
    });
    setSomethingChange(true);
  };
  //useEffect untuk mengambil data toko
  useEffect(() => {
    if (snapshot) {
      setForm(snapshot.data());
    }
  }, [snapshot]);
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
        setSomethingChange(false);
        enqueueSnackbar("Data toko berhasil disimpan", { variant: "success" });
      } catch (e) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
      setSubmitting(false);
    }
  };
  if (loading) {
    return <AppPageLoading />;
  }
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
          disabled={isSubmitting || !isSomethingChange}
          type="submit"
        >
          Simpan
        </Button>
      </form>
      <Prompt
        when={isSomethingChange}
        message="Perubahan data belum disimpan, apakah anda yakin untuk keluar halaman"
      />
    </div>
  );
}

export default StoreSettings;
