module.exports = class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            renderChild: true,
            userName: null,
            password: null
        };
    }

    componentDidMount(){
      this.loadCheck();
      this.loadUsername();
      this.loadPassword();
      //this.setWindowsColours();

    }

    setWindowsColours(){
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
    }

    userSubmit(e) {
       if (e.key == 'Enter') {
         var psw = $("#passsword").val();
         var usr = $("#username").val();
         if (usr == "" || usr == null){
           $("#username").focus();
         }
         else if (psw == "" || psw == null){
           $("#passsword").focus();
         }else{

           $('#login').click();
         }
       }
    }

    passSubmit(e) {
       if (e.key == 'Enter') {
          $('#login').click();
       }
    }



     loadCheck() {
       if (localStorage.chkbx && localStorage.chkbx != '') {
           $('#remember_me').attr('checked', 'checked');
       } else {
           $('#remember_me').removeAttr('checked');
       }
     }

     loadUsername() {
       if (localStorage.chkbx && localStorage.chkbx != '') {
           $('#username').val(localStorage.usrname);
           this.setState({userName: localStorage.usrname})
       } else {
           $('#username').val('');
       }
     }

     loadPassword() {
       if (localStorage.chkbx && localStorage.chkbx != '') {
           $('#passsword').val(localStorage.pass);
           this.setState({password: localStorage.pass})
       } else {
           $('#passsword').val('');
       }
     }

    render() {
      document.getElementById('top_bar').style.visibility = "hidden";
       var title = "Login \u2014 Gamempire"
       document.title = title
       document.getElementById('title').textContent = title
         return (
           <div id="loginContainer" className="row align-center align-middle noselect">
           <div className="content-loading"></div>
               <div className="medium-6 large-6 column">
               <img className="gamEmpireLogo" src="../app/img/GamEmpireLogo.png" />
                   <div className="input-group required">
                       <input className="input-group-field noselect" type="text" id="username" placeholder="Username" onKeyPress={this.userSubmit.bind(this)} value={this.state.userName|| ''} onChange={(event)=> {this.setState({userName: event.target.value})}}/>
                       <span className="input-group-label">*</span>
                   </div>
                   <div className="input-group required">
                       <input className="input-group-field noselect" type="password" id="passsword" placeholder="Password" onKeyPress={this.passSubmit.bind(this)} value={this.state.password|| ''} onChange={(event)=> {this.setState({password: event.target.value})}}/>
                       <span className="input-group-label">*</span>
                   </div>
                   <center><div className="input-group-field" id="loginmsg"></div></center>
                   <hr/>
                   <input type="checkbox" value="remember-me" id="remember_me" /> Remember Me
                   <button className="button" id="login" onClick={this._handleLogin.bind(this)}>Login</button>
                   <button className="button secondary" onClick={this._handleRegistry.bind(this)}>Sign Up</button>
               </div>
               <script type="text/javascript">

               </script>
           </div>
         );
     }

    _handleLogin() {
      if ($('#remember_me').is(':checked')) {
        localStorage.usrname = $('#username').val();
        localStorage.pass = $('#passsword').val();
        localStorage.chkbx = $('#remember_me').val();
      } else {
        localStorage.usrname = '';
        localStorage.pass = '';
        localStorage.chkbx = '';
      }
      var user_id = this.state.userName;
      var pwrd = this.state.password;
      if (user_id == null || user_id == "" || pwrd == null || pwrd == "") {
        $("#loginmsg").html("All fields must be filled in.<button id='close' onclick='$(this).parent().hide();' ></button>");
        $("#loginmsg").addClass('label warning input-group-field');
        $("#loginmsg").addClass("shake");
        $("#loginmsg").show();
        setTimeout(function() {
          $("#loginmsg").removeClass("shake");
        },200);
        return false;
      }
      $( ".content-loading" ).css("display:block;");
      $( ".content-loading" ).show();

      $.post(api_server+'/login/find',
      {
        username:this.state.userName,
        password:this.state.password
      }).done((res) =>{
        $( ".content-loading" ).fadeOut( "slow" );
        var token = electron.remote.getGlobal('sharedObject').token = res;
        $.post(api_server+"/login/load",{
          'token': token
        }).done((d)=> {
          electron.remote.getGlobal('sharedObject').id=d._id;
          $.ajax({
            url:api_server+'/login/profile/'+ d._id + '/info',
            type:"GET"
          }).done((res2)=>{
            electron.remote.getGlobal('sharedObject').layout=res2.layout;
            electron.remote.getGlobal('sharedObject').username=res2.username;
            electron.remote.getGlobal('sharedObject').aboutme=res2.aboutme;
            electron.remote.getGlobal('sharedObject').widget=res2.widgets;
            electron.remote.getGlobal('sharedObject').avatar=res2.avatar;
            electron.remote.getGlobal('sharedObject').data=res2.data;

            $.ajax({
              url:api_server+"/login/pingstatus",
              type:"PUT",
              contentType: 'application/json; charset=utf-8',
              data:JSON.stringify({
                _id:electron.remote.getGlobal('sharedObject').id,
                status:"online",
              })
            }).done((res)=>{
              ipc.sendSync('loggedIn')
              document.getElementById('top_bar').style.visibility = "visible";
              ReactDOM.render(
                <SideBar />,
                document.getElementById('main-content')
              )

              //The <SideBar> loads a content div which will allow the screens to change while the sidebar remains untouched

              //Always alive content loads, and needs to be imediatley set to invisible.
              //currently displays white screen for split second when rendering the elements in sidebar.js
              //TODO: find faster way to way.
              document.getElementById('playgroundFrame').style.visibility = "hidden";
            }).fail((err)=>{
              console.log("status failed to update to the server.")
            })
          });
        })
      })

      .fail((res)=>{
        $( ".content-loading" ).hide();
        $("#loginmsg").html("Wrong Username or Password<button id='close' onclick='$(this).parent().hide();' >");
        $("#loginmsg").addClass('label warning');
        $("#loginmsg").addClass("shake");
        $("#loginmsg").show();
        setTimeout(function () {
          $("#loginmsg").removeClass("shake");
        },200);
      });
    }

    _handleRegistry() {
        ReactDOM.render(
        <Registration />,
        document.getElementById('main-content')
      )
    }
}
