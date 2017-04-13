var vex = require('vex-js')
vex.defaultOptions.className = 'vex-theme-os'
module.exports = global.Notepad = React.createClass({


  getDefaultProps() {
    return {};
  },


    componentDidMount: function(){
      console.log("Notepad App component did mount.");
    },

  getInitialState() {
    var id = electron.remote.getGlobal('sharedObject').id;
    var data = electron.remote.getGlobal('sharedObject').data;
    //const notepad ='58c32d942ca0d464773a4dbb';
    var notepadData = data["58c32d942ca0d464773a4dbb"];
    console.log(data["58c32d942ca0d464773a4dbb"]);

    return {
      data:data["58c32d942ca0d464773a4dbb"],
      id:id,

    };

  },

  edit(event){
    this.setState({data:event.target.value});
  },

  updatedata(){
            $.ajax({
                  url:api_server+"/login/profile/dataupload",
                  type:"PUT",
                  contentType: 'application/json; charset=utf-8',
                  data:JSON.stringify({
                    _id:this.state.id,
                    ref:"58c32d942ca0d464773a4dbb",
                    data:this.state.data
                    })
                    }).done((res)=>{

                      $.ajax({
                        url:api_server+'/login/profile/'+ this.state.id + '/info',
                        type:"GET"
                              }).done((res2)=>{

                        electron.remote.getGlobal('sharedObject').data=res2.data;

                      })
                      
                    }).fail((res)=>{
                        console.log("Notepad data upload failed.");
                        vex.dialog.alert({
                            message: 'Notepad data upload failed.',
                            callback: function (value){
                                if (value) {
                                  return;
                                }
                            }.bind(this)
                        })
                    });

  },

  render() {
    return (
    <textarea rows="4" value={this.state.data} onChange={this.edit} onBlur={this.updatedata} wrap="virtual" cols="20"></textarea>
    );
  }
});
