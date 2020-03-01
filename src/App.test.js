import React from 'react';
import nock from 'nock';
import { render, fireEvent } from '@testing-library/react';
import App from './App';

const mockJoke = {
  type: 'success',
  value: {
    id: 144,
    joke: 'Mock joke content here 😂',
    categories: []
  }
};

it('displays an appropriate initial message', () => {
  const { getByText } = render(<App />);
  getByText(
    "If Chuck Norris was using this application, he'd have clicked the joke button by now"
  );
});

it('fetches a random joke when the button is clicked, excluding explicit jokes', async () => {
  const scope = nock('http://api.icndb.com')
    .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
    .get('/jokes/random?exclude=[explicit]')
    .reply(200, mockJoke);
  const { getByText, findByText } = render(<App />);

  const button = getByText(/random joke/i);
  fireEvent.click(button);

  await findByText('Mock joke content here 😂');
  expect(scope.isDone()).toBe(true);
});

it('displays an appropriate error message when the random joke service call fails', async () => {
  const scope = nock('http://api.icndb.com')
    .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
    .get('/jokes/random?exclude=[explicit]')
    .reply(500);
  const { getByText, findByText } = render(<App />);

  const button = getByText(/random joke/i);
  fireEvent.click(button);

  await findByText(
    'Chuck Norris has declined your ridiculous request for a joke 🤠'
  );
  expect(scope.isDone()).toBe(true);
});
