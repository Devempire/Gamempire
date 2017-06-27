import {ScreenRatioConverter} from '../../Helpers/Converters.js';

const twitchPlayer = 'https://player.twitch.tv/?';

/**
 * Just a generic embedded twitch player. Pass through channel name in props
 * and wrap in ContentDimensions so it can auto resize
 * See GDQ.js for example implemntation
 */
export default class TwitchView extends React.Component {
  getURI () {
    if (this.props.channel != null) {
      return twitchPlayer + 'channel=' + this.props.channel;
    }
  }
  render () {
    let width = Math.max(this.props.width, 400);
    let height = this.props.RatioConverter.getHeightFromWidth(width);

    return (
      <iframe
        src={this.getURI()}
        height={height}
        width={width} />
    );
  }
}

TwitchView.defaultProps = {
  RatioConverter: new ScreenRatioConverter(16, 9)
};
