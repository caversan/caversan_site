try {
    var language = "";
    document.getElementsByClassName('flag')[0].onclick = function() {
        if (language != "pt-br" && jsonPTBR.readyState === 4) {
            if (jsonPTBR.status >= 200 && jsonPTBR.status < 400) {
                language = "pt-br";
                fillHtml(JSON.parse(jsonPTBR.responseText))
            }
        }
    }
    document.getElementsByClassName('flag')[1].onclick = function() {
        if (language != "en" && jsonEN.readyState === 4) {
            if (jsonEN.status >= 200 && jsonEN.status < 400) {
                language = "en";
                fillHtml(JSON.parse(jsonEN.responseText))
            }
        }
    }



    var data = new Date();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var jsonEN = new XMLHttpRequest();
    jsonEN.open('GET', 'js/data/en/data.json', true);
    jsonEN.send();
    //jsonEN = null;



    var jsonPTBR = new XMLHttpRequest();
    jsonPTBR.open('GET', ('js/data/pt-br/data.json?' + Math.floor(Math.random() * 1000000)), true);

    jsonPTBR.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                language = "pt-br";
                fillHtml(JSON.parse(this.responseText))
            } else {
                // Error :(
            }
        }
    };

    jsonPTBR.send();
    //jsonPTBR = null;


    function fillHtml(loadedJson) {

        document.getElementsByTagName("title")[0].innerHTML = loadedJson.name;
        document.getElementsByClassName("icoMore pdf")[0].parentElement.setAttribute("href", loadedJson.pdf);
        document.getElementsByClassName("topBarTitle")[0].innerHTML = loadedJson.name + " - " + loadedJson.title + " - " + data.getFullYear();
        document.getElementsByClassName("nome")[0].innerHTML = loadedJson.name;
        document.getElementsByClassName("occupation")[0].innerHTML = loadedJson.profile.occupation.title + ": <span class=\"txtAmarelo\">" + loadedJson.profile.occupation.description + "</span>";
        var birth = new Date(loadedJson.profile.birth.description)
        switch (language) {
            case "pt-br":
                document.getElementsByClassName("birth")[0].innerHTML = loadedJson.profile.birth.title + ": 0" + birth.getDate() + "/0" + (birth.getMonth() + 1) + "/" + birth.getFullYear();
                break;
            case "en":
                document.getElementsByClassName("birth")[0].innerHTML = loadedJson.profile.birth.title + ": " + months[birth.getMonth()] + "/0" + birth.getDate() + "/" + birth.getFullYear();
                break;
            default:
                alert("")
                document.getElementsByClassName("birth")[0].innerHTML = loadedJson.profile.birth.title + ": 0" + birth.getDate() + "/0" + (birth.getMonth() + 1) + "/" + birth.getFullYear();
                break;
        }

        document.getElementsByClassName("phone")[0].innerHTML = loadedJson.profile.phone.title + ": <a href=\"tel:" + loadedJson.profile.phone.description + "\">" + loadedJson.profile.phone.description + "</a>";
        document.getElementsByClassName("email")[0].innerHTML = loadedJson.profile.email.title + ": <a href=\"mailto:" + loadedJson.profile.email.description + "\">" + loadedJson.profile.email.description + "</a>";
        document.getElementsByClassName("skype")[0].innerHTML = loadedJson.profile.skype.title + ": <a href=\"mailto:" + loadedJson.profile.skype.description + "\">" + loadedJson.profile.skype.description + "</a>";
        document.getElementsByClassName("address")[0].innerHTML = loadedJson.profile.address.title + ": " + loadedJson.profile.address.description;
        document.getElementsByClassName("nationality")[0].innerHTML = loadedJson.profile.nationality.title + ": " + loadedJson.profile.nationality.description;
        document.getElementsByClassName("matrialstatus")[0].innerHTML = loadedJson.profile.matrialstatus.title + ": " + loadedJson.profile.matrialstatus.description;
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



        document.getElementsByClassName("languages")[0].innerHTML = "<h2>" + loadedJson.sections.languages.title + ":</h2><ul class=\"languagesList\">";
        for (i in loadedJson.sections.languages.grid) {
            document.getElementsByClassName("languagesList")[0].innerHTML += "<li>" + loadedJson.sections.languages.grid[i] + "</li>";
        }
        document.getElementsByClassName("languages")[0].innerHTML += "</ul>";


        document.getElementsByClassName("graduation")[0].innerHTML = "<h2>" + loadedJson.sections.graduation.title + ":</h2><ul class=\"graduationList\">";
        for (i in loadedJson.sections.graduation.grid) {
            document.getElementsByClassName("graduationList")[0].innerHTML += "<li>" + loadedJson.sections.graduation.grid[i].title + " - " + loadedJson.sections.graduation.grid[i].description + "</li>";
        }
        document.getElementsByClassName("graduation")[0].innerHTML += "</ul>";


        document.getElementsByClassName("courses")[0].innerHTML = "<h2>" + loadedJson.sections.courses.title + ":</h2><ul class=\"coursesList\">";
        for (i in loadedJson.sections.courses.grid) {
            document.getElementsByClassName("coursesList")[0].innerHTML += "<li>" + loadedJson.sections.courses.grid[i].title + " - " + loadedJson.sections.courses.grid[i].description + "</li>";
        }
        document.getElementsByClassName("courses")[0].innerHTML += "</ul>";

        document.getElementsByClassName("experience")[0].innerHTML = "<h2>" + loadedJson.sections.experience.title + ":</h2><ul class=\"experienceList\">";
        for (i in loadedJson.sections.experience.grid) {
            document.getElementsByClassName("experienceList")[0].innerHTML += "<li><b>" + loadedJson.sections.experience.grid[i].title + "</b><br/>" + loadedJson.sections.experience.grid[i].description + "<br/>" + ((loadedJson.sections.experience.grid[i].link != "" || loadedJson.sections.experience.grid[i].link != undefined) ? ("<a href=\"" + loadedJson.sections.experience.grid[i].link + "\" target=\"_blank\">" + loadedJson.sections.experience.grid[i].link + "</a>") : "") + "</li><br/><br/>";
        }
        document.getElementsByClassName("experience")[0].innerHTML += "</ul>";



        document.getElementsByClassName("portifolio")[0].innerHTML = "<h2>" + loadedJson.sections.portifolio.title + ":</h2>";
        document.getElementsByClassName("portifolio")[0].innerHTML += "<div class=\"portifolioList\"></div>"
        for (i in loadedJson.sections.portifolio.grid) {
            document.getElementsByClassName("portifolioList")[0].innerHTML += "<div class=\"portifolioListTitle\">" + loadedJson.sections.portifolio.grid[i].title + "</div>";
            for (j in loadedJson.sections.portifolio.grid[i].grid) {
                document.getElementsByClassName("portifolioList")[0].innerHTML += "<div class=\"portifolioListItem\"><div class=\"portifolioListItemThumb\"><a href=\"javascript:void(null)\" class=\"btnContent\" content=\"" + loadedJson.sections.portifolio.grid[i].grid[j].content + "\"><img src=\"" + loadedJson.sections.portifolio.grid[i].grid[j].thumb + "\" /></a></div><div class=\"portifolioListItemDescription\">" + loadedJson.sections.portifolio.grid[i].grid[j].title + "<br/><br/>" + loadedJson.sections.portifolio.grid[i].grid[j].description + "</div></div>";

            }
        }
        var btnContent = document.getElementsByClassName('btnContent');
        var imageModalFrame = document.getElementsByClassName('imageModalFrame')[0];
        window.onclick = function(event) {
            if (event.target == imageModalFrame) {
                closeModal();
            }
        }
        for (i = 0; i < btnContent.length; i++) {
            // console.log(btnContent[i].getAttribute("content"))

            btnContent[i].onclick = function() {
                if (this.getAttribute("content") != "") {
                    switch (this.getAttribute("content").split(".")[1]) {
                        case "m4v":
                        case "mp4":
                            videoOpen(this.getAttribute("content"), document.getElementsByClassName('contentView')[0]);
                            break;
                        case "jpg":
                        case "png":
                            imageOpen(this.getAttribute("content"), document.getElementsByClassName('contentView')[0]);
                            break;
                        case "pdf":
                            pdfOpen(this.getAttribute("content"));
                            break;
                        default:
                            console.log("web");
                            break;
                    }

                } else {
                    console.log("vazio")
                }

            }
        }


        function imageOpen(img, target) {
            target.innerHTML = "<div class=\"imageModalFrameClose\"><div class=\"btnClose\">[X]</div></div><img src=\"" + img + "\" />";
            showModal();
        }

        function pdfOpen(pdf) {
            window.open(pdf)
        }

        function videoOpen(video, target) {
            target.innerHTML = "<div class=\"imageModalFrameClose\"><div class=\"btnClose\">[X]</div></div><video autoplay controls><source src=\"" + video + "\" type=\"video/mp4\"></video>"
            showModal();
        }

        function showModal() {
            document.getElementsByClassName('btnClose')[0].onclick = function() {
                closeModal();
            }
            if (imageModalFrame.style.display == "flex") {
                closeModal();
            } else {
                imageModalFrame.style.display = "flex";
            }
        };

        function closeModal() {
            imageModalFrame.style.display = "none";
            document.getElementsByClassName('contentView')[0].innerHTML = "";
        }
    }

} catch (err) {
    alert(err)
}