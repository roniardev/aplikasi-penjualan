import React, { useState } from "react";
import PropTypes from "prop-types";
//material ui
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
//firebase
import { useFirebase } from "../../../components/FirebaseProvider";
//react-router-dom
import { withRouter } from "react-router-dom";

function AddDialog({ history, open, handleClose }) {
  //FirebaseProvider
  const { firestore, user } = useFirebase();
  const produkCol = firestore.collection(`toko/${user.uid}/produk`);

  const [isSubmitting, setSubmitting] = useState(false);
  const [nama, setNama] = useState("");
  const [error, setError] = useState("");
  const handleSimpan = async e => {
    setSubmitting(true);
    try {
      if (!nama) {
        throw new Error("Nama produk wajib diisi");
      }
      const produkBaru = await produkCol.add({ nama });
      history.push(`product/edit/${produkBaru.id}`);
    } catch (e) {
      setError(e.message);
    }
    setSubmitting(false);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableBackdropClick={isSubmitting}
      disableEscapeKeyDown={isSubmitting}
    >
      <DialogTitle>Buat Produk Baru</DialogTitle>
      <DialogContent dividers>
        <TextField
          id="nama"
          label="Nama Produk"
          value={nama}
          onChange={e => {
            setError("");
            setNama(e.target.value);
          }}
          helperText={error}
          error={error ? true : false}
          disabled={isSubmitting}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={isSubmitting} onClick={handleClose}>
          Batal
        </Button>
        <Button color="primary" onClick={handleSimpan} disabled={isSubmitting}>
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default withRouter(AddDialog);
