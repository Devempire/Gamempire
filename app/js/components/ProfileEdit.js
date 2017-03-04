var WidthProvider = require('react-grid-layout').WidthProvider;
var ReactGridLayout = require('react-grid-layout');
ReactGridLayout = WidthProvider(ReactGridLayout);
import AvatarEditor from 'react-avatar-editor'

const originalLayouts = getFromLS('layouts') || {};
const fs = require('fs');

module.exports = global.ProfileEdit = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      className: "layout",
      cols: 12,
      rowHeight: 20,
      verticalCompact: true
    };
  },

  getInitialState() {
    var layout = this.generateLayout();
    return {

      layout: layout,
      items:{i:"edit",x:0,y:0,w:10,h:30,static: true},
      pw:[],
      email:[],
      response:undefined,
      username:null,
      lastname:null,
      firstname:null,
      birthday:null,
      avatar:null,
      scale: 1.2

    };
  },

  generateLayout() {
    var p = this.props;
    return _.map(new Array(p.items), function(item, i) {
      var y = _.result(p, 'y') || Math.ceil(Math.random() * 4) + 1;
      return {x: i * 2 % 12, y: Math.floor(i / 6) * y, w: 2, h: y, i: i.toString()};
    });
  },

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  },

  onLayoutChange(layout) {
    this.setState({layout: layout});
  },

  loadProfile(){
    var token = electron.remote.getGlobal('sharedObject').token;
     $.post(api_server+"/user/load",{
        'token': token
         }).done((d)=> {
             $.get(api_server+'/user/profile/'+ d._id + '/info').done((res)=>{
               if (!res.avatar) {
                 var avatar = './../app/img/user.jpg';
               }else{
                 var avatar = res.avatar;
               }


                this.setState({response: res,
                                username:res.username,
                                firstname:res.firstname,
                                lastname:res.lastname,
                                lastname:res.avatar,
                                birthday:res.dateofbirth,
                                avatar:avatar
                });
        });
    });
  },

  componentWillMount: function(){
    this.loadProfile();
    global.avatar_scale = this.state.scale;
  },


  resetimage(e){

    ReactDOM.render(
      <img src={e} />,
      document.getElementById('userAvatar')
    );
  },

  avatarSave(){
    //TODO:
    //take output image and make sure it's 180x180.
    //make sure the image if formated to JPEG. Doesn't matter if user uploads bmp,gif etc, app should convert to 180x180 JPEG image.
    //rename the ouput image to users ID  (e.g. 58b93ee3a7c98c3001ad48a8.jpg)
    //Push this image to server inside ~/server/view/img/avatar/ i think is the directory. double check server via API request upload put. Overwriite current image on sever if exists.
    //Push the tile name to userDB e.g. "avatar": "58b93ee3a7c98c3001ad48a8.jpg"

    var pic = document.getElementById("profilepic").files;

    var image = new Image();
    image.id = "pic";
    image.src = pic[0].path;
    var canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 180;
    var canvas_context = canvas.getContext("2d");
    canvas_context.drawImage(image, 0, 0, 180, 180);
    this.setState({
      avatar: canvas.toDataURL()
    })

    //Debugging
    console.log(image)
    console.log('Conerted canvas data URL: '+canvas.toDataURL());

    this.avatarCancel(); //in the end reset back to new pp.
    this.resetimage(canvas.toDataURL()); //Display picture is reset based on state.avatar property
    },

    avatarCancel(){
      document.getElementById('save_cancel').style.display = "none";
      document.getElementById('avatarEditor').innerHTML = "";
      document.getElementById('profilepic').value = "";
      global.avatar_scale = 1.2;
      this.setState({
        scale: global.avatar_scale
      })
      document.getElementById('upload').style.display = "block";
    },

    createProfile(el) {
      var i = el.i;
      return (
        <div key={i} data-grid={el} className="noselect">
          <h3>Edit Profile</h3>
          <hr/>
            <div id='userAvatar'><img src={this.state.avatar} /></div>
            <div id='avatarEditor'></div>

            <div id='upload'>
              <br/>
              <label htmlFor='profilepic' className='custom-file-upload'>Upload Profile Picture</label>
              <input id='profilepic' onChange={this.uploadPic} type='file' accept='image/*'/>
            </div>

            <div id='save_cancel'>
              <div className="row expanded button-group">
                <button onClick={this.avatarSave} className="button" id="Save">Save</button>
                <button onClick={(event) => {this.resetimage(this.state.avatar); this.avatarCancel();}} className="button secondary" id="Cancel">Cancel</button>
              </div>
            </div>
          <br/>
          <font id='uploadmsg' color='red'></font>
          <br/>
          <form>
              Username: <br></br>
              <input type="text" id="userName" value={this.state.username} onChange={(event) => {this.setState({username: event.target.value})}}/>
              <font id='uname' color='red'></font>
              <br></br>
              First Name: <br></br>
              <input type="text" id="firstName" value={this.state.firstname} onChange={(event) => {this.setState({firstname: event.target.value})}} />
              <font id='fname' color='red'></font>
              <br></br>
              Last Name: <br></br>
              <input type="text" id="lastName" value={this.state.lastname} onChange={(event) => {this.setState({lastname: event.target.value})}}/>
              <font id='lname' color='red'></font>
              <br></br>
              Birthday: <br></br>
              <input type="date" id="birthday" value={this.state.birthday} onChange={(event) => {this.setState({birthday: moment(event.target.value).format('YYYY-MM-DD')})}}/>
              <br></br>
          </form>

          <div className="row expanded button-group">
            <button className="button" onClick={this.checkValid}> Submit </button>
            <button className="button" onClick={this.onAddchangepw}>Change Password</button>
            <button className="button" onClick={this.onAddchangeEmail}>Change Email</button>
            <button className="button secondary" onClick={this.backToDashboard}>Back</button>
          </div>
        </div>
      );
    },

    handleScale(){
      global.avatar_scale = parseFloat(document.getElementById("avatar_scale").value);
      this.setState({
        scale: global.avatar_scale
      })
      this.uploadPic();
    },

    uploadPic() {
      document.getElementById('userAvatar').innerHTML = "";
      document.getElementById('save_cancel').style.display = "block";
      document.getElementById('upload').style.display = "none";
      var pic = document.getElementById("profilepic").files;
      const element = (
        <div>
        <AvatarEditor
            image={pic[0].path}
            width={180}
            height={180}
            border={20}
            color={[255, 255, 255, 0.8]}
            scale={global.avatar_scale}
            rotate={0} />
            <br/>
            <label id="scale_value" htmlFor="avatar_scale">Zoom: {global.avatar_scale}</label>
            <input type="range" step="0.10" min="1" max="4" id="avatar_scale" defaultValue={this.state.scale} onInput={this.handleScale} />
            </div>
      );
      ReactDOM.render(
        element,
        document.getElementById('avatarEditor')
      );
    },

    onRemoveItem() {
      this.setState({pw: _.reject(this.state.pw, {i: "change password"})});
    },

    onRemoveItem1() {
      this.setState({email: _.reject(this.state.email, {i: "change email"})});
    },

    onAddchangepw() {
      if(this.state.pw.length==0){
      this.setState({
        pw: this.state.pw.concat({
          i: "change password",
          x: 0,
          y: 16,
          w: 4,
          h: 10
        })
      });
      }
    },

    onAddchangeEmail() {
    if(this.state.email.length==0){
      this.setState({
        email: this.state.email.concat({
          i: "change email",
          x: 4,
          y: 16,
          w: 4,
          h: 10
        })
      });
    }
    },

    backToDashboard() {
    let MainWindow =  ReactDOM.render(
          <Dashboardv2 />,
          document.getElementById('content'));
    },

    changePW(el) {
      var i = el.i;
      return (
        <div key={i} data-grid={el}>
          <h3> Edit Your password</h3>
          <hr/>
          <form>
          <label>
          Old password:
          <input type="password" id="oldpw" />
          <font id='oldpass' color='red'></font>
          </label>
          <br/>
          <label>
          New password:
          <input type="password" id="newpw" />
          <font id='newpass' color='red'></font>
          </label>
          <br/>
          <label>
          Confirm password:
          <input type="password" id="cnewpw" />
          <font id='cnewpass' color='red'></font>
          </label>
          <br/>
          </form>
          <button onClick={this.checkPw}> Submit </button>
        </div>
      );
    },

    changeEmail(el) {
      var i = el.i;
      return (
        <div key={i} data-grid={el}>
          <h3> Edit Your Email</h3>
          <hr/>
          <form>
          <label>
          New email
          <input type="text" id="email" />
          <font id='newemail' color='red'></font>
          </label>
          </form>
          <button onClick={this.checkEmail}> Submit </button>
        </div>
      );
    },

    render() {
      var title = "Profile Edit - Gamempire"
      document.title = title
      document.getElementById('title').textContent = title

      //Removes all Active class from Menu
      $("#mySidenav>a.active").removeClass("active");

      //Set Dashbaord as active in menu
      $( "#_ProfileEdit" ).addClass('active');

      if(this.state.response){
        return (
          <div>
            <ReactGridLayout onLayoutChange={this.onLayoutChange} onBreakpointChange={this.onBreakpointChange}
                {...this.props}>
                { this.createProfile(this.state.items)}
                {_.map(this.state.pw, this.changePW)}
                {_.map(this.state.email, this.changeEmail)}
            </ReactGridLayout>
          </div>
        );
      }else{
          return (<div className="content-loading"></div>);
      }
    },

    checkValid() {
      var namePattern = new RegExp('^[a-zA-Z ]{1,}$');
      var userPattern = new RegExp('^[a-zA-Z0-9]{3,}$');
      var fname = $('#firstName').val();
      var errorfname = document.getElementById('fname');
      var lname = $('#lastName').val();
      var errorlname = document.getElementById('lname');
      var uname = $('#userName').val();
      var erroruname = document.getElementById('uname');

      if (fname == "") {
          errorfname.innerHTML = "The field is empty.";
      } else if (!namePattern.test(fname)) {
          errorfname.innerHTML = "Names can only contain alphabets.";
      } else {
          errorfname.innerHTML = "";
      }

      if (lname == "") {
          errorlname.innerHTML = "The field is empty.";
      } else if (!namePattern.test(lname)) {
          errorlname.innerHTML = "Names can only contain alphabets.";
      } else {
          errorlname.innerHTML = "";
      }

      if (uname == "") {
          erroruname.innerHTML = "The field is empty.";
      } else if (!userPattern.test(uname)) {
          erroruname.innerHTML = "Usernames must be at least 3 characters long and can only contain alphabets or digits.";
      } else {
          erroruname.innerHTML = "";
      }

      if (errorfname.innerHTML == "" && errorlname.innerHTML == "" && erroruname.innerHTML == "") {
          var token = electron.remote.getGlobal('sharedObject').token;
          $.post(api_server+"/user/load",

              {
                  'token' :token
              }).done((d)=> {
                  $.ajax({
                          url:api_server+"/user/profile/update",
                          type:"PUT",
                          data:{
                              _id:d._id,
                              "firstname":fname,
                              "lastname":lname,
                              "username":uname,
                              "birthday":this.state.birthday
                          }
                      }).done((res)=>{
                                  erroruname.innerHTML = "";

                              }).fail((err)=>{
                                  erroruname.innerHTML = "Username already exist!";
                              });
                          });
      }
    },

    checkPw(){
      var newpw = $('#newpw').val();
      var oldpw = $('#oldpw').val();
      var cnewpw = $('#cnewpw').val();
      console.log(newpw,oldpw,cnewpw);
      var errornewpass = document.getElementById('newpass');
      var erroroldpass = document.getElementById('oldpass');
      var errorcnewpass = document.getElementById('cnewpass');
      if (newpw == "") {
          errornewpass.innerHTML = "The field is empty.";
      } else if (newpw.length <6) {
          errornewpass.innerHTML = "At least 6 length";
      } else if (newpw == oldpw) {
          errornewpass.innerHTML = "Do not use your old password";
      } else {
          errornewpass.innerHTML = "";
      }
      if (cnewpw == "") {
          errorcnewpass.innerHTML = "The field is empty.";
      }  else if (cnewpw != newpw) {
          errorcnewpass.innerHTML = "The new password does not match";
      } else {
          errorcnewpass.innerHTML = "";
      }

      if(errornewpass.innerHTML == "" && errorcnewpass.innerHTML == ""){
        var token = electron.remote.getGlobal('sharedObject').token;
        $.post(api_server+"/user/load",
           {
               'token' :token
           }).done((d) => {
               $.post(api_server+"/user/profile/checkold", {
                  _id:d._id,
                  "password":oldpw
              }).done( (res) =>{
                  erroroldpass.innerHTML ="";
                  $.ajax({

                      url:api_server+"/user/profile/updatePW",
                      type:"PUT",
                      data:{
                          _id:d._id,
                          "password":newpw
                      }
                  }).done((res2)=>{
                      this.onRemoveItem();

                  });
              }).fail((err)=>{
                  erroroldpass.innerHTML = "The old password not match.";
              });
          });
      }
    },

    checkEmail(){
      var emailPattern = new RegExp('^[a-zA-Z0-9]{1,}@[a-zA-Z]{1,}[.]{1}[a-zA-Z]{1,}$');
      var email = $('#email').val();
      var errornewemail = document.getElementById('newemail');

      if (email == "") {
          errornewemail.innerHTML = "The field is empty.";
      } else if (!emailPattern.test(email)) {
          errornewemail.innerHTML = "Not correct email format";
      } else {
          errornewemail.innerHTML = "";
      }

      if(errornewemail.innerHTML == ""){
           var token = electron.remote.getGlobal('sharedObject').token;

          $.post(api_server+"/user/load",
              {
                  'token' :token
              }).done((d) => {
                  $.ajax({
                     url:api_server+"/user/profile/updateEmail",

                      type:"PUT",
                      data:{
                          _id:d._id,
                          "email":email
                          }
                      }).done((res)=>{
                          errornewemail.innerHTML = "";
                          this.onRemoveItem1();

                      }).fail((res)=>{
                          errornewemail.innerHTML = "The Email already exist!";
                      });
              });
      }
    }
  });

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem('rgl-8')) || {};
    } catch(e) {/*Ignore*/}
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem('rgl-8', JSON.stringify({
      key: value
    }));
  }
}
