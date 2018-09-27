import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import SearchBox from "./components/SearchBox";
import ResultsList from "./components/ResultsList";

class App extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      posts: [],
      // initial keywords
      keywords: ["westbrook", "thunder", "okc"]
    };

    this.submit = this.submit.bind(this);
    this.updateKeywords = this.updateKeywords.bind(this);
  }

  componentDidMount() {
    // Prelim submit with initial keywords
    this.submit();
  }

  updateKeywords(keywords) {
    this.setState({ keywords });
  }

  submit() {
    const query = this.state.keywords.map(kw => `kw=${kw}`).join("&");
    this.setState({ loading: true });
    axios.get(`/api/keywords/?${query}`).then(res => {
      const posts = res.data;
      this.setState({ loading: false });
      this.setState({ posts });
    });
  }

  render() {
    return (
      <div>
        <h1 className="title-header">
          <span>OKC Thunder feed</span>
        </h1>
        <div className="search-container">
          <SearchBox
            keywords={this.state.keywords}
            updateKeywords={this.updateKeywords}
          />
          <input
            type="button"
            name="btn"
            className="submit-btn"
            value="Submit"
            onClick={this.submit}
          />
        </div>
        <div>
          <ResultsList posts={this.state.posts} loading={this.state.loading} />
        </div>
      </div>
    );
  }
}

export default App;
