import React from 'react';

const Issues = ({ issues }) => (
  <div>
    <ul>
      Issues: {issues.edges.map(issue => (
        <li key={issue.node.id}>
          <a href={issue.node.url}>{issue.node.title}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default Issues;