
var SoundPlayerComponents = require('react-soundplayer/components');
var SoundPlayerAddons = require('react-soundplayer/addons');

var PlayButton = SoundPlayerComponents.PlayButton;
var Progress = SoundPlayerComponents.Progress;

// icons are components too!
var SoundCloudLogoSVG = SoundPlayerComponents.Icons.SoundCloudLogoSVG

var SoundPlayerContainer = SoundPlayerAddons.SoundPlayerContainer;




//Hearthstone Deck Builder
module.exports = class Soundcloud extends React.Component {
    constructor(){
        super();
        this.trackReady = this.trackReady.bind(this);
    }

    trackReady(){
        console.log('Track can be played!')
        // Enable the play button, or start playing programmatically, etc
    }

    render() {
      const clientId = 'wvXhTijw6meEM5dDnqGmCxti46bkCIWR';
      const resolveUrl = 'https://soundcloud.com/thrilljockey/future-islands-balance';
      return(
        <div>
            <SoundPlayerContainer
                clientId={clientId}
                resolveUrl={resolveUrl}
                onReady={this.trackReady()}
            >
                {/* your custom player components */}
            </SoundPlayerContainer>
        </div>
      );
    }
}
