import React from 'react';
import Clipboard from 'clipboard';
import message from 'antd/lib/message';

message.config({
  top: 50,
  duration: 3,
});

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
    const cp = new Clipboard('.cp-btn', {
      text: trigger => trigger.getAttribute('data-cpcontent'),
    });
    cp.on('success', () => {
      message.success('已复制！');
    });
    cp.on('error', () => {
      message.error('复制失败，请手动复制！');
    });
  }

  // 修改输入框数据
  toggleChange(content) {
    const contentArr = content.split('\n').filter(item => item.length > 0);
    console.log(contentArr);
    this.setState({ content, contentNumber: contentArr.length, contentArr });
  }

  // 提交
  confirm() {
    if (!this.state.contentArr.length) {
      message.error('请至少输入一条字符串内容！');
      return false;
    }
    return this.props.actions.newAds({ content: this.state.contentArr }).then((res) => {
      if (res.status !== 'ok') {
        message.error('添加失败！');
      } else {
        this.setState({
          content: '',
          contentNumber: 0,
          newAds: false,
          contentArr: [],
        });
        message.success('添加成功！');
        this.props.actions.getAdsList();
      }
    });
  }

  render() {
    return (
      <div className="ads-body">
        <header className="ads-header">
        </header>
        <div className={`new-ads-section ${!this.state.newAds && 'hide-new-section'}`}>
          <textarea
            className="new-ads-content"
            value={this.state.content}
            onChange={e => this.toggleChange(e.target.value)}
            placeholder="请输入字符串内容，多条内容用空行(回车)隔开，单条内容中请不要输入空行"
          >
          </textarea>
          <span className="content-tips">已输入{this.state.contentNumber}条数据</span>
          <span className="confirm-btn" onClick={() => this.confirm()}>确定</span>
          <span className="cancel-btn" onClick={() => this.setState({ newAds: false })}>取消</span>
        </div>
        <div className="ads-script-section">
          <h2 className="list-title">版本列表</h2>
          <button className="new-ads" onClick={() => this.setState({ newAds: true })}>新增script版本</button>
          <div className="ads-script-list">
            <div className="ads-script-item-body">
              <ul className="list-group">
                {this.props.reducer.adsList.sort((a, b) =>
                  a.match(/(v1.)[0-9]+(.0.js)/g)[0].split('.')[1] - b.match(/(v1.)[0-9]+(.0.js)/g)[0].split('.')[1] < 0
                ).map((item, i) =>
                  <li key={i} className="list-group-item">
                    <div className="clipboard">
                      <a className="btn download-script" href={item} download="">下载文件</a>
                      <span
                        className="btn copy-script cp-btn"
                        data-cpcontent={`<script src="${item}"></script>`}
                      >复制 &lt;script&gt; 标签</span>
                      <span
                        className="btn copy-link cp-btn"
                        data-cpcontent={item}
                      >复制链接</span>
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
