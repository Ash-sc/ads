import React from 'react';

export default class Ads extends React.Component {

  componentDidMount() {
    this.props.actions.getAdsList();
  }

  render() {
    return (
      <div
        className="ads-body"
      >hello
      </div>
    );
  }
}
