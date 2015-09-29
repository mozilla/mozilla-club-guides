(function() {

    // Used to hold information from markdown
    var data = {
        content: {}
    };

    // Builds the guide content
    function bindGuideData() {
        var source = $("#guide-template").html();
        var template = Handlebars.compile(source);

        console.log("Loading guide.md markdown file...");

        // New markdown renderer tweaks
        var renderer = new marked.Renderer();
        var paragraphCounter = 0;

        renderer.paragraph = function(text) {
            var paragraphId = "para" + paragraphCounter;

            paragraphCounter += 1;

            return "<p class='has-marker' id='" +paragraphId+ "'>"
                + text
                + " <a href='#"+paragraphId+"' class='paragraph-marker'>&para;</a><p>";
        };

        function successfulyLoadedMarkdownFile(markdownData) {
            var content = metaMarked(markdownData, { renderer: renderer });

            data.content = content.html;

            console.log("Binding guide data...");

            $("#guide").html(template(data));

            document.title = content.meta.title;
            $("#document-title").html(content.meta.title);

            bindTOC();

            setTimeout(scrollToParagraph, 200);

        }

        $.ajax({
            url: "guide.md",
            type: 'get',
            dataType: 'html',
            success: successfulyLoadedMarkdownFile
        });

    }

    function scrollToParagraph() {
        console.log("scrolling to:", location.hash);
        if (!window.location.hash) {
            return;
        }

        var position = $(location.hash)[0].offsetTop - 100;

        window.scrollTo(0, position);
    }

    function bindTOC() {
      var source = $("#toc-template").html();
      var template = Handlebars.compile(source);
      var toc = tableOfContentFromHTML(document, "#guide");

      console.log("building table of contents...");
      $("#toc").html(template(toc));

    }

    // Reading Options releated functions
    function closeReadingOptionsDialog() {
        $('#readingOptions').foundation('reveal', 'close');
    }

    function closeTOCDialog() {
        $('#tableOfContents').foundation('reveal', 'close');
    }


    function changeGuideFont(event) {
        var fontFamily = event.target.value;
        var guide = document.querySelector("#guide");

        console.log("Reading options. Changing font to:", fontFamily);


        guide.classList.remove("text-opensans");
        guide.classList.remove("text-firasans");
        guide.classList.remove("text-droidsans");
        guide.classList.remove("text-times");

        guide.classList.add(fontFamily)


        closeReadingOptionsDialog();
    }

    function changeGuideFontSize(event) {
        var fontSize = event.target.value;
        var guide = document.querySelector("#guide");


        console.log("Reading options. Changing font size to:", fontSize);

        guide.classList.remove("text-normal");
        guide.classList.remove("text-large");
        guide.classList.remove("text-small");

        guide.classList.add(fontSize)

        closeReadingOptionsDialog();
    }

    // Bind reading options and toc controls
    $("input[name='fontFamilySelector']").change(changeGuideFont);
    $("input[name='fontSizeSelector']").change(changeGuideFontSize);
    $("#toc").click(closeTOCDialog);



    // Handlebar helpers
    Handlebars.registerHelper('toLowerCase', function (str) {
        return str.toLowerCase();
    });

    Handlebars.registerHelper('matchTag', function (conditional, options) {
        if (conditional.indexOf(this.tag) > -1) {
            return options.fn(this);
        }

    });

    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });

    // Load foundation
    $(document).foundation()

    // Load main content area and start the app.
    bindGuideData();
}());
