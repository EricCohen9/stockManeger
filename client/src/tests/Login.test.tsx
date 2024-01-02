import { render, screen } from '@testing-library/react';
import { expect } from "vitest";
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Login from '../pages/auth/Login';

const mockStore = configureStore();

test('contains the word "Login"', async () => {
  const store = mockStore({});

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );

  const loginHeading = screen.getByText(/Login/i);
  const componentText = loginHeading ? loginHeading.textContent?.toLowerCase() : '';
  expect(componentText).toContain('login');
});

