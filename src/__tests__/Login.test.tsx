import { render, screen } from '@testing-library/react';
import { Login } from '../components/Login';

describe('Login', () => {
  it('renders a heading', () => {
    const handleLogin = jest.fn();
    render(<Login onLogin={handleLogin} />);

    const heading = screen.getByRole('heading', {
      name: /pharmacy management system/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
