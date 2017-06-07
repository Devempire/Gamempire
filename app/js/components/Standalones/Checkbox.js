// Standalone checkbox component

export default class Checkbox extends React.Component {
  constructor (props) {
    super(props);

    this.state = { checked: props.checked };
  }
  onCheck (sender) {
    this.props.onChange(sender.target.value, this.props.id);
  }

  render () {
    return <input type='checkbox'
                  checked={this.props.checked}
                  onChange={this.onCheck.bind(this)}
           />;
  }
}