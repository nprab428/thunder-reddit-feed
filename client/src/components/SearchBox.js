import { List } from "immutable";
import React, { Component } from "react";
import { TagBox } from "react-tag-box";
import "../styles.css";

export default class SearchBox extends Component {
  state = {
    tags: List(
      this.props.keywords.map(t => ({
        label: t,
        value: t
      }))
    ),
    selected: List(
      this.props.keywords.map(t => ({
        label: t,
        value: t
      }))
    )
  };

  render() {
    const { tags, selected } = this.state;
    const onSelect = tag => {
      const newTag = {
        label: tag.label,
        value: tag.value || tag.label
      };

      this.setState(
        {
          selected: selected.push(newTag)
        },
        this.updateKeywords
      );
    };

    const remove = tag => {
      this.setState(
        {
          selected: selected.filter(t => t.value !== tag.value)
        },
        this.updateKeywords
      );
    };

    const placeholder = "Enter a keyword to filter on...";

    return (
      <div className="search-box">
        <TagBox
          tags={tags.toJS()}
          selected={selected.toJS()}
          onSelect={onSelect}
          removeTag={remove}
          placeholder={placeholder}
          renderNewOption={text => text}
        />
      </div>
    );
  }

  updateKeywords() {
    this.props.updateKeywords(this.state.selected.map(kw => kw.value));
  }
}
