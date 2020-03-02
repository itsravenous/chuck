import React from 'react';
import nock from 'nock';
import userEvent from '@testing-library/user-event';
import { render, fireEvent } from '@testing-library/react';
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from '@reach/router';
import App from './App';

const createMockJoke = jokeText => ({
  type: 'success',
  value: {
    id: 144,
    joke: jokeText,
    categories: []
  }
});

describe('Random joke feature', () => {
  const queryMatcher = query =>
    query.exclude === '[explicit]' &&
    query.escape === 'javascript' &&
    typeof query.firstName === 'undefined' &&
    typeof query.lastName === 'undefined';

  it('displays an appropriate initial message', () => {
    const { getByText } = render(<App />);
    getByText(
      "If Chuck Norris was using this application, he'd have clicked the joke button by now"
    );
  });

  it('fetches a random joke when the button is clicked, excluding explicit jokes', async () => {
    const scope = nock('http://api.icndb.com')
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/jokes/random')
      .query(queryMatcher)
      .reply(200, createMockJoke('Mock joke content here 😂'));
    const { getByText, findByText } = render(<App />);

    const randomJokeButton = getByText(/random joke/i);
    fireEvent.click(randomJokeButton);

    await findByText('Mock joke content here 😂');
    expect(scope.isDone()).toBe(true);
  });

  it('displays an appropriate error message when the random joke service call fails', async () => {
    const scope = nock('http://api.icndb.com')
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/jokes/random')
      .query(queryMatcher)
      .reply(500);
    const { getByText, findByText } = render(<App />);

    const button = getByText(/random joke/i);
    fireEvent.click(button);

    await findByText(
      'Chuck Norris has declined your ridiculous request for a joke 🤠'
    );
    expect(scope.isDone()).toBe(true);
  });
});

const renderWithRouter = (
  ui,
  { route = '/', history = createHistory(createMemorySource(route)) } = {}
) => render(<LocationProvider history={history}>{ui}</LocationProvider>);

describe('Joke search feature', () => {
  it('requests a joke with a custom single-word name', async () => {
    const jokeText =
      "Why won't Chuck Norris go to dinner with Cher? Because she doesn't like to Cher her food! 🤣";
    const scope = nock('http://api.icndb.com')
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/jokes/random')
      .query(
        query =>
          query.exclude === '[explicit]' &&
          query.escape === 'javascript' &&
          query.firstName === 'Cher'
      )
      .reply(200, createMockJoke(jokeText));
    const { getByText, findByLabelText, findByText } = renderWithRouter(
      <App />,
      {
        route: '/search'
      }
    );

    const searchInput = await findByLabelText(/enter an inferior name/i);
    await userEvent.type(searchInput, 'Cher');

    const searchSubmitButton = getByText(/submit/i);
    fireEvent.click(searchSubmitButton);
    await findByText(jokeText);
  });

  it('requests a joke with a custom first and last name', async () => {
    const jokeText =
      'What did Arnie say when asked about Windows 10? I still love Vista baby.';
    const scope = nock('http://api.icndb.com')
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/jokes/random')
      .query(
        query =>
          query.exclude === '[explicit]' &&
          query.escape === 'javascript' &&
          query.firstName === 'Arnold' &&
          query.lastName === 'Schwarznegger'
      )
      .reply(200, createMockJoke(jokeText));
    const { getByText, findByLabelText, findByText } = renderWithRouter(
      <App />,
      {
        route: '/search'
      }
    );

    const searchInput = await findByLabelText(/enter an inferior name/i);
    await userEvent.type(searchInput, 'Arnold Schwarznegger');

    const searchSubmitButton = getByText(/submit/i);
    fireEvent.click(searchSubmitButton);
    await findByText(jokeText);
  });

  it('prevents submitting the form if no name is entered', async () => {
    const { getByText, findByLabelText } = renderWithRouter(<App />, {
      route: '/search'
    });

    const searchSubmitButton = getByText(/submit/i);
    expect(searchSubmitButton).toBeDisabled();
  });

  it('prevents submitting the form if more than two words are entered', async () => {
    const { getByText, findByLabelText } = renderWithRouter(<App />, {
      route: '/search'
    });

    const searchInput = await findByLabelText(/enter an inferior name/i);
    await userEvent.type(searchInput, 'Mary Elizabeth Mastrantonio');

    const searchSubmitButton = getByText(/submit/i);
    expect(searchSubmitButton).toBeDisabled();
  });
});
