import React from 'react';
import Ads from './Ads';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';

class AdsContainer extends React.Component {
  render() {
    return <Ads {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    reducer: state.ads,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdsContainer);
