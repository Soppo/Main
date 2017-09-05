var table = null;
var radioButtonId = "colorRadioButton";
var colorBlockId = "colorBlockId";
var pointsList = {

	Points: []
}
var loadedMap = [];

$(document).ready(
	
		function() {

		$("#submit").click(function () {

		   var countTr = parseInt($("#tr1").val());
		   var countTd = parseInt($("#td1").val());

		   $('#mapBlock').html("<table id='t1' class='table'></table>"); 

		      for (var i = 0; i < countTr; i++) {

	            $('#mapBlock #t1').append("<tr></tr>");
	           
	            for (var n = 0; n < countTd; n++) {    	        	
						
	                $('#mapBlock #t1 tr:last').append("<td>"+"</td>");                     
									
	            }

	        }

	        $("td").append('<div class="up"></div>');
	        $("td").append('<div class="down"></div>');
	        $("#t1").css("transform", "rotateX(180deg)");

	               

		    table = document.getElementById("t1");

		    var selectedColorModel = getSelectedColor();

		    if (table != null) {

		    	pointsList.Points = []; 

			    for (var i = 0; i < table.rows.length; i++) {


			        for (var j = 0; j < table.rows[i].cells.length; j++) {

			        	var regularPosition = new Position(i,j,-1); 			        	
			        	 
			        	pointsList.Points.push(regularPosition);			        					

			        	var createClickHandler = 
				            function(i,j,cell) 
				            {
				                return function() { 

                                   var selectedColorModel = getSelectedColor();
                                   var background = cell.style.backgroundColor;
                                   var up = cell.firstChild;
                                   var down = cell.lastChild;
                               
                               	   updateCellTypeBy(i,j, selectedColorModel.id);

                               	   cell.style.backgroundColor = selectedColorModel.color;	                                   
                                   up.style.borderBottomColor = selectedColorModel.color;	                                   
                                   down.style.borderTopColor = selectedColorModel.color;
   		
				                  };
				                  
				            };
			        	table.rows[i].cells[j].onclick = createClickHandler(i,j,table.rows[i].cells[j]); 			        	
			        } 
		 	    }
			}		                       
		});		

		generateButtons();

		populateList();

		$("td").click(function(){
			var selectedColorModel = getSelectedColor();
		});

		$(".settings-btn").click(function(){
			$(".settingsBlock").slideToggle(200);

		});

		$("#import").click(function(){
			loadedMap = loadFile();

			pointsList.Points = [];			

			var cols =  0, rows = 0;
			var length = loadedMap.length;
			var cellColor = [];
			
			for(var k = 0; k < length; k++){
				if(cols < loadedMap[k].y ){ cols = loadedMap[k].y }
				if(rows < loadedMap[k].x){ rows = loadedMap[k].x }	
				var regularPosition = new Position(loadedMap[k].x, loadedMap[k].y, loadedMap[k].cellType);	
				pointsList.Points.push(regularPosition);
				console.log(regularPosition);

				var color;
				switch(loadedMap[k].cellType){
					case -1: color = "#000"; cellColor.push(color); break;
					case 0: color = "#7a8984"; cellColor.push(color); break;
					case 1: color = "#66CC66"; cellColor.push(color); break;
					case 2: color = "#ecff52"; cellColor.push(color); break;
				}
					
			}
			console.log(cellColor);

			$('#mapBlock').html("<table id='t1' class='table'></table>"); 

			

		    for (var i = 0; i < rows+1; i++) {

	        	$('#mapBlock #t1').append("<tr></tr>");
	           
	            for (var n = 0; n < cols +1; n++) {    	        	
						
	                $('#mapBlock #t1 tr:last').append("<td>"+"</td>");
									
	            }
	        }

	        $("td").append('<div class="up"></div>');
	        $("td").append('<div class="down"></div>');
	        $("#t1").css("transform", "rotateX(180deg)");

	        table = document.getElementById("t1");

		    var selectedColorModel = getSelectedColor();

		    var cellCount = -1;

	        if (table != null) {
		    	
			    for (var i = 0; i < table.rows.length; i++) {


			        for (var j = 0; j < table.rows[i].cells.length; j++) {

			        	cellCount = cellCount+1;	        	

			        	var createClickHandler = 
				            function(i,j,cell) 
				            {
				                return function() { 

                                   var selectedColorModel = getSelectedColor();                                   
                                   var up = cell.firstChild;
                                   var down = cell.lastChild;
                               
                               	   updateCellTypeBy(i,j, selectedColorModel.id);

                               	   cell.style.backgroundColor = selectedColorModel.color;	                                   
                                   up.style.borderBottomColor = selectedColorModel.color;	                                   
                                   down.style.borderTopColor = selectedColorModel.color;
   		
				                  };
				                  
				            };
				        
			        	table.rows[i].cells[j].onclick = createClickHandler(i,j,table.rows[i].cells[j]); 
			        	

			        	function colorCell(){
			        		table.rows[i].cells[j].style.backgroundColor = cellColor[cellCount];
			        		table.rows[i].cells[j].firstChild.style.borderBottomColor = cellColor[cellCount];
			        		table.rows[i].cells[j].lastChild.style.borderTopColor = cellColor[cellCount];			        		
			        	};
			        	colorCell();			        	

			        } 
		 	    }
			}              
		})

		$("#generate").click(function () {
			
			generateJSONmap(pointsList);			

		});


	});

function populateList() {

	  	var colorContainer = document.getElementById("colorList");

		for (var i = 0; i < colorButtons.length; i++) {

			var node = colorButtons[i];

					var createClickHandler = 
				            function(i) 
				            {
				                return function() {

				                	if (i == 0) {

				                		//TODO show elements here
				                		
				                	} else {

					                	var was = colorButtons[0];
					                	var must = colorButtons[i];

					                	colorButtons[0] = must;
					                	colorButtons[i] = was;

					                	populateList();

					                	//TODO hide other elements here
				                	}
				                };
				            };

        	node.onclick = createClickHandler(i);

		  	colorContainer.appendChild(node);
		}
}

function updateCellTypeBy(x,y,cellType) {

	

	for (var i =0; i < pointsList.Points.length; i++) {

		var point = pointsList.Points[i];


		if (point.x == x && point.y == y)
			pointsList.Points[i].cellType = parseInt(cellType);;
	}
}

function generateJSONmap(mapArray) {

	fileName = "map.json";

	saveData(mapArray, fileName);
}

var saveData = (function () {

	var a = document.createElement("a");

	document.body.appendChild(a);
	a.style = "display: none";

	return function (data, fileName) {
		var json = JSON.stringify(data),
		blob = new Blob([json], {type: "octet/stream"}),
		url = window.URL.createObjectURL(blob);

		a.href = url;
		a.download = fileName;
		a.click();
		
		window.URL.revokeObjectURL(url);
	};
}());

function getSelectedColor() {

	var colorModel;

	var selectedColor = colorButtons[0].getElementsByTagName("div")[0].style.backgroundColor;
	var colorId = colorButtons[0].id;

	colorModel = new ColorModel(colorId,selectedColor);

	return colorModel;
}   


var colorButtons = [];

function generateButtons() {

  	var colorContainer = document.getElementById("colorList");

  	var wall = makeListItem(0, "Wall", "#7a8984", 0);
  	var free = makeListItem(1, "Free", "#66CC66", 1);
  	var def = makeListItem(-1, "Void", "#000", -1);
  	var loot = makeListItem(2, "Loot", "#ecff52", 2);

  	colorButtons = [wall, free, def, loot];
  	/*

	for (var i = 0; i < 2; i++) {

		var first_button = makeListItem(i, getRandomColor(), i);
	  	
	  	colorButtons[i] = first_button;
	}
	*/
}

function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

function makeListItem(id, text, colorHex, blockId) {

    var label = document.createElement("li");
    var block = document.createElement("div");

    block.id = "colorBlock";
    label.id = id;
    label.classList.add("list-group-item");

    block.style.backgroundColor = colorHex;

    label.appendChild(block);
    label.appendChild(document.createTextNode(text));

    return label;
  }	

function getRandomColor() {

    var letters = '0123456789ABCDEF';
    var color = '#';

    for (var i = 0; i < 6; i++ ) {
    
        color += letters[Math.floor(Math.random() * 16)];
    }
    
    return color;
}

function loadFile() {
    var input, file, fr, loadedMap;

    input = document.getElementById('fileinput');
    if (!input.files[0]) {
      alert("Please select a file before clicking 'Load'");
    }
    else {
      file = input.files[0];
      fr = new FileReader();
      fr.onload = receivedText;
      fr.readAsText(file);
      alert("loaded!")
    }

    function receivedText(e) {
      lines = e.target.result;
      var newArr = JSON.parse(lines); 
      loadedMap = newArr.Points;
      
    }
      return loadedMap;    
  }
  

class ColorModel {

	constructor(id, color) {
		this.id = id;
		this.color = color;
	}
}
 
class Position {

  constructor(x, y, cellType) {
    this.x = x;
    this.y = y;
    this.cellType = cellType;
  }
}