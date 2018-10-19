import React from 'react';
import Repository from './Repository';

const User = ({ user, errors, onFetchMoreIssues, onStarRepository }) => {
  if (errors) {
    return (
      <p>
        <strong>Something went wrong:</strong>
        {errors.map(error => error.message).join(' ')}
      </p>
    );
  }

  return (
    <div>
    <p>
      <strong>Issues from User: </strong>
      <a href={user.url}>{user.name}</a>
    </p>
    <Repository 
      repository={user.repository} 
      onFetchMoreIssues={onFetchMoreIssues}
      onStarRepository={onStarRepository}
    />
  </div>
  )
};

export default User;