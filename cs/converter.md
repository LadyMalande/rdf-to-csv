---
layout: page
title: Konvertor
permalink: /cs/converter
language: cs
handle: /converter
sitemap: false
---

<!-- Czech version of the converter page -->

Jak použít RDFtoCSV konvertor:

1. Nahrajte RDF soubor z lokálního uložiště nebo zapiště jeho URL.
2. Vyberte, kolik chcete vytvořit tabulek v CSV formátu.
3. Klikněte na "Více parametrů...", pokud chcete konverzi ještě dále pozměnit.
4. Klikněte na tlačítko "Konvertovat a uložit výsledný .zip".
     Je hotovo! Prosím, vezměte na vědomí, že konverze formátu může nějakou dobu trvat. Pro menší soubory jde přibližně o 20 sekund, pro velké soubory se může jednat až o několik minut.

<!-- Form for submitting parameters for conversion -->
<form id="rdfandconfiguration" action="https://rdf-to-csvw.onrender.com/rdftocsvw" method="post" enctype="multipart/form-data">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js" 
            integrity="sha384-6/h6KNezXTtLgipPS0pRMR6TqELBUT3i3n1KNLuL/0CuDw1ovx9qgLq0fCZxWbVm" 
            crossorigin="anonymous"></script>
    <!-- Div to choose a file or to input file URL -->
    <div id="choose-file-or-url">
        <!-- Choose a file div -->
        <div id="drop-zone">
            Přesuňte soubor sem...<br />
            <div id="holderForFileInputAndBin">
                <label class="label" id="labelForFileInput" for="file">
                    <input type="file" name="file" id="file" accept=".nq, .nt, .jsonl, .jsonld, .n3, .ndjson, .ndjsonld, .owl, .rdf, .rdfs, .rj, .trig, .trigs, .trix, .ttl, .ttls" required />
                    <span id="spanForFileInput">...nebo vyberte soubor...</span>
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
                ...nebo zapište URL RDF souboru <a href="#comment-1"><sup class="comment-marker" data-index="1">[1]</sup></a>
            </label>
            <input type="text" id="fileURL" name="fileURL" required />
        </div>
    </div>
    <br />
    <!-- How many tables to create parameters -->
    <div class="top-and-bottom-margin">
        <label>Kolik chcete vytvořit CSV tabulek:</label>
        <label>
            <input type="radio" name="tables" id="basicQuery" value="basicQuery" checked="checked" />
            Jedna tabulka
        </label>
        <label>
            <input type="radio" name="tables" id="splitQuery" value="splitQuery" />
            Více tabulek <a href="#comment-2"><sup class="comment-marker" data-index="2">[2]</sup></a>
        </label>
        <br />
    </div>
    <br />
    <!-- Button for uncovering more parameters options -->
    <button id="toggleButton" onclick="toggleContent()">Více parametrů...</button>
    <div id="toggleContent">
        <!-- Conversion method parameters input -->
        <label>Vyberte metodu konverze:</label><br />
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
        <label>Jak se chovat k seznamům hodnot v buňkách:</label><br />
        <label>
            <input type="radio" name="firstNormalForm" value="true" checked="checked" />
            Buňka obsahuje pouze 1 hodnotu
        </label>
        <label>
            <input type="radio" name="firstNormalForm" value="false" />
            Buňky mohou obsahovat seznamy hodnot
        </label>
        <br />
        <!-- Preferred Languages parameter input -->
        <label for="preferredLanguages">Preferované jazykové kódy (oddělené čárkou, např. 'cs,en,de'):</label><br />
        <input type="text" id="preferredLanguages" name="preferredLanguages" placeholder="cs,en" pattern="^[a-zA-Z]{2,3}(,[a-zA-Z]{2,3})*$" />
        <br /><br />
        <!-- Naming Convention dropdown parameter input -->
        <label for="namingConvention">Konvence pojmenování záhlaví CSV:</label><br />
        <select id="namingConvention" name="namingConvention">
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
        <br />
    </div>
    <br />
    <br />
    <!-- Web service status indicator changing pictures and text depending on the responsiveness of connected web service -->
    <div id="statusIndicator">
        <img id="loadingWheel" src="../loading.gif" alt="Loading" style="display: none;" />
        <img id="greenArrow" src="../check.jpg" alt="OK" style="display: none;" />
        <span id="healthCheckStatus">Webová služba se načítá...</span>
    </div>
    <!-- Form Submit Button, changes style according to service status indicator -->
    <input type="submit" value="Konvertovat a uložit výsledný .zip" id="submitButton" class="top-and-bottom-margin" />
</form>
<!-- Div to inform users to wait for the web service response -->
<div>
    <div id="countdown" style="display: none;">30</div>
    <div id="patienceText" style="display: none;">Webová služba běží na verzi zdarma - počkejte 60 sekund a pokud se Vám nestáhl výsledný .zip archiv, klikněte znovu na tlačítko "Konvertovat".</div>
</div>
<div id="responsePlace">
    <label id="previewLabel"></label>
</div>
<!-- Div for web service  responses error messages -->
<div id="errorMessage" style="color: red; display: none;"></div>
<!-- Div for comments about the form -->
<div id="comments">
    <h3>Poznámky</h3>
    <div class="comment" id="comment-1"><strong>[1]</strong> Pokud nahrajete RDF soubor i vyplníte URL, bude konverze provedena na datech z URL.</div>
    <div class="comment" id="comment-2"><strong>[2]</strong> Konvertor vytvoří více tabulek pouze v případě, že jsou data pro takové rozdělení vhodná. Pokud data vhodná k rozdělení nejsou, vytvoří jednu tabulku.</div>
</div>

<script
    type="text/javascript"
    src="{% if jekyll.environment == 'production' %}{{site.production.url}}{{site.production.baseurl}}{% else %}{{site.development.url}}{{site.development.baseurl}}{% endif %}/{{ 'assets/sendPost.js' | relative_url }}"
></script>