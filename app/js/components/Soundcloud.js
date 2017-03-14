var SoundPlayerComponents = require('react-soundplayer/components');
var SoundPlayerAddons = require('react-soundplayer/addons');
var PlayButton = SoundPlayerComponents.PlayButton;
var Progress = SoundPlayerComponents.Progress;
var SoundCloudLogoSVG = SoundPlayerComponents.Icons.SoundCloudLogoSVG
var SoundPlayerContainer = SoundPlayerAddons.SoundPlayerContainer;


const clientId = 'wvXhTijw6meEM5dDnqGmCxti46bkCIWR';
const track = 'https://soundcloud.com/migosatl/bad-and-boujee-feat-lil-uzi-vert-prod-by-metro-boomin';

module.exports = global.TrackInfo = class TrackInfo extends React.Component {
    render() {
        let { track } = this.props;

        if (!track) {
            return <div>Loading...</div>;
        }

        return (
            <div>
              <h4>{track.title}</h4>
              <h5>{track.user.username}</h5>
              <img src={track.artwork_url} width='150' />
            </div>
        );
    }
}

module.exports = global.PlayPause = class PlayPause extends React.Component {

    togglePlay() {
        let { playing, soundCloudAudio } = this.props;

          if (playing) {
              soundCloudAudio.pause();
          } else {
              soundCloudAudio.play();
          }
    }

    render() {
        let { playing } = this.props;
        let text = playing ? 'Pause' : 'Play';
        if (!track) {
            return <div>Loading...</div>;
        }

        return (
            <button onClick={this.togglePlay.bind(this)}>
                <b>{text}</b>
            </button>
        );
    }
}

module.exports = global.Soundcloud = class Soundcloud extends React.Component {


    render() {
        return (
            <SoundPlayerContainer resolveUrl={track} clientId={clientId}>
                <TrackInfo />
                <PlayPause />
            </SoundPlayerContainer>
        );
    }
}
