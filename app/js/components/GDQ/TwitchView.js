export default class TwitchView extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      width: '400',
      height: '300'
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  updateWindowDimensions () {
    console.log('changin dims');
    console.log(window.innerWidth);
    this.setState({
      width: Math.max(window.innerWidth, 400),
      height: Math.max(window.innerHeight, 300)
    });
  }

  componentDidMount () {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  render () {
    let width = Math.max(this.props.width, 400);
    let height = Math.ceil((width * 9) / 16);
    return (
      <iframe
        src={this.props.src}
        height={height}
        width={width} />
    );
  }
}