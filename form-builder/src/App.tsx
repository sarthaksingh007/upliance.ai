import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Router } from './routes/Router';
import { NavLink } from 'react-router-dom';

export default function App() {
  return (
    <>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: '1px solid #e5e7eb' }}
      >
        <Toolbar sx={{ display: 'flex', gap: 2 }}>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 800, color: 'primary.main' }}
          >
            Upliance.ai Form Builder
          </Typography>

          <NavLink to="/create" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                variant={isActive ? 'contained' : 'outlined'}
                color="primary"
              >
                Create
              </Button>
            )}
          </NavLink>

          <NavLink to="/preview" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                variant={isActive ? 'contained' : 'outlined'}
                color="primary"
              >
                Preview
              </Button>
            )}
          </NavLink>

          <NavLink to="/myforms" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                variant={isActive ? 'contained' : 'outlined'}
                color="primary"
              >
                My Forms
              </Button>
            )}
          </NavLink>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Router />
      </Container>
    </>
  );
}
