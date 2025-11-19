import { render, screen } from '@testing-library/react';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

test('renders welcome message', () => {
  render(
    <GoogleOAuthProvider clientId="test_client_id">
      <App />
    </GoogleOAuthProvider>
  );
  const linkElement = screen.getByText(/Selamat Datang di e-planner/i);
  expect(linkElement).toBeInTheDocument();
});
