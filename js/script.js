try {
    var data = new Date();

    //var jsonEN = new XMLHttpRequest();
    //jsonEN.open('GET', 'js/data/en/data.json', true);
    //jsonEN.send();
    //jsonEN = null;



    var jsonPTBR = new XMLHttpRequest();
    jsonPTBR.open('GET', ('js/data/pt-br/data.json?' + Math.floor(Math.random() * 1000000)), true);

    jsonPTBR.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                fillHtml(JSON.parse(this.responseText))
            } else {
                // Error :(
            }
        }
    };

    jsonPTBR.send();
    jsonPTBR = null;


    function fillHtml(loadedJson) {

        document.getElementsByTagName("title")[0].innerHTML = loadedJson.name;
        document.getElementsByClassName("icoMore pdf")[0].parentElement.setAttribute("href", loadedJson.pdf);
        document.getElementsByClassName("topBarTitle")[0].innerHTML = loadedJson.name + " - " + loadedJson.title + " - " + data.getFullYear();
        document.getElementsByClassName("nome")[0].innerHTML = loadedJson.name;
        document.getElementsByClassName("occupation")[0].innerHTML = loadedJson.profile.occupation.title + ": <span class=\"txtAmarelo\">" + loadedJson.profile.occupation.description + "</span>";
        var birth = new Date(loadedJson.profile.birth.description)
        document.getElementsByClassName("birth")[0].innerHTML = loadedJson.profile.birth.title + ": 0" + birth.getDate() + "/0" + (birth.getMonth() + 1) + "/" + birth.getFullYear();
        document.getElementsByClassName("phone")[0].innerHTML = loadedJson.profile.phone.title + ": <a href=\"tel:" + loadedJson.profile.phone.description + "\">" + loadedJson.profile.phone.description + "</a>";
        document.getElementsByClassName("email")[0].innerHTML = loadedJson.profile.email.title + ": <a href=\"mailto:" + loadedJson.profile.email.description + "\">" + loadedJson.profile.email.description + "</a>";
        document.getElementsByClassName("address")[0].innerHTML = loadedJson.profile.address.title + ": " + loadedJson.profile.address.description;
        document.getElementsByClassName("nationality")[0].innerHTML = loadedJson.profile.nationality.title + ": " + loadedJson.profile.nationality.description;
        document.getElementsByClassName("matrialstate")[0].innerHTML = loadedJson.profile.matrialstate.title + ": " + loadedJson.profile.matrialstate.description;
        document.getElementsByClassName("children")[0].innerHTML = loadedJson.profile.children.title + ": " + loadedJson.profile.children.description;
        document.getElementsByClassName("driverlicense")[0].innerHTML = loadedJson.profile.driverlicense.title + ": " + loadedJson.profile.driverlicense.description;
        document.getElementsByClassName("car")[0].innerHTML = loadedJson.profile.car.title + ": " + loadedJson.profile.car.description;
        document.getElementsByClassName("travel")[0].innerHTML = loadedJson.profile.travel.title + ": " + loadedJson.profile.travel.description;
        document.getElementsByClassName("move")[0].innerHTML = loadedJson.profile.move.title + ": " + loadedJson.profile.move.description;
        document.getElementsByClassName("opportunity")[0].innerHTML = "<h2>" + loadedJson.sections.opportunity.title + ":</h2><article>" + loadedJson.sections.opportunity.description + "</article>";
        document.getElementsByClassName("profile")[0].innerHTML = "<h2>" + loadedJson.sections.profile.title + ":</h2><article>" + loadedJson.sections.profile.description + "</article>";
        document.getElementsByClassName("skills")[0].innerHTML = "<h2>" + loadedJson.sections.skills.title + ":</h2><article>" + loadedJson.sections.skills.description + "</article>";
        document.getElementsByClassName("skills")[0].innerHTML += "<br/><div class=\"skillsGrid\"></div>"

        for (i in loadedJson.sections.skills.grid) {
            document.getElementsByClassName("skillsGrid")[0].innerHTML += "<div class=\"skillsGridItem\"><div class=\"skillsGridItemTitle\">" + loadedJson.sections.skills.grid[i].title + "</div><div class=\"skillsGridItemDescription\">" + loadedJson.sections.skills.grid[i].description + "</div></div>";
        }



        document.getElementsByClassName("languages")[0].innerHTML += "<h2>" + loadedJson.sections.languages.title + ":</h2><ul class=\"languagesList\">";
        for (i in loadedJson.sections.languages.grid) {
            document.getElementsByClassName("languagesList")[0].innerHTML += "<li>" + loadedJson.sections.languages.grid[i] + "</li>";
        }
        document.getElementsByClassName("languages")[0].innerHTML += "</ul>";


        document.getElementsByClassName("graduation")[0].innerHTML += "<h2>" + loadedJson.sections.graduation.title + ":</h2><ul class=\"graduationList\">";
        for (i in loadedJson.sections.graduation.grid) {
            document.getElementsByClassName("graduationList")[0].innerHTML += "<li>" + loadedJson.sections.graduation.grid[i].title + " - " + loadedJson.sections.graduation.grid[i].description + "</li>";
        }
        document.getElementsByClassName("graduation")[0].innerHTML += "</ul>";


        document.getElementsByClassName("courses")[0].innerHTML += "<h2>" + loadedJson.sections.courses.title + ":</h2><ul class=\"coursesList\">";
        for (i in loadedJson.sections.courses.grid) {
            document.getElementsByClassName("coursesList")[0].innerHTML += "<li>" + loadedJson.sections.courses.grid[i].title + " - " + loadedJson.sections.courses.grid[i].description + "</li>";
        }
        document.getElementsByClassName("courses")[0].innerHTML += "</ul>";

        document.getElementsByClassName("experience")[0].innerHTML += "<h2>" + loadedJson.sections.experience.title + ":</h2><ul class=\"experienceList\">";
        for (i in loadedJson.sections.experience.grid) {
            document.getElementsByClassName("experienceList")[0].innerHTML += "<li><b>" + loadedJson.sections.experience.grid[i].title + "</b><br/>" + loadedJson.sections.experience.grid[i].description + "<br/>" + ((loadedJson.sections.experience.grid[i].link != "") ? ("<a href=\"" + loadedJson.sections.experience.grid[i].link + "\" target=\"_blank\">" + loadedJson.sections.experience.grid[i].link + "</a>") : "") + "</li><br/><br/>";
        }
        document.getElementsByClassName("experience")[0].innerHTML += "</ul>";



        document.getElementsByClassName("portifolio")[0].innerHTML += "<h2>" + loadedJson.sections.portifolio.title + ":</h2>";
        document.getElementsByClassName("portifolio")[0].innerHTML += "<div class=\"portifolioList\"></div>"
        for (i in loadedJson.sections.portifolio.grid) {
            document.getElementsByClassName("portifolioList")[0].innerHTML += "<div class=\"portifolioListTitle\">" + loadedJson.sections.portifolio.grid[i].title + "</div>";
            for (j in loadedJson.sections.portifolio.grid[i].grid) {
                document.getElementsByClassName("portifolioList")[0].innerHTML += "<div class=\"portifolioListItem\"><div class=\"portifolioListItemThumb\"><a href=\"javascript:void(null)\" class=\"btnContent\" content=\"" + loadedJson.sections.portifolio.grid[i].grid[j].content + "\"><img src=\"" + loadedJson.sections.portifolio.grid[i].grid[j].thumb + "\" /></a></div><div class=\"portifolioListItemDescription\">" + loadedJson.sections.portifolio.grid[i].grid[j].title + "<br/><br/>" + loadedJson.sections.portifolio.grid[i].grid[j].description + "</div></div>";

            }
        }
        var btnContent = document.getElementsByClassName('btnContent');
        for (i = 0; i < btnContent.length; i++) {
            // console.log(btnContent[i].getAttribute("content"))

            btnContent[i].onclick = function() {
                if (this.getAttribute("content") != "") {
                    switch (this.getAttribute("content").split(".")[1]) {
                        case "mp4":
                            console.log("video");
                            break;
                        case "jpg":
                        case "png":
                            console.log("imagem");
                            break;
                        case "pdf":
                            console.log("pdf");
                            break;
                        default:
                            console.log("web");
                            break;
                    }
                } else {
                    console.log("vazio")
                }
                /*if(modal.style.display == "flex"){
                  modal.style.display = "none";
                } else{
                  modal.style.display = "flex";
                }*/
            }
        }

    }



} catch (err) {
    alert(err)
}

















// Get the modal
var modal = document.getElementById('contactModalFrame');

// Get the button that opens the modal
var btn = document.getElementsByClassName('btnContact');

// Get the <span> element that closes the modal
var span = document.getElementById('closeX');

// When the user clicks the button, open the modal 
for (i in btn) {
    btn[i].onclick = function() {
        if (modal.style.display == "flex") {
            modal.style.display = "none";
        } else {
            modal.style.display = "flex";
        }
    }
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}








var request = new XMLHttpRequest();
request.open('GET', 'https://tools.dps.sh/frontend-application-test/modal-content.json', true);

request.onreadystatechange = function() {
    if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var loadedJson = JSON.parse(this.responseText);
            var contactTitle = document.querySelector('#contactTitle');
            contactTitle.innerHTML = "<h1>" + loadedJson.data.title + "</h1>";
            var contactContent = document.querySelector('#contactContent');
            contactContent.innerHTML = "<p>" + loadedJson.data.content + "</p>";

        } else {
            // Error :(
        }
    }
};

request.send();
request = null;