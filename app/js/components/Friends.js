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
  if (!this.state.friends[i].avatar || this.state.friends[i].privacy.avatar == true || this.state.friends[i].privacy.avatar == 'true'){

    allUsers.push(<div key={Math.random().toString(36).substr(2, 5)} style={{display: 'inline'}}><br/><br/><img width="75" src="./../app/img/user.jpg" /></div>);
   }else{
     var img = [api_server+'/img/avatars/'+id+'.jpg?'+new Date().getTime()];
     allUsers.push(<div key={Math.random().toString(36).substr(2, 5)} style={{display: 'inline'}}><br/><br/><img width="75" src={img[0]} /></div>);
   }
  if (this.state.friends[i].status == "pending") {
    allUsers.push(<div key={Math.random().toString(36).substr(2, 5)} style={{display: 'inline'}}>
    <a data-tag={id} onClick={this.viewprofile} >
    <b>{username}</b></a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <b>{this.state.friends[i].status}</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <button className="button" onClick={()=>{this.acceptfriend(id)}}> Accept </button>
    <button className="button" onClick={this.removeFriendConfirm.bind(this,id,username)}> Decline</button>
    </div>
   );
  }else{
allUsers.push(<div key={Math.random().toString(36).substr(2, 5)} style={{display: 'inline'}}>
<a data-tag={id} onClick={this.viewprofile} >
<b>{username}</b></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<b>{this.state.friends[i].status}</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
<button className="button" onClick={this.removeFriendConfirm.bind(this,id,username)}> Remove</button>
</div>
);
  }
}


    ReactDOM.render(
      <div key={Math.random().toString(36).substr(2, 5)}>{allUsers}</div>,
      document.getElementById('targat')
    );

   


},

  componentWillMount: function(){
    this.loadFriends();
  },

  username(event){
    this.setState({username:event.target.value});
   
  },

  search(){
    var name =this.state.username;
    $.post(api_server+"/friend/info",
    {
            username:name
        }).done((res)=>{
      this.setState({result:res});
    });
  },

  addfriend(){
    if(this.state.result.msg =="no result found !"){
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
        message: 'Are you sure you want to remove the ' + name + ' ?',
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

    //Set Dashbaord as active in menu
    $( "#_Friends" ).addClass('active');

      return (
        <div>
        <div>
        <input type="text" placeholder=" enter username here" onChange={this.username}/>
        <button className="button" onClick={this.search} >Search</button>
        <p>{this.state.result.msg ? this.state.result.msg :<a onClick={this.addfriend}>{this.state.result.user}</a>}  </p>
        </div>

        <div key={"1"} id="targat">Loading friends...</div>
        </div>

      );

  }

});


