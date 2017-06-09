var fs = require('fs')
var WidthProvider = require('react-grid-layout').WidthProvider;
var ReactGridLayout = require('react-grid-layout');
ReactGridLayout = WidthProvider(ReactGridLayout);
import AvatarEditor from 'react-avatar-editor'

var vex = require('vex-js')
vex.registerPlugin(require('vex-dialog'))
vex.defaultOptions.className = 'vex-theme-os'
const gpuReport = require("gl-info");

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
      items:{i:"edit",x:0,y:0,w:12,h:63,static: true},
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
      FNCheck:true,
      LNCheck:true,
      aboutme:null,

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
     $.post(api_server+"/login/load",{
        'token': token
         }).done((d)=> {
             $.get(api_server+'/login/profile/'+ d._id + '/info').done((res)=>{
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
                                aboutme:res.aboutme
                });

                for (var i in res.privacy) {
                  if (i == 'firstname') {
                    if (res.privacy[i] == 'false') {
                      var toggleEle = document.getElementById('toggle_privacy_first_name');
                      toggleEle.setAttribute('checked', 'checked');
                    }
                    setTimeout(function () {
                      document.getElementById('toggle_privacy_first_name').parentNode.style.visibility = "visible";
                    }, 270);
                  } else if (i == 'lastname') {
                    if (res.privacy[i] == 'false') {
                      var toggleEle = document.getElementById('toggle_privacy_last_name');
                      toggleEle.setAttribute('checked', 'checked');
                    }
                    setTimeout(function () {
                      document.getElementById('toggle_privacy_last_name').parentNode.style.visibility = "visible";
                    }, 270);
                  } else if (i == 'dateofbirth') {
                    if (res.privacy[i] == 'false') {
                      var toggleEle = document.getElementById('toggle_privacy_birthday');
                      toggleEle.setAttribute('checked', 'checked');
                    }
                    setTimeout(function () {
                      document.getElementById('toggle_privacy_birthday').parentNode.style.visibility = "visible";
                    }, 270);
                  } else if (i == 'email') {
                    if (res.privacy[i] == 'false') {
                      var toggleEle = document.getElementById('toggle_privacy_email');
                      toggleEle.setAttribute('checked', 'checked');
                    }
                    setTimeout(function () {
                      document.getElementById('toggle_privacy_email').parentNode.style.visibility = "visible";
                    }, 270);
                  } else if (i == 'aboutme') {
                    var toggleEle = document.getElementById('toggle_privacy_about_me');
                    if (res.privacy[i] == 'true') {
                      toggleEle.removeAttribute('checked');
                    } else if (res.privacy[i] == 'false' || res.privacy[i] == false) {
                      toggleEle.setAttribute('checked', 'checked');
                    }
                    setTimeout(function () {
                      document.getElementById('toggle_privacy_about_me').parentNode.style.visibility = "visible";
                    }, 270);
                  } else if (i == 'avatar') {
                    var toggleEle = document.getElementById('toggle_privacy_avatar');
                    if (res.privacy[i] == 'true') {
                      toggleEle.removeAttribute('checked');
                    } else if (res.privacy[i] == 'false' || res.privacy[i] == false) {
                      toggleEle.setAttribute('checked', 'checked');
                    }
                    setTimeout(function () {
                      document.getElementById('toggle_privacy_avatar').parentNode.style.visibility = "visible";
                    }, 270);
                  } else if (i == 'compspecs') {
                    var toggleEle = document.getElementById('toggle_privacy_compspecs');
                    if (res.privacy[i] == 'true') {
                      toggleEle.removeAttribute('checked');
                    } else if (res.privacy[i] == 'false' || res.privacy[i] == false) {
                      toggleEle.setAttribute('checked', 'checked');
                    }
                    setTimeout(function () {
                      document.getElementById('toggle_privacy_compspecs').parentNode.style.visibility = "visible";
                    }, 270);
                  }
                }
              })
      }).fail((err)=>{
          console.log("Profile failed to load.");
          vex.dialog.alert({
              message: 'Profile failed to load.',
              callback: function (value){
                  if (value) {
                    return;
                  }
              }.bind(this)
          })
      });
  },

  componentWillMount: function(){
    this.loadProfile();
    global.avatar_scale = this.state.scale;
    global.rotate = 0;
  },

  componentDidMount: function(){
    setTimeout( execute, 5000 );
    function execute(){
      var gpus = electron.remote.getGlobal('sharedObject').gpuHTML;
      var option='';
      var i =0;
      for (i = 0; i < gpus.length; i++) {
      var option = option+'<option value="'+gpus[i]+'">'+gpus[i]+'</option>';
      }
      var gpus = '<select id="gpusel">'+option+'</select>';
      document.getElementById('gpudiv').innerHTML = gpus;
    }
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

    $.post(api_server+"/login/load",
        {
            'token' :token
        }).done((d)=> {
            $.ajax({
                    url:api_server+"/login/profile/updateAvatar",
                    type:"POST",
                    data:{
                        _id:d._id,
                        avatar:imgData.toDataURL('image/jpeg')
                    }
                }).done((res)=>{
                    console.log('New avatar updated.');
                })
            }).fail((err)=>{
              console.log("Avatar could not be saved to the server.")
              vex.dialog.alert({
                  message: 'Avatar could not be saved to the server.',
                  callback: function (value){
                      if (value) {
                        return;
                      }
                  }.bind(this)
              })
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
      $.post(api_server+"/login/load",
      {
         'token' :token
      }).done((d)=> {
         $.ajax({
                 url:api_server+"/login/profile/deleteAvatar",
                 type:"PUT",
                 data:{
                     _id:d._id,
                 }
             }).done((res)=>{
                 console.log('Avatar deleted.');
             })
         }).fail((err)=>{
              console.log('Avatar could not be deleted in the server.');
              vex.dialog.alert({
              message: 'Avatar could not be deleted in the server.',
              callback: function (value){
                  if (value) {
                    return;
                  }
              }.bind(this)
          })
        });;
      this.resetimage(avatar);
      this.setState({showImageDelete:false});
      global.rotate = 0;
  },

  createProfile(el) {
    var i = el.i;
    return (
      <div key={i} data-grid={el} className="noselect profileedit row columns">
        <h3>Edit Profile</h3>
        <hr/>
        <div id='popupContainer'></div>
          <div id='userAvatar'><img src={this.state.avatar} /></div>
          <div id='avatarEditor'></div>

          <div className="onoffswitch" style={{display : 'inline-block', visibility : 'hidden'}}>
              <input type="checkbox" onClick={this.toggleAvatar} name="onoffswitch" className="onoffswitch-checkbox" id="toggle_privacy_avatar"/>
              <label className="onoffswitch-label" htmlFor="toggle_privacy_avatar">
                  <span className="onoffswitch-inner"></span>
                  <span className="onoffswitch-switch"></span>
              </label>
          </div>

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

            About Me:

            <div className="onoffswitch" style={{display : 'inline-block', visibility : 'hidden'}}>
                <input type="checkbox" onClick={this.toggleAboutMe} name="onoffswitch" className="onoffswitch-checkbox" id="toggle_privacy_about_me"/>
                <label className="onoffswitch-label" htmlFor="toggle_privacy_about_me">
                    <span className="onoffswitch-inner"></span>
                    <span className="onoffswitch-switch"></span>
                </label>
            </div>

            <label className="aboutmelabel">{this.state.aboutme}</label>

            First Name:

            <div className="onoffswitch" style={{display : 'inline-block', visibility : 'hidden'}}>
                <input type="checkbox" onClick={this.toggleFName} name="onoffswitch" className="onoffswitch-checkbox" id="toggle_privacy_first_name"/>
                <label className="onoffswitch-label" htmlFor="toggle_privacy_first_name">
                    <span className="onoffswitch-inner"></span>
                    <span className="onoffswitch-switch"></span>
                </label>
            </div>

            <input type="text" id="firstName" value={this.state.firstname} onChange={(event) => {this.setState({firstname: event.target.value})}} />
            <font id='fname' color='red'></font>

            Last Name:

            <div className="onoffswitch" style={{display : 'inline-block', visibility : 'hidden'}}>
                <input type="checkbox" onClick={this.toggleLName} name="onoffswitch" className="onoffswitch-checkbox" id="toggle_privacy_last_name"/>
                <label className="onoffswitch-label" htmlFor="toggle_privacy_last_name">
                    <span className="onoffswitch-inner"></span>
                    <span className="onoffswitch-switch"></span>
                </label>
            </div>

            <input type="text" id="lastName" value={this.state.lastname} onChange={(event) => {this.setState({lastname: event.target.value})}}/>
            <font id='lname' color='red'></font>

            Birthday:

            <div className="onoffswitch" style={{display : 'inline-block', visibility : 'hidden'}}>
                <input type="checkbox" onClick={this.toggleBday} name="onoffswitch" className="onoffswitch-checkbox" id="toggle_privacy_birthday"/>
                <label className="onoffswitch-label" htmlFor="toggle_privacy_birthday">
                    <span className="onoffswitch-inner"></span>
                    <span className="onoffswitch-switch"></span>
                </label>
            </div>

            <input type="date" id="birthday" value={this.state.birthday} onChange={(event) => {this.setState({birthday: moment(event.target.value).format('YYYY-MM-DD')})}}/>
        </form>

        <button className="button secondary" id='emailButton' onClick={this.onAddchangeEmail}>Change Email</button>
        <div key={'changeEmail'} id='emailEdit' data-grid={el} style={{display : 'none'}}>
          <h3> Edit Your Email</h3>
          <hr/>
          <form>
          <label>
          New Email:

          <div className="onoffswitch" style={{display : 'inline-block'}}>
              <input type="checkbox" onClick={this.toggleEmail} name="onoffswitch" className="onoffswitch-checkbox" id="toggle_privacy_email"/>
              <label className="onoffswitch-label" htmlFor="toggle_privacy_email">
                  <span className="onoffswitch-inner"></span>
                  <span className="onoffswitch-switch"></span>
              </label>
          </div>

          <input type="text" id="email" />
          <font id='newemail' color='red'></font>
          </label>
          </form>
          <div className="row column button-group">
            <button className="button" onClick={this.checkEmail}> Submit </button>
            <button className="button secondary" onClick={this.cancelChangeEmail}>Cancel</button>
          </div>
        </div>

        <button className="button secondary" id='passwordButton' onClick={this.onAddchangepw}>Change Password</button>
        <div key={'changePassword'} id='passwordEdit' data-grid={el} style={{display : 'none'}}>
          <h3> Edit Your Password</h3>
          <hr/>
          <form>
          <label>
          Old Password:
          <input type="password" id="oldpw" />
          <font id='oldpass' color='red'></font>
          </label>
          <label>
          New Password:
          <input type="password" id="newpw" />
          <font id='newpass' color='red'></font>
          </label>
          <label>
          Confirm Password:
          <input type="password" id="cnewpw" />
          <font id='cnewpass' color='red'></font>
          </label>
          <br/>
          </form>
          <div className="row column button-group">
            <button className="button" onClick={this.checkPw}> Submit </button>
            <button className="button secondary" onClick={this.cancelChangePw}>Cancel</button>
          </div>
        </div>

        <form>
            <div className="onoffswitch" style={{visibility : 'hidden'}}>
                <input type="checkbox" onClick={this.toggleCompSpecs} name="onoffswitch" className="onoffswitch-checkbox" id="toggle_privacy_compspecs"/>
                <label className="onoffswitch-label" htmlFor="toggle_privacy_compspecs">
                    <span className="onoffswitch-inner"></span>
                    <span className="onoffswitch-switch"></span>
                </label>
            </div>

            CPU: <br/>
            <label>{ipc.sendSync('hostStats')[3][0].model}</label>

            GPU: <br/>
            <div id="gpudiv">Loading GPU...</div><br/>


            Hard Drive: <br/>
            <label>hd</label>

            Keyboard: <br/>
            <label>kb</label>

            Mouse: <br/>
            <label>mouse</label>
        </form>

        <div className="row expanded button-group">
          <button className="button" onClick={this.saveCompSpecs}> Save </button>
        </div>

        <div className="row expanded button-group">
        <label>Primary Colour
            <input id="Primary" type="color" />
        </label>
        <label>Background Colour
            <input id="Background" type="color" />
        </label>
        <label>Secondary Colour
            <input id="Secondary" type="color" />
        </label>
        <button className="button" onClick={this.themeColour}> Submit </button>
        </div>

        <div className="row expanded button-group">
          <button className="button" onClick={this.checkValid}> Submit </button>
          <button className="button" onClick={this.resend} style={{display: this.state.is_verified?  'none':'block' }}>Resend Email Verification</button>
          <button className="button secondary" onClick={this.backToDashboard}>Back to Dashboard</button>
        </div>
      </div>

    );
  },

  saveCompSpecs() {
    var cpu = ipc.sendSync('hostStats')[3][0].model;
    console.log($("#gpusel").val())
    var gpu = $("#gpusel").val()
    var harddrive = 'hd';
    var keyboard = 'keyboard';
    var mouse = 'mouse';

    var token = electron.remote.getGlobal('sharedObject').token;
      $.post(api_server+"/login/load",
         {
             'token' :token
         }).done((d) => {
           $.ajax({
                   url:api_server+"/login/profile/saveCompSpecs",
                   type:"PUT",
                   data:{
                       _id:d._id,
                       cpu:cpu,
                       gpu:gpu,
                       harddrive:harddrive,
                       keyboard:keyboard,
                       mouse:mouse
                   }
               }).done((res)=>{
                   console.log("comp specs is updated");
               })
           }).fail((err)=>{
               console.log("Computer Specs is not updated in the server.");
               vex.dialog.alert({
                    message: "Computer Specs is not updated in the server.",
                    callback: function (value){
                        if (value) {
                          return;
                        }
                    }.bind(this)
                })
           });
  },

  themeColour() {
      var Primary = $("#Primary").val();
      var Background = $("#Background").val();
      var Secondary = $("#Secondary").val();
      $.each(primaryElements, function(index, value) {
          $(value).css("background-color", Primary);
      });
      $.each(backgroundElements, function(index, value) {
          $(value).css("background-color", Background);
      });
      $.each(secondaryElements, function(index, value) {
          $(value).css("background-color", Secondary);
      });
  },

  toggleAvatar() {
    var toggleEle = document.getElementById('toggle_privacy_avatar');
    if (toggleEle.getAttribute('checked') == 'checked') {
      toggleEle.removeAttribute('checked');
      this.setState({check: true});
    } else {
      toggleEle.setAttribute('checked', 'checked');
      this.setState({check: false});
    }
    var token = electron.remote.getGlobal('sharedObject').token;
      $.post(api_server+"/login/load",
         {
             'token' :token
         }).done((d) => {
           $.ajax({
                   url:api_server+"/login/profile/toggleAvatar",
                   type:"PUT",
                   data:{
                       _id:d._id,
                       privacy:this.state.check
                   }
               }).done((res)=>{
                   console.log("avatar's privacy is updated");
               })
           }).fail((err)=>{
              console.log("Avatar's privacy is not updated in the server.");
              vex.dialog.alert({
                    message: "Avatar's privacy is not updated in the server.",
                    callback: function (value){
                        if (value) {
                          return;
                        }
                    }.bind(this)
                })
              });
  },

  toggleAboutMe() {
    var toggleEle = document.getElementById('toggle_privacy_about_me');
    if (toggleEle.getAttribute('checked') == 'checked') {
      toggleEle.removeAttribute('checked');
      this.setState({check: true});
    } else {
      toggleEle.setAttribute('checked', 'checked');
      this.setState({check: false});
    }
    var token = electron.remote.getGlobal('sharedObject').token;
      $.post(api_server+"/login/load",
         {
             'token' :token
         }).done((d) => {
           $.ajax({
                   url:api_server+"/login/profile/toggleAboutMe",
                   type:"PUT",
                   data:{
                       _id:d._id,
                       privacy:this.state.check
                   }
               }).done((res)=>{
                   console.log("aboutme's privacy is updated");
               })
           }).fail((err)=>{
               console.log("About Me's privacy is not updated in the server.");
               vex.dialog.alert({
                    message: "About Me's privacy is not updated in the server.",
                    callback: function (value){
                        if (value) {
                          return;
                        }
                    }.bind(this)
                })
           });
  },

  toggleFName() {
    var toggleEle = document.getElementById('toggle_privacy_first_name');
    var toggleLNEle = document.getElementById('toggle_privacy_last_name');
    var token = electron.remote.getGlobal('sharedObject').token;
    //If at the time you clicked the toggle was public, it means you
    //want to make the field private and vise versa.
    //removeAttribute('checked') = true = private
    //setAttribute('checked', 'checked') = false = public
    if (toggleEle.getAttribute('checked') == 'checked' && toggleLNEle.getAttribute('checked') == 'checked') {
      //private and auto toggle last name's toggler
      toggleEle.removeAttribute('checked');
      toggleEle.checked = false;
      this.setState({FNCheck: true});
      toggleLNEle.removeAttribute('checked');
      toggleLNEle.checked = false;
      this.setState({LNCheck: true});
      $.post(api_server+"/login/load",
         {
             'token' :token
         }).done((d) => {
           $.ajax({
                   url:api_server+"/login/profile/toggleLastName",
                   type:"PUT",
                   data:{
                       _id:d._id,
                       privacy:this.state.LNCheck
                   }
               }).done((res)=>{
                   console.log("lastname's privacy is updated");
               })
           }).fail((err)=>{
               console.log("Last Name's privacy is not updated in the server.");
               vex.dialog.alert({
                    message: "Last Name's privacy is not updated in the server.",
                    callback: function (value){
                        if (value) {
                          return;
                        }
                    }.bind(this)
                })
           });
    }
    else if (toggleEle.getAttribute('checked') == 'checked') {
      //private
      toggleEle.removeAttribute('checked');
      toggleEle.checked = false;
      this.setState({FNCheck: true});
    } else if (toggleEle.getAttribute('checked') == null) {
      //public
      toggleEle.setAttribute('checked', 'checked');
      toggleEle.checked = true;
      this.setState({FNCheck: false});
    }
      $.post(api_server+"/login/load",
         {
             'token' :token
         }).done((d) => {
           $.ajax({
                   url:api_server+"/login/profile/toggleFirstName",
                   type:"PUT",
                   data:{
                       _id:d._id,
                       privacy:this.state.FNCheck
                   }
               }).done((res)=>{
                   console.log("firstname's privacy is updated");
               })
           }).fail((err)=>{
               console.log("First Name's privacy is not updated in the server.");
               vex.dialog.alert({
                    message: "First Name's privacy is not updated in the server.",
                    callback: function (value){
                        if (value) {
                          return;
                        }
                    }.bind(this)
                })
           });
  },

  toggleLName() {
    var toggleEle = document.getElementById('toggle_privacy_last_name');
    var toggleFNEle = document.getElementById('toggle_privacy_first_name');
    var token = electron.remote.getGlobal('sharedObject').token;
    if (toggleEle.getAttribute('checked') == 'checked') {
      //private
      toggleEle.removeAttribute('checked');
      toggleEle.checked = false;
      this.setState({LNCheck: true});
    } else if (toggleEle.getAttribute('checked') == null && toggleFNEle.getAttribute('checked') == null) {
      //public and auto toggling first name's toggler
      toggleEle.setAttribute('checked', 'checked');
      toggleEle.checked = true;
      this.setState({LNCheck: false});
      toggleFNEle.setAttribute('checked', 'checked');
      toggleFNEle.checked = true;
      this.setState({FNCheck: false});
      $.post(api_server+"/login/load",
         {
             'token' :token
         }).done((d) => {
           $.ajax({
                   url:api_server+"/login/profile/toggleFirstName",
                   type:"PUT",
                   data:{
                       _id:d._id,
                       privacy:this.state.FNCheck
                   }
               }).done((res)=>{
                   console.log("firstname's privacy is updated");
               })
           }).fail((err)=>{
               console.log("First Name's privacy is not updated in the server.");
               vex.dialog.alert({
                    message: "First Name's privacy is not updated in the server.",
                    callback: function (value){
                        if (value) {
                          return;
                        }
                    }.bind(this)
                })
           });
    } else if (toggleEle.getAttribute('checked') == null) {
      //public
      toggleEle.setAttribute('checked', 'checked');
      toggleEle.checked = true;
      this.setState({LNCheck: false});
    }
      $.post(api_server+"/login/load",
         {
             'token' :token
         }).done((d) => {
           $.ajax({
                   url:api_server+"/login/profile/toggleLastName",
                   type:"PUT",
                   data:{
                       _id:d._id,
                       privacy:this.state.LNCheck
                   }
               }).done((res)=>{
                   console.log("lastname's privacy is updated");
               })
           }).fail((err)=>{
               console.log("Last Name's privacy is not updated in the server.");
               vex.dialog.alert({
                    message: "Last Name's privacy is not updated in the server.",
                    callback: function (value){
                        if (value) {
                          return;
                        }
                    }.bind(this)
                })
           });
  },

  toggleBday() {
    var toggleEle = document.getElementById('toggle_privacy_birthday');
    if (toggleEle.getAttribute('checked') == 'checked') {
      toggleEle.removeAttribute('checked');
      this.setState({check: true});
    } else {
      toggleEle.setAttribute('checked', 'checked');
      this.setState({check: false});
    }
    var token = electron.remote.getGlobal('sharedObject').token;
      $.post(api_server+"/login/load",
         {
             'token' :token
         }).done((d) => {
           $.ajax({
                   url:api_server+"/login/profile/toggleBirthday",
                   type:"PUT",
                   data:{
                       _id:d._id,
                       privacy:this.state.check
                   }
               }).done((res)=>{
                   console.log("birthday's privacy is updated");
               })
           }).fail((err)=>{
               console.log("Birthday's privacy is not updated in the server.");
               vex.dialog.alert({
                    message: "Birthday's privacy is not updated in the server.",
                    callback: function (value){
                        if (value) {
                          return;
                        }
                    }.bind(this)
                })
           });
  },

  toggleEmail() {
    var toggleEle = document.getElementById('toggle_privacy_email');
    if (toggleEle.getAttribute('checked') == 'checked') {
      toggleEle.removeAttribute('checked');
      this.setState({check: true});
    } else {
      toggleEle.setAttribute('checked', 'checked');
      this.setState({check: false});
    }
    var token = electron.remote.getGlobal('sharedObject').token;
      $.post(api_server+"/login/load",
         {
             'token' :token
         }).done((d) => {
           $.ajax({
                   url:api_server+"/login/profile/toggleEmail",
                   type:"PUT",
                   data:{
                       _id:d._id,
                       privacy:this.state.check
                   }
               }).done((res)=>{
                   console.log("email's privacy is updated");
               })
           }).fail((err)=>{
               console.log("Email's privacy is not updated in the server.");
               vex.dialog.alert({
                    message: "Email's privacy is not updated in the server.",
                    callback: function (value){
                        if (value) {
                          return;
                        }
                    }.bind(this)
                })
           });
  },

  toggleCompSpecs() {
    var toggleEle = document.getElementById('toggle_privacy_compspecs');
    if (toggleEle.getAttribute('checked') == 'checked') {
      toggleEle.removeAttribute('checked');
      this.setState({check: true});
    } else {
      toggleEle.setAttribute('checked', 'checked');
      this.setState({check: false});
    }
    var token = electron.remote.getGlobal('sharedObject').token;
      $.post(api_server+"/login/load",
         {
             'token' :token
         }).done((d) => {
           $.ajax({
                   url:api_server+"/login/profile/toggleCompSpecs",
                   type:"PUT",
                   data:{
                       _id:d._id,
                       privacy:this.state.check
                   }
               }).done((res)=>{
                   console.log("comp specs privacy is updated");
               })
           }).fail((err)=>{
               console.log("Computer Specs privacy is not updated in the server.");
               vex.dialog.alert({
                    message: "Computer Specs privacy is not updated in the server.",
                    callback: function (value){
                        if (value) {
                          return;
                        }
                    }.bind(this)
                })
           });
  },

  resend(){
    var token = electron.remote.getGlobal('sharedObject').token;
      $.post(api_server+"/login/load",
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

  onAddchangeEmail() {
    var emailEdit = document.getElementById('emailEdit');
    emailEdit.removeAttribute('style');
    var emailButton = document.getElementById('emailButton');
    emailButton.setAttribute('style', 'display: none');
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

  cancelChangeEmail() {
    var emailEdit = document.getElementById('emailEdit');
    emailEdit.setAttribute('style', 'display: none');
    var emailButton = document.getElementById('emailButton');
    emailButton.removeAttribute('style');
  },

  onAddchangepw() {
    var passwordEdit = document.getElementById('passwordEdit');
    passwordEdit.removeAttribute('style');
    var passwordButton = document.getElementById('passwordButton');
    passwordButton.setAttribute('style', 'display: none');
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

  cancelChangePw() {
    var passwordEdit = document.getElementById('passwordEdit');
    passwordEdit.setAttribute('style', 'display: none');
    var passwordButton = document.getElementById('passwordButton');
    passwordButton.removeAttribute('style');
  },

  backToDashboard() {
  let MainWindow =  ReactDOM.render(
        <Dashboard />,
        document.getElementById('content'));
  },

  render() {
    var title = "Profile Edit \u2014 Gamempire"
    document.title = title
    document.getElementById('title').textContent = title

    //Removes all Active class from Menu
    $("#mySidenav>a.active").removeClass("active");
    $("#mySidenav>a").css("background-color", "");


    //Set Dashbaord as active in menu
    $( "#_ProfileEdit" ).addClass('active');

    if(this.state.response){
      return (

          <ReactGridLayout onLayoutChange={this.onLayoutChange} onBreakpointChange={this.onBreakpointChange}
              {...this.props}>
              { this.createProfile(this.state.items)}
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
        $.post(api_server+"/login/load",

            {
                'token' :token
            }).done((d)=> {
                $.ajax({
                        url:api_server+"/login/profile/update",
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
                                erroruname.innerHTML = "The username already exists.";
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
    var passwordEdit = document.getElementById('passwordEdit');
    var passwordButton = document.getElementById('passwordButton');

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
      $.post(api_server+"/login/load",
         {
             'token' :token
         }).done((d) => {
             $.post(api_server+"/login/profile/checkold", {
                _id:d._id,
                "password":oldpw
            }).done( (res) =>{
                passwordEdit.setAttribute('style', 'display: none');
                passwordButton.removeAttribute('style');
                erroroldpass.innerHTML ="";
                $.ajax({

                    url:api_server+"/login/profile/updatePW",
                    type:"PUT",
                    data:{
                        _id:d._id,
                        "password":newpw
                    }
                }).done((res2)=>{
                    this.onRemoveItem();

                });
            }).fail((err)=>{
                erroroldpass.innerHTML = "The old password does not match.";
            });
        });
    }
  },

  checkEmail(){
    var emailPattern = new RegExp('^[a-zA-Z0-9]{1,}@[a-zA-Z]{1,}[.]{1}[a-zA-Z]{1,}$');
    var email = $('#email').val();
    var errornewemail = document.getElementById('newemail');
    var emailEdit = document.getElementById('emailEdit');
    var emailButton = document.getElementById('emailButton');

    if (email == "") {
        errornewemail.innerHTML = "The field is empty.";
    } else if (!emailPattern.test(email)) {
        errornewemail.innerHTML = "Not correct email format";
    } else {
        errornewemail.innerHTML = "";
    }

    if(errornewemail.innerHTML == ""){
         var token = electron.remote.getGlobal('sharedObject').token;

        $.post(api_server+"/login/load",
            {
                'token' :token
            }).done((d) => {
                $.ajax({
                   url:api_server+"/login/profile/updateEmail",

                    type:"PUT",
                    data:{
                        _id:d._id,
                        "email":email
                        }
                    }).done((res)=>{
                      emailEdit.setAttribute('style', 'display: none');
                      emailButton.removeAttribute('style');
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
                        errornewemail.innerHTML = "The email already exists.";
                    });
            });
    }
  }
});
