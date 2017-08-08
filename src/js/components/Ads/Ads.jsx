import React from 'react';

export default class Ads extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scriptInfo: '',
    };
  }

  componentDidMount() {
    this.props.actions.getAdsList();
  }

  toggleChange(value) {
    console.log(value, 222);
    this.setState({ scriptInfo: value });
  }

  addNewAds() {
    if (!this.state.scriptInfo) return;
    this.props.actions.newAds({ content: this.state.scriptInfo });
  }

  render() {
    return (
      <div
        className="ads-body"
      >
        <div className="ads-script-section">
          <h2>版本信息</h2>
          <ul className="ads-script-list">
            {this.props.reducer.adsList.map((item, i) =>
              <li key={i} className="script-item">{item}</li>
            )}
            {this.props.reducer.adsList.length === 0 &&
              <li className="script-item empty">没有查询到相关的版本数据</li>
            }
          </ul>
        </div>
        <div className="new-ads-section">
          <h2>新增版本</h2>
          <textarea
            className="text-area"
            value={this.state.scriptInfo}
            onChange={e => this.toggleChange(e.target.value)}
          > </textarea>
          <button className="btn" onClick={() => this.addNewAds()}>添加</button>
        </div>
      </div>
    );
  }
}
