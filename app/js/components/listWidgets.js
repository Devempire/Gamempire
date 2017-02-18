

class listWidgets {
	constructor() {
  	}

  	test(){
    	
    	console.log("hi");
    }
	
	Soundcloud() {
        return (
         <webview className='widget' src='https://soundcloud.com/charts/top'></webview>
       );
    }

    

}

module.exports = global.listWidgets = new listWidgets();
