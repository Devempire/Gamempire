


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
           })
         });

       }
      this.renderFriends();
      
    }).fail((err)=>{
      console.log("Couldn't load friends.");
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
  // if (!this.state.friends[i].avatar ){
    allUsers.push(<div key={Math.random().toString(36).substr(2, 5)} style={{display: 'inline'}}><br/><br/><img width="75" src="./../app/img/user.jpg" /></div>);
  // }else{
  //   var id = [api_server+'/img/avatars/'+id+'.jpg?'+new Date().getTime()];
  //   allUsers.push(<div key={Math.random().toString(36).substr(2, 5)} style={{display: 'inline'}}><br/><br/><img width="75" src={id[0]} /></div>);
  // }
  if (this.state.friends[i].status == "pending") {
    allUsers.push(<div key={Math.random().toString(36).substr(2, 5)} style={{display: 'inline'}}>
    <a data-tag={id} onClick={this.viewprofile} >
    <b>{this.state.friends[i].status}</b></a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <a><b>{id}</b></a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <button onClick={()=>{this.acceptfriend(id)}}> Accept </button>
    <button onClick={()=>{this.removefriend(id)}}> Decline</button>
    </div>
   );
  }else{
allUsers.push(<div key={Math.random().toString(36).substr(2, 5)} style={{display: 'inline'}}>
<a data-tag={id} onClick={this.viewprofile} >
<b>{this.state.friends[i].status}</b></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<b>{id}</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
<button onClick={()=>{this.removefriend(id)}}> Remove</button>
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
      this.setState({result:res._id});
    });
  },

  addfriend(){
    var id =electron.remote.getGlobal('sharedObject').id;
    $.ajax({
        url:api_server+"/friend/addFriend",
        type:"PUT",
        data:{
          user1:id,
          user2:this.state.result
            }
                     }).done((res)=>{
                      console.log(res);

                    }).fail((err)=>{
                      console.log("friend add fail");

                    });
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
                      console.log(res);

                    }).fail((err)=>{
                      console.log("friend accept fail");

                    });

  },

  removefriend(removeid){

    var id =electron.remote.getGlobal('sharedObject').id;
    $.ajax({
        url:api_server+"/friend/removeFriend",
        type:"PUT",
        data:{
          user1:id,
          user2:removeid
            }
                     }).done((res)=>{
                      console.log(res);

                    }).fail((err)=>{
                      console.log("friend remove fail");

                    });

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
        <input type="text" onChange={this.username}/>
        <button onClick={this.search} >Search</button>
        <p><a onClick={this.addfriend}>{this.state.result}</a></p>
        </div>

        <div key={"1"} id="targat">Loading friends...</div>
        </div>

      );

  }

});


