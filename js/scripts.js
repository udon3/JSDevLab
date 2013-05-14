/*
SUKO443.com
*/
//create namespace: check for variable/namespace existence. If already defined, use that instance, otherwise assign a new object literal to SUKO443
var SUKO443 = SUKO443 || {};
	
//SUKO443 GLOBAL VARIABLES........
var oldIE = false; //boolean


SUKO443.Utils = function(){
	/*
	Utility functionalities that can be used and reused in other functions
	**	isOldIE - feature detection for IE7 and 8
	**	ajaxLoad - load content from another page
	**
	**	
	*/

	/*
     *  feature detect to identify IE7 and 8
     *	uses jQuery.support to return boolean   
     *	//if (oldIE){console.log('the browser is IE7 or 8');}
     */
	var isOldIE= (function(){
		if(!jQuery.support.leadingWhitespace){
			oldIE = true;
		}		
	})();

	
	/**
     *  Updates the given string so the first character of each word is in uppercase
     *
     *  @param <String>     str (required)
     *                      String to be converted
     *
     *  @return <String>    Converted string
     */
    function _toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    /**
     *  Converts a number to contain commas in the thousands
     *
     *  @param <String/Number>  number (required)
     *                          String to be converted
     *
     *  @return <String>        Formatted number
     */
    function _numberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     *  Removes commas from a number
     *
     *  @param <String>     number (required)
     *                      String to be converted
     *
     *  @return <String>    Formatted number
     */
    function _stripCommasFromStringNumber(string) {
        return string.split(',').join('')
    }
	/*
	*	Function heading
	*	function description
	*/

	/*
	*	add content from another page with ajax .load()
	*	@params		source - str: path of original code to copy from (e.g. page.html #myContent)
	*				newLoc - selector: DOM element into which the new div and ajaxed content
	*				newDivId - str: new id name for the container div	
	*/
	var ajaxLoad = function(source, newLoc, newDivId){
		//add an element to insert content into
		$(newLoc).append('<div id="' +newDivId+ '"></div>');
		//ajax load content
		$('#'+newDivId).load(source);

		
	}

	//RETURN PUBLIC: return an object containing Utils' public methods and properties
	var uPublic = {
		ajaxLoad: ajaxLoad
	};
	return uPublic; 

}();


//add modules to SUKO443 namespace:
SUKO443.PageModules = function(){	
	/*
	*Functionalities that are commonly used on all pages:
	**	clearFieldOnFocus
	**	setLinkTarget - set target attr to open external and certain files in a new window
	**	printPage - adds a print button
	**	prepopulateEmail
	**	addSocialLinks
	*/
	//PROPERTIES............


	//METHODS...............

	/*
	*	Clear Form field on focus
	*	remove/add default text ofform field on focus/blur
	*	@param: 	fieldId - str: id of form element
	*/
	var clearFieldOnFocus = function(fieldId){
		var field = document.getElementById(fieldId);
		var defaultText = field.value;
        field.onfocus = function(){
            if(this.value == field.value){
            	this.value = '';
            }          	
        };
        field.onblur = function(){
            if(this.value == ''){
            	this.value = defaultText;
            }  
        }
	}
    
	
	/*
	*	Open external links and chosen file types (e.g. PDFs) in a new window
	*	set target="_blank" on external links & chosen filetypes
	*	add title attribute to inform users if none has been hard coded
	*/
	var setLinkTarget = function(){
		if (!document.getElementsByTagName) return;
		var links = document.getElementsByTagName("a");
		var newWinFileTypes = ['pdf','xls'];
		var hasTitle = true;
		var href, 
			fileName = '';
		//check whether a link href is external or a chosen file type
		var _checkLink = function(hrefStr, fileStr){
			if ((href.indexOf('http') !== -1)&&(href.indexOf(window.location.host) ==-1)){
				return true;
			} else {
				//check if file extention matches newWinFileTypes
				for(j=0; j<newWinFileTypes.length; j++){
					if (href.indexOf(newWinFileTypes[j]) !== -1) {
						//store file ext as uppercase string
						fileName = newWinFileTypes[j].toUpperCase();
						return true;
					} else {
						fileName = '';
					}
				}
			}	
			return;			
		};

		//iterate through all links in the document and run _checkLink
		for (var i=0; i<links.length; i++) {
			var href = links[i].getAttribute('href');
			fileName = '';
			//run the _checkLink function and set target if returning true
			if(_checkLink(href, fileName)){
				links[i].setAttribute('target','_blank');
				links[i].setAttribute('title','Opens ' +fileName+ ' in a new window');
			}
		}		
	};


	
	/*
	*	Print page function (jquery)
	*	append a print button to container element - print page or only the contents of container	
	*	printPage(selector [, boolean][, URL])
	*	@params		container (required): selector of the containing element to add button to
	*				printAll  : true (default): prints whole page
	*							false: prints only the contents of 'container'
	*							(Opens printWindow.html, which runs the script to fetch content from parent)
	*				newWinURL : URL string - path to html file
	*/
	var printPage = function(container, printAll, newWinURL){
		var printButton = '<button href="#" class="printButton">Print</button>';
		var variableName = container;
		$(container).prepend(printButton);
		$printButton = $('.printButton');

		if($printButton.length > 0){
			$printButton.on('click', function(e){
				if(printAll == true || printAll == undefined){
					window.print();
					return;
				} else {
					//open new window and load the contents of 'container'
					var printWindow = window.open(newWinURL,'printWindow','left=100,top=100,width=600px,height=600,scrollbars=yes,status=yes,toolbar=no,menubar=yes,location=yes',false);
					newWinURL = '';
					var contentFromParent = $(container).eq(0).html();

					//check if target html page is specified
					if((newWinURL == '')||(newWinURL == undefined)){
						//if not specified, add neccessary mark-up to new window document(copy from parent)
						//do the copying:
						var parentHeadContent = $('head').html();
						//do the writing:
						var newWinMarkUp = '<!DOCTYPE html><head>'+parentHeadContent+'<style>button.printButton {display:none;}</style></head><body>';
							newWinMarkUp += '<div id="wrap">';
							newWinMarkUp += contentFromParent;
							newWinMarkUp += '</div>';
							newWinMarkUp += '<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>'; //may be need another test to check if library is already inside the <head>?
							newWinMarkUp += '</body></html>';
						printWindow.document.write(newWinMarkUp);
					} else{						
						var newWinBody;

						//Ensure we access the new window object only when the onload is available in IE 
						//("IE doesn't return any status from window.open() which means you can open a page and try to access it BEFORE onload is available.")
				        function ieLoaded(){
				            newWinBody = printWindow.document.getElementsByTagName('body');
				            if (newWinBody[0]==null){
				                //page not yet ready
				                setTimeout(ieLoaded, 10);
				            } else {
				                printWindow.onload = function(){
				                    printWindow.document.getElementById('wrap').innerHTML = contentFromParent;          
				                }
				            }
				        }
				        IEloaded();
					}

					printWindow.focus();
					printWindow.print();
					//printWin.close();
				}
			});	
		}
	};
	
		

	/*
	*	Prepopulate email link
	*	Add simple content and current URL to email
	*	prepopulateEmail(selector, emailAddress, str, str)
	*	@param		linkCLass (required): selector of the email link 
	*
	*
	*/
	var prepopulateEmail = function(linkClass, options){	
    	var options = {
    		emailAddress: 'Email address here',
    		subject: 'Subject here',
    		message: 'Type your message'
    	};
    	var newEmailHref = 'mailto:';
    		newEmailHref += options.emailAddress;
    		newEmailHref += '?subject=' + options.subject;
    		newEmailHref += '&body=' + options.message;
    		newEmailHref += '%0D%0A%0D%0ALink:%20' + top.location.href;//HEX: %0D=carriage return, %0A=line feed
    	$(linkClass).attr('href', newEmailHref);

	};
	


/*
//social links
	var currentURL = window.location.href;
	var currentTitle = document.title;
	var linkedInURL ="http://www.linkedin.com/shareArticle?mini=true&url=" + currentURL + "&title=" + currentTitle;
	$('#social-links .linkedin').attr('href', linkedInURL);
*/


	//RETURN PUBLIC: public methods and properties
	var pPublic = {
		clearFieldOnFocus: clearFieldOnFocus,
		setLinkTarget: setLinkTarget,
		printPage: printPage,
		prepopulateEmail: prepopulateEmail
	};
	return pPublic; 

}();



//add modules to SUKO443 namespace:
SUKO443.Modules = function(){	
	/*
	Modular functionalities:
		overlays
		lightbox
		tabs
		sliders + faders
		ajax
	*/
	//module's methods and properties


	//PROPERTIES............


	//METHODS...............

	/*
	*	Function heading
	*	function description
	*/




	//RETURN PUBLIC: public methods and properties
	var mPublic = {
	};
	return mPublic; 

}();


//JQUERY DOM READY...........................
$(function() {
	if(document.getElementById('searchField')){
		SUKO443.PageModules.clearFieldOnFocus('searchField');
	}
		
	SUKO443.PageModules.printPage('.printable', false, 'printWindow.html');
	SUKO443.PageModules.prepopulateEmail('.email');
	SUKO443.PageModules.setLinkTarget();

	SUKO443.Utils.ajaxLoad('sitemap.html #sitemap', '#wrap>footer', 'fatFooterDiv');
	


});