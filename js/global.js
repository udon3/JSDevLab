$(document).ready(function(){


	//IE only:
	var notIE= jQuery.support.leadingWhitespace;	
	if (notIE == false){
		$('#primary-nav li').last().addClass('last');
		$('#footer-nav li').last().addClass('last');
		$('.business-nav ul li').last().addClass('last');
		
	}

	//print link
	$('#tools').prepend('<a class="print" href="#">Print</a>');
	$('#tools a.print').click(function() {
		window.print();
		return false;
	});

	


	//social links
	var currentURL = window.location.href;
	var currentTitle = document.title;
	var linkedInURL ="http://www.linkedin.com/shareArticle?mini=true&url=" + currentURL + "&title=" + currentTitle;
	$('#social-links .linkedin').attr('href', linkedInURL);



    //prepop'd email link
    var $newEmailURL = 'mailto:email@address.com?subject=My SUbject Title&body=You may be interested in this: ' + currentURL;
    $('.email').attr('href', $newEmailURL);
	
	
	//iPad test
	var isiPad = navigator.userAgent.match(/iPad/i) != null;
	


//open all external links in new window (except the absolute ones on current domain)
    $("a[href^='http:']:not([href*='" + window.location.host + "'])").each(function () {
        $(this).attr("target", "_blank").attr("title", "Opens external webpage in a new window");
    })
    //open all pdf documents in a new window
    $('a[href$=".pdf"]').each(function () {
        $(this).attr("title", "Opens PDF in a new window").click(function () {
            window.open(this.href);
            return false;
        });

    });

//search form field
    $('.search-text').focus(function () {
        this.value = '';
    });
    $('.search-text').blur(function () {
        if (this.value == '') {
            this.value = 'Search';
        }
    });

//set targetting on external links & chosen filetypes
    $('a').each(function (i) {

        // links to filetypes to this array will open in a blank window
        var fileTypes = new Array('pdf', 'mov');

        var checkLink = function (str) {
            if (str.indexOf('://') != (-1)) {
                return true;
            }
            for (i = 0; i < fileTypes.length; i++) {
                if (str.indexOf('.' + fileTypes[i]) == str.length - (fileTypes[i].length + 1)) {
                    return true;
                }
            }
            return false;
        }

        if (checkLink($(this).attr('href'))) {
            if (!$(this).attr('target')) {
                $(this).attr('target', '_blank');
            }
        }
    });
	
	//open all pdf documents in a new window and add title attr to links
    $('a[href$=".pdf"]').each(function () {

        //for the toolbar pdf icon
        if ($(this).parent("li").attr("id") == "liCreateThisPagePDF") {
            $(this).attr("title", "Opens PDF of page in a new window");
            $(this).attr("target", "_blank");
        }
        //for all the rest of pdf download links on the site
        else {
            $(this).attr("title", "Opens PDF in a new window");
            $(this).attr("target", "_blank");
        }

    });
	
	
	
	
	
	});// close document.ready