import React, { Component } from 'react';
import axios from 'axios';
import User from './User';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
      }`,
  },
});

const TITLE = 'React GraphQL GitHub Client';

const GET_ISSUES_OF_REPOSITORY = `
  query ($user: String!, $repository: String!) {
    user(login: $user) {
      name
      url
      repository(name: $repository) {
        name
        url
        issues(last: 5) {
          edges {
            node {
              id
              title
              url
            }
          }
        }
      }
    }
  }
  `;

const getIssuesOfRepository = path => {
  const [user, repository] = path.split('/');

  return axiosGitHubGraphQL.post('', {
    query: GET_ISSUES_OF_REPOSITORY,
    variables: { user, repository },
  });
};

const resolveIssuesQuery = queryResult => () => ({
  user: queryResult.data.data.user,
  errors: queryResult.data.errors,
});

class App extends Component {
  state = {
    path: 'mihailgaberov/es6-bingo-game',
    user: null,
    errors: null,
  };

  onFetchFromGitHub = path => {
    getIssuesOfRepository(path).then(queryResult => this.setState(resolveIssuesQuery(queryResult)))
  };


  componentDidMount() {
    this.onFetchFromGitHub(this.state.path);
  }

  onChange = event => {
    this.setState({ path: event.target.value });
  };

  onSubmit = event => {
    this.onFetchFromGitHub(this.state.path);
    event.preventDefault();
  };

  render() {
    const { path, user, errors } = this.state;

    return (
      <div>
        <h1>{TITLE}</h1>

        <form onSubmit={this.onSubmit}>
          <label htmlFor="url">
            Show open issues for https://github.com/
  </label>
          <input
            id="url"
            type="text"
            onChange={this.onChange}
            style={{ width: '300px' }}
            value={path}
          />
          <button type="submit">Search</button>
        </form>
        <hr />
        {user ? (<User user={user} errors={errors} />) : <p>No information yet.</p>}
      </div>
    );
  }
}

export default App;