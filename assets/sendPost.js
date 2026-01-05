// Functions used in HTML files containing the form to submit parameters for RDF to CSV conversion

// Initialize rate limiter to prevent abuse (max 5 requests per minute)
const rateLimiter = new RateLimiter(5, 60000);

// The form for submitting parameters for RDF to CSV conversion
const form = document.querySelector("#rdfandconfiguration");
// Place for information about the fetched response
const previewLabel = document.querySelector("#previewLabel");
const divForResponse = document.querySelector("#responsePlace");
// Input for file loading
const fileInput = document.getElementById('file');
// Input for writing RDF file URL
const fileURLElement = document.getElementById('fileURL');
// Span containing all the file options
const spanForFileInput = document.getElementById('spanForFileInput');
// Drop zone for file loading
const dropZone = document.getElementById('drop-zone');
// Place for error message to be shown
const errorMessageElement = document.getElementById('errorMessage');
// Element for showing the status of the web service
const healthCheckStatusElement = document.getElementById('healthCheckStatus');
// The button hiding more parameters
const toggleButton = document.getElementById('toggleButton');


// Send the form and accept response
document.getElementById('rdfandconfiguration').addEventListener('submit', async function (event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const pageLang = document.documentElement.lang;

  // Clear any previous error message
  errorMessageElement.style.color = 'red';
  errorMessageElement.style.display = 'none'; // Hide any previous message
  errorMessageElement.innerText = ''; // Clear previous content

  // SECURITY: Rate limiting check
  if (!rateLimiter.allowRequest()) {
    const waitTime = Math.ceil(rateLimiter.getTimeUntilNextRequest() / 1000);
    errorMessageElement.style.display = 'block';
    setTextSafely(errorMessageElement, 
      pageLang === 'cs' 
        ? `Příliš mnoho požadavků. Počkejte prosím ${waitTime} sekund.`
        : `Too many requests. Please wait ${waitTime} seconds.`);
    return;
  }

  // SECURITY: Validate form data before submission
  const validation = validateFormData(formData);
  if (!validation.isValid) {
    errorMessageElement.style.display = 'block';
    setTextSafely(errorMessageElement, validation.errors.join(' '));
    return;
  }

  // SECURITY: Validate URL if provided
  const fileURL = formData.get('fileURL');
  if (fileURL && fileURL.trim() !== '') {
    if (!isValidURL(fileURL.trim())) {
      errorMessageElement.style.display = 'block';
      setTextSafely(errorMessageElement,
        pageLang === 'cs'
          ? 'Neplatná URL adresa. Použijte prosím platnou http nebo https URL.'
          : 'Invalid URL. Please use a valid http or https URL.');
      return;
    }
  }

  try {


    const response = await fetch("https://rdf-to-csvw.onrender.com/rdftocsvw", {
      method: "POST",
      body: formData // Let the browser set the content-type
    });

    if (response.status == null) {
      throw new Error(`Error: CORS`);
    } else if (response.status === 409) {
      // Handle file locking error
      alert('The file is currently in use. Please try again later.');
    } else if (!response.ok) {
      // If the response is not ok, throw an error
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.blob();
    const file = new Blob([data], { type: 'application/zip' });

    const fileURL = URL.createObjectURL(file);

    const anchorTag = document.createElement('a');
    anchorTag.href = fileURL;
    anchorTag.target = '_blank';
    let inputField = fileURLElement.value.trim();
    if (inputField != "") {
      // SECURITY: Sanitize filename from URL
      const sanitizedURL = sanitizeText(fileURLElement.value.split('/').pop().split('?')[0]);
      anchorTag.download = sanitizedURL + '-resultingCSVW.zip';
    } else {
      // SECURITY: Sanitize filename before use
      const fileName = sanitizeText(fileInput.files[0].name);
      anchorTag.download = fileName + ".zip";
    }
    //anchorTag.download = 'resultingCSVW.zip'; 
    document.body.appendChild(anchorTag);
    anchorTag.click();
    document.body.removeChild(anchorTag);

    errorMessageElement.style.display = 'block';
    const pageLang = document.documentElement.lang;
    if (pageLang == "cs") {
      errorMessageElement.style.color = 'green';
      setTextSafely(errorMessageElement, 'Konvertovaný soubor úspěšně dorazil.');
    } else {
      errorMessageElement.style.color = 'green';
      setTextSafely(errorMessageElement, 'The converted file has been successfully delivered.');
    }



  } catch (e) {
    // SECURITY: Display safe error message without exposing technical details
    errorMessageElement.style.display = 'block';
    const pageLang = document.documentElement.lang;
    const safeMessage = getSafeErrorMessage(e, pageLang);
    setTextSafely(errorMessageElement, safeMessage);

    // Log detailed error for debugging (only visible in browser console)
    console.error('Form submission error:', e);
  }
});


// Check if at least one of the file option is used
function checkAtLeastOneFileOptionIsUsed() {
  let inputField = fileURLElement.value.trim();
  if (inputField != "") {
    return true;
  }
  if (fileInput.files.length > 0) {
    return true;
  }
  return false;

}


function fetchWithTimeout(url, options, timeout = 5000) {
  return new Promise((resolve, reject) => {
    // Set up the timeout
    const timer = setTimeout(() => {
      reject(new Error("Request timed out"));
    }, timeout);

    // Perform the fetch
    fetch(url, options)
      .then(response => {
        clearTimeout(timer); // Clear the timeout if response is received
        resolve(response);   // Resolve with the response
      })
      .catch(err => {
        clearTimeout(timer); // Clear the timeout on error
        reject(err);         // Reject with the error
      });
  });
}

// Clear the file loading input
function clearFileInput() {
  document.getElementById('file').value = '';
  // If no file is selected, revert to the original text
  const pageLang = document.documentElement.lang;
  if (pageLang == "cs") {
    spanForFileInput.textContent = "...nebo vyberte soubor";
  } else {
    spanForFileInput.textContent = "...or select a file";
  }

}

// Manage the file input by language and contents of the input
fileInput.addEventListener('change', function () {
  // Check if a file has been selected
  if (fileInput.files.length > 0) {
    // Get the name of the file
    const fileName = fileInput.files[0].name;
    // SECURITY: Sanitize filename before display
    const sanitizedName = sanitizeText(fileName);
    // Change the span text to the file name
    const truncatedFileName = truncateString(sanitizedName, 17);
    spanForFileInput.textContent = (truncateString.length == sanitizedName) ? sanitizedName : truncatedFileName + "...";
  } else {
    // If no file is selected, revert to the original text
    const pageLang = document.documentElement.lang;
    if (pageLang == "cs") {
      spanForFileInput.textContent = "...nebo vyberte soubor";
    } else {
      spanForFileInput.textContent = "...or select a file";
    }

  }
});

// Add listener to clear the error message label when the submit button is clicked
submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', function () {
  errorMessageElement.innerText = ``;
});

// Add event listener to the clear button
document.getElementById('clearButton').addEventListener('click', function (event) {
  event.preventDefault(); // Prevents form submission
  clearFileInput();
  console.log('Button clicked without form submission');
});


$(function () {
  var dropZoneId = "drop-zone";
  //var buttonId = "clickHere";
  var buttonId = "spanForFileInput";
  var mouseOverClass = "mouse-over";
  var fileInputId = "file";

  var dropZone = $("#" + dropZoneId);

  // Prevent default behaviors for dragover and drop
  document.getElementById(dropZoneId).addEventListener("dragover", function (e) {
    e.preventDefault(); // Prevent default to stop file from opening
    e.stopPropagation(); // Stop propagation
    dropZone.addClass(mouseOverClass);
  }, true);

  // Add dragging file loading listener to drop zone div
  document.getElementById(dropZoneId).addEventListener("dragleave", function (e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.removeClass(mouseOverClass);
  }, true);

  // File drop zone function for loading file
  document.getElementById(dropZoneId).addEventListener("drop", function (e) {
    e.preventDefault(); // Prevent default to stop file from opening
    e.stopPropagation(); // Stop propagation
    dropZone.removeClass(mouseOverClass);

    // Get the dropped files
    const files = e.dataTransfer.files;

    if (files.length > 0) {
      console.log("Files dropped:", files);
      // Assign dropped file to the file input element
      fileInput.files = files;  // Access the DOM element using [0] to set files

      // Manually trigger the 'change' and 'input' event
      const event = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(event);  // Trigger the event on the element
      const eventForDeterminingRequired = new Event('input', { bubbles: true });
      fileInput.dispatchEvent(eventForDeterminingRequired);  // Trigger the event on the element

      // Display file name to the user
      if (files.length > 0) {
        //document.getElementById("fileName").textContent = files[0].name;
        console.log("File dropped: " + files[0].name);
      }
    } else {
      console.error("No files were dropped.");
    }
  }, true);

  document.getElementById(buttonId).addEventListener("click", function (e) {
    console.log("Drag listener called and before if path");
    if ($("#" + fileInputId).val().length != 0) {
      console.log("Drag listener called and in if path");
    }
  }, true);
});


// Require at least one of the two required inputs
document.addEventListener('DOMContentLoaded', function () {
  const inputs = Array.from(
    document.querySelectorAll('input[name=file], input[name=fileURL]')
  );

  const inputListener = e => {
    inputs
      .filter(i => i !== e.target)
      .forEach(i => (i.required = !e.target.value.length));
  };

  inputs.forEach(i => i.addEventListener('input', inputListener));
});

// Require at least one of the two required inputs
document.addEventListener('DOMContentLoaded', function () {
  if (fileURLElement.value.trim != "") {
    fileInput.required = false;
  } else {
    fileInput.required = true;
  }
  if (fileInput.files.length > 0) {
    fileURLElement.required = false;
  } else {
    fileURLElement.required = true;
  }
});

// Delete last characters of string input exceeding limit
function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...'; // Optional: Add ellipsis to indicate truncation
  }
  return str;
}

// Countdown for showing how long to wait before trying to send another conversion request
let countdownInterval = null;
let isCountingDown = false;

document.getElementById('submitButton').addEventListener('click', function (event) {
  //event.preventDefault();  // Prevent form submission for demo purposes

  let countdown = document.getElementById('countdown');
  let patienceText = document.getElementById('patienceText');

  if (isCountingDown) {
    // If countdown is already running, clear the existing interval and reset the countdown
    clearInterval(countdownInterval);
    countdown.style.display = 'none';  // Hide the countdown
    patienceText.style.display = 'none';
    isCountingDown = false;
  }

  let timeLeft = 60;
  countdown.style.display = 'block';  // Show the countdown
  patienceText.style.display = 'block';
  countdown.textContent = timeLeft;   // Set initial time

  countdownInterval = setInterval(function () {
    timeLeft--;
    countdown.textContent = timeLeft;  // Update the countdown

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);  // Stop the countdown at 0
      countdown.style.display = 'none';  // Hide the countdown
      patienceText.style.display = 'none';
    }
  }, 1000);  // Decrease the countdown every second (1000ms)
  isCountingDown = true;
});

// Create a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver((mutationsList) => {
  mutationsList.forEach(mutation => {
    if (mutation.type === 'childList' || mutation.type === 'characterData') {
      // The text content of errorMessageElement has changed
      if (isCountingDown) {
        clearInterval(countdownInterval);
        countdown.style.display = 'none';
        patienceText.style.display = 'none';
        isCountingDown = false;
      }
    }
  });
});

// Configure the observer to listen for changes in text content
observer.observe(errorMessageElement, {
  childList: true,  // Watch for changes in child elements (e.g., textContent changes)
  characterData: true, // Watch for changes to the text nodes
  subtree: true  // Include changes inside the element
});

// Setting of the toggle button for choosing more parameters
window.addEventListener('DOMContentLoaded', () => {
  const toggleLabel = document.getElementById('toggleButton');
  const pageLang = document.documentElement.lang;  // Get the page language

  if (pageLang === "cs") {
    toggleLabel.setAttribute('data-tooltip', 'Klikněte pro vybrání dalších parametrů');
  } else {
    toggleLabel.setAttribute('data-tooltip', 'Click to choose from other parameters');
  }

  // Check the service health every 5 seconds
  setInterval(checkServiceHealth, 5000);

  // Start with the spinning wheel until the first check
  showLoadingWheel();
});

// Function for pinging web service if its available
function checkServiceHealth() {
  fetch('https://rdf-to-csvw.onrender.com/', {
    mode: 'no-cors' // Allow request without CORS, but can't read response
  })
    .then(response => {
      // With no-cors mode, we can't check response.ok, but if fetch succeeds, service is up
      // If the fetch completes without error, assume service is ready
      document.getElementById('greenArrow').style.display = 'block';
      document.getElementById('loadingWheel').style.display = 'none';
      const pageLang = document.documentElement.lang;
      if (pageLang == "cs") {
        healthCheckStatusElement.textContent = "Webová služba je připravená!";
      } else {
        healthCheckStatusElement.textContent = "The Web Service is ready!";
      }
      activateButton();
    })
    .catch(error => {
      // If there is an error or the server does not respond, show the spinning wheel
      console.error('Health check failed:', error);
      showLoadingWheel();
    });
}

// Show the loading wheel and deactivate submit button if the web service is not ready
function showLoadingWheel() {
  document.getElementById('greenArrow').style.display = 'none';
  document.getElementById('loadingWheel').style.display = 'block';
  const pageLang = document.documentElement.lang;
  if (pageLang == "cs") {
    healthCheckStatusElement.textContent = "Webová služba se načítá...";
  } else {
    healthCheckStatusElement.textContent = "The Web Service is loading...";
  }
  deactivateButton();
}

// Function to activate the button
function activateButton() {
  submitButton.classList.remove('submitButtonDisactivated');
  submitButton.classList.add('submitButton');
  submitButton.disabled = false; // Enable the button
}

// Function to deactivate the button
function deactivateButton() {
  submitButton.classList.remove('submitButton');
  submitButton.classList.add('submitButtonDisactivated');
  submitButton.disabled = true; // Enable the button
}

// Show the parameters hidden behind the More parameters button
function toggleContent() {
  var x = document.getElementById("moreParametersContent");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

// Prevent default for button present in form other than submit button
toggleButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the form from submitting
  console.log("Button clicked without submitting the form!");
});