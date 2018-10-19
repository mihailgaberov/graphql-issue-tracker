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
  query ($user: String!, $repository: String!, $cursor: String) {
    user(login: $user) {
      name
      url
      repository(name: $repository) {
        id
        name
        url
        viewerHasStarred
        stargazers {
          totalCount
        }
        issues(first: 1, after: $cursor, states: [OPEN]) {
          edges {
            node {
              id
              title
              url
              reactions(last: 3) {
                edges {
                  node {
                    id
                    content
                  }
                }
              }
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
  `;
  
  const ADD_STAR = `
    mutation ($repositoryId: ID!) {
      addStar(input:{starrableId:$repositoryId}) {
        starrable {
          viewerHasStarred
        }
      }
    }
  `;

  const REMOVE_STAR = `
  mutation ($repositoryId: ID!) {
    removeStar(input:{starrableId:$repositoryId}) {
      starrable {
        viewerHasStarred
      }
    }
  }
`;

const getIssuesOfRepository = (path, cursor) => {
  const [user, repository] = path.split('/');

  return axiosGitHubGraphQL.post('', {
    query: GET_ISSUES_OF_REPOSITORY,
    variables: { user, repository, cursor },
  });
};

const resolveIssuesQuery = (queryResult, cursor) => state => {
  const { data, errors } = queryResult.data;

  if (!cursor) {
    return {
      user: data.user,
      errors,
    };
  }

  const { edges: oldIssues } = state.user.repository.issues;
  const { edges: newIssues } = data.user.repository.issues;
  const updatedIssues = [...oldIssues, ...newIssues];

  return {
    user: {
      ...data.user,
      repository: {
        ...data.user.repository,
        issues: {
          ...data.user.repository.issues,
          edges: updatedIssues,
        },
      },
    },
    errors,
  };
};

const resolveAddStarMutation = mutationResult => state => {
  const { viewerHasStarred } = mutationResult.data.data.addStar.starrable;
  const { totalCount } = state.user.repository.stargazers;


  return {
    ...state,
    user: {
      ...state.user,
      repository: {
        ...state.user.repository,
        viewerHasStarred,
        stargazers: {
          totalCount: totalCount + 1,
        },
      },
    },
  };
};

const resolveRemoveStarMutation = mutationResult => state => {
  const { viewerHasStarred } = mutationResult.data.data.removeStar.starrable;
  const { totalCount } = state.user.repository.stargazers;


  return {
    ...state,
    user: {
      ...state.user,
      repository: {
        ...state.user.repository,
        viewerHasStarred,
        stargazers: {
          totalCount: totalCount - 1,
        },
      },
    },
  };
};

const addStarToRepository = repositoryId => {
    return axiosGitHubGraphQL.post('', {
      query: ADD_STAR,
      variables: { repositoryId },
    });
  };

  const removeStarToRepository = repositoryId => {
    return axiosGitHubGraphQL.post('', {
      query: REMOVE_STAR,
      variables: { repositoryId },
    });
  };
  

class App extends Component {
  state = {
    path: 'mihailgaberov/es6-bingo-game',
    user: null,
    errors: null,
  };

  onFetchFromGitHub = (path, cursor) => {
    getIssuesOfRepository(path, cursor).then(queryResult => this.setState(resolveIssuesQuery(queryResult, cursor)))
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

  onFetchMoreIssues = () => {
    const { endCursor } = this.state.user.repository.issues.pageInfo;

    this.onFetchFromGitHub(this.state.path, endCursor);
  };

  onStarRepository = (repoId, viewerHasStarred) => {
    if (viewerHasStarred) {
      removeStarToRepository(repoId).then(mutationResult =>
        this.setState(resolveRemoveStarMutation(mutationResult)),
      );
    } else {
      addStarToRepository(repoId).then(mutationResult =>
        this.setState(resolveAddStarMutation(mutationResult)),
      );
    }
    
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
        {user ? 
        (<User user={user}
          errors={errors}
          onFetchMoreIssues={this.onFetchMoreIssues}
          onStarRepository={this.onStarRepository}
        />) : (
            <p>No information yet.</p>
          )}
      </div>
    );
  }
}

export default App;