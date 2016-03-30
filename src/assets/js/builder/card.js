$(document).ready(function doc_ready(){

	$('.cl-delete').click(function(){
		var $this = $(this);
		$this.addClass('tndr-load');
		$this.prop('disabled', true);

		var bid = $this.data('builder');

		$.ajax({
			//{{! TODO : url }}
			url: '/builder/',
			context: this,
			dataType: 'json',
			method: 'DELETE',
			data: {
				id: bid,
			}
		})
			.always(function(){
				$(this).removeClass('tndr-load');
				$(this).prop('disabled', false);
			})
			.done(function(data){
				// redirect to the index
				//{{! TODO: url }}
				window.location = '/builder/index';

				showMessage(MSG.success, data.message);
			})
			.fail(function(data){
				console.error('delete fail', data);

				$('.modal').modal('hide');

				var resp = data.responseJSON;
				showMessage(MSG.error, resp.error);
			});
	});

	var $eform = $('.cl-builder-edit-main');

	$eform.find('.cl-save').click(function(){
		$(this).addClass('tndr-load');
		$(this).prop('disabled', true);

		var fdata = $eform.serialize();

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
				$eform.find('.cl-cancel').click();
			})
			.fail(function(data){
				console.error('save fail', data);

				$('.modal').modal('hide');

				var resp = data.responseJSON;
				showMessage(MSG.error, resp.error);
			});

	});

	$eform.find('.cl-cancel').click(function(){
		if (mode_create){
			window.history.back();
		} else {
			$eform.find('.cl-state-edit').hide();
			$eform.find('.cl-state-read').show();

			$eform.find('.cl-editable').prop('disabled', true);
		}
	});

	$eform.find('.cl-edit').click(function(){
			$eform.find('.cl-state-edit').show();
			$eform.find('.cl-state-read').hide();

			$eform.find('.cl-editable').prop('disabled', false);
	});

	$eform.find('.cl-create').click(function(){
		$(this).addClass('tndr-load');
		$(this).prop('disabled', true);

		var fdata = $eform.serialize();

		$.ajax({
			//{{! TODO : url }}
			url: '/builder/',
			context: this,
			dataType: 'json',
			method: 'POST',
			data: fdata
		})
			.always(function(){
				$(this).removeClass('tndr-load');
				$(this).prop('disabled', false);
			})
			.done(function(data){
				$('.modal').modal('hide');

				var b = data.data;

				//{{! TODO : url }}
				window.location = '/builder/' + b.id;
				showMessage(MSG.info, data.message);
			})
			.fail(function(data){
				console.error('create fail', data);
				$('.modal').modal('hide');


				var resp = data.responseJSON;
				showMessage(MSG.error, (resp && resp.error));
			});

	});

	// ======================================================
	// Employee stuff

	$('.cl-employee-add').click(function(){
console.debug('addfd');
	});

});
