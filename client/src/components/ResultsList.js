import React, { Component } from "react";

export default class ResultsList extends Component {
  renderResults() {
    return this.props.posts.map(post => [
      <ul key={post.id}>
        <li>{post.title}</li>
        <ul>
          <li>score: {post.score}</li>
          <li>comments: {post.comments}</li>
          <li>
            url:{" "}
            <a target="_blank" href={post.url}>
              {post.url}
            </a>
          </li>
          <li>
            permalink:{" "}
            <a target="_blank" href={post.permalink}>
              {post.permalink}
            </a>
          </li>
          <li>time: {post.time}</li>
        </ul>
      </ul>
    ]);
  }

  render() {
    if (this.props.loading) {
      return <div className="loader" />;
    }
    return (
      <div className="results-container">
        <p className="result-count">
          {this.props.posts.length}{" "}
          {this.props.posts.length > 1 ? "results" : "result"}:
        </p>
        {this.renderResults()}
      </div>
    );
  }
}
