var locales = [
    {"name": "বাংলা", "code": "bn"},
    {"name": "中文", "code": "zh-s"},
    {"name": "Nederlands", "code": "nl"},
    {"name": "English", "code": "en"},
    {"name": "Español", "code": "es"},
    {"name": "Filipino", "code": "fil"},
    {"name": "Deutsch", "code": "de"},
    {"name": "ગુજરાતી", "code": "gu"},
    {"name": "हिन्दी", "code": "hi"},
    {"name": "Bahasa Indonesia", "code": "id"},
    {"name": "Português", "code": "pt"},
    {"name": "Svenska", "code": "sv"}
];

var username, password = "";


function getGuideFromHash() {
    return location.hash.substr(1);
}

function filenameForLanguage(guide, locale) {
    if (locale == "en") {
        return "../"+guide+"/content.md";
    }

    return "../"+guide+"/content." + locale + ".md";
}

function getContentFromGuide(guide, locale, callback) {
    $.ajax({
        url: filenameForLanguage(guide, locale),
        success: function(content) {
            callback(null, content);
        },
        error: function(xhr, text, errorThrown) {
            callback(errorThrown, null);
        }
    });
}

function bindInterfaceControlsForColumn(whichColumn) {
    var dropdownEl = $("#" + whichColumn + "-language-selector");

    $(dropdownEl).on("change", function() {
        var locale = $(this).val();

        loadGuideContentOnElement(locale, whichColumn);
    });

}

function loadGuideContentOnElement(locale, whichColumn) {

    var guide = getGuideFromHash();
    var textareaEl = $("#" + whichColumn + "-guide-content");


    function callbackFromContentRequest(error, content) {
        if (content) {
            textareaEl.val(content);
        }

        if (error) {
            if (error !== "Not Found") {
                swal("Oops...", error, "error");
            }
        }
    }

    textareaEl.val("");

    getContentFromGuide(guide, locale, callbackFromContentRequest)

}


// TEST LOGIN

function notBusy() {
    $("#busy").addClass("hidden");
}

function busy() {
    $("#busy").removeClass("hidden");
}

function testLogin() {
    function loginWorks(user) {
        $("#openLoginDialog").addClass("hidden");
        $("#save").removeClass("hidden");
        $("#userfullname").html(user.name);
        $("#avatar").attr("src", user.avatar_url);

        $('#loginDialog').foundation('close');
    }

    function loginError(err) {
        username = "";
        password = "";

        swal("Oops..","Error: Wrong login information","error");

        $("#login").removeClass("hidden");
        $("#loginSpin").addClass("hidden");

    }

    $("#login").addClass("hidden");
    $("#loginSpin").removeClass("hidden");
    busy();

    username = $("#username").val();
    password = $("#password").val();

    var github = new Github({
        username: username,
        password: password,
        auth: "basic"
    });

    var user = github.getUser();

    user.show(username, function(err, user) {
        console.log("err", err);
        console.log("user", user);

        notBusy();

        if (user) {
            loginWorks(user);
        }

        if (err) {
            loginError(err)
        }
    });

}

function saveAsIssue() {

    var reponame = "mozilla-club-guides";
    var content = $("#edit-guide-content").val();
    var guide = getGuideFromHash();
    var locale = $("#edit-language-selector").val();
    var subjectForIssue = "[L10N] New translation for '" + guide + "' in " + locale;

    busy();

    var github = new Github({
        username: username,
        password: password,
        auth: "basic"
    });

    var issues = github.getIssues("mozilla", reponame);

    var options = {
        title: subjectForIssue,
        body: content,
        assignee: "soapdog",
        labels: [
            "Needs Review",
            "Mozilla Clubs",
            "L10N"
        ]
    };

    issues.create(options, function(err, issue) {
        console.log("err", err);

        console.log("issue", issue);

        if (issue) {
            swal({
                    title: "Thanks for the translation",
                    text: "Your translation has been sent to us as a Github issue!",
                    type: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "View on Github!",
                    cancelButtonText: "Close",
                    closeOnConfirm: true
                },
                function(){
                    window.open(issue.html_url);
                }
            );
        }


        notBusy();

    });


}


// Binds
bindInterfaceControlsForColumn("edit");
bindInterfaceControlsForColumn("view");

$("#save").click(saveAsIssue);
$("#login").click(testLogin);


loadGuideContentOnElement("en", "edit");
loadGuideContentOnElement("en", "view");


// Load Foundation

$(document).foundation();


