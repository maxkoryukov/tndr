$(document).ready(function doc_ready(){

	var $form = $('form.main');

	$('.cl-create').click(function(){
		var $this = $(this);
		$this.addClass('tndr-load');
		$this.prop('disabled', true);

		var fdata = $form.serializeObject();

		console.log(fdata);

		$.ajax({
			//{{! TODO : url }}
			url: '/api/tender/',
			context: this,
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			method: 'POST',
			data: JSON.stringify({ "item": fdata }),
		})
			.always(function(){
				$(this).removeClass('tndr-load');
				$(this).prop('disabled', false);
			})
			.done(function(data){

				//{{! TODO: url }}
				var new_url = data.url || '/tender/';
				// redirect to the index
				window.location = new_url;

				showMessage(MSG.success, data.message);
			})
			.fail(function(data){
				console.error('CREATE fail', data);

				var resp = data.responseJSON;
				showMessage(MSG.error, resp.error);
			});
	});

	$form.find('.cl-save').click(function(){
		$(this).addClass('tndr-load');
		$(this).prop('disabled', true);

		var fdata = $form.serialize();

		$.ajax({
			//{{! TODO : url }}
			url: '/builder/',
			context: this,
			dataType: 'json',
			method: 'PUT',
			data: fdata
		})
			.always(function(){
				$(this).removeClass('tndr-load');
				$(this).prop('disabled', false);
			})
			.done(function(data){
				$('.modal').modal('hide');

				var b = data.data;

				showMessage(MSG.info, data.message);
				$form.find('.cl-cancel').click();
			})
			.fail(function(data){
				console.error('save fail', data);

				$('.modal').modal('hide');

				var resp = data.responseJSON;
				showMessage(MSG.error, resp.error);
			});

	});

});
