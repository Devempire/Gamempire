var WidthProvider = require('react-grid-layout').WidthProvider;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

const originalLayouts = getFromLS('layouts') || {};

module.exports = global.ProfileEdit = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      className: "layout",
      cols: {lg: 12, md: 12, sm: 12, xs: 4, xxs: 4},
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
      birthday:null

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


                this.setState({response: res,
                                username:res.username,
                                firstname:res.firstname,
                                lastname:res.lastname,
                                birthday:res.dateofbirth
                });
                console.log(this.state.response);
        });
    });
  },

  componentWillMount: function(){
    this.loadProfile();
  },

  createProfile(el) {

    var i = el.i;
    return (
      <div key={i} data-grid={el} className="noselect">
        <h3> Edit Your personal Info</h3>
        <hr/>
        <input className='profilepic' id='profilepic' type='image' onClick={this.openFileExp} src={'./../app/img/GamEmpireLogo.png'} draggable="false"/>
        <input className='uploadedpic' onChange={this.uploadPic} id='uploadedpic' type='file' accept="image/*"/>
        <br></br>
        <font id='uploadmsg' color='red'></font>

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

  openFileExp() {
    $("input[id='uploadedpic']").click();
  },

  uploadPic() {

    let option1 = {
      type: 'info',
      buttons: ['Yes'],
      title: 'Update profile picture',
      message: "Successfully updated.",
      defaultId: 0,
      cancelId: 0
    };

    let option2 = {
      type: 'info',
      buttons: ['Yes'],
      title: 'Update profile picture',
      message: "Upload failed.",
      defaultId: 0,
      cancelId: 0
    };

    var pic = document.getElementById("uploadedpic").files;
    if (pic.length != 0) {
      document.getElementById("profilepic").src = pic[0].path;
    }

    // var pic = document.getElementById("uploadedpic").files;
    // console.log(pic);
    // if (pic.length != 0) {
    //   document.getElementById("profilepic").src = pic[0].path;
    //   var image = fs.readFileSync(pic[0].path);
    //   var token = electron.remote.getGlobal('sharedObject').token;
    //        $.post( "http://localhost:8080/user/load",
    //           {
    //               'token' :token
    //           }).done((d)=> {
    //               $.ajax({
    //                       url:"http://localhost:8080/user/profile/updatePic",
    //                       type:"PUT",
    //                       data:{
    //                           _id:d._id,
    //                           "img":pic[0].path
    //                       }
    //                   }).done((res)=>{
    //                       dialog.showMessageBox(option1);
    //                   }).fail((err)=>{
    //                       dialog.showMessageBox(option2);
    //                   });
    //               });
    // }
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
          <ResponsiveReactGridLayout onLayoutChange={this.onLayoutChange} onBreakpointChange={this.onBreakpointChange}
              {...this.props}>
              { this.createProfile(this.state.items)}
              {_.map(this.state.pw, this.changePW)}
              {_.map(this.state.email, this.changeEmail)}
          </ResponsiveReactGridLayout>
        </div>
      );
    }else{
        return (<div> Loading</div>);
    }
  },

  checkValid() {

      let option1 = {
          type: 'info',
          buttons: ['Yes'],
          title: 'Update personal info',
          message: "Successfully updated.",
          defaultId: 0,
          cancelId: 0
      };

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
                                  dialog.showMessageBox(option1);
                              }).fail((err)=>{
                                  erroruname.innerHTML = "Username already exist!";
                              });
                          });
      }
  },

    checkPw(){

        let option1 = {
          type: 'info',
          buttons: ['Yes'],
          title: 'Update Password',
          message: "Successfully updated!",
          defaultId: 0,
          cancelId: 0
        };
        var passPattern = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$');
        var newpw = $('#newpw').val();
        var oldpw =$('#oldpw').val();
        var cnewpw=$('#cnewpw').val();
        console.log(newpw,oldpw,cnewpw);
        var errornewpass = document.getElementById('newpass');
        var erroroldpass = document.getElementById('oldpass');
        var errorcnewpass = document.getElementById('cnewpass');
        if (newpw == "") {
            errornewpass.innerHTML = "The field is empty.";
        } else if (!passPattern.test(newpw)) {
            errornewpass.innerHTML = "At least 6 length (1 Upper & 1 Lower letter & 1 digits)";
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
                            dialog.showMessageBox(option1);
                            this.onRemoveItem();

                        });
                    }).fail((err)=>{
                        erroroldpass.innerHTML = "The old password not match.";
                    });
                });

        }


    },

    checkEmail(){

        let option1 = {
          type: 'info',
          buttons: ['Yes'],
          title: 'Update Email',
          message: "Successfully updated!",
          defaultId: 0,
          cancelId: 0
        };
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
                            dialog.showMessageBox(option1);
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
