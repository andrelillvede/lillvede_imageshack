if (Meteor.isClient) {

	Meteor.startup(function(){
		Session.set('loading', true)
		Meteor.call('getImages', function(err, res){
			Session.set('images', res.images);
			Session.set('loading', false);
		})
	})

	Template.main.helpers({
		images: function () {
			return Session.get('images');
		},
		loading: function(){
			return Session.get('loading');
		}
	});
	Template.image.helpers({
		selected: function(){
			return lodash.find(Session.get('selectedImages'), { 'id': this.id });
		}
	});

	Template.postCode.helpers({
		selectedImages: function(){
			return Session.get('selectedImages');
		}
	});

	Template.main.events({
		'click button': function (e, tmpl) {
			var upload = tmpl.find('#upload');
			var file = upload.files[0];
			var reader = new FileReader();
			reader.onload = function() {
				var uploadsAB = new Uint8Array(reader.result);
				Meteor.call('file-upload', file, uploadsAB);
			};
			reader.readAsArrayBuffer(file);
		},
		'click img': function(){
			var selectedImages = Session.get('selectedImages') || [];

			if(lodash.find(selectedImages, { 'id': this.id })){
				lodash.remove(selectedImages, { 'id': this.id });
			}else{
				selectedImages.push(this);
			}

			Session.set('selectedImages', selectedImages);
		}
	});
}

if (Meteor.isServer) {
	var IS = new Imageshack(settings.username, settings.password, settings.apikey);
	Meteor.methods({
		'file-upload': function (fileInfo, fileData) {
			var buffer = new Buffer(fileData);
			console.log(IS.upload(buffer).result.images);
		},
		'getImages': function(){
			return IS.getUserImages('alsod', {limit: 100});
		}
	});

	Meteor.startup(function () {

	});
}
