function clicktest(){
  alert("Is Clicked!");
}

//ondevice ready events-------------------------------------------------------------
  document.addEventListener("deviceready", onDeviceReady, false);
  
  function onDeviceReady() {
      //inital the Config_Page-----------------------------------
      // var geo=JSON.parse(window.localStorage.getItem('geo'));
      // var local_geo_position=JSON.parse(window.localStorage.getItem('local_geo_position'));

      // if (local_geo_position!=null)
      //   geo_num=local_geo_position.length;
      // else
      //   geo_num=0;

      // alert(document.getElementById('stored_geo').innerHTML);

      // if (local_geo_position!=null){
      //   for (var i=0;i<local_geo_position.length;i++){
      //     document.getElementById('stored_geo').innerHTML=document.getElementById('stored_geo').innerHTML+" <a onclick='activation(this)'><div id="+(i+1).toString()+" class='geo_item'></div> </a>"
      //     document.getElementById((i+1).toString()).innerHTML="<h1>"+local_geo_position[i].store_name+"</h1>";
      //   }
      // }
      // alert(document.getElementById('stored_geo').innerHTML);

  }

  $( document ).ready(function() {

      //inital the Config_Page-----------------------------------
      var geo=JSON.parse(window.localStorage.getItem('geo'));
      var local_geo_position=JSON.parse(window.localStorage.getItem('local_geo_position'));

      if (local_geo_position!=null)
        geo_num=local_geo_position.length;
      else
        geo_num=0;

      if (local_geo_position!=null){
        for (var i=0;i<local_geo_position.length;i++){
          document.getElementById('stored_geo').innerHTML=document.getElementById('stored_geo').innerHTML+" <a onclick='activation(this)'><div id="+(i+1).toString()+" class='geo_item'></div> </a>"
          document.getElementById((i+1).toString()).innerHTML="<h1>"+local_geo_position[i].store_name+"</h1>";
        }
      }
    console.log( "ready!" );
    var HEIGHT = $('body').height();
    var ini_h= $(window).height();
    var ini_w= $(window).width();
    console.log("height is "+ini_h);
    console.log("width is "+ini_w);

    document.getElementById('body').style.height=ini_h.toString()+"px";
    document.getElementById('body').style.width=ini_w.toString()+"px";
    // $(window).resize(function() {
    //         document.getElementById('body').style.height=HEIGHT.toString()+"px";
    // });
  })
//end ondevice ready events-------------------------------------------------------------

//Code About Map-----------------------------------------------
        var ini_longitude=-150.109291;
        var ini_latitude=62.323907;
        var map;
        var label="picture";
        var overlays=[];
        var overlays_icon=[];
        var chosen_overlay=null;

        var bound_x1=[];
        var bound_x2=[];
        var bound_y1=[];
        var bound_y2=[];

        USGSOverlay.prototype = new google.maps.OverlayView();
        google.maps.event.addDomListener(window, 'load', initMap);
        // Function to Initialise the Map
        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
              zoom: 15,
              center: {lat: 62.323907, lng: -150.109291},
            });
            map.addListener("projection_changed", drawonMap);
            google.maps.event.addListener(map,'zoom_changed', function() {
              var zoom =  map.getZoom();
              console.log('zoom is '+ zoom);
                if (zoom<=14 && label=="picture")
                {
                  alert('label changed');
                  //alert(overlays.length);
                  console.log(overlays);
                  label="icon";

                  for (var i=0;i<overlays.length;i++){
                    overlays[i].setMap(null);
                    overlays_icon[i].setMap(map);}
                }

                if (zoom>14 && label=="icon")
                {
                  alert('label changed');
                  label="picture";
                  for (var i=0;i<overlays.length;i++){
                    overlays[i].setMap(map);
                    overlays_icon[i].setMap(null);}
                }
            });
        }
        
        function refreshMap(picture_object){
            alert('refreshing Map');
            //Retrieve From the Local Storage
            var storage = window.localStorage;
            var json_data = storage.getItem('data');
            var json_album_data=storage.getItem('album_data');

            if (json_data!=null)
                var data=JSON.parse(json_data);
            else
                var data=[];

            if (json_album_data!=null)
                var album_data=JSON.parse(json_album_data);
            else
                var album_data=[];


            var current_map_album=album_data[picture_object.album];
            var determinant = current_map_album.photos.length;
            var album_bound = new google.maps.LatLng(current_map_album.lat,current_map_album.lon);

            var bound1=anotherbound(album_bound,0.1*determinant);
            var bound2=anotherbound(bound1,0.5);
            var bounds=new google.maps.LatLngBounds(bound1,bound2);
            var srcImage=picture_object.URL;
            var pic_id=picture_object.id;
            var overlay = new USGSOverlay(bounds, srcImage, map,pic_id,overlays.length);

            var overlay_icon=new google.maps.Marker({
                    position: bound1,
                    map: map,
                    title: 'Zoom in!'
                  });
            overlay_icon.setMap(null);

            overlays_icon.push(overlay_icon);
            overlays.push(overlay);


            if (bound1!=null)
                map.setCenter(bound1);
        }

        function drawonMap(){
            //test overlay
              // var bound1=new google.maps.LatLng(ini_latitude,ini_longitude);
              // var bound2=anotherbound(bound1,0.5);
              // var bounds=new google.maps.LatLngBounds(bound1,bound2)
              // var overlay = new USGSOverlay(bounds, 'img/test.png', map);
              // overlays.push(overlay);

              // var overlay_icon=new google.maps.Marker({
              //     position: bound1,
              //     map: map,
              //     title: 'Zoom in!'
              //   });

              // overlay_icon.setMap(null);
              // overlays_icon.push(overlay_icon);

              // bound_x1.push(Math.max(overlays[0].bounds_.b.b,overlays[0].bounds_.b.f));
              // bound_x2.push(Math.min(overlays[0].bounds_.b.b,overlays[0].bounds_.b.f));

              // bound_y1.push(Math.max(overlays[0].bounds_.f.f,overlays[0].bounds_.f.b));
              // bound_y2.push(Math.min(overlays[0].bounds_.f.f,overlays[0].bounds_.f.b));

              // console.log(bound_x1);
              // console.log(bound_x2);
              // console.log('width is '+ (bound_x2-bound_x1).toString());
              // console.log(bound_y1);
              // console.log(bound_y2);
              // console.log('height is '+ (bound_y2-bound_y1).toString());


            //inital the overlay
            var storage = window.localStorage;
            var json_data = storage.getItem('data');
            var json_album_data=storage.getItem('album_data');

            if (json_data!=null)
                var data=JSON.parse(json_data);
            else
                var data=[];

            if (json_album_data!=null)
                var album_data=JSON.parse(json_album_data);
            else
                var album_data=[];

            for (var v=0;v<album_data.length;v++){
              var current_map_album=album_data[v];
              var determinant = current_map_album.photos.length;
   
              var album_bound = new google.maps.LatLng(current_map_album.lat,current_map_album.lon);
              var current_photo;
              var bound1;
              var bound2;
              var bounds;
              var srcImage;
              var pic_id;
              for (var i=0;i<determinant;i++){
                current_photo=data[current_map_album.photos[i]];
                bound1=anotherbound(album_bound,0.1*i);
                bound2=anotherbound(bound1,0.5);
                bounds=new google.maps.LatLngBounds(bound1,bound2);
                srcImage=current_photo.URL;
                pic_id=current_photo.id;

                var overlay = new USGSOverlay(bounds, srcImage, map,pic_id,overlays.length);
              
                var overlay_icon=new google.maps.Marker({
                      position: bound1,
                      map: map,
                      title: 'Zoom in!'
                    });
                overlay_icon.setMap(null);
                overlays_icon.push(overlay_icon);
                overlays.push(overlay);
              }              
            }

            if (bound1!=null)
                map.setCenter(bound1);
        }


        //function to initialise a overlay-----------------------------------------------
        /** @constructor */
        function USGSOverlay(bounds, image, map, pic_id,overlay_id) {

            // Initialize all properties.
            this.bounds_ = bounds;
            this.image_ = image;
            this.map_ = map;
            this.id=pic_id;
            this.overlay_id=overlay_id;

            // Define a property to hold the image's div. We'll
            // actually create this div upon receipt of the onAdd()
            // method so we'll leave it null for now.
            this.div_ = null;

            // Explicitly call setMap on this overlay.
            this.setMap(map);
        }

          /**
           * onAdd is called when the map's panes are ready and the overlay has been
           * added to the map.
           */
        USGSOverlay.prototype.onAdd = function() {

            var div = document.createElement('div');

            div.style.border='solid 0.5em blue';
            div.style.borderImage= 'url(img/border.png) 30 round';
            div.style.position = 'absolute';
            google.maps.event.addDomListener(div, 'click', change_overlap);
            div.setAttribute('overlay_id',this.overlay_id.toString());
            div.setAttribute('pic_id',this.id)
            // Create the img element and attach it to the div.
            var img = document.createElement('img');
            img.src = this.image_;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.position = 'absolute';
            div.appendChild(img);

            this.div_ = div;

            // Add the element to the "overlayLayer" pane.
            var panes = this.getPanes();
            panes.overlayMouseTarget.appendChild(div);
        };

        USGSOverlay.prototype.draw = function() {

            var overlayProjection = this.getProjection();

            // Retrieve the south-west and north-east coordinates of this overlay
            var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
            var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

            // Resize the image's div to fit the indicated dimensions.
            var div = this.div_;
            div.style.left = sw.x + 'px';
            div.style.top = ne.y + 'px';
            div.style.width = (ne.x - sw.x) + 'px';
            div.style.height = (sw.y - ne.y) + 'px';
        };
          // The onRemove() method will be called automatically from the API if
          // we ever set the overlay's map property to 'null'.
        USGSOverlay.prototype.onRemove = function() {
            this.div_.parentNode.removeChild(this.div_);
            this.div_ = null;
        };

        function change_overlap(){
          //alert('begin changing');

          var storage = window.localStorage;
          var json_data = storage.getItem('data');
          var json_album_data=storage.getItem('album_data');

          if (json_data!=null)
              var data=JSON.parse(json_data);
          else
              var data=[];

          if (json_album_data!=null)
              var album_data=JSON.parse(json_album_data);
          else
              var album_data=[];
          

          //alert('it still works');
          //alert('this id is  '+ this.getAttribute('overlay_id'));
          var overlay_id=this.getAttribute('overlay_id');
          var pic_id=this.getAttribute('pic_id');

           chosen_overlay=data[pic_id].album;

          var last_map_album=album_data[data[overlay_id].album];
          
          //alert('it still works');
          for (var i=0;i<last_map_album.photos.length;i++){
            for (var v=0;v<overlays.length;v++){
              if (last_map_album.photos[i]== overlays[v].id)
                break;
            }
              overlays[v].setMap(null);
          }

          //alert('after clear the original overlay');
   

          var current_map_album_photos=album_data[data[pic_id].album].photos;
          //alert('it still works');
          var temp=current_map_album_photos[current_map_album_photos.length-1];

          //alert('it still works');
          //alert(album_data[data[pic_id].album].photos);
          for (var i=current_map_album_photos.length-1;i>=1;i--){
            current_map_album_photos[i]=current_map_album_photos[i-1];
          }


          //alert('after change ths order');

          current_map_album_photos[0]=temp;
          album_data[data[pic_id].album].photos=current_map_album_photos;

          //alert(album_data[data[pic_id].album].photos);

          var current_map_album=album_data[data[pic_id].album];
          var determinant = current_map_album.photos.length;
          var album_bound = new google.maps.LatLng(current_map_album.lat,current_map_album.lon);
          var current_photo;
          var bound1;
          var bound2;
          var bounds;
          var srcImage;
          var pic_id;

          for (var i=0;i<determinant;i++)
          { 
            current_photo=data[current_map_album.photos[i]];
            bound1=anotherbound(album_bound,0.1*i);
            bound2=anotherbound(bound1,0.5);
            bounds=new google.maps.LatLngBounds(bound1,bound2);
            srcImage=current_photo.URL;
            pic_id=current_photo.id;

            for (var v=0;v<overlays.length;v++){
              if (current_map_album.photos[i]== overlays[v].id)
                break;
            }

            var overlay = new USGSOverlay(bounds, srcImage, map,pic_id,v);
            var overlay_icon=new google.maps.Marker({
                  position: bound1,
                  map: map,
                  title: 'Zoom in!'
                });
            overlay_icon.setMap(null);
            overlays_icon.push(overlay_icon);
            overlays[v]=overlay;
          }

          storage.setItem('album_data',JSON.stringify(album_data));
          storage.setItem('data',JSON.stringify(data));
        }  
        //Computational auxiliary
        function anotherbound(ini,per){
            var screen_width=document.getElementById("map").offsetWidth;
            var screen_height=document.getElementById("map").offsetHeight;

            var world_ini= map.getProjection().fromLatLngToPoint(ini);

            var new_world_x=world_ini.x+per*screen_width/Math.pow(2,17);
            var new_world_y=world_ini.y-per*screen_height/Math.pow(2,17);
            
            var new_world_ini= new google.maps.Point(new_world_x,new_world_y);

            var new_ini=  map.getProjection().fromPointToLatLng(new_world_ini);


            return new_ini;
        }

        function collision_detect(x1,y1,x1_,y1_){
            var rect1 = {x: x1, y: y1, width: 0.0018829107284545898, height: 0.001275684935450272};
            var rect2 = {x: x1_, y: y1_, width: 0.0018829107284545898, height: 0.001275684935450272};

              if (rect1.x < rect2.x + rect2.width &&
                 rect1.x + rect1.width > rect2.x &&
                 rect1.y < rect2.y + rect2.height &&
                 rect1.height + rect1.y > rect2.y) {
                  return true;
              }
              else{
                return false;
              }
        }

        function add_marker(){
            var myCenter=new google.maps.LatLng(51.508742,-0.120850);
            var marker=new google.maps.Marker({
                  position:myCenter,
                  animation:google.maps.Animation.BOUNCE
                  });
            marker.setMap(map);
        }


//End Code About Map--------------------------------------------

//Capture And Store--------------------------------------------
  function Take_Photo(){
    //Take a photo, store it in the Local System and reveal it in the Camera Page-------------
        navigator.camera.getPicture(picture_onSuccess, picture_onFail, { 
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType:Camera.PictureSourceType.SAVEDPHOTOALBUM,
        saveToPhotoAlbum: true});

    function picture_onSuccess(imageURI) {
        alert("picture success!");
        console.log(imageURI);

        if (imageURI.substring(0,21)=="content://com.android") {
          photo_split=imageURI.split("%3A");
          imageURI="content://media/external/images/media/"+photo_split[1];
        }

        var image = document.getElementById('myimage');
        image.src = imageURI;


        var geo_coords;
        navigator.geolocation.getCurrentPosition(geo_onSuccess, geo_onError);

        function geo_onSuccess(position){
             // alert(   'Latitude: '          + position.coords.latitude          + '\n' +
             //          'Longitude: '         + position.coords.longitude         + '\n' +
             //          'Altitude: '          + position.coords.altitude          + '\n' +
             //          'Accuracy: '          + position.coords.accuracy          + '\n' +
             //          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
             //          'Heading: '           + position.coords.heading           + '\n' +
             //          'Speed: '             + position.coords.speed             + '\n' +
             //          'Timestamp: '         + position.timestamp                + '\n');

            geo_coords={ latitude :position.coords.latitude,longitude:position.coords.longitude};

            var storage = window.localStorage;
            var json_data = storage.getItem('data');
            var json_album_data=storage.getItem('album_data');

            if (json_data!=null)
                var data=JSON.parse(json_data);
            else
                var data=[];

            if (json_album_data!=null)
                var album_data=JSON.parse(json_album_data);
            else
                var album_data=[];

            var id_=data.length;

            picture_object={lat:geo_coords.latitude,lon:geo_coords.longitude,URL:imageURI,id:id_};

            var image=document.getElementById('myimage');
            image.setAttribute('pic_id',id_);

            var y1;
            var y1_=picture_object.lat;
            var x1;
            var x1_=picture_object.lon;
            var isnear=false;


            for (var i=0;i<data.length;i++){
              y1=data[i].lat;
              x1=data[i].lon;
              if (collision_detect(x1,y1,x1_,y1_)){
                picture_object.album=data[i].album;
                album_data[data[i].album].photos.push(picture_object.id);
                isnear=true;
                break;
              }
            }


            if (isnear==false){
              var new_album={lat:y1_,lon:x1_,photos:[]};
              new_album.photos.push(picture_object.id);
              album_data.push(new_album);
              picture_object.album=album_data.length-1;
            }


            data.push(picture_object);
            storage.setItem('album_data',JSON.stringify(album_data));
            storage.setItem('data',JSON.stringify(data));

            refreshMap(picture_object);
        }

        function geo_onError(position){
            alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
            geo_coords=null;

            var storage = window.localStorage;
            var json_data=storage.getItem('data');
            if (json_data!=null)
                var data=JSON.parse(json_data);
            else
                var data=[];

            var id_=data.length+1;
                
            picture_object={lat:'unknown',lon:'unknown',URL:imageURI,id:id_};
            data.push(picture_object);

            storage.setItem('data',JSON.stringify(data));
        }  

    }    

    function picture_onFail(message) {
        alert('Failed because: ' + message);
    }
  }
//End Capture And Store--------------------------------------------

//Function linked to Buttons------------------------------------------
    //Buttons from the Universal Nav Bar------------------------------
        function to_map(){

        	if (document.getElementById("Config_Page").getAttribute("activate")=="1"){
           	//document.getElementById("Config_Page").style.display="none";
           	document.getElementById("Config_Page").setAttribute("activate","0");
           	document.getElementById("to_config").style.backgroundColor="lightyellow";

           	document.getElementById("to_map").style.backgroundColor="white";

            var lat=parseFloat(document.getElementById('input_latitude').value);
            var lon=parseFloat(document.getElementById('input_longitude').value);

            if ((!isNaN(lat)) && (!isNaN(lon))){
              if (lat<=85 && lat>=-85 && lon>=-180 && lon<=180){
                var cent= new google.maps.LatLng(lat,lon);
                console.log(cent);
                console.log(cent.lat());
                console.log(cent.lng());
                map.setCenter(cent);
              }
              else{
                alert('Invalid Longitude or Latitude Input');
              }
            }

        	}

        	 if (document.getElementById("Camera_Page").getAttribute("activate")=="1"){
        	 	//document.getElementById("Camera_Page").style.display="none";
        	 	document.getElementById("Camera_Page").setAttribute("activate","0");
        	 	document.getElementById("to_camera").style.backgroundColor="lightyellow";

        	 	document.getElementById("to_map").style.backgroundColor="white";
        	 	//document.getElementById("Map_Page").style.display="block";
        	 }

            document.getElementById('page_content').style.left='0%';
        	 	document.getElementById("Map_Page").setAttribute("activate","1");

        }

        function to_camera(mode){



        	//console.log(document.getElementById("Map_Page").getAttribute("activate"));
         if (document.getElementById("Map_Page").getAttribute("activate")=="1"){
         	document.getElementById("Map_Page").setAttribute("activate","0");
         	//document.getElementById("Map_Page").style.display="none";
         	document.getElementById("to_map").style.backgroundColor="lightyellow";

         	//document.getElementById("Camera_Page").style.display="block";
         	document.getElementById("to_camera").style.backgroundColor="white";
         }
         	


         if (document.getElementById("Config_Page").getAttribute("activate")=="1"){
         	document.getElementById("Config_Page").setAttribute("activate","0");
         	//document.getElementById("Config_Page").style.display="none";
         	document.getElementById("to_config").style.backgroundColor="lightyellow";
         	//document.getElementById("Camera_Page").style.display="block";
         	document.getElementById("to_camera").style.backgroundColor="white";
         	
         }

         	//$("#page_content").velocity({left: '-100%'});
          document.getElementById('page_content').style.left='-100%';
         	document.getElementById("Camera_Page").setAttribute("activate","1");
          if (mode==1){
            Take_Photo();
          }
          else{

              var storage = window.localStorage;
              var json_data = storage.getItem('data');
              var json_album_data=storage.getItem('album_data');

              if (json_data!=null)
                  var data=JSON.parse(json_data);
              else
                  var data=[];

              if (json_album_data!=null)
                  var album_data=JSON.parse(json_album_data);
              else
                  var album_data=[];

              var image=document.getElementById('myimage')
              image.src=data[album_data[chosen_overlay].photos[album_data[chosen_overlay].photos.length-1]].URL;
              image.setAttribute('pic_id',album_data[chosen_overlay].photos[album_data[chosen_overlay].photos.length-1]);
          }
        }

        function to_config(){

        	if (document.getElementById("Camera_Page").getAttribute("activate")=="1"){
        		document.getElementById("Camera_Page").setAttribute("activate","0");
         	//document.getElementById("Camera_Page").style.display="none";
         	document.getElementById("to_camera").style.backgroundColor="lightyellow";

         	//document.getElementById("Config_Page").style.display="block";
         	document.getElementById("to_config").style.backgroundColor="white";
         	
         }
         	if (document.getElementById("Map_Page").getAttribute("activate")=="1"){
         	document.getElementById("Map_Page").setAttribute("activate","0");
         	//document.getElementById("Map_Page").style.display="none";
         	document.getElementById("to_map").style.backgroundColor="lightyellow";

         	//document.getElementById("Config_Page").style.display="block";
         	document.getElementById("to_config").style.backgroundColor="white";
         }
         	//$("#page_content").velocity({left: '-200%'});
            document.getElementById("page_content").style.left="-200%";
         	document.getElementById("Config_Page").setAttribute("activate","1");
        }
    //End Buttons from the Universal Nav Bar------------------------------

    //Buttons from the Config_Page------------------------------------
        var geo_num=0;
        var activate='undefined';
        var input_latitude;
        var input_longitude;
        var geo_position={store_id:'',store_latitude:'',store_longitude:'',store_name:'',store_desc:''};
        var local_geo_position;
        //Initial Triggered by the Tick Item---------------------------------------
          function geo_add(){

              $('#Config_Page').fadeToggle();
              $('#geo_name').fadeToggle();
              document.getElementById("input_geo_name").focus()
              console.log(geo_num);

          }

          function activation(obj){
            console.log(obj.firstChild.getAttribute('id'));
            local_geo_position=JSON.parse(window.localStorage.getItem('local_geo_position'));
            document.getElementById('input_longitude').value=local_geo_position[parseFloat(obj.firstChild.getAttribute('id'))-1].store_longitude;
            document.getElementById('input_latitude').value=local_geo_position[parseFloat(obj.firstChild.getAttribute('id'))-1].store_latitude;

            if (activate!='undefined'){
               if (activate!=obj.firstChild.getAttribute('id')){
                document.getElementById(activate).style.backgroundColor='lightyellow';
                activate=obj.firstChild.getAttribute('id'); 
                document.getElementById(activate).style.backgroundColor='orange';
               }
               else{
                document.getElementById(activate).style.backgroundColor='lightyellow';
                activate='undefined'; 
               }
            }
            else{
              activate=obj.firstChild.getAttribute('id');  
              document.getElementById(activate).style.backgroundColor='orange';
            } 
          }
          
          //Buttons from the Geo_name----------------------------------------
            function to_desc(){
                $('#geo_name').fadeToggle();
                $('#geo_desc').fadeToggle();
                document.getElementById("input_geo_desc").focus()
            }

            function back_config(){
                $('#geo_name').fadeToggle();
                $('#Config_Page').fadeToggle();
            }
          //End Buttons from the Geo_name----------------------------------------

          //Buttons from the Geo_desc----------------------------------------
            function back_geo_name(){
                $('#geo_desc').fadeToggle();
                $('#geo_name').fadeToggle();
                document.getElementById("input_geo_name").focus()
            }

            function build_geo(){
                $('#geo_desc').fadeToggle();
                geo_num=geo_num+1;
                document.getElementById('stored_geo').innerHTML=document.getElementById('stored_geo').innerHTML+" <a onclick='activation(this)'><div id="+geo_num.toString()+" class='geo_item'></div> </a>"
                document.getElementById(geo_num.toString()).innerHTML="<h1>"+document.getElementById('input_geo_name').value+"</h1>";

                input_latitude=document.getElementById('input_latitude').value;
                input_longitude=document.getElementById('input_longitude').value;
                input_geo_name=document.getElementById('input_geo_name').value;
                input_geo_desc=document.getElementById('input_geo_desc').value;
                // console.log('latitude is '+input_latitude);
                // console.log('longitude is '+input_longitude);
                // console.log('geo_name is '+input_geo_name);
                // console.log('geo_desc is '+input_geo_desc);
                geo_position.store_latitude=input_latitude;
                geo_position.store_longitude=input_longitude;
                geo_position.store_name=input_geo_name;
                geo_position.store_desc=input_geo_desc;
                geo_position.store_id=geo_num;
                //console.log(geo_position);


                local_geo_position=window.localStorage.getItem('local_geo_position');

                if (local_geo_position!=null){
                  local_geo_position=JSON.parse(local_geo_position);
                  local_geo_position.push(geo_position);
                }
                else{
                  local_geo_position=[];
                  local_geo_position.push(geo_position);
                }

                console.log(local_geo_position);
                window.localStorage.setItem('local_geo_position',JSON.stringify(local_geo_position));

                $('#Config_Page').fadeToggle();
            }
            
            function des_reveal(){
              $('#Config_Page').fadeToggle();
              $('#geo_desc_reveal').fadeToggle();
              var local_geo=JSON.parse(window.localStorage.getItem('local_geo_position'));
              document.getElementById('output_geo_desc').value= local_geo[activate-1].store_desc;
            }

            function back_config_page(){
              $('#Config_Page').fadeToggle();
              $('#geo_desc_reveal').fadeToggle();
            }
          // //End Buttons from the Geo_desc---------------------------

        //End Initial Triggered by the Tick Item--------------------------

        //Initial Triggered by the Trash Item-----------------
          function delete_geo_item(){
              geo_num=geo_num-1;
              var delete_item=document.getElementById(activate).parentNode;
              console.log(delete_item);
              //deltet the button from the local storage
              var item_index=activate-1;
              local_geo_position=JSON.parse(window.localStorage.getItem('local_geo_position'));
              for(var i=item_index;i<local_geo_position.length-1;i++)
                local_geo_position[i]=local_geo_position[i+1];
              local_geo_position.pop();
              window.localStorage.setItem('local_geo_position',JSON.stringify(local_geo_position));

               //delete the button from the user interface
               // var delete_item_index=parseFloat(delete_item.getAttribute('id'));
               // var all_items=document.getElementsByClassName('geo_item');
               //  console.log('delete_item_index is '+delete_item_index);
               // for (i=delete_item_index;i<all_items.length;i++)
               //  all_items[i].setAttribute('id',(parseFloat(all_items[i].getAttribute('id'))-1).toString());
               var temp=delete_item.nextSibling;

              while (temp!=null){
                temp=temp.nextSibling;
                if (temp!=null){
                  temp=temp.firstChild;
                  if (temp!=null){
                    new_id=(parseFloat(temp.getAttribute('id'))-1).toString();
                    console.log(toString());
                    temp.setAttribute('id',new_id);
                    temp=temp.parentNode.nextSibling;}
                  }
              }

              delete_item.parentNode.removeChild(delete_item);
              activate='undefined';
          }
        //End Initial Triggered by the Trash Item-------------

        //Initial Triggered by the gerPosition Icon------------
        function get_current_position(){
          var geo_coords;
          navigator.geolocation.getCurrentPosition(geo_onSuccess, geo_onError);

          function geo_onSuccess(position){
              geo_coords={ latitude :position.coords.latitude,longitude:position.coords.longitude};

              document.getElementById('input_latitude').value=position.coords.latitude;
              document.getElementById('input_longitude').value=position.coords.longitude;
              alert('Success in trasfering the geo data to the Input Box');
          }

          function geo_onError(position){
              alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
          }  
        }
    //End Buttons from the Config_Page------------------------------------

    //Buttons from the Camera_Page
      
      function img_delete(){
        alert('delete the image');
        var pic_id=document.getElementById('myimage').getAttribute('pic_id');

        var storage = window.localStorage;
        var json_data = storage.getItem('data');
        var json_album_data=storage.getItem('album_data');

        if (json_data!=null)
            var data=JSON.parse(json_data);
        else
            var data=[];

        if (json_album_data!=null)
            var album_data=JSON.parse(json_album_data);
        else
            var album_data=[];

        var last_photos=album_data[data[pic_id].album].photos;
        var new_photos=[];
        for (var i=0;i<last_photos.length;i++){
          if (last_photos[i]!=pic_id)
            new_photos.push(last_photos[i]);
        }

        data[pic_id]=null;

        for (var i=0;i<overlays.length;i++){
          if (overlays[i].id==pic_id){
            overlays[i].setMap(null)
            break;
          }
        }
        storage.setItem('album_data',JSON.stringify(album_data));
        storage.setItem('data',JSON.stringify(data));
      }
    //End Buttons from the Camera_Page
    function clc(){
      window.localStorage.clear();
      alert('memory clear');
    }
//Function linked to Buttons------------------------------------------      