var height = '',width = '';
/* <![CDATA[ */
$(document).ready(function(){	
	$('body').append('<div id="loading_ajax"><div><img src="'+BASE_URL+'/libs/img/ajax-loader.gif">Memuat...</div></div>');
	/* global ajax setup
	------------------------------------------------------------------------- */
	$.ajaxSetup({
		type: 'GET',
		datatype: 'json',
		timeout: 20000
	});
	$('#loading_ajax').ajaxStart(function() {	
		$(this).show();
	});
	$('#loading_ajax').ajaxStop(function() {
		$(this).hide();
		height = $('#dialog_modal').outerHeight();
		width = $('#dialog_modal').outerWidth();
		$('#dialog_modal').css({ 
			height: 'auto', 
			marginTop: '-' + ((height/2)+20) + 'px', 
			marginLeft: '-' + (width/2) + 'px' 
		});
	});

	/* dialog box
	------------------------------------------------------------------------- */
	dialog = {
		defaults: {
			autohide: false,
			buttons: {
				'Close': function() {
					dialog.hide();
				}
			}
		},
		init: function() {
			$('body').append('<div id="dialog_modal"><div id="dialog_modal_close">&times;</div><div id="dialog_modal_header"></div><div id="dialog_modal_status"></div><div id="dialog_modal_inner"></div></div><div id="dialog_modal_overlay"></div>');
			$('#dialog_modal_close').click(dialog.hide);
		},
		show: function(options) {
			var options = $.extend({}, this.defaults, options);
			switch (options.type) {
				case 'ajax':
					$.ajax({
						type: 'GET',
						datatype: 'html',
						url: options.url,
						success: function(data) {
							options.content = data;
							dialog._show(options);
						}
					});
					break;
				default:
					this._show(options);
					break;
			}
		},
		_show: function(options) {
			$('#dialog_modal_footer').remove();
			//membuat tombol footer otomatis
			if (options.buttons) {
				var lx;
				var l = 0;
				$('#dialog_modal').append('<div id="dialog_modal_footer"></div>');
				$.each(options.buttons, function(k, v) {
					if( l == 0 ) lx = 'l';
					else lx = 'r';
					$('<button class="button '+lx+' '+k.toLowerCase()+'"></button>').text(k).click(v).appendTo('#dialog_modal_footer');
					l++;
				});
			}

			$('#dialog_modal_overlay').fadeIn();
			$('#dialog_modal').fadeIn();
			$('#dialog_modal_header').html(options.title);
			$('#dialog_modal_inner').html(options.content);
			$('#dialog_modal_inner input:first').focus();
			if (options.autohide) {
				setTimeout(function() {dialog.hide();}, options.autohide);
			}
		},
		hide: function() {
			$('#dialog_modal').fadeOut(function() {
				$('#dialog_modal_header').html('');
				$('#dialog_modal_status').html('');
				$('#dialog_modal_inner').html('');
				$('#dialog_modal_footer').remove();
			});
			$('#dialog_modal_overlay').fadeOut();
		}
	};
	dialog.init();
	
	/* edit menu
	------------------------------------------------------------------------- */
	$('a#popup').click(function() {
		var button_footer;
		var url 	= $(this).attr('href');
		var type 	= $(this).attr('data-type');
		
		url = BASE_URL + '/' + url;
		if( type == 'add' ){
			button_footer = {
				'Add': function() {
					ajax_feedback(url,'');
				},
				'Cancel': dialog.hide
			};
		}else if( type == 'edit' ){
			button_footer = {
				'Edit': function() {
					ajax_feedback(url,'');
				},
				'Cancel': dialog.hide
			};
		}else if( type == 'confirm' ){
			button_footer = {
				'Yes': function() {
					ajax_feedback(url,'');
				},
				'No': dialog.hide
			};
		}else if( type == 'send' ){
			button_footer = {
				'Send': function() {
					ajax_feedback(url);
				},
				'Cancel': dialog.hide
			};
		}else if( type == 'show' ){
			button_footer = '';
		}
		
		dialog.show({
			title: $(this).attr('title'),
			type: 'ajax',
			url: url,
			buttons: button_footer
		});
		return false;
	});
	function ajax_feedback(url, val ){
		
		if( $('#dialog_modal form').attr('action') ) 
			url = $('#dialog_modal form').attr('action');
		
		$.ajax({
			type: 'POST',
			url: url,
			data: $('#dialog_modal form').serialize() + val,
			error: function(data) {		
				console.log(data);		
				$('<span id="error"></span>')
				.text('Failed to execution this data, please check your ajax file.')
				.prependTo('#dialog_modal_status')
				.delay(1000)
				.fadeOut(1000, function(){
					//document.location.reload();
					$(this).remove();
				});
			},
			success: function(data) {				
				var fld = 0, msg = '',cls = 'error';
				
				if( data.msg ) msg = data.msg;
				if( data.status == 1 ) cls = 'success';
				else if( data.status == 2 ) cls = 'message';
				else if( data.status == 3 ) cls = 'error';
				else{
					fld = 1;
					cls = 'error';
					msg = 'Failed to explode this data, please check your ajax file.';
				}
				
				console.log(data);
				
				$('<div id="'+cls+'"></div>')
				.text(msg)
				.prependTo('#dialog_modal_status')
				.delay(1000)
				.fadeOut(1000, function(){
					
					if( cls != 'error' && fld != 1 )
					document.location.reload();
					
					$(this).remove();
				});
			}
		})
	}

});
/* ]]> */