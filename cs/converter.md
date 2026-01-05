---
layout: page
title: Konvertor
permalink: /cs/converter
language: cs
handle: /converter
sitemap: false
---

<!-- Czech version of the converter page -->

<div class="alert alert-info" role="alert">
  <h5 class="alert-heading">Jak použít RDFtoCSV konvertor:</h5>
  <ol class="mb-0">
    <li>Nahrajte RDF soubor z lokálního uložiště nebo zapiště jeho URL.</li>
    <li>Vyberte, kolik chcete vytvořit tabulek v CSV formátu.</li>
    <li>Klikněte na "Více parametrů...", pokud chcete konverzi ještě dále pozměnit.</li>
    <li>Klikněte na tlačítko "Konvertovat a uložit výsledný .zip".</li>
  </ol>
  <hr>
  <p class="mb-0"><small>Prosím, vezměte na vědomí, že konverze formátu může nějakou dobu trvat. Pro menší soubory jde přibližně o 20 sekund, pro velké soubory se může jednat až o několik minut.</small></p>
</div>

<!-- Form for submitting parameters for conversion -->
<form id="rdfandconfiguration" action="https://rdf-to-csvw.onrender.com/rdftocsvw" method="post" enctype="multipart/form-data" class="needs-validation" novalidate>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js" 
            crossorigin="anonymous"></script>
    <!-- Div to choose a file or to input file URL -->
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Krok 1: Nahrajte RDF soubor</h5>
      </div>
      <div class="card-body">
    <div id="choose-file-or-url">
        <!-- Choose a file div -->
        <div id="drop-zone">
            Přesuňte soubor sem...<br />
            <div id="holderForFileInputAndBin">
                <label class="label" id="labelForFileInput" for="file">
                    <input type="file" name="file" id="file" accept=".nq, .nt, .jsonl, .jsonld, .n3, .ndjson, .ndjsonld, .owl, .rdf, .rdfs, .rj, .trig, .trigs, .trix, .ttl, .ttls" required />
                    <span id="spanForFileInput">...nebo vyberte soubor...</span>
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
                ...nebo zapište URL RDF souboru <a href="#comment-1"><sup class="comment-marker" data-index="1">[1]</sup></a>
            </label>
            <input type="text" id="fileURL" name="fileURL" required />
        </div>
    </div>
      </div>
    </div>
    
    <!-- How many tables to create parameters -->
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Krok 2: Konfigurace tabulek</h5>
      </div>
      <div class="card-body">
    <div class="mb-3">
        <label class="form-label fw-bold">Kolik chcete vytvořit CSV tabulek:</label>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="table" id="basicQuery" value="ONE" checked="checked" />
            <label class="form-check-label" for="basicQuery">Jedna tabulka</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="table" id="splitQuery" value="MORE" />
            <label class="form-check-label" for="splitQuery">
                Více tabulek <a href="#comment-2"><sup class="comment-marker" data-index="2">[2]</sup></a>
            </label>
        </div>
    </div>
      </div>
    </div>
    
    <!-- Button for uncovering more parameters options -->
    <div class="text-center mb-3">
      <button type="button" id="toggleButton" class="btn btn-outline-secondary" onclick="toggleContent()" title="Klikněte pro vybrání dalších parametrů">Více parametrů...</button>
    </div>
    <div id="moreParametersContent" style="display: none;">
      <div class="card mb-4">
        <div class="card-header bg-secondary text-white">
          <h5 class="mb-0">Pokročilé parametry</h5>
        </div>
        <div class="card-body">
        <!-- Conversion method parameters input -->
        <label class="form-label fw-bold">Vyberte metodu konverze:</label>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="conversionMethod" id="conversionRDF4J" value="RDF4J" checked="checked" />
            <label class="form-check-label" for="conversionRDF4J">RDF4J</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="conversionMethod" id="conversionBigFile" value="BIGFILESTREAMING" />
            <label class="form-check-label" for="conversionBigFile">Big File Streaming</label>
        </div>
        <div class="form-check mb-3">
            <input class="form-check-input" type="radio" name="conversionMethod" id="conversionStreaming" value="STREAMING" />
            <label class="form-check-label" for="conversionStreaming">Streaming</label>
        </div>
        <!-- first normal form parameter input -->
        <label class="form-label fw-bold">Jak se chovat k seznamům hodnot v buňkách:</label>
        <div class="form-check">
            <input class="form-check-input" type="radio" name="firstNormalForm" id="fnfTrue" value="true" checked="checked" />
            <label class="form-check-label" for="fnfTrue">Buňka obsahuje pouze 1 hodnotu</label>
        </div>
        <div class="form-check mb-3">
            <input class="form-check-input" type="radio" name="firstNormalForm" id="fnfFalse" value="false" />
            <label class="form-check-label" for="fnfFalse">Buňky mohou obsahovat seznamy hodnot</label>
        </div>
        <!-- Preferred Languages parameter input -->
        <div class="mb-3">
          <label for="preferredLanguages" class="form-label">Preferované jazykové kódy (oddělené čárkou, např. 'cs,en,de'):</label>
          <input type="text" class="form-control" id="preferredLanguages" name="preferredLanguages" placeholder="cs,en" pattern="^[a-zA-Z]{2,3}(,[a-zA-Z]{2,3})*$" />
        </div>
        <!-- Naming Convention dropdown parameter input -->
        <div class="mb-3">
          <label for="namingConvention" class="form-label">Konvence pojmenování záhlaví CSV:</label>
          <select class="form-select" id="namingConvention" name="namingConvention">
            <option value="">Výchozí (bez změny)</option>
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
            <span id="healthCheckStatus" class="ms-2">Webová služba se načítá...</span>
        </div>
        <!-- Form Submit Button, changes style according to service status indicator -->
        <button type="submit" id="submitButton" class="btn btn-primary btn-lg px-5">Konvertovat a uložit výsledný .zip</button>
      </div>
    </div>
</form>
<!-- Div to inform users to wait for the web service response -->
<div class="alert alert-warning text-center" style="display: none;" id="patienceAlert">
    <div id="countdown" class="display-4 mb-2" style="display: none;">30</div>
    <div id="patienceText" style="display: none;">Webová služba běží na verzi zdarma - počkejte 60 sekund a pokud se Vám nestáhl výsledný .zip archiv, klikněte znovu na tlačítko "Konvertovat".</div>
</div>
<div id="responsePlace" class="mb-3">
    <label id="previewLabel"></label>
</div>
<!-- Div for web service  responses error messages -->
<div id="errorMessage" class="alert alert-danger" role="alert" style="display: none;"></div>
<!-- Div for comments about the form -->
<div id="comments" class="card mt-4">
    <div class="card-header">
      <h5 class="mb-0">Poznámky</h5>
    </div>
    <div class="card-body">
      <div class="alert alert-info" id="comment-1"><strong>[1]</strong> Pokud nahrajete RDF soubor i vyplníte URL, bude konverze provedena na datech z URL.</div>
      <div class="alert alert-info" id="comment-2"><strong>[2]</strong> Konvertor vytvoří více tabulek pouze v případě, že jsou data pro takové rozdělení vhodná. Pokud data vhodná k rozdělení nejsou, vytvoří jednu tabulku.</div>
    </div>
</div>

<script
    type="text/javascript"
    src="{{ 'assets/sendPost.js' | relative_url }}"
></script>