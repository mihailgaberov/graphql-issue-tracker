import React from 'react';
import Issues from './Issues';

const Repository = ({ repository, onFetchMoreIssues, onStarRepository }) => (
  <div>
    <p>
      <strong>In Repository: </strong>
      <a href={repository.url}>{repository.name}</a>
    </p>

    <Issues issues={repository.issues} />

    <hr />

    <button type="button" onClick={() => onStarRepository(repository.id, repository.viewerHasStarred)}>
      {repository.stargazers.totalCount}
      {repository.viewerHasStarred ? 'Unstar' : 'Star'}
    </button>

    {repository.issues.pageInfo.hasNextPage && <button onClick={onFetchMoreIssues}>More</button>}
  </div>
);

export default Repository;