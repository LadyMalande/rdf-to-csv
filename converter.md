---
layout: page
title: Converter
permalink: /converter
language: en
handle: /converter
sitemap: false
---
<div class="alert alert-info" role="alert">
  <h5 class="alert-heading">How to use the RDFtoCSV Converter:</h5>
  <ol class="mb-0">
    <li>Upload the RDF file from your local storage OR provide a URL.</li>
    <li>Choose how many tables you want to convert the RDF data into.</li>
    <li>Click on "More parameters..." button if you want to customize the conversion more.</li>
    <li>Click "Convert & Download" button.</li>
  </ol>
  <hr>
  <p class="mb-0"><small>Please be informed that the conversion might take some time. Smaller files are returned in approximately 20 seconds, larger ones can take up to a few minutes.</small></p>
</div>

<!-- English version of the converter page --> 
<!-- Form for submitting parameters for conversion -->
<form id="rdfandconfiguration" action="https://rdf-to-csvw.onrender.com/rdftocsvw" method="post" class="needs-validation" novalidate>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js" 
            crossorigin="anonymous"></script>
    <!-- Div to choose a file or to input file URL -->
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Step 1: Upload Your RDF File</h5>
      </div>
      <div class="card-body">
    <div id="choose-file-or-url">
        <!-- Choose a file div -->
        <div id="drop-zone">
            Drop file here...<br />
            <div id="holderForFileInputAndBin">
                <label class="label" id="labelForFileInput" for="file">
                    <input type="file" name="file" id="file" accept=".nq, .nt, .jsonl, .jsonld, .n3, .ndjson, .ndjsonld, .owl, .rdf, .rdfs, .rj, .trig, .trigs, .trix, .ttl, .ttls" required />
                    <span id="spanForFileInput">...or select a file...</span>
                </label>
                <button type="button" class="clear-button" id="clearButton">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        </div>
        <div class="vertical-line"></div>
        <!-- Input a file URL div -->
        <div class="top-and-bottom-margin" id="rdf-url-div">
            <label for="fileURL">
                ...or fill in the RDF file URL: <a href="#comment-1"><sup class="comment-marker" data-index="1">[1]</sup></a>
            </label>
            <input type="text" id="fileURL" name="fileURL" required />
        </div>
    </div>
      </div>
    </div>
    
    <!-- How many tables to create parameters -->
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Step 2: Table Configuration</h5>
      </div>
      <div class="card-body">
    <div class="mb-3">
        <label class="form-label fw-bold">Choose how many CSV tables you wish to get:</label>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="table" id="basicQuery" value="ONE" checked="checked" />
            <label class="form-check-label" for="basicQuery">
                One table
            </label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="table" id="splitQuery" value="MORE" />
            <label class="form-check-label" for="splitQuery">
                Multiple tables <a href="#comment-2"><sup class="comment-marker" data-index="2">[2]</sup></a>
            </label>
        </div>
    </div>
      </div>
    </div>
    
    <!-- Button for uncovering more parameters options -->
    <div class="text-center mb-3">
      <button type="button" id="toggleButton" class="btn btn-outline-secondary" onclick="toggleContent()" title="Click to choose from other parameters">More parameters...</button>
    </div>
    <div id="moreParametersContent" style="display: none;">
      <div class="card mb-4">
        <div class="card-header bg-secondary text-white">
          <h5 class="mb-0">Advanced Parameters</h5>
        </div>
        <div class="card-body">
        <!-- Conversion method parameters input -->
        <label class="form-label fw-bold">Choose a conversion method:</label>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="conversionMethod" id="conversionRDF4J" value="RDF4J" checked="checked" />
            <label class="form-check-label" for="conversionRDF4J">RDF4J</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="conversionMethod" id="conversionBigFile" value="BIGFILESTREAMING" />
            <label class="form-check-label" for="conversionBigFile">Big File Streaming <a href="#comment-3"><sup class="comment-marker" data-index="3">[3]</sup></a></label>
        </div>
        <div class="form-check mb-3">
            <input class="form-check-input" type="radio" name="conversionMethod" id="conversionStreaming" value="STREAMING" />
            <label class="form-check-label" for="conversionStreaming">Streaming <a href="#comment-3"><sup class="comment-marker" data-index="3">[3]</sup></a></label>
        </div>
        <!-- first normal form parameter input -->
        <label class="form-label fw-bold">How to treat lists of values in cells:</label>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="firstNormalForm" id="fnfTrue" value="true" checked="checked" />
            <label class="form-check-label" for="fnfTrue">Each cell contains only 1 value</label>
        </div>
        <div class="form-check mb-3">
            <input class="form-check-input" type="radio" name="firstNormalForm" id="fnfFalse" value="false" />
            <label class="form-check-label" for="fnfFalse">Cells can contain lists of values</label>
        </div>
        <!-- Preferred Languages parameter input -->
        <div class="mb-3">
          <label for="preferredLanguages" class="form-label">Preferred language codes (comma-separated, e.g., 'en,cs,de'):</label>
          <input type="text" class="form-control" id="preferredLanguages" name="preferredLanguages" placeholder="en,cs" pattern="^[a-zA-Z]{2,3}(,[a-zA-Z]{2,3})*$" />
        </div>
        <!-- Naming Convention dropdown parameter input -->
        <div class="mb-3">
          <label for="namingConvention" class="form-label">CSV header naming convention:</label>
          <select class="form-select" id="namingConvention" name="namingConvention">
            <option value="">Default (no change)</option>
            <option value="camelCase">camelCase</option>
            <option value="PascalCase">PascalCase</option>
            <option value="snake_case">snake_case</option>
            <option value="SCREAMING_SNAKE_CASE">SCREAMING_SNAKE_CASE</option>
            <option value="kebab-case">kebab-case</option>
            <option value="Title Case">Title Case</option>
            <option value="dot.notation">dot.notation</option>
            <option value="original">original</option>
        </select>
        </div>
        </div>
      </div>
    </div>
    <!-- Web service status indicator changing pictures and text depending on the responsiveness of connected web service -->
    <div class="card mb-4">
      <div class="card-body text-center">
        <div id="statusIndicator" class="mb-3">
            <img id="loadingWheel" src="{{ 'loading.gif' | relative_url }}" alt="Loading" style="display: none;" />
            <img id="greenArrow" src="{{ 'check.jpg' | relative_url }}" alt="OK" style="display: none;" />
            <span id="healthCheckStatus" class="ms-2">The Web Service is loading...</span>
        </div>
        <!-- Form Submit Button, changes style according to service status indicator -->
        <button type="submit" id="submitButton" class="btn btn-primary btn-lg px-5">Convert & Download</button>
      </div>
    </div>
</form>
<!-- Div to inform users to wait for the web service response -->
<div class="alert alert-warning text-center" style="display: none;" id="patienceAlert">
    <div id="countdown" class="display-4 mb-2" style="display: none;">30</div>
    <div id="patienceText" style="display: none;">
        The web service runs on free plan - please wait 60 seconds for the result. If you are not getting any file transfer until then, click on the convert button again. The response times may vary depending on the size of your RDF file.
    </div>
</div>
<div id="responsePlace" class="mb-3">
    <label id="previewLabel"></label>
</div>
<!-- Div for web service  responses error messages -->
<div id="errorMessage" class="alert alert-danger" role="alert" style="display: none;"></div>
<!-- Div for comments about the form -->
<div id="comments" class="card mt-4">
    <div class="card-header">
      <h5 class="mb-0">Comments</h5>
    </div>
    <div class="card-body">
      <div class="alert alert-info" id="comment-1"><strong>[1]</strong> If you load a file and fill in URL, the conversion will use the URL as the original RDF file.</div>
      <div class="alert alert-info" id="comment-2">
          <strong>[2]</strong> The converter creates multiple tables only if the data are suitable for dividing into multiple tables. If the data are not suitable for splitting into multiple tables, the converter creates only one table.
      </div>
      <div class="alert alert-info" id="comment-3">
          <strong>[3]</strong> Big File Streaming and Streaming methods work only with .nt files (N-Triples serialization format).
      </div>
    </div>
</div>

<script
    type="text/javascript"
    src="{{ 'assets/sendPost.js' | relative_url }}"
></script>
