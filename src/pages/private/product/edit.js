import React, { useState, useEffect } from "react";
//material-ui
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { useFirebase } from "../../../components/FirebaseProvider";
import { useDocument } from "react-firebase-hooks/firestore";
import AppPageLoading from "../../../components/AppPageLoading";

function EditProduct({ match }) {
  //firebase
  const { firestore, user } = useFirebase();
  const produkDoc = firestore.doc(
    `toko/${user.uid}/produk/${match.params.productId}`
  );
  const [snapshot, loading] = useDocument(produkDoc);
  const [form, setForm] = useState({
    nama: "",
    sku: "",
    harga: 0,
    stok: 0,
    deskripsi: ""
  });
  const [error, setError] = useState({
    nama: "",
    sku: "",
    harga: "",
    stok: "",
    deskripsi: ""
  });
  useEffect(() => {
    if (snapshot) {
      setForm({ ...form, ...snapshot.data() });
    }
  }, [snapshot]);
  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError({
      ...error,
      [e.target.name]: ""
    });
  };
  const validate = () => {
    const newError = { ...error };
    if (!form.nama) {
      newError.nama = "Nama produk wajib diisi";
    }
    if (!form.harga) {
      newError.harga = "Harga produk wajib diisi";
    }
    if (!form.stok) {
      newError.stok = "Stok produk wajib diisi";
    }
    return newError;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const findErrors = validate();
    if (Object.values(findErrors).some(err => err !== "")) {
      setError(findErrors);
    }
  };
  if (loading) {
    return <AppPageLoading />;
  }
  return (
    <div>
      <Typography component="h1" variant="h5">
        Edit Produk:
      </Typography>
      <Grid container alignItems="center" justify="center">
        <Grid item xs={12} sm={6}>
          <form id="produk-form" onSubmit={handleSubmit} noValidate>
            <TextField
              id="nama"
              name="nama"
              label="Nama Produk"
              margin="normal"
              value={form.nama}
              onChange={handleChange}
              helperText={error.nama}
              error={error.nama ? true : false}
              fullWidth
              required
            />
            <TextField
              id="sku"
              name="sku"
              label="SKU Produk"
              margin="normal"
              value={form.sku}
              onChange={handleChange}
              helperText={error.sku}
              error={error.sku ? true : false}
              fullWidth
            />
            <TextField
              type="number"
              id="harga"
              name="harga"
              label="Harga Produk"
              margin="normal"
              value={form.harga}
              onChange={handleChange}
              helperText={error.harga}
              error={error.harga ? true : false}
              fullWidth
              required
            />
            <TextField
              type="number"
              id="stok"
              name="stok"
              label="Stok Produk"
              margin="normal"
              value={form.stok}
              onChange={handleChange}
              helperText={error.stok}
              error={error.stok ? true : false}
              fullWidth
              required
            />
            <TextField
              id="deskripsi"
              name="deskripsi"
              label="Deskripsi Produk"
              margin="normal"
              value={form.deskripsi}
              onChange={handleChange}
              helperText={error.deskripsi}
              error={error.deskripsi ? true : false}
              rowsMax={3}
              multiline
              fullWidth
            />
          </form>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Upload Gambar</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            form="produk-form"
          >
            Simpan
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default EditProduct;
