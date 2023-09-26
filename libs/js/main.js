/*======================WINDOW ONLOAD GEOJSON VERSION===================*/
let csvResult = null;
let finalItems = null;
let meteoriteData = null;

window.onload = function() {
    const mainSearch = new XMLHttpRequest();

    mainSearch.open("GET", "assets/geoJSON/getMeteorites.geo.json", true);

    mainSearch.onload = function() {
        if(this.status == 200) {
            meteoriteData = JSON.parse(this.responseText);
            console.log(meteoriteData);
            finalItems = meteoriteData.data.features;
            finalItems = finalItems.filter((item) => item.properties.year > 1299);
        }
    }

    mainSearch.send();
}


/*====================GET STARTED========================*/

const brandLogo = document.querySelector(".project-title");
const openingContent = document.querySelector(".opening-content");
const openingInfo = document.querySelector(".opening-info");
const ctaButton = document.querySelector(".cta-btn");
const summaryMetrics = document.querySelector(".summary-metrics");
const summaryMetricsBtn = document.querySelector(".summary-metrics-btn");
const leafletMap = document.querySelector(".leaflet-map");
const contentDisplay = document.querySelector(".content-display");
const resultsTableContainer = document.querySelector(".table-container");



ctaButton.addEventListener("click", () => {

    openingContent.style.display = "none";
    resultsTableContainer.style.display = "block";
    summaryMetricsBtn.style.display = "block";

      // Initial render
    updatePagination();
    renderTable(currentPage);

})

/*========================MAP MODE==================*/

const toggleMap = document.querySelector("#tableMapBtn");
toggleMap.addEventListener("click", toggleMapFunction);

function toggleMapFunction() {

    openingContent.style.display = "none";

    footer.classList.toggle("map-mode");

        if(!contentDisplay.classList.contains("map-mode")) {
            tableMapBtn.innerHTML = `TABLE MODE <span class="btn-circle"></span>`;
            summaryMetricsBtn.style.display = "none";
            summaryMetrics.style.display = "none";
            resultsTableContainer.style.display = "none";
        } else {
            tableMapBtn.innerHTML = `MAP MODE <span class="btn-circle"></span>`;
            summaryMetricsBtn.style.display = "block";
            summaryMetrics.style.display = "none";
            resultsTableContainer.style.display = "block";
        }

        contentDisplay.classList.toggle("map-mode");
        displayResultsMap();
        displayResultsTable();
        map.invalidateSize();
    
}


/*===================FOOTER TOGGLE======================*/

const footer = document.querySelector("footer");
const toggleFooter = document.querySelector(".footer-up-down");
toggleFooter.addEventListener("click", toggleFooterFunction);

function toggleFooterFunction() {

    footer.classList.toggle("footer-up");
    document.body.classList.toggle("footer-up");
    
    resetFunction();
}


/*====================NIGHT-DAY-MODE=================*/
function daymode() {
    let setTheme = document.body;

    setTheme.classList.toggle("day-mode");
    
    const button = document.getElementById("mybtn");
    
    if (setTheme.classList.contains("day-mode")) {
        button.innerHTML = `NIGHT MODE <span class="btn-circle"></span>`;
    } else {
        button.innerHTML = `DAY MODE <span class="btn-circle"></span>`;
    }
    
}



/*=======================INSTALL MAP===================== */

let map = L.map("map").setView([41.505, -0.09], 1);

L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
}).addTo(map);


/*==================LOGIC FOR TABLE====================*/

const itemsPerPage = 50;

let resultsTableBody = document.querySelector(".results-table .table-body");
const prevPageButton = document.querySelector(".prev-page");
const currPage = document.querySelector(".curr-page");
const nextPageButton = document.querySelector(".next-page");

let currentPage = 1;

function updatePagination() {
    const totalPages = Math.ceil(finalItems.length / itemsPerPage);
  
    // Enable or disable previous and next buttons based on current page
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
  
    currPage.textContent = `Page ${currentPage} of ${totalPages}`;
  }

function renderTable(page) {

    resultsTableBody.innerHTML = ""; 
    // console.log(finalItems);
  
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    if(finalItems.length < 1) {

        alert("Apologies: No data to display, please refine your search.")
        resetFunction();

    } else {
        
        for (let i = startIndex; i < endIndex && i < finalItems.length; i++) {
            
        const item = finalItems[i];
        const newRow = document.createElement("tr");
    
        newRow.innerHTML = `
            <td class="id-data">${item.properties.id}</td>
            <td class="name-data">${item.properties.name}</td>
            <td class="recclass-data">${item.properties.recclass}</td>
            <td class="mass-data">${item.properties.mass}</td>
            <td class="year-data">${item.properties.year}</td>
            <td class="lat-data">${item.geometry.coordinates[1].toFixed(3)}</td>
            <td class="long-data">${item.geometry.coordinates[0].toFixed(3)}</td>
        `
        resultsTableBody.append(newRow);
        
        }

    }
  
    currPage.textContent = `Page ${currentPage}`;

    updatePagination();
}
  
  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      renderTable(currentPage);
    }
  }
  
  function nextPage() {
    const totalPages = Math.ceil(finalItems.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable(currentPage);
    }
  }
  
  prevPageButton.addEventListener("click", prevPage);
  nextPageButton.addEventListener("click", nextPage);




 /*====================SEARCH FUNCTIONS===================*/

let mainSearchInput = null;
const mainSearch = document.querySelector(".main-search");
let nameChoice = null;
const nameInput = document.querySelector(".name-select");
const centurySelect = document.querySelector(".century-select");
const massSelect = document.querySelector(".mass-select");

 const searchParameters = {
    openQuery: null,
    nameQuery: null,
    centuryQuery: null,
    massQuery: null
 }
 

/*MAIN SEARCH INPUT*/

mainSearch.addEventListener("click", clearNameInput);
function clearNameInput() {
    if(nameInput.value.length > 0) {
        finalItems = meteoriteData.data.features;
        nameInput.value = "";
        searchParameters.nameQuery = null;
        centurySelect.value = "";
        searchParameters.centuryQuery = null;
        massSelect.value = "";
        searchParameters.massQuery = null;
    }

    if(searchParameters.openQuery != null) {
        finalItems = meteoriteData.data.features;
        centurySelect.value = "";
        searchParameters.centuryQuery = null;
        massSelect.value = "";
        searchParameters.massQuery = null;
    }
}

mainSearch.addEventListener("change", textInputFunction);

function textInputFunction() {

    mainSearchInput = document.querySelector(".main-search").value.trim().toLowerCase();
    searchParameters.openQuery = mainSearchInput;

    if(finalItems.length < 32187) {
        finalItems = finalItems.filter(item => {
            return item.properties.name.includes(mainSearchInput);
        })
    } else {
        finalItems = [];
        meteoriteData.data.features.forEach(item => {
            const itemName = item.properties.name.trim().toLowerCase(); 
            if(itemName.includes(mainSearchInput)) {
                finalItems.push(item);
            }
        })
    }

}


/*NAME SEARCH INPUT*/

nameInput.addEventListener("change", nameInputFunction);

function nameInputFunction() {

    if(mainSearch.value.length > 0) {
        finalItems = meteoriteData.data.features;
        mainSearch.value = "";
        searchParameters.openQuery = null;
        centurySelect.value = "";
        searchParameters.centuryQuery = null;
        massSelect.value = "";
        searchParameters.massQuery = null;
    }

    if(searchParameters.nameQuery != null) {
        finalItems = meteoriteData.data.features;
        centurySelect.value = "";
        searchParameters.centuryQuery = null;
        massSelect.value = "";
        searchParameters.massQuery = null;
    }

    nameChoice = Array.from(nameInput.value);
    console.log(nameChoice);
    searchParameters.nameQuery = nameChoice;
    nameFilter();

}

function nameFilter() {

    if(finalItems.length < 32187) {
        finalItems = finalItems.filter(item => {
            const itemName = item.properties.name.trim().toLowerCase(); 
            return itemName.startsWith(searchParameters.nameQuery[0]) || itemName.startsWith(searchParameters.nameQuery[1]) || itemName.startsWith(searchParameters.nameQuery[2]);
        })
    } else {

        finalItems = [];
    
        meteoriteData.data.features.forEach(item => {
            const itemName = item.properties.name.trim().toLowerCase(); 
            if(itemName.startsWith(searchParameters.nameQuery[0]) || itemName.startsWith(searchParameters.nameQuery[1]) || itemName.startsWith(searchParameters.nameQuery[2])) {
                        finalItems.push(item);
                    }
            
        })
    }

    console.log(finalItems.length);
}


/*CENTURY SEARCH INPUT*/

centurySelect.addEventListener("change", centuryInputFunction);

function centuryInputFunction() {

    if(searchParameters.centuryQuery != null) {
        finalItems = meteoriteData.data.features;
        mainSearch.value = "";
        searchParameters.openQuery = null;
        nameInput.value = "";
        searchParameters.nameQuery = null;
        massSelect.value = "";
        searchParameters.massQuery = null;
    }

    searchParameters.centuryQuery = centurySelect.value;

    centuryFilter();

} 

function centuryFilter() {

    const lowEnd = searchParameters.centuryQuery.slice(0, 4);
    const highEnd = searchParameters.centuryQuery.slice(-4);

    if(finalItems.length < 32187) {
        finalItems = finalItems.filter(item => {
            return item.properties.year >= lowEnd && item.properties.year <= highEnd;
        })
    } else {
        finalItems = [];   

        meteoriteData.data.features.filter(item => {
            if(item.properties.year >= lowEnd && item.properties.year <= highEnd) {
                finalItems.push(item);
            }
        })
    } 
    console.log(finalItems.length);
}


/*MASS SEARCH INPUT*/

massSelect.addEventListener("change", massInputFunction);

function massInputFunction() {

    if(searchParameters.massQuery != null) {
        finalItems = meteoriteData.data.features;
        mainSearch.value = "";
        searchParameters.openQuery = null;
        nameInput.value = "";
        searchParameters.nameQuery = null;
        centurySelect.value = "";
        searchParameters.centuryQuery = null;
    }

    searchParameters.massQuery = massSelect.value;

    massFilter();
    
}

function massFilter() {

    const lowMass = searchParameters.massQuery.slice(0, 8);
    const highMass = searchParameters.massQuery.slice(-8);

    if(finalItems.length < 32187) {
        finalItems = finalItems.filter(item => {
            return Number(item.properties.mass) >= lowMass && Number(item.properties.mass) <= highMass;
        })
    } else {
        finalItems = [];

        meteoriteData.data.features.filter(item => {
            if(Number(item.properties.mass) >= lowMass && Number(item.properties.mass) <= highMass) {
                finalItems.push(item);
            }
        })

    }
    console.log(finalItems.length);
}


/*SEARCH BUTTON*/

const searchForm = document.querySelector(".search-form");
const mainSearchButton = document.querySelector(".main-search-btn");
mainSearchButton.addEventListener("click", searchNow)

function searchNow() {

    if(footer.classList[0]) {
        footer.classList.toggle("footer-up");
        document.body.classList.toggle("footer-up");
    } 



    if (contentDisplay.classList.contains("map-mode")) {
        console.log("Map mode is active");
        displayResultsMap();
    } else {
        console.log("Table mode is active");
        displayResultsTable();
    }

    
    searchForm.reset();
    
    setTimeout(function() {
        Object.keys(searchParameters).forEach((i) => searchParameters[i] = null);
    console.log(searchParameters);
    }, 1000); 

}


function displayResultsTable() {

    resultsTableBody.innerHTML = "";

    currentPage = 1;

    renderTable(currentPage);

}


let geojsonLayer = null;
const markerCluster = L.markerClusterGroup({
    maxClusterRadius: 40,
    disableClusteringAtZoom: 16
});

function displayResultsMap() {
    
    markerCluster.clearLayers();

    if(finalItems.length < 1) {

        alert("Apologies: No data to display, please refine your search.")
        resetFunction();

    } else {
      
            geojsonLayer = L.geoJSON(finalItems, {
                pointToLayer: function (feature, latlng) {
                    const markerIcon = L.icon({
                        iconUrl: "assets/images/markerIcon.png",
                        iconSize: [30, 30],
                        iconAnchor: [50, 50],
                        popupAnchor: [-35, -55]
                    });
                    return L.marker(latlng, {
                        icon: markerIcon
                    });
                },
                onEachFeature: function (feature, layer) {
                    console.log(typeof feature.properties.mass);
                    const popupContent = `
                        <ul class="popup-list" style="list-style: none;">
                            <li class="popup-list-item"><strong>Id:</strong> ${feature.properties.id}</li>
                            <li class="popup-list-item"><strong>Name:</strong> ${feature.properties.name}</li>
                            <li class="popup-list-item"><strong>Record Class:</strong> ${feature.properties.recclass}</li>
                            <li><strong>Mass (g):</strong> ${Number(feature.properties.mass).toLocaleString("en-GB")}</li>
                            <li><strong>Year of Impact:</strong> ${feature.properties.year}</li>
                            <li><strong>Latitude:</strong> ${feature.geometry.coordinates[1].toFixed(3)}</li>
                            <li><strong>Longitude:</strong> ${feature.geometry.coordinates[0].toFixed(3)}</li>
                        </ul>
                    `;
                    layer.bindPopup(popupContent);
                }
            });
    
                markerCluster.addLayer(geojsonLayer);
                map.addLayer(markerCluster);

    }

    const screenWidth = document.documentElement.clientWidth;

    if(screenWidth < 650) {
        map.setView([35.505, -0.09], 3);
    } else {
        map.setView([41.505, -0.09], 2);
    }


    window.addEventListener('resize', function(){

        if (screenWidth < 650) {
            map.setView([35.505, -0.09], 3);
        }  
    });

}


/*================SUMMARY METRICS COMPONENT================*/

// const ctx = document.getElementById('histogram').getContext('2d');
let chartYears = null;
let yearsArr = null;
let strikesArr = null;
let sumMetActive = false;


summaryMetricsBtn.addEventListener("click", () => {

    // chartLabels();

    const totalStrikes = document.querySelector(".total-strikes");
    const avgMass = document.querySelector(".avg-mass");
    const mostStrikesYear = document.querySelector(".most-strikes-year");
    const mostCommonRecClass = document.querySelector(".most-common-recclass");

    totalStrikes.innerHTML = `<strong>Total Strikes:</strong> ${finalItems.length.toLocaleString("en-GB")}`;
    avgMass.innerHTML = `<strong>Average Mass:</strong> ${massCalculation()} grams`;
    mostStrikesYear.innerHTML = `<strong>Severest Year:</strong> ${prevalentYear(finalItems)}`;
    mostCommonRecClass.innerHTML = `<strong>Most Common RecClass:</strong> ${prevalentRecClass(finalItems)}`

    sumMetActive = true;

    if(contentDisplay.classList.contains("map-mode")) {
        leafletMap.style.display = "none";
        summaryMetrics.style.display = "block";
    } else {
        
        resultsTableContainer.style.display = "none";
        summaryMetrics.style.display = "block";
    }
})

const massCalculation = () => {
    
    let totalMass = 0;
    finalItems.forEach(item => {
        const parsedMass = parseInt(item.properties.mass);
        totalMass += parsedMass;
    })
    const result = totalMass / finalItems.length; 
    const roundedResult = Math.round(result * 100) / 100; 
    const formattedResult = roundedResult.toLocaleString("en-GB"); 
    
    return formattedResult;

}

function prevalentYear(array) {
    let yearCounts = {}; 
    let maxCount = 0;
    let prevalentYear;

    for (let i = 0; i < array.length; i++) {
        const year = array[i].properties.year;
        if (yearCounts[year]) {
            yearCounts[year]++; 
        } else {
            yearCounts[year] = 1;
        }

        if (yearCounts[year] > maxCount) {
            maxCount = yearCounts[year];
            prevalentYear = year;
        }
    }

    return `${prevalentYear} (${maxCount.toLocaleString("en-GB")} strikes)`;
}

function prevalentRecClass(array) {
    let recClassCounts = {}; 
    let maxCount = 0;
    let prevalentRecClass;

    for (let i = 0; i < array.length; i++) {
        const recClass = array[i].properties.recclass;
        if (recClassCounts[recClass]) {
            recClassCounts[recClass]++; 
        } else {
            recClassCounts[recClass] = 1; 
        }

        if (recClassCounts[recClass] > maxCount) {
            maxCount = recClassCounts[recClass];
            prevalentRecClass = recClass;
        }
    }

    return prevalentRecClass;
}

summaryMetrics.addEventListener("click", () => {

    if(contentDisplay.classList.contains("map-mode")) {
        leafletMap.style.display = "block";
        summaryMetrics.style.display = "none";
    } else {
        resultsTableContainer.style.display = "block";
        summaryMetrics.style.display = "none";
    }
    
})

// function chartLabels() {
    
//     const years = finalItems.map(item => item.properties.year);

//     const minYear = Math.min(...years);
//     const maxYear = Math.max(...years);

//     const yearRange = maxYear - minYear;

//     const intervalSize = Math.floor(yearRange / 9);

//     const chartYears = Array.from({ length: 9 }, (_, index) => minYear + index * intervalSize);
//     console.log(minYear);

//     chartYears.push(maxYear);

//     strikesByYearCalc(chartYears);
// }

// function strikesByYearCalc(years) {
//     const strikesByYear = Array(years.length).fill(0);

//     finalItems.forEach(item => {
//         const yearIndex = years.indexOf(item.properties.year);
//         if (yearIndex !== -1) {
//             strikesByYear[yearIndex]++;
//         }
//     });
    
//     chartFunc(years, strikesByYear);
// }


// function chartFunc(years, strikesByYear) {

//     console.log(years);
//     console.log(strikesByYear);

//     const chart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: years,
//         datasets: [{
//           label: 'Strikes by Year',
//           data: strikesByYear,
//           backgroundColor: ["#FFDC73"],
//         }]
//       },
//       options: {
//         scales: {
//           xAxes: [{
//             display: false,
//             barPercentage: 1.3,
//             ticks: {
//               max: 3,
//               maxRotation: 90,
//               minRotation: 90,
//             }
//           }, {
//             display: true,
//             ticks: {
//               autoSkip: false,
//               max: 4,
//             }
//           }],
//           yAxes: [{
//             ticks: {
//               beginAtZero: true
//             }
//           }]
//         }
//       }
//     });

// }



/*=====================RESET BUTTON==================*/
const resetButton = document.querySelector(".reset-btn");
resetButton.addEventListener("click", resetFunction);

function resetFunction() {
    markerCluster.clearLayers();
    currentPage = 1;
    finalItems = meteoriteData.data.features;
    searchForm.reset();
    updatePagination();
    renderTable(currentPage);
}


/*=======================GITHUB BUTTON=================*/
const githubButton = document.querySelector(".github-btn");
githubButton.addEventListener("click", githubFunction);

function githubFunction() {
    window.open("https://github.com/chingu-voyages/v45-tier1-team-10", "_blank");
}


