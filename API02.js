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
const startYearSlider = document.querySelector('#startYearSliderRange');
const endYearSlider = document.querySelector('#endYearSliderRange');
const submitBtn = document.querySelector('#btnSubmit');
const pageUpBtn = document.querySelector('#btnPageUp');
const pageDownBtn = document.querySelector('#btnPageDown');
const singleCardWrapper = document.querySelector('.carousel-inner');

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

//  Search variables
let pageNumber = 1;


// Set Range Sliders
let searchstartYearSlider = 1950;
let searchendYearSlider = thisYear;
let searchstartYearSliderMax = thisYear - 1;

console.log("Start year slider max year");
console.log("Start year max type:", typeof searchstartYearSliderMax);
console.log("Start year max:", searchstartYearSliderMax)


console.log("End year slider max year");
console.log("End year type:", typeof searchendYearSlider);
console.log("End year max:", searchendYearSlider);



//startYearSlider.setAttribute("max", searchstartYearSliderMax);
//endYearSlider.setAttribute("max", searchendYearSlider);



// **********   SITE FUNCTIONS   **********

//   **********   SEARCH ENGINE & DISPLAY   **********
//   *****   FETCH SEARCH OPTIONS   *****

function fetchResults(e) {

    console.log(e);                 // logs event

    e.preventDefault();             // prevents request from actually being sent, stops refresh


    console.log("Data from search box:", searchTerm.value)
    //console.log("Data from start year:", startYearSlider.value)
    //console.log("Data from end year:", endYearSlider.value)
    
    // get results
    searchURL = nasaImageBaseURL + "?q=" + searchTerm.value + "&year_start=" + 1950 + "&year_end=" + 2020 + "&page=" + pageNumber;

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

      console.log("This is the results of jsonSearch.collection.items:")
      // creates reference to search results down to items, now use data and links
      let imageHits = jsonSearch.collection.items;     
      let numberOfHits = imageHits.length;
      let cardClassSetting = 0;

      console.log("--------------------------------------------------------------");

      console.log(imageHits);

      // REMOVE PREVIOUS ELEMENTS IF NECESSARY
        // a while loop


      
      console.log("The number of hits on THIS page:");
      console.log(numberOfHits);

      //  IF there are more than 100 hits, turn on page buttons
      if(numberOfHits === 100 || pageNumber > 1) {   // shows buttons if above page 0 OR
        //nav.style.display = 'block'; //shows the nav display if 10 items are in the array
        // SHOW THE PAGE BUTTONS
        console.log("Showing < Page >");
        } else {
        //nav.style.display = 'none'; //hides the nav display if less than 10 items are in the array
        // HIDE THE PAGE BUTTONS
        console.log("Hiding page buttons");
        }


      if(numberOfHits === 0) {              //  Are there any hits to display?
          console.log("NO RESULTS");        //  If not, send an alert
          alert("There were no hits for your search criteria.");
      } else {      // If there are, began card display loop

        // FOR loop to go through each hit and write HTML
        for(let i = 0; i < numberOfHits; i++) {

            console.log("--------------------------------------");

            // Determines appropriate class for card, 1st card MUST be "active"
            if(i === 0) {
                cardClassSetting = firstCardattribute;
            } else {
                cardClassSetting = restOfTheCardsattribute;
            };

            console.log("Class setting is:", cardClassSetting); // *****  DELETE  *****

            let currentHit = imageHits[i];
            console.log(currentHit.data[0]);


            //check for a short desciprtion
            let imageDescription = currentHit.data[0].description_508;
            if(imageDescription === undefined) {
                imageDescription = "No description available"    // if none, provide a statment
            };
            console.log("This is the short descprtion:", imageDescription)

            let imageTitle = currentHit.data[0].title;
            console.log("This is the title:", imageTitle)

            let imageDate = currentHit.data[0].date_created;
            imageDate = imageDate.slice(0,10);
            console.log("This is the date created:", imageDate)

            let imageType = currentHit.data[0].media_type;
            console.log("This is the media type:", imageType)

            // Check for image availability
            if (imageType === "image") {
                imageURL = currentHit.links[0].href;
            } else {
                imageURL = defaultNoImage;  // provide a default image
            };
            console.log("This is the image URL:")
            console.log(imageURL);


            // Create HTML - appened below <div class="carousel-inner">
            singleCardWrapper





        };    //  END of for loop to write HTML cards


      };   // END OF Are there images to display loop



      

  };    //  END OF displayResults function














//   *****   BUTTON FUNCTIONS   *****
function pageUp() {              // 'e' - the original object - is passed into the function
    pageNumber++;       // increases the value of the pageNumber variable
    //fetchResults(e);    // rerun the fetch with a new pageNumber in the URL (line 49)
    console.log("Page number:", pageNumber);    // log the page number for review
};

function pageDown() {       // 'e' - the original object - is passed into the function
    if(pageNumber > 1) {    // if the button is pressed and the pageNumber is above 1st page,
    pageNumber--;           //     it reduces the pageNumber by 1   (pageNumber - 1)
    } else {                // if this is the first page (page 0),
    return;                 //     the button simple doesn't work
    }
//fetchResults(e);          // rerun the fetch with a new pageNumber in the URL (line 49)
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
            console.log("Sending to send function:", jsonAPOD);
            sendImageToJumbotron(jsonAPOD);
        })
        .catch(function(err) {
            console.log('Fetch Error: ', err);
        });

};  //  End of jumbotron image fetch


//   *****   SENDS APOD OR DEFAULT IMAGE TO JUMBOTRON   ***** 
function sendImageToJumbotron(jsonAPOD, imageError) {
    console.log("I have received Jason.")       //  **********   DELETE   **********
    console.log(jsonAPOD.url);                  //  **********   DELETE   **********
    console.log(jsonAPOD.media_type);           //  **********   DELETE   **********
    console.log(jsonAPOD.code);                 //  **********   DELETE   **********

    if(jsonAPOD.media_type === "video" || jsonAPOD.code === 404) {
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
//  fetchJumobtronImage(apodUrl);   *********  RESTORE NEAR COMPLETION


//  *********      RESTORE fetchJumobtronImage ABOVE UPON COMPLETION   *************
let addedInlineStyle = "background-image: url('" + defaultJumobtronImage + "')";
console.log("TEMPORARY - set to default so as not to use up daily uses")
console.log(addedInlineStyle);          //  **********   DELETE   **********
jumbotronDIV.setAttribute("style", addedInlineStyle);
//  **************      DELETE ABOVE SECTION UPON COMPLETION   *********************
