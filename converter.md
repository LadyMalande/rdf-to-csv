---
layout: page
title: Converter
permalink: /converter
language: en
handle: /converter
sitemap: false
---
How to use the RDFtoCSV Converter:

1. Upload the RDF file from your local storage OR provide a URL.
2. Choose how many tables you want to convert the RDF data into.
3. Click on "More parameters..." button if you want to customize the conversion more.
4. Click "Convert & Download" button.
     You are set! Please be informed that the conversion might take some time. Smaller files are returned in approximately 20 seconds, larger ones can take up to a few minutes.

<!-- English version of the converter page --> 
<!-- Form for submitting parameters for conversion -->
<form id="rdfandconfiguration" action="https://rdf-to-csvw.onrender.com/rdftocsvw" method="post">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js" 
            integrity="sha384-6/h6KNezXTtLgipPS0pRMR6TqELBUT3i3n1KNLuL/0CuDw1ovx9qgLq0fCZxWbVm" 
            crossorigin="anonymous"></script>
    <!-- Div to choose a file or to input file URL -->
    <div id="choose-file-or-url">
        <!-- Choose a file div -->
        <div id="drop-zone">
            Drop file here...<br />
            <div id="holderForFileInputAndBin">
                <label class="label" id="labelForFileInput" for="file">
                    <input type="file" name="file" id="file" accept=".nq, .nt, .jsonl, .jsonld, .n3, .ndjson, .ndjsonld, .owl, .rdf, .rdfs, .rj, .trig, .trigs, .trix, .ttl, .ttls" required />
                    <span id="spanForFileInput">...or select a file...</span>
                </label>
                <button class="clear-button" id="clearButton">
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
    <br />
    <!-- How many tables to create parameters -->
    <div class="top-and-bottom-margin">
        <label>Choose how many CSV tables you wish to get:</label>
        <label>
            <input type="radio" name="tables" id="basicQuery" value="ONE" checked="checked" />
            One table
        </label>
        <label>
            <input type="radio" name="tables" id="splitQuery" value="MORE" />
            Multiple tables <a href="#comment-2"><sup class="comment-marker" data-index="2">[2]</sup></a>
        </label>
    </div>
    <br />
    <!-- Button for uncovering more parameters options -->
    <button type="button" id="toggleButton" onclick="toggleContent()">More parameters...</button>
    <div id="moreParametersContent" style="display: none;">
        <!-- Conversion method parameters input -->
        <label>Choose a conversion method:</label><br />
        <label>
            <input type="radio" name="choice" value="RDF4J" checked="checked" />
            RDF4J
        </label>
        <label>
            <input type="radio" name="choice" value="BIGFILESTREAMING" />
            Big File Streaming
        </label>
        <label>
            <input type="radio" name="choice" value="STREAMING" />
            Streaming
        </label>
        <br />
        <!-- first normal form parameter input -->
        <label>How to treat lists of values in cells:</label><br />
        <label>
            <input type="radio" name="firstNormalForm" value="true" checked="checked" />
            Each cell contains only 1 value
        </label>
        <label>
            <input type="radio" name="firstNormalForm" value="false" />
            Cells can contain lists of values
        </label>
        <br />
        <!-- Preferred Languages parameter input -->
        <label for="preferredLanguages">Preferred language codes (comma-separated, e.g., 'en,cs,de'):</label><br />
        <input type="text" id="preferredLanguages" name="preferredLanguages" placeholder="en,cs" pattern="^[a-zA-Z]{2,3}(,[a-zA-Z]{2,3})*$" />
        <br /><br />
        <!-- Naming Convention dropdown parameter input -->
        <label for="namingConvention">CSV header naming convention:</label><br />
        <select id="namingConvention" name="namingConvention">
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
        <br />
    </div>
    <br />
    <br />
    <!-- Web service status indicator changing pictures and text depending on the responsiveness of connected web service -->
    <div id="statusIndicator">
        <img id="loadingWheel" src="{{ 'loading.gif' | relative_url }}" alt="Loading" style="display: none;" />
        <img id="greenArrow" src="{{ 'check.jpg' | relative_url }}" alt="OK" style="display: none;" />
        <span id="healthCheckStatus">The Web Service is loading...</span>
    </div>
    <!-- Form Submit Button, changes style according to service status indicator -->
    <input type="submit" value="Convert & Download" id="submitButton" class="top-and-bottom-margin" />
</form>
<!-- Div to inform users to wait for the web service response -->
<div>
    <div id="countdown" style="display: none;">30</div>
    <div id="patienceText" style="display: none;">
        The web service runs on free plan - please wait 60 seconds for the result. If you are not getting any file transfer until then, click on the convert button again. The response times may wary depending on the size of your RDF file.
    </div>
</div>
<div id="responsePlace">
    <label id="previewLabel"></label>
</div>
<!-- Div for web service  responses error messages -->
<div id="errorMessage" style="color: red; display: none;"></div>
<!-- Div for comments about the form -->
<div id="comments">
    <h3>Comments</h3>
    <div class="comment" id="comment-1"><strong>[1]</strong> If you load a file and fill in URL, the conversion will use the URL as the original RDF file.</div>
    <div class="comment" id="comment-2">
        <strong>[2]</strong> The converter creates multiple tables only if the data are suitable for dividing into multiple tables. If the data are not suitable for splitting into multiple tables, the converter creates only one table.
    </div>
</div>

<script
    type="text/javascript"
    src="{{ 'assets/sendPost.js' | relative_url }}"
></script>
