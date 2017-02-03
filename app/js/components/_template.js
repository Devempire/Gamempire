module.exports = React.createClass({
  render () {
    // Set Titles
    var title = "Template - Gamempire"
    document.title = title
    document.getElementById('title').textContent = title

    //Removes all Active class from Menu
    $("#mySidenav>a.active").removeClass("active");

    //Set Dashbaord as active in menu
    $( "#_MenuIDfromSideBar.js" ).addClass('active');

    return (
      <div>
        <h1>Welcome Gamempire Developers!</h1>
      </div>
    )
  }
})
