async function getTrend(){
    const response = await fetch('/worlddb');
    const res = await fetch('/usadb');
    const worlddb = await response.json();
    const usadb = await res.json();
    // let dropdown = document.getElementById('trend');

      //chart setup 
    let chart = am4core.create("mapdiv", am4maps.MapChart);
    chart.geodata = am4geodata_worldLow;
    chart.projection = new am4maps.projections.Miller();
  

    let worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
    worldSeries.exclude = ["AQ"];
    worldSeries.useGeodata = true;
    let polygonTemplate = worldSeries.mapPolygons.template;
    polygonTemplate.fill = am4core.color("#c5c7c5");
    worldSeries.data = [{
        id: "US",
        disabled: false,
    }];

    worldSeries.data = []
    for (let i = 0; i < worlddb.length; i++) {
        let graphdata = {
        "id": worlddb[i].state,
        "fill": am4core.color(worlddb[i].trend1[2]),
        "query": worlddb[i].trend1[1],
        "trend1": worlddb[i].trend1[0]
        }
        worldSeries.data.push(graphdata)
    }
    polygonTemplate.propertyFields.fill = "fill";
    polygonTemplate.tooltipHTML = '<b>{name}</b><br><a href="https://twitter.com/search?q={query}">{trend1}</a>';
    polygonTemplate.propertyFields.id = "id";


        // Set up tooltips
    polygonTemplate.tooltipPosition = "fixed";
    worldSeries.tooltip.label.interactionsEnabled = true;
    worldSeries.tooltip.keepTargetHover = true;

    // Configure label series
    let labelSeries = chart.series.push(new am4maps.MapImageSeries());
    let labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label);
    labelTemplate.horizontalCenter = "middle";
    labelTemplate.verticalCenter = "middle";
    labelTemplate.fontSize = 12;
    labelTemplate.interactionsEnabled = false;
    labelTemplate.nonScaling = true;

    worldSeries.events.on("inited", function() {
        for (let i = 0; i < worlddb.length; i++) {
        let polygon = worldSeries.getPolygonById(worlddb[i].state);

        if (polygon) {
            let label = labelSeries.mapImages.create();
            label.latitude = polygon.visualLatitude;
            label.longitude = polygon.visualLongitude;
            label.children.getIndex(0).text = worlddb[i].trend1[0];
        }
        }
    });


    let usaSeries = chart.series.push(new am4maps.MapPolygonSeries());
    usaSeries.geodata = am4geodata_usaLow

    //create data for map
    usaSeries.data = []
    for (let i = 0; i < usadb.length; i++) {
        let graphdata = {
        "id": usadb[i].state,
        "fill": am4core.color(usadb[i].trend1[2]),
        "query": usadb[i].trend1[1],
        "trend1": usadb[i].trend1[0]
        }
        usaSeries.data.push(graphdata)
    }

    // // Configure series
    polygonTemplate = usaSeries.mapPolygons.template;
    polygonTemplate.propertyFields.fill = "fill";
    polygonTemplate.tooltipHTML = '<b>{name}</b><br><a href="https://twitter.com/search?q={query}">{trend1}</a>';
    polygonTemplate.fill = am4core.color("#8f8f8f");
    polygonTemplate.propertyFields.id = "id";

    // Set up tooltips
    polygonTemplate.tooltipPosition = "fixed";
    // usaSeries.calculateVisualCenter = true;
    usaSeries.tooltip.label.interactionsEnabled = true;
    usaSeries.tooltip.keepTargetHover = true;

    // Configure label series
    labelSeries = chart.series.push(new am4maps.MapImageSeries());
    labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label);
    labelTemplate.horizontalCenter = "middle";
    labelTemplate.verticalCenter = "middle";
    labelTemplate.fontSize = 12;
    labelTemplate.interactionsEnabled = false;
    labelTemplate.nonScaling = true;

    // Set up label series to populate
    usaSeries.events.on("inited", function() {
        for (let i = 0; i < usadb.length; i++) {
        let polygon = usaSeries.getPolygonById(usadb[i].state);

        if (polygon) {
            let label = labelSeries.mapImages.create();
            label.latitude = polygon.visualLatitude;
            label.longitude = polygon.visualLongitude;
            label.children.getIndex(0).text = usadb[i].trend1[0];
        }
        }
    });
}

// function try1(){
//     console.log("works")
//     let trend1 = "1"
//     let trend2 = "2"
//     let rank = "1"
//     console.log("hello {rank}")
// }
