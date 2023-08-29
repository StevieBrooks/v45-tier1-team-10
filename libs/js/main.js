/*======================WINDOW ONLOAD===================*/
let csvResult = null;
let finalItems = null;
let resultsTableContainer = null;

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
                            finalItems = csvResult;
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


/*====================GET STARTED========================*/

const brandLogo = document.querySelector(".project-title");
const openingInfo = document.querySelector(".opening-info");
const ctaButton = document.querySelector(".cta-btn");

ctaButton.addEventListener("click", () => {
    ctaButton.style.display = "none";
    openingInfo.style.display = "none";
    resultsTableContainer = document.querySelector(".table-container");
    resultsTableContainer.style.display = "block";
      // Initial render
    updatePagination();
    renderTable(currentPage);
})

brandLogo.addEventListener("click", () => {
    ctaButton.style.display = "block";
    openingInfo.style.display = "block";
})


/*=======================INSTALL MAP===================== */

// let map = L.map("map").setView([41.505, -0.09], 2);

// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '© OpenStreetMap'
// }).addTo(map);

// let layerGroup = L.layerGroup().addTo(map);
// let marker = null;


/*==================LOGIC FOR TABLE====================*/

const itemsPerPage = 10;

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
    resultsTableBody.innerHTML = ""; // Clear existing table rows
    console.log(finalItems);
  
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    for (let i = startIndex; i < endIndex && i < finalItems.length; i++) {
      const item = finalItems[i];
      // Create a new table row and populate it with data
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.recclass}</td>
        <td>${item["mass (g)"]}</td>
        <td>${item.year}</td>
        <td>${item.reclat}</td>
        <td>${item.reclong}</td>
      `
      resultsTableBody.append(newRow);
      

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
  



/*========================TOGGLE FUNCTIONS==================*/

const contentDisplay = document.querySelector(".content-display");
const toggleMap = document.querySelector(".table-map-mode");
toggleMap.addEventListener("click", toggleMapFunction);

function toggleMapFunction() {
    contentDisplay.classList.toggle("map-mode");
}


const footer = document.querySelector("footer");
const toggleFooter = document.querySelector(".footer-up-down");
toggleFooter.addEventListener("click", toggleFooterFunction);

function toggleFooterFunction() {
    footer.classList.toggle("footer-up");
    resetFunction();
}



 /*====================SEARCH FUNCTIONS===================*/

 const searchParameters = {
    openQuery: null,
    nameQuery: null,
    centuryQuery: null,
    massQuery: null
 }
 

/*MAIN SEARCH BAR*/
let mainSearchInput = null;
const mainSearch = document.querySelector(".main-search");

mainSearch.addEventListener("click", clearNameInput);
function clearNameInput() {
    if(nameInput.value.length > 0) {
        nameInput.value = "";
        finalItems = csvResult;
        searchParameters.nameQuery = null;
        console.log(searchParameters);
    }
}

mainSearch.addEventListener("change", searchBar);
function searchBar() {
    
    mainSearchInput = document.querySelector(".main-search").value.trim().toLowerCase();
    searchParameters.openQuery = mainSearchInput;
    textInputFunction();
    
}

function textInputFunction() {

    console.log(mainSearchInput);

    if(finalItems.length < 38115) {
        finalItems = finalItems.filter(item => {
            return item.name.includes(mainSearchInput);
        })
    } else {
        finalItems = [];
        csvResult.forEach(item => {
            const itemName = item.name.trim().toLowerCase(); 
            if(itemName.includes(mainSearchInput)) {
                finalItems.push(item);
            }
        })
    }

}


/*NAME SEARCH INPUT*/
let nameChoice = null;
const nameInput = document.querySelector(".name-select");

nameInput.addEventListener("change", nameInputFunction);

function nameInputFunction() {

    if(mainSearch.value.length > 0) {
        mainSearch.value = "";
        searchParameters.openQuery = null;
        finalItems = csvResult;
    }

    nameChoice = Array.from(nameInput.value);
    console.log(nameChoice);
    searchParameters.nameQuery = nameChoice;
    nameFilter();

}


function nameFilter() {

    if(finalItems.length < 38115) {
        finalItems = finalItems.filter(item => {
            const itemName = item.name.trim().toLowerCase(); 
            return itemName.startsWith(searchParameters.nameQuery[0]) || itemName.startsWith(searchParameters.nameQuery[1]) || itemName.startsWith(searchParameters.nameQuery[2]);
        })
    } else {

        finalItems = [];
    
        csvResult.forEach(item => {
            const itemName = item.name.trim().toLowerCase(); 
            if(itemName.startsWith(searchParameters.nameQuery[0]) || itemName.startsWith(searchParameters.nameQuery[1]) || itemName.startsWith(searchParameters.nameQuery[2])) {
                        finalItems.push(item);
                    }
            
        })
    }

    console.log(finalItems.length);
}


/*CENTURY SEARCH INPUT*/
const centurySelect = document.querySelector(".century-select");

centurySelect.addEventListener("change", centuryInputFunction);

function centuryInputFunction() {

    console.log(centurySelect.value);

    searchParameters.centuryQuery = centurySelect.value;

    centuryFilter();

} 


function centuryFilter() {

    const lowEnd = searchParameters.centuryQuery.slice(0, 4);
    const highEnd = searchParameters.centuryQuery.slice(-4);

    if(finalItems.length < 38115) {
        finalItems = finalItems.filter(item => {
            return item.year >= lowEnd && item.year <= highEnd;
        })
    } else {
        finalItems = [];   

        csvResult.filter(item => {
            if(item.year >= lowEnd && item.year <= highEnd) {
                finalItems.push(item);
            }
        })
    } 
    console.log(finalItems.length);
}

/*MASS SEARCH INPUT*/
const massSelect = document.querySelector(".mass-select");
massSelect.addEventListener("change", massInputFunction);

function massInputFunction() {

    searchParameters.massQuery = massSelect.value;

    massFilter();
    
}

function massFilter() {

    const lowMass = searchParameters.massQuery.slice(0, 8);
    const highMass = searchParameters.massQuery.slice(-8);

    if(finalItems.length < 38115) {
        finalItems = finalItems.filter(item => {
            return item["mass (g)"] >= lowMass && item["mass (g)"] <= highMass;
        })
    } else {
        finalItems = [];

        csvResult.filter(item => {
            if(item["mass (g)"] >= lowMass && item["mass (g)"] <= highMass) {
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

    footer.classList.toggle("footer-up");

    console.log(contentDisplay.classList);

    if (contentDisplay.classList.contains("map-mode")) {
        console.log("Map mode is active");
        // displayResultsMap();
    } else {
        console.log("Table mode is active");
        displayResultsTable();
    }

    
    searchForm.reset();
    

    setTimeout(function() {
        // finalItems = csvResult;
        Object.keys(searchParameters).forEach((i) => searchParameters[i] = null);
    console.log(searchParameters);
    }, 1000); 

}


function displayResultsTable() {

    resultsTableBody.innerHTML = "";

    currentPage = 1;

    renderTable(currentPage);

    // finalItems.forEach(item => {

    //     let newRow = document.createElement('tr');
    //     newRow.innerHTML = `
    //     <td>${item.id}</td>
    //     <td>${item.name}</td>
    //     <td>${item.recclass}</td>
    //     <td>${item["mass (g)"]}</td>
    //     <td>${item.year}</td>
    //     <td>${item.reclat}</td>
    //     <td>${item.reclong}</td>
    //     `
    //     resultsTableBody.append(newRow);
    
    // })

}


// function displayResultsMap() {
//     console.log(finalItems);
//     console.log(layerGroup);

//     layerGroup.clearLayers();



//     finalItems.forEach(item => {

//         const markerIcon = L.icon({
//             iconUrl: "assets/images/markerIcon.png",
//             iconSize: [30, 30],
//             iconAnchor: [50, 50],
//             popupAnchor: [-35, -55]
//         })
        
//         marker = L.marker([item.reclat, item.reclong], {
//             icon: markerIcon
//         }).addTo(layerGroup);
    
//         const markerPopup = L.popup().setContent(`
//             <ul class="popup-list" style="list-style: none;">
//                 <li class="popup-list-item"><strong>Id:</strong> ${item.id}</li>
//                 <li class="popup-list-item"><strong>Name:</strong> ${item.name}</li>
//                 <li class="popup-list-item"><strong>Record Class:</strong> ${item.recclass}</li>
//                 <li><strong>Mass (g):</strong> ${item["mass (g)"]}</li>
//                 <li><strong>Year of Impact:</strong> ${item.year}</li>
//                 <li><strong>Latitude:</strong> ${item.reclat}</li>
//                 <li><strong>Longitude:</strong> ${item.reclong}</li>
//             </ul>                       
//         `);

//         marker.bindPopup(markerPopup).addTo(map);

//     })
// }


/*=====================RESET BUTTON==================*/
const resetButton = document.querySelector(".reset-btn");
resetButton.addEventListener("click", resetFunction);

function resetFunction() {
    // layerGroup.clearLayers();
    currentPage = 1;
    finalItems = csvResult;
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



/*  
EXTRA IDEAS 
1. Limit results to 50/100, etc
*/


// bug - if user changes mind with param (eg wants 1900 instead of 2000), zero results
