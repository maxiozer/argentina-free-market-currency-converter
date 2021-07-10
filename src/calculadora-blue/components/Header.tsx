import { AppBar, LinearProgress, Toolbar, Typography } from "@material-ui/core";

export default function Header(props: HeaderProps) {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">Calculadora Blue</Typography>
      </Toolbar>
      {props.isLoading && <LinearProgress />}
    </AppBar>
  );
}

interface HeaderProps {
  isLoading: Boolean;
}
