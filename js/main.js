// User code here

// HINT: start here: https://swapi.co/api/films/

$(document).ready(function() {
	var removeArray = [];
	var new_result = '';
	var dict = new Object();
	
	// displaying gilms on click of dropdown
	$(document).on('click', '#swFilms', function() {
		swurl = 'https://swapi.co/api/films/';
		$.ajax({
			url: swurl,
			dataType: "json",
			type: 'GET',
			success: function (data) {
				var ret = data['results'];
				new_result = ret.sort( sortBy("release_date") );
				var moviesArray = [];
				for(var i = 0; i < new_result.length; i++) {
					var jsonData = {};
					var obj = new_result[i];
					jsonData['id'] = i;
					jsonData['name'] = obj['title'];
					moviesArray.push(jsonData);
				}
				dropdown = $('.dropdown-menu');
				dropdown.empty();
				dropdown.prop('selectedIndex', 0);
				var data = '';
				$.each(moviesArray, function (key, entry) {
					data += '<li class="dd_option" id=' + entry['id'] + '><a href="#">' + entry['name'] + '</a></li>';
			  })
				dropdown.append(data);
			},
			error: function (error) {
				console.log('Error: ');
			},
		});
	});
	
	//displaying characters and spaceships on click of film name
	$(document).on('click', '.dd_option', function() {
		$('.char-table').empty();
		$('#swFilms').text($(this).text());
		$('#swFilms').append('  <span class="caret"></span>');
		var id = this.id;
		c_data = new_result[id];
		var characters = c_data['characters'];
		$.each(characters, function (i, item) {
			var name = '';
			var sship_url = [];
			var c_url = item;
			$.ajax({
				url: c_url,
				dataType: "json",
				type: 'GET',
				success: function (data) {
					name = data['name'];
					sship_url = data['starships'];
					var sname_array = [];
					if (!(name in dict)){

						$.each(sship_url, function (j, sship) {
							var s_name = '';
							$.ajax({
								url: sship,
								dataType: "json",
								type: 'GET',
								success: function (s_data) {
									s_name = s_data['name'];
									sname_array.push(s_name);
								},
								async: false
							});
						
						});
						dict[name] = sname_array;
					}
					if(!removeArray.includes(name)){
						displayList = $('.char-table');
						disp = '<tr><td class = ' + name +'>' + name + '<a href="#"><span class="glyphicon glyphicon-remove " id=' + name +'></span></a></td>';
						if(dict[name].length > 0)
							disp += '<td>' + dict[name] + '</td></tr>';
						else
							disp += '<td>' + 'No Starships' + '</td></tr>';
						displayList.append(disp);
					}
				},
				//async: false
			});
		});		
	});

	//removing character record from dsplayed list on click of red cross
	$(document).on('click', '.glyphicon-remove', function() {
		var id = this.id;
		var cls = '.'+id;
		var name = $(cls).text();
		removeArray.push(name);
		alert('This character will be removed from the future results!');
		$(this).closest('tr').remove();
	});
	
});//end of document

function sortBy(val){
   return function(a,b){
      if( a[val] > b[val]){
          return 1;
      }else if( a[val] < b[val] ){
          return -1;
      }
      return 0;
   }
}