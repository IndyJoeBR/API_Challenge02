// API used: https://api.nasa.gov/
// NASA API Key: uCpgjIIIWQrT2dmBSwx6IIwLgDnc41QSk7VugrYu
// Key use ex: https://api.nasa.gov/planetary/apod?api_key=uCpgjIIIWQrT2dmBSwx6IIwLgDnc41QSk7VugrYu
// Account Email: IndyJoeBRJS@gmail.com
// Account ID: 1ee79900-8ed3-43e9-a313-c79e429a2653


//  **** This will get to the APOD image of the day using my key
// https://api.nasa.gov/planetary/apod?&date=2020-09-29&api_key=uCpgjIIIWQrT2dmBSwx6IIwLgDnc41QSk7VugrYu
//                                    |  date-search   |
//  for the date use today's month# and day#... for the year
//  year_range = today's year# - 2015
//  yearForImageOfDay = Math.floor(Math.random * year_range) + 2015       (gives a range of 2015 to 'this' year)
//

//   *****   DECLARATIONS   *****
const nasaAPODurlBase = "https://api.nasa.gov/planetary/apod?&date=";   // APOD URL
const myNASAkey = "&api_key=uCpgjIIIWQrT2dmBSwx6IIwLgDnc41QSk7VugrYu";  // API key
const jumbotronDIV = document.getElementById("myJumbotron");    // jumbotron element
const defaultJumobtronImage = "./Assets/defaultForJumbotron.jpg";    // default image for jumobtron
const nasaImageBaseURL = "https://images-api.nasa.gov/search";  // NASA image search base url
let searchURL;
const defaultNoImage = "./Assets/noImageAvailable.png"; // default image for a hit with no image
let imageURL = "";


// Search Form & Navigation
const searchForm = document.querySelector('form');
const searchTerm = document.querySelector('#inputImageSearch');
const submitBtn = document.querySelector('#btnSubmit');
const pageUpBtn = document.querySelector('#btnPageUp');
const pageDownBtn = document.querySelector('#btnPageDown');
const singleCardWrapper = document.querySelector('#insertCardsHere');

const startYearSliderRange = document.querySelector('#startYearSliderRange');
const endYearSliderRange = document.querySelector('#endYearSliderRange');
const startSliderOutput = document.querySelector('.startingSliderOutput');
const endSliderOutput = document.querySelector('.endingSliderOutput');
const pageNavigationDisplay = document.querySelector('nav');

const firstCardattribute = "carousel-item active";
const restOfTheCardsattribute = "carousel-item";


//   EVENT LISTENERS
searchForm.addEventListener('submit', fetchResults);    // listening for 'submit'
pageUpBtn.addEventListener('click', pageUp);            // listening for nextPage button
pageDownBtn.addEventListener('click', pageDown);    // listening for previousPage button


// Random date for APOD URL to use in jumbotron
//    - uses today's month and day, but chooses random
//      year between 2015 and this year
//    - the first APOD was on 01-01-2015
let todaysDate = new Date().toISOString();
let thisYear = parseInt(todaysDate.slice(0,4));
let APODdate = dateForAPOD(todaysDate, thisYear);     // creates a date for the url
let apodUrl = nasaAPODurlBase + APODdate + myNASAkey;   // url for jumbotron

// Search variables
startYear = 1958;
endYear = thisYear;

// Set initial styling for Page buttons
pageNavigationDisplay.style.display = 'none';
let pageNumber = 1;
//let displayPageButtons = false;




// **********   SITE FUNCTIONS   **********

//   **********   SEARCH ENGINE & DISPLAY   **********
//   *****   FETCH SEARCH OPTIONS   *****

function fetchResults(e) {

    console.log(e);                 // logs event

    e.preventDefault();             // prevents request from actually being sent, stops refresh

    console.log("Data from search box:", searchTerm.value)
    //console.log("Data from start year:", startYearSliderRange.value)
    //console.log("Data from end year:", endYearSliderRange.value)
    

    // get start & end years
    startYear = startSliderOutput.innerHTML;
    endYear = endSliderOutput.innerHTML;

    //  Corrects the end year to always be greater than the starting year of the search
    if (endYear < startYear) {
      endYear = parseInt(startYear) + 1;
      alert(`The end year cannot be earlier than the start year.\n\nThe end year used will be ${endYear} instead.\n\nThe start and end years may, however be the same.`)
    };

    // get results
    searchURL = nasaImageBaseURL + "?q=" + searchTerm.value + "&year_start=" + startYear + "&year_end=" + endYear + "&media_type=image&page=" + pageNumber;

    console.log(searchURL);

    //   *****   FETCH NASA SEARCH RESULTS   *****
    fetch(searchURL)              // give our search url to fetch and
    .then(function(result) {      // when the promise it creates is resolved
      console.log(result)           // we log those results ('result')
      return result.json();         // and convert those results into a json object
    })                              // once that promis is resolved
    .then(function(jsonSearch) {        // the json is passed to a new function that then
      displayResults(jsonSearch);       // moved the console.log to a displayResults() function
    });

};  //  End of Fetch results


  function displayResults(jsonSearch) {


    //  While there is a firstChild in the card display html it loops through, each time
    //  clearing out the firstChild, until is is empty - having removed all previous search results
    while (singleCardWrapper.firstChild){
      singleCardWrapper.removeChild(singleCardWrapper.firstChild);
    };
    

    console.log("This is the results of jsonSearch.collection.items:")
    // creates reference to search results down to items, now use data and links
    let imageHits = jsonSearch.collection.items;     
    let numberOfHits = imageHits.length;

    let cardClassSetting = "";
  
    console.log("--------------------------------------------------------------");
  
    console.log(imageHits);   //  ***** DELETE THIS *****

      
    console.log("The number of hits on THIS page:", numberOfHits);   //  ***** DELETE THIS *****


    //  Page Up/Down Display
    //  IF there are more than 100 hits, turn on page buttons
    if(numberOfHits === 100 || pageNumber > 1) {   // shows buttons if above page 0 OR
      pageNavigationDisplay.style.display = 'block'; //shows the nav display if 100 items are in the array or user is above page 1
      // SHOW THE PAGE BUTTONS
      console.log("Showing < Page >");
    } else {
      pageNavigationDisplay.style.display = 'none'; //hides the nav display if less than 100 items are in the array
        // HIDE THE PAGE BUTTONS
        console.log("Hiding page buttons");
      }


    console.log("}}}}}=====----- INDIVIDUAL CARDS BELOW -----====={{{{{");

    if(numberOfHits === 0) {             //  Are there any hits to display?
          console.log("NO RESULTS");     //  If not, send an alert
          alert("There were no hits for your search criteria.");
    } else {      // If there are, began card display loop

      // FOR loop to go through each hit and write HTML
      for(let i = 0; i < numberOfHits; i++) {

        console.log("--------------------------------------");
        console.log("This is index:" ,i);

        // Determines appropriate class for card, 1st card MUST be "active"
        if(i === 0) {
            cardClassSetting = "carousel-item active";
        } else {
            cardClassSetting = "carousel-item";
          };

        let currentHit = imageHits[i];

        // Sets image title
        let imageTitle = currentHit.data[0].title;
        // Sets the date to be displayed
        let imageDate = currentHit.data[0].date_created;
        imageDate = imageDate.slice(0,10);
        // Sets the media type
        let imageType = currentHit.data[0].media_type;
        //Sets short desciprtion
        let imageDescription = currentHit.data[0].description_508;  // .description can be excessively long
        if(imageDescription === undefined) {
            imageDescription = "No description available"    // if none, provide a statment
        };
        console.log("This is the short descprtion:", imageDescription);
        // Sets image to be used
        if (imageType === "image") {
            imageURL = currentHit.links[0].href;  // image provided
        } else {
            imageURL = defaultNoImage;  // provide a default image
          };

        // Create HTML lines for each card

        //  1st line:  <div class="${cardClassSetting}" data-interval="10000">  -  goes into singleCardWrapper
        let line01DIV = document.createElement('div');
        line01DIV.setAttribute("class", cardClassSetting);
        line01DIV.setAttribute("data-interval", "10000");

        // 2nd line:  <div class="centeringTESTcss">  -  goes into 1
        let line02DIV = document.createElement('div');
        line02DIV.setAttribute("class", "centeringTESTcss");

        // 3rd line: div class="card" style="width: 18rem;">   -  goes into 2
        let line03DIV = document.createElement('div');
        line03DIV.setAttribute("class", "card");
        line03DIV.setAttribute("style", "width: 25rem;");

        // 4th line: <img src="${imageURL}" class="card-img-top" alt="...">  -  goes into 3
        let line04IMG = document.createElement('img');
        line04IMG.setAttribute("src", imageURL);
        line04IMG.setAttribute("class", "card-img-top");
        line04IMG.setAttribute("alt", "...");

        // 5th line: <div class="card-body">  -  goes into 3
        let line05DIV = document.createElement('div');
        line05DIV.setAttribute("class", "card-body");

        // 6th line:  <h5 class="card-title">${imageTitle}</h5>  -  goes into 5
        let line06H5 = document.createElement('h5');
        line06H5.setAttribute("class", "card-title");
        line06H5.textContent = imageTitle;

        // 7th line:  <h6 class="card-subtitle mb-2 text-muted">${imageDate} / ${imageType}</h6>  -  goes into 5
        let line07H6 = document.createElement('h6');
        line07H6.setAttribute("class", "card-subtitle mb-2 text-muted");
        line07H6.textContent = `${imageDate}`;
          // IF site is expanded beyond images, add ${imageType} after date

        // 8th line: <p class="card-text">${imageDescription}</p>  -  goes into 5
        let line08P = document.createElement('p');
        line08P.setAttribute("class","card-text");
        line08P.textContent = `${imageDescription}`;

        // 9th line:  <a href="${imageURL}" target="_blank" class="btn btn-primary">View Image</a>  -  goes into 5
        let line09A = document.createElement('a');
        line09A.setAttribute("href",`${imageURL}`);
        line09A.setAttribute("target","_blank");
        line09A.setAttribute("class","btn btn-primary viewImageButtonShift");
        line09A.textContent = "View Image";


        // APPENDS
        line05DIV.appendChild(line06H5);
        line05DIV.appendChild(line07H6);
        line05DIV.appendChild(line08P);
        line05DIV.appendChild(line09A);

        line03DIV.appendChild(line04IMG);
        line03DIV.appendChild(line05DIV);

        line02DIV.appendChild(line03DIV);

        line01DIV.appendChild(line02DIV);

        singleCardWrapper.appendChild(line01DIV)


            /*             EXAMPLE HTML for individual card
    1)    <div class="${cardClassSetting}" data-interval="10000">
    2)      <div class="centeringTESTcss">
    3)        <div class="card" style="width: 16rem;">
    4)          <img src="${imageURL}" class="card-img-top" alt="...">
    5)          <div class="card-body">
    6)            <h5 class="card-title">${imageTitle}</h5>
    7)            <h6 class="card-subtitle mb-2 text-muted">${imageDate} (${imageType})</h6>
    8)            <p class="card-text">${imageDescription}</p>
    9)            <a href="${imageURL}" target="_blank" class="btn btn-primary viewImageButtonShift">View Image</a>
              </div>
             </div>
           </div>
        </div>
            */


        };    //  END OF For Loop to write HTML cards
      };   // END OF There are images to display condition.
  };    //  END OF displayResults function


//   *****   SLIDER FUNCTIONS   *****  
function startSliderUpdates(startInput) {

  startSliderOutput.innerHTML = startInput;
  
}

function endSliderUpdates(endInput) {

  endSliderOutput.innerHTML = endInput;

}


//   *****   BUTTON FUNCTIONS   *****
function pageUp(e) {              // 'e' - the original object - is passed into the function
    pageNumber++;       // increases the value of the pageNumber variable
    fetchResults(e);    // rerun the fetch with a new pageNumber in the URL (line 49)
    console.log("Page number:", pageNumber);    // log the page number for review
};

function pageDown(e) {       // 'e' - the original object - is passed into the function
    if(pageNumber > 1) {    // if the button is pressed and the pageNumber is above 1st page,
    pageNumber--;           //     it reduces the pageNumber by 1   (pageNumber - 1)
    } else {                // if this is the first page (page 0),
    return;                 //     the button simple doesn't work
    }
fetchResults(e);          // rerun the fetch with a new pageNumber in the URL (line 49)
console.log("Page number:", pageNumber);    // log the page number for review
};



//   **********   JUMBOTRON   **********
//   *****   FETCH JUMBOTRON IMAGE   ***** 
function fetchJumobtronImage(imageURL) {
    fetch(imageURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonAPOD) {
            console.log("Image sent to jumbotron:", jsonAPOD);
            sendImageToJumbotron(jsonAPOD);
        })
        .catch(function(err) {
            console.log('Fetch Error: ', err);
        });

};  //  End of jumbotron image fetch


//   *****   SENDS APOD OR DEFAULT IMAGE TO JUMBOTRON   ***** 
function sendImageToJumbotron(jsonAPOD, imageError) {

    if(jsonAPOD.media_type === "video" || jsonAPOD.code === 404 || jsonAPOD.media_type === "other") {
        console.log("No image available; use default NASA image.");
        
        let addedInlineStyle = "background-image: url('" + defaultJumobtronImage + "')";

        console.log(addedInlineStyle);          //  **********   DELETE   **********
        jumbotronDIV.setAttribute("style", addedInlineStyle);
    } else {
        console.log("Sending APOD url")
        // add inline style of background-image to <div> with 'container' class

        let addedInlineStyle = "background-image: url('" + jsonAPOD.url + "')";

        console.log(addedInlineStyle);          //  **********   DELETE   **********
        jumbotronDIV.setAttribute("style", addedInlineStyle);
    }
};  //  End sending random year APOD to jumbotron


//   *****   CREATES DATE FOR RANDOM APOD IMAGE   *****
function dateForAPOD(todaysDate, thisYear) {
    //let todaysDate = new Date().toISOString();
    //let thisYear = parseInt(todaysDate.slice(0,4));
    let thisMonthDay = todaysDate.slice(4,10);

    // allows for random year between 2015 and current
    let yearRange = thisYear - 2015 + 1;

    // random number to add to 2015
    let yearForImageOfDay = Math.floor(Math.random() * yearRange);
    
    // calculates random year and converts it to a string
    yearForImageOfDay = (yearForImageOfDay + 2015).toString();

    // concatenates the random year with today's month and day
    let dateForAPODurl = yearForImageOfDay + thisMonthDay;

    return dateForAPODurl;

};  // End of random APOD date determination


///   *****   WHEN THE EAGLE HAS LANDED   ***** 
fetchJumobtronImage(apodUrl);

/*
//  *********      RESTORE fetchJumobtronImage ABOVE UPON COMPLETION   *************
let addedInlineStyle = "background-image: url('" + defaultJumobtronImage + "')";
console.log("TEMPORARY - set to default so as not to use up daily uses")
console.log(addedInlineStyle);          //  **********   DELETE   **********
jumbotronDIV.setAttribute("style", addedInlineStyle);
//  **************      DELETE ABOVE SECTION UPON COMPLETION   *********************
*/