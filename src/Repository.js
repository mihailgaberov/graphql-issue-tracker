import React from 'react';
import Issues from './Issues';

const Repository = ({ repository, onFetchMoreIssues }) => (
  <div>
    <p>
      <strong>In Repository: </strong>
      <a href={repository.url}>{repository.name}</a>
    </p>

    <Issues issues={repository.issues} />

    <hr />

    {repository.issues.pageInfo.hasNextPage && <button onClick={onFetchMoreIssues}>More</button>}
  </div>
);

export default Repository;