module.exports = class Registration extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: null,
            lastName: null,
            userName: null,
            password: null,
            confirmPass: null,
            email: null,
            confirmEmail: null,
            birthday: moment().format('YYYY-MM-DD'),
        };

    }

    // dismiss() {
    //     this.props.unmountMe();
    // }

    render() {
      var title = "Sign up  \u2014 Gamempire"
      document.title = title
      document.getElementById('title').textContent = title

        return (


        <form style={{height: "auto"}} id="loginContainer" className="row align-center align-middle noselect">
            <div className="medium-6 large-6 column">
            <img className="gamEmpireLogo" src="../app/img/GamEmpireLogo.png" />
            <div id='user' className="validationError dropFade" style={{display: "none"}}></div>
                <div className="input-group required">
                    <input className="input-group-field noselect" required type="text" id="username" placeholder="Username" value={this.state.userName || ""}
                        onChange={(event) => {this.setState({userName: event.target.value})}}/>
                        <span className="input-group-label">*</span>
                </div>
                <div id='fname' className="validationError dropFade" style={{display: "none"}}></div>
                <div id='lname' className="validationError dropFade" style={{display: "none"}}></div>
                    <div className="input-group required">
                        <input className="input-group-field noselect" required type="text" id="firstName" placeholder="First Name" value={this.state.firstName || ""}
                        onChange={(event) => {this.setState({firstName: event.target.value})}}/>
                        <span className="input-group-label">*</span>
                        <input className="input-group-field noselect" required type="text" id="lastName" placeholder="Last Name" value={this.state.lastName || ""}
                        onChange={(event) => {this.setState({lastName: event.target.value})}}/>
                        <span className="input-group-label">*</span>
                    </div>
                <div id='pass' className="validationError dropFade" style={{display: "none"}}></div>
                <div className="input-group required">
                    <input className="input-group-field noselect" required type="password" id="passsword" placeholder="Password"  value={this.state.password || ""}
                        onChange={(event) => {this.setState({password: event.target.value})}}/>
                    <span className="input-group-label">*</span>
                </div>
                <div id='cpass' className="validationError dropFade" style={{display: "none"}}></div>
                <div className="input-group required">
                    <input className="input-group-field noselect" required type="password" id="confirmPasssword" placeholder="Confirm Password" value={this.state.confirmPass || ""}
                        onChange={(event) => {this.setState({confirmPass: event.target.value})}}/>
                    <span className="input-group-label">*</span>
                </div>
                <div id='emailmsg' className="validationError dropFade" style={{display: "none"}}></div>
                <div className="input-group required">
                    <input className="input-group-field noselect" required type="text" id="email" placeholder="Email" value={this.state.email || ""}
                        onChange={(event) => {this.setState({email: event.target.value})}}/>
                    <span className="input-group-label">*</span>
                </div>
                <div id='cemailmsg' className="validationError dropFade" style={{display: "none"}}></div>
                <div className="input-group required">
                    <input className="input-group-field noselect" required type="text" id="confirmEmail" placeholder="Confirm Email" value={this.state.confirmEmail || ""}
                        onChange={(event) => {this.setState({confirmEmail: event.target.value})}} />
                    <span className="input-group-label">*</span>
                </div>
                <div className="input-group required">
                    <input className="input-group-field noselect" required type="date" id="birthday" value={this.state.birthday||''}
                        onChange={(event) => {this.setState({birthday: moment(event.target.value).format('YYYY-MM-DD')})}}/>
                    <span className="input-group-label">*</span>
                </div>
                <center><div className="input-group-field" id="signupmsg"></div></center>
                <hr/>
                <button className="button" type="submit" onClick={this._checkValid.bind(this)}>Sign Up</button>
                <button className="button secondary" onClick={this._backToLogin.bind(this)}>Back to login</button>
            </div>

        </form>



        );
    }

    _checkValid(e) {
        e.preventDefault();
        var namePattern = new RegExp('^[a-zA-Z ]{1,}$');
        var userPattern = new RegExp('^[a-zA-Z0-9]{3,}$');
        //var passPattern = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$');
        var emailPattern = new RegExp('^[a-zA-Z0-9]{1,}@[a-zA-Z]{1,}[.]{1}[a-zA-Z]{1,}$');

        var fname = document.getElementById('fname');
        var lname = document.getElementById('lname');
        var user = document.getElementById('user');
        var pass = document.getElementById('pass');
        var cpass = document.getElementById('cpass');
        var email = document.getElementById('emailmsg');
        var cemail = document.getElementById('cemailmsg');

        if (this.state.firstName == null) {
             $("#fname").show();
            fname.innerHTML = "The field is empty. ";
        } else if (!namePattern.test(this.state.firstName)) {
             $("#fname").show();
            fname.innerHTML = "Names can only contain alphabets. ";
        } else {
            fname.innerHTML = "";
        }

        if (this.state.lastName == null) {
            $("#lname").show();
            lname.innerHTML = "The field is empty.";
        } else if (!namePattern.test(this.state.lastName)) {
            $("#lname").show();
            lname.innerHTML = "Names can only contain alphabets.";
        } else {
            lname.innerHTML = "";
        }

        if (this.state.userName == null) {
            $("#user").show();
            user.innerHTML = "The field is empty.";
        } else if (!userPattern.test(this.state.userName)) {
            $("#user").show();
            user.innerHTML = "Usernames must be at least 3 characters long and can only contain alphabets or digits.";
        } else {
            user.innerHTML = "";
        }

        if (this.state.password == null) {
            $("#pass").show();
            pass.innerHTML = "The field is empty.";
        } else if ((this.state.password).length < 6) {
            $("#pass").show();
            pass.innerHTML = "Passwords must be at least 6 characters long.";
        } else {
            pass.innerHTML = "";
        }

        if (this.state.confirmPass == null) {
            $("#cpass").show();
            cpass.innerHTML = "The field is empty.";
        } else if (this.state.password != this.state.confirmPass) {
            $("#cpass").show();
            cpass.innerHTML = "Passwords do not match.";
        } else {
            cpass.innerHTML = "";
        }

        if (this.state.email == null) {
            $("#emailmsg").show();
            email.innerHTML = "The field is empty.";
        } else if (!emailPattern.test(this.state.email)) {
            $("#emailmsg").show();
            email.innerHTML = "Invalid email.";
        } else {
            email.innerHTML = "";
        }

        if (this.state.confirmEmail == null) {
            $("#cemailmsg").show();
            cemail.innerHTML = "The field is empty.";
        } else if (this.state.email != this.state.confirmEmail) {
            $("#cemailmsg").show();
            cemail.innerHTML = "Emails do not match."
        } else {
            cemail.innerHTML = "";
        }

        if (fname.innerHTML == "" && lname.innerHTML == "" && user.innerHTML == ""
            && pass.innerHTML == "" && cpass.innerHTML == ""
            && email.innerHTML == "" && cemail.innerHTML == "") {

            this._register();

        }

    }

     _register(){

        $.post(api_server+'/user/add',

                {

                    username:this.state.userName,
                    password:this.state.password,
                    email:this.state.email,
                    firstname:this.state.firstName,
                    lastname:this.state.lastName,
                    birthday:this.state.birthday,


                }
        )
            .done((res) =>{

                this._backToLogin();
            })
            .fail((res)=>{
                    $("#signupmsg").html("Username or email already exists !<button id='close' onclick='$(this).parent().hide();' >");
                    $("#signupmsg").addClass('label warning');
                    $("#signupmsg").addClass("shake");
                    $("#signupmsg").show();
                    setTimeout(function () {
                        $("#signupmsg").removeClass("shake");
                    },200);
                    console.log("i am in trouble");
                        });

    }

    _backToLogin() {
        ReactDOM.render(
        <Login />,
        document.getElementById('main-content')
      );
    }

  }
