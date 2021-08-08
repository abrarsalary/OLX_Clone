import { makeStyles } from "@material-ui/core/styles";
export const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      //   backgroundColor: "red",
      marginBottom: "23px"
    }
  },
  parentContainer: {
    //   backgroundColor:"Green",
  },
  lis: {
    display: "inline"
  }
  ,
  // PhotosHeading: {
  //   marginTop: "10px",
  //   marginBottom: "15px"
  // },
  input: {
    display: "none"
    
  },
  img: {
    height: "100px",
    width: "100px",
    //  border: "1px solid black"
    outlineColor: "coral"
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));
