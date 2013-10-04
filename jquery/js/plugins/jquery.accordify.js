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

	initialise: 
	$('.accordionWrapper').accordify({
		header: 'h3',
		panel: 'div',
		openAll: true,
		openMultiple: true
	})
*/

(function($){

	$.fn.accordify = function(options){
		//default options settings:
		var defaults = {
			header: 'h4',
			panel: 'div',
			initialState: 'firstOnly', //'allOpen' , 'allClosed'
			openMultiple: true,
			toggleButtonClass: undefined //this only works with openMultiple set to true
		}
		$.extend(defaults, options);
		
		//define variables
		var $collection = this;
		var headers,
			panels;
		//console.log($collection[0]);
		$collection.each(function(i){
			//get headers and panels for each collection
			headers = $collection.find(defaults.header),
			panels = headers.next(defaults.panel);
			
			//warn if missing expected headers
			if(headers.length==0){
				console.warn('missing from the mark up - looking for accordion headers: ' +defaults.header);
				return;
			}

			console.log(this, this.headers);//#accordion1, 2 and 3


			//multiple open is enabled by default. If disabled, panels can only close a panel when another is opened within the same collection): 
			
			//bind click to headers and call open and close functions:
			//(unbind the click event first, to prevent function firing twice)

			headers.off('click')
				   .on('click', function(){
						var $this = $(this);
						var $thisPanel = $this.next(defaults.panel);

						//if multiple open is enabled:
						if(defaults.openMultiple == true){
							//call open/close function
							if(!$thisPanel.hasClass('opened')){
								openPanel($thisPanel);
							} else {
								closePanel($thisPanel);
							}
							
							
						} else {
							//multiple open is disabled
							//detect if a panel is open in the collection:

							//the header of the currently open panel is unclickable:
							if($thisPanel.hasClass('opened')){
								return;
							} else {								
								//close any siblings and open panel
								$this.siblings(defaults.panel).hide(500)
																.removeClass('opened')
																.attr('data-opened', false);
								openPanel($thisPanel);
							}

							
						
						}
			});	//end bind clicks to headers			
			
			


		});
		

		//open segment
		function openPanel(panel){ 
			//console.log('openpanel running');
			panel.show({
						duration: 500,
						complete: function(){ 

						}
					})
				.attr('data-opened', true)
				.addClass('opened');
		}

		//close segment
		function closePanel(panel){
			panel.hide({
						duration: 500,
						complete: function(){ 

						}
					})
				.attr('data-opened', false)
				.removeClass('opened');
		}
		//open all 
		function openAll(){
			headers.each(function(){
				$(this).addClass('open');
			});
			panels.each(function(){
				openPanel($(this));
				$(this).addClass('opened')
					   .attr('data-opened', true);
			});
			console.log(panels);
			
		}
		// close all
		function closeAll(){
			headers.each(function(){
				$(this).removeClass('open');
			});
			panels.each(function(){
				closePanel($(this));
				$(this).removeClass('opened')
					   .attr('data-opened', false);
			});
		}


		//if the toggleButtonClass option has been set, run the function to open all/close all 
		if(defaults.toggleButtonClass !== undefined){
			//console.log('toggle button enabled');
			console.log($collection);
			openCloseAllButton();
		}
		//open all/close all button
		function openCloseAllButton(){
			//append the toggle button
			$collection.prepend('<a href="#" class="'+defaults.toggleButtonClass+' openall" >Open all</a>');

			//bind click event to button
			$('.' + defaults.toggleButtonClass).on('click', function(e){
				var $this = $(this);
				var $panelset = $this.parent($collection).children(defaults.panel);
				
				//first time click should open all 
				if($this.hasClass('openall')){
					$panelset.show(500).addClass('opened')
					   .attr('data-opened', true);;					
					$this.removeClass('openall').text('Close all');
				} else {
					$panelset.hide(500).removeClass('opened')
					   .attr('data-opened', false);;
					$this.addClass('openall').text('Open all');
				}
				e.preventDefault();

			});
		}

		//set the onload initial state:
		switch (defaults.initialState) {
			case 'firstOnly':
				//initial state = first open
				closeAll();
				//open the first panel in each collection:
				$collection.each(function(){
					openPanel($(this).children('div:first'));

				});
				break;

			case 'allOpen':
				openAll();
				break;

			case 'allClosed':
				closeAll();				
				break;

			default:
				//maybe the firstOnly case should be here?
				//for now, a warning
				console.warn('invalid or no initial state has been defined');
		}

		
		










	};//end of $.fn.accordify assignment

})(jQuery);








