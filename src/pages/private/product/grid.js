import React, { useState } from "react";
//material-ui
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
//useStyles
import useStyles from "./styles/grid";
//page component
import AddDialog from "./add";

function GridProduct() {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const classes = useStyles();
  return (
    <>
      <h1>Halaman Grid Product</h1>;
      <Fab
        className={classes.fab}
        color="primary"
        onClick={e => {
          setOpenAddDialog(true);
        }}
      >
        <AddIcon />
      </Fab>
      <AddDialog
        open={openAddDialog}
        handleClose={() => {
          setOpenAddDialog(false);
        }}
      />
    </>
  );
}

export default GridProduct;
