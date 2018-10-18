import React from 'react';
import ReactionsList from './ReactionsList';

const Issues = ({ issues }) => (
  <div>
    <ul>
      Issues: {issues.edges.map(issue => (
        <li key={issue.node.id}>
          <a href={issue.node.url}>{issue.node.title}</a>
          <ReactionsList reactions={issue.node.reactions} />
        </li>
      ))}
    </ul>
  </div>
);

export default Issues;