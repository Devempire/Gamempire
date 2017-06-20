var vex = require('vex-js')
vex.defaultOptions.className = 'vex-theme-os'
module.exports = global.Friends = React.createClass({

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      friends: [],
      result:'',
    };
  },

  loadFriends() {

    var id =electron.remote.getGlobal('sharedObject').id;
    $.get(api_server+"/friend/"+id+ "/show").done((res)=>{

       for (var i = 0; i < res.length; i++) {

         this.setState({
           friends: this.state.friends.concat({
             id:res[i]._id,
             status:res[i].status,
             username:res[i].friend.username,
             avatar:res[i].friend.avatar,
             privacy:res[i].friend.privacy,
             online:res[i].friend.status.status,
           })
         });

       }

      this.renderFriends();

    }).fail((err)=>{
        console.log('Failed to load friends.');
        vex.dialog.alert({
            message: 'Failed to load friends.',
            callback: function (value){
                if (value) {
                  return;
                }
            }.bind(this)
        })
      });

  },

  viewprofile(event) {
    var id = event.target.parentNode.dataset.tag;
    electron.remote.getGlobal('sharedObject').viewProfileID = id;
    ReactDOM.render(
			<Profile />,
			document.getElementById('content')
		);

  },

  renderFriends(){

var allUsers = [];
for (var i = 0; i < this.state.friends.length; i++) {
  var id =this.state.friends[i].id;
  var username=this.state.friends[i].username;
  var online=this.state.friends[i].online;
  if (!this.state.friends[i].avatar || this.state.friends[i].privacy.avatar == true || this.state.friends[i].privacy.avatar == 'true'){
    var avatar =(<div className="small-3 large-2 columns noselect" key={Math.random().toString(36).substr(2, 5)}><img className="thumbnail noselect" width="200" src="./../app/img/user.jpg" /></div>);
   }else{
     var img = [api_server+'/img/avatars/'+id+'.jpg?'+new Date().getTime()];
     var avatar =(<div className="small-3 large-2 columns noselect" key={Math.random().toString(36).substr(2, 5)}><img className="thumbnail noselect" width="200" src={img[0]} /></div>);
   }
   if (online == 'online'){
     var status = (<span className="success round label noselect">Online</span>);
   }else if (online == 'offline'){
     var status = (<span className="alert round label noselect">Offline</span>);
   }
  if (this.state.friends[i].status == "pending") {

    allUsers.push(<div><div className="row expanded">{avatar}<div key={Math.random().toString(36).substr(2, 5)} className="small-6 columns noselect">
    <h2 className="noselect">{username}</h2>
    <a className="noselect" data-tag={id} onClick={this.viewprofile} ><b>View profile</b></a><br/>
    <b className="noselect">{status}</b><br/>
    <b className="noselect">{this.state.friends[i].status.status}</b><br/>
    <button className="button small-6 large-3 noselect" onClick={()=>{this.acceptfriend(id)}}>Accept</button>
    <button className="button small-6 large-3 noselect" onClick={this.removeFriendConfirm.bind(this,id,username)}>Decline</button>
    </div>
    </div><hr className="row expanded"/></div>
    );
  }else{
    allUsers.push(<div><div className="row expanded">{avatar}<div key={Math.random().toString(36).substr(2, 5)} className="small-6 columns noselect">
      <h2 className="noselect">{username}</h2>
      <a className="noselect" data-tag={id} onClick={this.viewprofile} ><b>View profile</b></a><br/>
      <b className="noselect">{status}</b><br/>
      <b className="noselect">{this.state.friends[i].status}</b><br/>
      <button className="button small-6 large-4 noselect" onClick={this.removeFriendConfirm.bind(this,id,username)}>Remove friend</button>
      </div>
      </div><hr className="row expanded"/></div>
    );
  }
}


    ReactDOM.render(
      <div key={i}>{allUsers}</div>,
      document.getElementById('targat')
    );




},

  componentWillMount: function(){
    this.loadFriends();
  },

  componentDidMount: function(){
    document.getElementById('search_results').style.display = "none";
    //this.setWindowsColours();
  },

  setWindowsColours(){
    var primaryElements = [
        ".button",
        "::selection",
        "react-grid-item:hover",
        ".react-grid-item:hover h2",
        ".sidenav .active",
        ".react-grid-placeholder",
        ".validationError",
        ".custom-file-upload"
    ];
    var backgroundElements = [
        "body",
        "html",
        ".react-grid-item",
        ".react-grid-item h2",
        ".overlay",
        "table tbody",
        "table tfoot",
        "table thead"
    ];
    var secondaryElements = [
        ".secondary",
        "table thead",
        ".widgetTitle",
        "#top_bar",
        ".sidenav",
        "input"
    ];

    var accentColor = ipc.sendSync('getAccentColor');
    var activeCaption = ipc.sendSync('getActiveCaption');
    var inactiveCaption = ipc.sendSync('getInactiveCaption');
    //var experiment = ipc.sendSync('experiment');
    const red = accentColor.substr(0, 2);
    const green = accentColor.substr(2, 2);
    const blue = accentColor.substr(4, 2);
    const alpha = accentColor.substr(6, 2);
    //console.log(accentColor);
    //console.log('R: '+red+'   G: '+green+'   B: '+blue+'   A:'+alpha);
    //console.log(activeCaption);
    //console.log(inactiveCaption);
    //console.log(experiment);
    var red_decimal = parseInt(red, 16);
    var green_decimal = parseInt(green, 16);
    var blue_decimal = parseInt(blue, 16);
    var alpha_percent = ((parseInt(alpha, 16)) / 255)

    $.each(primaryElements, function(index, value) {
        $(value).css("background-color", activeCaption);
    });
    $.each(backgroundElements, function(index, value) {
        $(value).css("background-color", 'rgba(' + red_decimal + ', ' + green_decimal + ', ' + blue_decimal + ', ' + alpha_percent + ')');
    });
    $.each(secondaryElements, function(index, value) {
        $(value).css("background-color", inactiveCaption);
    });
  },

  username(event){
    this.setState({username:event.target.value});
    document.getElementById('search_results').style.display = "none";
  },

  search(){
    var usr = $("#usernameSearch").val();
    if (usr == "" || usr == null){
      $("#usernameSearch").focus();
    }else{

    var name =this.state.username;
    if (name==electron.remote.getGlobal('sharedObject').username){
      $("#usernameSearch").focus();
        //Cannot look up themselves
    }else{
    $.post(api_server+"/friend/info",
    {
            username:name
        }).done((res)=>{
      this.setState({result:res});
if(res.msg =="No results found."){
  ReactDOM.render(
  <div className="row expanded">
    <p className="noselect">No results found for <b><i>{this.state.username}</i></b>.</p><br/>
    <button title="Clear search" className="close-button" type="button" onClick={this.clearSearch}><span aria-hidden="true">&times;</span></button>
  </div>,
  document.getElementById('search_results')
  );
  document.getElementById('search_results').style.display = "block";
}else{

var isFriend = null;
for (var i = 0; i < this.state.friends.length; i++) {

  if (this.state.friends[i].username === this.state.username){

    if (this.state.friends[i].online == 'online'){
      var status = (<span className="success round label noselect">Online</span>);
    }else if (this.state.friends[i].online == 'offline'){
      var status = (<span className="alert round label noselect">Offline</span>);
    }
    isFriend = true;
    break;
  }else{
    isFriend = null;
  }
}



ReactDOM.render(
<div className="row expanded">
  <p>Showing results for <b><i>{this.state.username}</i></b>.</p><br/>
  <div className="media-object stack-for-small small-12 columns expanded" id="populateResults">
    <div key={Math.random().toString(36).substr(2, 5)}>
      <div className="media-object-section">
        <div>
          {this.state.result.avatar ? <img className='thumbnail noselect' src={api_server+'/img/avatars/'+this.state.result._id+'.jpg?' + new Date().getTime()} /> : <img className='thumbnail noselect' src='./../app/img/user.jpg' /> }
        </div>
      </div>
      <div className="media-object-section">
        <h3>{this.state.result.user}</h3>
        <p>{isFriend ? 'Friends since TODO GET FRIENDS SINCE DATE' : <p><span className="label" onClick={this.addfriend}><b aria-hidden="true">+</b> Add <b>{this.state.result.user}</b></span></p> }</p>
        <p className="noselect">{status ? status : ''}</p>
      </div>
    </div>
    <button title="Clear search" className="close-button" type="button" onClick={this.clearSearch}><span aria-hidden="true">&times;</span></button>
  </div>
</div>,
document.getElementById('search_results')
);

document.getElementById('search_results').style.display = "block";
}
    });
}
  }
  },

  addfriend(){
    if(this.state.result.msg =="No results found."){
      return ;
    }else{
    var id =electron.remote.getGlobal('sharedObject').id;
    $.ajax({
        url:api_server+"/friend/addFriend",
        type:"PUT",
        data:{
          user1:id,
          user2:this.state.result._id
            }
                     }).done((res)=>{
                      this.setState({friends:[]});
                      this.loadFriends();

                    }).fail((err)=>{
                        console.log('Failed to add a friend.');
                        vex.dialog.alert({
                            message: 'Failed to add a friend.',
                            callback: function (value){
                                if (value) {
                                  return;
                                }
                            }.bind(this)
                        })
                       });
                  }
  },

  acceptfriend(requestid){
    var id =electron.remote.getGlobal('sharedObject').id;
    $.ajax({
        url:api_server+"/friend/acceptFriend",
        type:"PUT",
        data:{
          user1:id,
          user2:requestid
            }
                     }).done((res)=>{
                      this.setState({friends:[]});
                      this.loadFriends();

                    }).fail((err)=>{
                        console.log('Accepting the friend request failed.');
                        vex.dialog.alert({
                            message: 'Accepting the friend request failed.',
                            callback: function (value){
                                if (value) {
                                  return;
                                }
                            }.bind(this)
                        })
                       });

  },

  removefriend(removeid){

     var ownerid =electron.remote.getGlobal('sharedObject').id;
     $.ajax({
         url:api_server+"/friend/removeFriend",
         type:"PUT",
         data:{
           user1:ownerid,
           user2:removeid
            }
                      }).done((res)=>{
                       console.log(res);
                     }).fail((err)=>{
                        console.log('Removing your friend failed.');
                        vex.dialog.alert({
                            message: 'Removing your friend failed.',
                            callback: function (value){
                                if (value) {
                                  return;
                                }
                            }.bind(this)
                        })
                       });
    this.setState({friends: _.reject(this.state.friends, {id: removeid})});

  },

  removeFriendConfirm(i, name){
    vex.dialog.confirm({
        overlayClosesOnClick: false,
        message: 'Are you sure you want to remove ' + name + '?',
        callback: function (value){
            if (value) {
              this.removefriend(i);
            } else {
              return;
            }
        }.bind(this)
    })
  },

  render() {
    var title = "Friends \u2014 Gamempire"
    document.title = title
    document.getElementById('title').textContent = title

    //Removes all Active class from Menu
    $("#mySidenav>a.active").removeClass("active");
    $("#mySidenav>a").css("background-color", "");

    //Set Dashbaord as active in menu
    $( "#_Friends" ).addClass("active");

      return (
        <div>
        <br/><br/>
          <div className="row search_input expanded">
            <ul className="menu noselect">
              <li><h4>Search friends</h4></li>
              <li>   </li>
              <li><input type="search" id="usernameSearch" placeholder="Search by username" onChange={this.username} onKeyPress={this.usernameSearch}/></li>
              <li><button type="button" id="usernameSearchbtn" className="button" onClick={this.search}>Search</button></li>
            </ul>
          </div>
          <br/>
          <div className="callout noselect" id="search_results">
          </div>
          <h4 className="noselect">Friends list</h4>
          <div key={"1"} id="targat">Loading friends...</div>
        </div>
      );
  },

  usernameSearch(e) {
     if (e.key == 'Enter') {
       var usr = $("#usernameSearch").val();
       if (usr == "" || usr == null){
         $("#usernameSearch").focus();
       }else{

         $('#usernameSearchbtn').click();
       }
     }
  },

  clearSearch(e){
    document.getElementById('search_results').style.display = "none";
    document.getElementById('usernameSearch').value = null;

  },


});
