/*objectives: write a simple jquery accordion plugin
	dependencies: jQuery library
	functionality:
		convert a set of headings(e.g. h3) and content containers(e.g. div) and turn it into an accordion
	$(collection_set_selector).accordify({params})
		options:
			header - element selector
			panel - element selector
			initial states: 
				openAll, closeAll, default (first open) - boolean
			multiple_open - panels can be opened independently

	
*/

;(function($){

	$.fn.accordify = function(options){
		//default options settings:
		var defaults = {
			header: 'h4',
			panel: 'div',
			initialState: 'firstOnly', //'allOpen' , 'allClosed'
			openMultiple: false, //multiple open is disabled by default
			toggleButtonClass: undefined, //this only works with openMultiple set to true
			toggleButtonText: 'Open/Close All',
			openAllButtonText: 'Open all panels',
			closeAllButtonText: 'Close all panels'
		};
		
		$.extend(defaults, options);
		

			

		//define variables
		var $collection = this,
			headers,
			panels,
			currentState; //defines class for currrent state of the accordion
			

		//a set of reusable functions:
		var showHideObj = {
			openPanel: function(panel){				
				panel.show(500)
					.attr('data-opened', true)
					.addClass('opened')
					.prev().addClass('open');
				panel.parent().attr('data-current-state','partialopen');
			},
			closePanel: function(panel){
				panel.hide(500)
					.attr('data-opened', false)
					.removeClass('opened')
					.prev().removeClass('open');
			},
			openCloseAllButton: function(){
				//append the toggle button	
				$collection.prepend('<a href="#" class="' +defaults.toggleButtonClass+ ' ' +currentState+ '"">' +defaults.toggleButtonText+ '</a>');

				//bind click event to button
				$('.' + defaults.toggleButtonClass).off('click')
												   .on('click', function(e){

														var $this = $(this);
														var $thisParent = $this.parent($collection);
														var $panelset = $thisParent.children(defaults.panel);
														
														//collection set - all closed or all open?
														if($thisParent.attr('data-current-state') == 'allopen'){
															//close all
															$panelset.hide(500).removeClass('opened')
															   .attr('data-opened', false);	
															$this.addClass('openall').text(defaults.openAllButtonText); 
															$thisParent.attr('data-current-state','allclosed');
														} else if($thisParent.attr('data-current-state') == 'allclosed'||$thisParent.attr('data-current-state') == 'partialopen'){
															//open all
															$panelset.show(500).addClass('opened')
															   .attr('data-opened', true);			
															$this.removeClass('openall').text(defaults.closeAllButtonText); 
															$thisParent.attr('data-current-state','allopen');
														}

														e.preventDefault();

												   });
			}

		};

		
		$collection.each(function(){
			//get headers and panels for each collection
			headers = $(this).find(defaults.header),
			panels = headers.next(defaults.panel);
			
			//warn if missing expected headers
			if(headers.length==0){
				console.warn('missing from the mark up - looking for accordion headers: ' +defaults.header);
				return;
			}

			
			//bind click to headers and call open and close functions:
			//(unbind the click event first, to prevent function firing twice)

			headers.off('click')
				   .on('click', function(){
						var $this = $(this);
						var $thisPanel = $this.next(defaults.panel);
						var $allSiblings = $this.siblings(defaults.panel);


						//if multiple open is enabled:
						if(defaults.openMultiple == true){
							//call open/close function
							if (!$thisPanel.hasClass('opened')){
								showHideObj.openPanel($thisPanel);
							} else {
								showHideObj.closePanel($thisPanel);
							}														
						} else {
							//multiple open is disabled
							//detect if a panel is open in the collection:
							if($thisPanel.hasClass('opened')){
								return;
							} else {								
								//close any siblings and open panel
								$allSiblings.hide(500)
										    .removeClass('opened')
										    .attr('data-opened', false);
								showHideObj.openPanel($thisPanel);
							}							
						
						} //end if/else

						//if toggle button: determine if the accordion is all open, partially open or all closed
						//and pdate current-state attribute + toggle button text
						if(defaults.toggleButtonClass !== undefined){
							currentState = (function(){
								if($allSiblings.hasClass('opened')){
									//partially or all open
									//test if all open:
									var openPanelsCount = $('.opened', $this.parent()).size();
									if(openPanelsCount == $allSiblings.size()){
										//set collection parent's current-state data attr to allopen
										$this.parent().attr('data-current-state','allopen')
													  .find('.' +defaults.toggleButtonClass).text(defaults.closeAllButtonText);										
									} else {
										//set collection parent's current-state data attr to partialopen
										$this.parent().attr('data-current-state','partialopen');
									}
								} else {
									//set collection parent's current-state data attr to allclosed
									$this.parent().attr('data-current-state','allclosed')
												  .find('.' +defaults.toggleButtonClass).text(defaults.openAllButtonText);
									
								}

							})();
						}

			});	//end bind clicks to headers			
			
	


		});
		

		

		//if the toggleButtonClass option has been set, run the function to open all/close all 
		if(defaults.toggleButtonClass !== undefined){
			defaults.openMultiple = true;
			showHideObj.openCloseAllButton();
		}
		
		

		//set the onload initial state:
		switch (defaults.initialState) {
			case 'firstOnly':
				//initial state = first open
				showHideObj.closePanel(panels);
				//open the first panel in each collection:
				$collection.each(function(){
					showHideObj.openPanel($(this).children('div:first'));

				});		
				$(this).attr('data-current-state','partialopen');;				
				break;

			case 'allOpen':
				showHideObj.openPanel(panels);
				$(this).attr('data-current-state','allopen');
				break;

			case 'allClosed':
				showHideObj.closePanel(panels);
				$(this).attr('data-current-state','allclosed');
				break;

			default:
				//maybe the firstOnly case should be here?
				//for now, a warning
				console.warn('invalid or no initial state has been defined');
		}

		
		


		//open panel via link?








	};//end of $.fn.accordify assignment

})(jQuery);








