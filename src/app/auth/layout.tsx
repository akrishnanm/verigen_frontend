import { Container, Box, Paper } from '@mui/material';

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8 }}>
        <Container maxWidth="sm">
          <Box sx={{ mt: 8, mb: 4, position: 'relative' }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {children}
            </Paper>
          </Box>
        </Container>
      </Box>
    </Container>
  );
}
