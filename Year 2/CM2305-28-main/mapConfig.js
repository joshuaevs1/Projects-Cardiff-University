mapboxgl.accessToken =
        'pk.eyJ1IjoibWFsLXdvb2QiLCJhIjoiY2oyZ2t2em50MDAyMzJ3cnltMDFhb2NzdiJ9.X-D4Wvo5E5QxeP7K_I3O8w';

setupMap()

function setupMap(){
     const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        zoom: 2, //loads map with no zoom
        center: [0,30]
      });

     const nav = new mapboxgl.NavigationControl() //adds zoom and rotate btns
     map.addControl(nav)

}
