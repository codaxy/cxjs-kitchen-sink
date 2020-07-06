import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';

import { VDOM, Cx } from 'cx/ui';
import { Store } from 'cx/data';

import SignInForm from './index';
import Controller from './Controller';

const server = setupServer();

beforeAll(() => server.listen());
beforeEach(() => {
   jest.restoreAllMocks();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Sign In', () => {
   test('renders', async () => {
      let store = new Store({
         lang: 'en',
      });
      let { getByText, getByLabelText } = render(
         <Cx store={store} subscribe>
            <div controller={Controller}>
               <SignInForm />
            </div>
         </Cx>
      );
      expect(getByLabelText('Email')).toBeInTheDocument();
      expect(getByLabelText('Password')).toBeInTheDocument();
   });
});
