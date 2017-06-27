import TwitchView from '../Standalones/TwitchView.js';
import ContainerDimensions from 'react-container-dimensions';

const gdqTwitch = 'gamesdonequick';

export default class GDQTwitch extends React.Component {
  constructor (props) {
    super(props);

    this.state = { sidebarOpen: false };

    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  toggleSidebar () {
    this.setState({sidebarOpen: !this.state.sidebarOpen});
  }

  render () {
    var sidebarClass = this.state.sidebarOpen ? 'sidebar open' : 'sidebar';
    var contentClass = this.state.sidebarOpen ? 'content open' : 'content';

    return (
      <div>
        // Next 3 lines are a dirty workaround until rgl is fixed
        <ContainerDimensions>
          <TwitchView channel={gdqTwitch} />
        </ContainerDimensions>
        <div className={sidebarClass}>
          <h2>GDQ title here</h2>
          <div className='toggleNav' onClick={this.toggleSidebar} />
        </div>
        <div className={contentClass}>
          <ContainerDimensions>
            <TwitchView channel={gdqTwitch} />
          </ContainerDimensions>
        </div>
      </div>
    );
  }
}
