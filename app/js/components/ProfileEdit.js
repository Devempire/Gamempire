var fs = require('fs')
var WidthProvider = require('react-grid-layout').WidthProvider;
var ReactGridLayout = require('react-grid-layout');
ReactGridLayout = WidthProvider(ReactGridLayout);
import AvatarEditor from 'react-avatar-editor'

var vex = require('vex-js')
vex.registerPlugin(require('vex-dialog'))
vex.defaultOptions.className = 'vex-theme-os'


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
    return {

      layout: {},
      items:{i:"edit",x:0,y:0,w:12,h:27,static: true},
      pw:[],
      email:[],
      response:undefined,
      username:null,
      lastname:null,
      firstname:null,
      birthday:null,
      avatar:null,
      scale: 1.2,
      showImageDelete:false,
      check:false,

    };
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
                } else {
                  var avatar = api_server+'/img/avatars/'+d._id+'.jpg?' + new Date().getTime();
                  this.setState({showImageDelete:true});
                }

                this.setState({response:res,
                                username:res.username,
                                firstname:res.firstname,
                                lastname:res.lastname,
                                birthday:res.dateofbirth,
                                Email:res.email,
                                avatar:avatar,
                                is_verified:res.is_verified,
                });

                console.log(res.privacy);

                for (var i in res.privacy) {
                  if (i == 'firstname') {
                    if (res.privacy[i] == false || res.privacy[i] == 'false') {
                      var toggleEle = document.getElementById('toggle_privacy_first_name');
                      toggleEle.setAttribute('checked', 'checked');
                    }
                  }
                }
        });
    });
  },

  componentWillMount: function(){
    this.loadProfile();
    global.avatar_scale = this.state.scale;
    global.rotate = 0;
  },

  resetimage(e){
    ReactDOM.render(
      <img src={e} />,
      document.getElementById('userAvatar')
    );
  },

  setEditorRef (editor) {
    if (editor) this.editor = editor
  },

  avatarSave(){
    const imgData = this.editor.getImageScaledToCanvas();
    //console.log('Conerted canvas data URL: ' + imgData.toDataURL('image/jpeg'));

    this.avatarCancel(); //in the end reset back to new pp.
    this.resetimage(imgData.toDataURL()); //Display picture is reset based on state.avatar property
    var token = electron.remote.getGlobal('sharedObject').token;
    this.setState({
      avatar: imgData.toDataURL('image/jpeg')
    })

    $.post(api_server+"/user/load",
        {
            'token' :token
        }).done((d)=> {
            $.ajax({
                    url:api_server+"/user/profile/updateAvatar",
                    type:"POST",
                    data:{
                        _id:d._id,
                        avatar:imgData.toDataURL('image/jpeg')
                    }
                }).done((res)=>{
                    console.log('New avatar updated.');
                }).fail((err)=>{
                    console.log('Avatar update failed.');
                });
            });

    this.setState({showImageDelete:true});

    ReactDOM.render(
      <img src={imgData.toDataURL('image/jpeg')}/>,
    document.getElementById('topbar_avatar')
    );


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

  deleteAvatarConfirm(){
    vex.dialog.confirm({
        overlayClosesOnClick: false,
        message: 'Are you sure you want to remove your current avatar?',
        callback: function (value){
            if (value) {
              this.deleteAvatar();
            } else {
              return;
            }
        }.bind(this)
    })
  },

  deleteAvatar(){
      var token = electron.remote.getGlobal('sharedObject').token;
      var avatar = './../app/img/user.jpg';
      $.post(api_server+"/user/load",
      {
         'token' :token
      }).done((d)=> {
         $.ajax({
                 url:api_server+"/user/profile/deleteAvatar",
                 type:"PUT",
                 data:{
                     _id:d._id,
                 }
             }).done((res)=>{
                 console.log('Avatar deleted.');
             }).fail((err)=>{
                 console.log('Avatar deletion failed.');
             });
         });
      this.resetimage(avatar);
      this.setState({showImageDelete:false});
      global.rotate = 0;
  },

  createProfile(el) {
    var i = el.i;
    return (
      <div key={i} data-grid={el} className="noselect profileedit">
        <h3>Edit Profile</h3>
        <hr/>
        <div id='popupContainer'></div>
          <div id='userAvatar'><img src={this.state.avatar} /></div>
          <div id='avatarEditor'></div>

          <div id='upload'>
            <br/>
            <label htmlFor='profilepic' className='custom-file-upload'>Upload Profile Picture</label>
            <input id='profilepic' onChange={this.uploadPic} type='file' accept='image/*'/>
            <label style={{display: this.state.showImageDelete ? 'inline-block' : 'none'}} onClick={this.deleteAvatarConfirm} className="custom-file-upload removepic">X</label>
          </div>

          <div id='save_cancel'>
            <div className="row expanded button-group">
              <button onClick={this.avatarSave} className="button" id="Save">Save</button>
              <button onClick={(event) => {this.resetimage(this.state.avatar); this.avatarCancel();}} className="button secondary" id="Cancel">Cancel</button>
            </div>
          </div>

        <font id='uploadmsg' color='red'></font>
        <form>
            Username: <br/>
            <input type="text" id="userName" value={this.state.username} onChange={(event) => {this.setState({username: event.target.value})}}/>
            <font id='uname' color='red'></font>
            First Name:

            <div className="onoffswitch" style={{display : 'inline-block'}}>
                <input type="checkbox" onClick={this.toggleFName} name="onoffswitch" className="onoffswitch-checkbox" id="toggle_privacy_first_name"/>
                <label className="onoffswitch-label" htmlFor="toggle_privacy_first_name">
                    <span className="onoffswitch-inner"></span>
                    <span className="onoffswitch-switch"></span>
                </label>
            </div>

            <input type="text" id="firstName" value={this.state.firstname} onChange={(event) => {this.setState({firstname: event.target.value})}} />
            <font id='fname' color='red'></font>
            Last Name:

            <div className="onoffswitch" style={{display : 'inline-block'}}>
                <input type="checkbox" onClick={this.toggleLName} name="onoffswitch" className="onoffswitch-checkbox" id="toggle_privacy_last_name"/>
                <label className="onoffswitch-label" htmlFor="toggle_privacy_last_name">
                    <span className="onoffswitch-inner"></span>
                    <span className="onoffswitch-switch"></span>
                </label>
            </div>

            <input type="text" id="lastName" value={this.state.lastname} onChange={(event) => {this.setState({lastname: event.target.value})}}/>
            <font id='lname' color='red'></font>
            Birthday: <br/>
            <input type="date" id="birthday" value={this.state.birthday} onChange={(event) => {this.setState({birthday: moment(event.target.value).format('YYYY-MM-DD')})}}/>
        </form>

        <div className="row expanded button-group">
          <button className="button" onClick={this.checkValid}> Submit </button>
          <button className="button" onClick={this.onAddchangepw}>Change Password</button>
          <button className="button" onClick={this.onAddchangeEmail}>Change Email</button>
          <button className="button" onClick={this.resend} style={{display: this.state.is_verified?  'none':'block' }}>Resend Email Verification</button>
          <button className="button secondary" onClick={this.backToDashboard}>Back to Dashboard</button>
        </div>
      </div>
    );
  },

  toggleFName() {
    var toggleEle = document.getElementById('toggle_privacy_first_name');
    //If at the time you clicked the toggle was public, it means you
    //want to make the field private and vise versa.
    //removeAttribute('checked') = true = private
    //setAttribute('checked', 'checked') = false = public
    if (toggleEle.getAttribute('checked') == 'checked') {
      console.log('one');
      toggleEle.removeAttribute('checked');
      this.setState({check: true});
    } else {
      console.log('two');
      toggleEle.setAttribute('checked', 'checked');
      this.setState({check: false});
    }
    //toggleEle.setAttribute('checked', 'checked');
    //console.log(toggleEle);
    var token = electron.remote.getGlobal('sharedObject').token;
      $.post(api_server+"/user/load",
         {
             'token' :token
         }).done((d) => {
           $.ajax({
                   url:api_server+"/user/profile/toggleFirstName",
                   type:"PUT",
                   data:{
                       _id:d._id,
                       privacy:this.state.check
                   }
               }).done((res)=>{
                   console.log("firstname's publicity is updated");
               }).fail((err)=>{
                   console.log("failed");
               });
           });
  },

  toggleLName() {
    var toggleEle = document.getElementById('toggle_privacy_last_name');
  },

  resend(){
    var token = electron.remote.getGlobal('sharedObject').token;
      $.post(api_server+"/user/load",
         {
             'token' :token
         }).done((d) => {
          $.post( api_server+"/profile/resend",
                        {
                          _id :d._id,
                        email:this.state.Email

                          }
                        ).done(function(res){

                        });
                      });
  },

  handleScale(){
    global.avatar_scale = parseFloat(document.getElementById("avatar_scale").value);
    this.setState({
      scale: global.avatar_scale
    })
    this.uploadPic();
  },

  rotateLeft(){
    global.rotate = global.rotate + 270;
    this.uploadPic();
  },

  rotateRight(){
    global.rotate = global.rotate + 90;
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
          ref={this.setEditorRef}
          image={pic[0].path}
          width={180}
          height={180}
          border={20}
          color={[255, 255, 255, 0.8]}
          scale={global.avatar_scale}
          rotate={global.rotate} />
          <br/>
          <label id="scale_value" htmlFor="avatar_scale">Zoom: {global.avatar_scale}</label>
          <input type="range" step="0.10" min="1" max="4" id="avatar_scale" defaultValue={this.state.scale} onInput={this.handleScale} />
          <div className="row expanded button-group">
            <label>Rotate: </label>
            <label id="rotate_left" onClick={this.rotateLeft} className="custom-file-upload rotate">Left</label>
            <label id="rotate_right" onClick={this.rotateRight} className="custom-file-upload rotate">Right</label>
          </div>
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
        h: 15
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
        h: 15
      })
    });
  }
  },

  backToDashboard() {
  let MainWindow =  ReactDOM.render(
        <Dashboard />,
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
        <label>
        New password:
        <input type="password" id="newpw" />
        <font id='newpass' color='red'></font>
        </label>
        <label>
        Confirm password:
        <input type="password" id="cnewpw" />
        <font id='cnewpass' color='red'></font>
        </label>
        <br/>
        </form>
        <button className="button" onClick={this.checkPw}> Submit </button>
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
        <button className="button" onClick={this.checkEmail}> Submit </button>
      </div>
    );
  },

  render() {
    var title = "Profile Edit \u2014 Gamempire"
    document.title = title
    document.getElementById('title').textContent = title

    //Removes all Active class from Menu
    $("#mySidenav>a.active").removeClass("active");

    //Set Dashbaord as active in menu
    $( "#_ProfileEdit" ).addClass('active');

    if(this.state.response){
      return (

          <ReactGridLayout onLayoutChange={this.onLayoutChange} onBreakpointChange={this.onBreakpointChange}
              {...this.props}>
              { this.createProfile(this.state.items)}
              {_.map(this.state.pw, this.changePW)}
              {_.map(this.state.email, this.changeEmail)}
          </ReactGridLayout>

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
                      $.post( api_server+"/profile/resend",
                        {_id :d._id,
                        email:email

                          }
                        ).done(function(res){
                          //
                        });
                      errornewemail.innerHTML = "";
                        this.onRemoveItem1();
                    }).fail((res)=>{
                        errornewemail.innerHTML = "The Email already exist!";
                    });
            });
    }
  }
});
