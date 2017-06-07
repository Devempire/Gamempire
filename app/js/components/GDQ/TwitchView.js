import {ScreenRatioConverter} from '../../Helpers/Converters.js';

export default class TwitchView extends React.Component {
  render () {
    let width = Math.max(this.props.width, 400);
    let height = this.props.RatioConverter.getHeightFromWidth(width);

    return (
      <iframe
        src={this.props.src}
        height={height}
        width={width} />
    );
  }
}

TwitchView.defaultProps = {
  RatioConverter: new ScreenRatioConverter(16, 9)
};
