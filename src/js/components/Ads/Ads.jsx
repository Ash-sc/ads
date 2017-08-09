import React from 'react';

export default class Ads extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      contentNumber: 0,
      newAds: false,
      contentArr: [],
    };
  }

  componentDidMount() {
    this.props.actions.getAdsList();
  }

  // 修改输入框数据
  toggleChange(content) {
    const contentArr = content.split('\n').filter(item => item.length > 0);
    console.log(contentArr);
    this.setState({ content, contentNumber: contentArr.length, contentArr });
  }

  // 提交
  confirm() {
    console.log(this.state.contentArr);
    this.props.actions.newAds({ content: this.state.contentArr }).then(() => {
      this.setState({
        content: '',
        contentNumber: 0,
        newAds: false,
        contentArr: [],
      });
      this.props.actions.getAdsList();
    });
  }

  // 复制script标签
  copyScript(content) {
    console.log(content, 22222);
  }

  render() {
    return (
      <div className="ads-body">
        <header className="ads-header">
        </header>
        <div className={`new-ads-section ${!this.state.newAds && 'hide-new-section'}`}>
          <textarea className="new-ads-content" value={this.state.content} onChange={e => this.toggleChange(e.target.value)}>
          </textarea>
          <span className="content-tips">已输入{this.state.contentNumber}条数据</span>
          <span className="confirm-btn" onClick={() => this.confirm()}>确定</span>
          <span className="cancel-btn" onClick={() => this.setState({ newAds: false })}>取消</span>
        </div>
        <div className="ads-script-section">
          <h2>版本列表</h2>
          <button className="new-ads" onClick={() => this.setState({ newAds: true })}>新增script版本</button>
          <div className="ads-script-list">
            <div className="ads-script-item-body">
              <ul className="list-group">
                {this.props.reducer.adsList.sort((a, b) =>
                  a.match(/(v1.)[0-9]+(.0.js)/g)[0].split('.')[1] - b.match(/(v1.)[0-9]+(.0.js)/g)[0].split('.')[1] < 0
                ).map((item, i) =>
                  <li key={i} className="list-group-item">
                    <div className="clipboard">
                      <span className="btn copy-script" onClick={() => this.copyScript(item)}>复制 &lt;script&gt; 标签</span>
                      <span className="btn copy-link">复制链接</span>
                    </div>
                    {item}
                  </li>
                )}
                {this.props.reducer.adsList.length === 0 &&
                  <li className="list-group-item empty-list">
                    暂无版本信息
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
