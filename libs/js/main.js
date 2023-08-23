/*======================WINDOW ONLOAD===================*/
let csvResult = null;

window.onload = function() {
    const mainSearch = new XMLHttpRequest();

    mainSearch.open("GET", "https://raw.githubusercontent.com/chingu-voyages/voyage-project-tier1-fireball/main/assets/Meteorite_Landings.csv", true);

    mainSearch.onload = function() {
        if(this.status == 200) {
            const csvData = this.responseText;

            Papa.parse(csvData, {
                header: true,
                dynamicTyping: true,
                complete: (result) => {
                    csvResult = [];
                    result.data.forEach(item => {
                        if(typeof item.GeoLocation === "string" && typeof item.year === "number" && typeof item["mass (g)"] === "number") {
                            csvResult.push(item);
                        }
                    })                    
                },
                error: (error) => {
                    console.error("Error parsing CSV:", error.message);
                },
            })

        }
    }

    mainSearch.send();
}


/*=======================INSTALL MAP===================== */

let map = L.map("map").setView([41.505, -0.09], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

let layerGroup = L.layerGroup().addTo(map);
let marker = null;



 /*====================SEARCH FUNCTIONS===================*/

/*
    1. select from any input
    2. input function calls filter for that input
    3. each filter func takes param of finalItems array
    4. does filtration then updates finalItems
    5. search func uses finalItems array
*/

 const searchParameters = {
    openQuery: null,
    nameQuery: null,
    centuryQuery: null
 }



/*MAIN SEARCH BAR*/
// let mainSearchInput = null;
// const mainSearch = document.querySelector(".main-search");

// mainSearch.addEventListener("click", searchBar);
// function searchBar() {
//     nameInput.value = "";
//     searchParameters.nameQuery = null;
//     mainSearchInput = document.querySelector(".main-search").value.trim().toLowerCase();
//     searchParameters.openQuery = mainSearchInput;
// }


/*NAME SEARCH INPUT*/
let nameChoice = null;
const nameInput = document.querySelector(".name-select");

nameInput.addEventListener("change", nameInputFunction);

function nameInputFunction() {
    nameChoice = Array.from(nameInput.value);
    console.log(nameChoice);
    // searchParameters.openQuery = null;
    searchParameters.nameQuery = nameChoice;
}


/*CENTURY SEARCH INPUT*/
const centurySelect = document.querySelector(".century-select");

centurySelect.addEventListener("change", centuryInputFunction);

function centuryInputFunction() {

    console.log(centurySelect.value);

    searchParameters.centuryQuery = centurySelect.value;

} 


/*SEARCH BUTTON*/
const searchForm = document.querySelector(".search-form");
const mainSearchButton = document.querySelector(".main-search-btn");
mainSearchButton.addEventListener("click", searchNow)

function searchNow() {

    console.log(searchParameters);

    layerGroup.clearLayers();
    searchForm.reset();
    nameFilter();

}


function nameFilter() {
    
    const centuryFilterItems = [];

    csvResult.forEach(item => {
        const itemName = item.name.trim().toLowerCase(); 

        if(searchParameters.nameQuery == null) {
            centuryFilterItems.push(item);
        } else if(itemName.startsWith(searchParameters.nameQuery[0]) || itemName.startsWith(searchParameters.nameQuery[1]) || itemName.startsWith(searchParameters.nameQuery[2])) {
            centuryFilterItems.push(item);
        }
        
    })

    centuryFilter(centuryFilterItems);

}


function centuryFilter(itemsToFilter) {

    const itemsForDisplay = [];
    

    itemsToFilter.forEach(item => {
        if(searchParameters.centuryQuery == null) {
            itemsForDisplay.push(item);
        } else {
            const lowEnd = searchParameters.centuryQuery.slice(0, 4);
            const highEnd = searchParameters.centuryQuery.slice(-4);

            if(item.year >= lowEnd && item.year <= highEnd) {
                itemsForDisplay.push(item);
            }

        }
        
    })

    displayItems(itemsForDisplay);

}


function displayItems(finalArray) {

    console.log(finalArray);

    finalArray.forEach(item => {

        const markerIcon = L.icon({
            iconUrl: "assets/images/markerIcon.png",
            iconSize: [30, 30],
            iconAnchor: [50, 50],
            popupAnchor: [-35, -55]
        })
        
        marker = L.marker([item.reclat, item.reclong], {
            icon: markerIcon
        }).addTo(layerGroup);
    
        const markerPopup = L.popup().setContent(`
            <ul class="popup-list" style="list-style: none;">
                <li class="popup-list-item"><strong>Id:</strong> ${item.id}</li>
                <li class="popup-list-item"><strong>Name:</strong> ${item.name}</li>
                <li class="popup-list-item"><strong>Record Class:</strong> ${item.recclass}</li>
                <li><strong>Mass (g):</strong> ${item["mass (g)"]}</li>
                <li><strong>Year of Impact:</strong> ${item.year}</li>
                <li><strong>Latitude:</strong> ${item.reclat}</li>
                <li><strong>Longitude:</strong> ${item.reclong}</li>
            </ul>                       
        `);

        marker.bindPopup(markerPopup).addTo(map);

    })

    Object.keys(searchParameters).forEach((i) => searchParameters[i] = null);
    console.log(searchParameters);
}







/*  
EXTRA IDEAS 
1. Limit results to 50/100, etc
*/





    // const yearVals = csvResult.map(item => item.year).filter(value => typeof value === "number");
    //                 console.log(yearVals);
    //                 const max = Math.max(...yearVals);
    //                 const min = Math.min(...yearVals);
    //                 console.log(max);
    //                 console.log(min);
    // console.log(centurySelect.value);