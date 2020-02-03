import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  storeSettings: {
    display: "flex",
    flexDirection: "column",
    width: 300
  },
  actionButton: {
    marginTop: theme.spacing(2)
  }
}));

export default useStyles;
