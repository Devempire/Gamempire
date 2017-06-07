import GDQSchedule from './GDQSchedule.js';
import Tabs, {TabPane} from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import InkTabBar from 'rc-tabs/lib/InkTabBar';
import TwitchView from './TwitchView';
import ContainerDimensions from 'react-container-dimensions';
import GDQManager from './GDQManager';

var WidthProvider = require('react-grid-layout').WidthProvider;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);
var ReactTable = require('react-table').default;

const gdqTwitch = 'https://player.twitch.tv/?channel=gamesdonequick';

var unirest = require('unirest');

// Hearthstone Deck Builder
export class GDQ extends React.Component {
  constructor (props) {
    super(props);

    this.state = {};

    this.manager = GDQManager.Instance();
  }

  resetLayout () {
    this.setState({layouts: {}});
  }

  onBreakpointChange (breakpoint) {
    this.setState({
      currentBreakpoint: breakpoint
    });
  }

  onLayoutChange (layout, layouts) {
    // saveToLS('layouts', layouts);
    this.setState({layouts});
  }

  render () {
    return (
      <div>
        <Tabs
          defaultActiveKey='2'
          renderTabBar={() => <InkTabBar />}
          renderTabContent={() => <TabContent />}
        >
          <TabPane tab='Twitch' key='1'>
            <ContainerDimensions>
              <TwitchView src={gdqTwitch} />
            </ContainerDimensions>
          </TabPane>
          <TabPane tab='Schedule' key='2'>
            <GDQSchedule manager={this.manager} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
