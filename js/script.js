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
        document.getElementsByClassName("skills")[0].innerHTML += "<br/><span class=\"skillsGrid\"></span>"

        for (i in loadedJson.sections.skills.grid) {
            document.getElementsByClassName("skillsGrid")[0].innerHTML += "<div class=\"gridItem\"><div class=\"gridItemTitle\">" + loadedJson.sections.skills.grid[i].title + "</div><div class=\"gridItemDescription\">" + loadedJson.sections.skills.grid[i].description + "</artidivcle></div>";
        }

        document.getElementsByClassName("languages")[0].innerHTML = "<h2>" + loadedJson.sections.languages.title + ":</h2><article>" + loadedJson.sections.languages.title + "</article>";

        /*for (var key in loadedJson.sections) {
            console.log("key " + key + " has value " + loadedJson.sections[key]);
            document.getElementsByClassName(key)[0].innerHTML = "<h2>" + loadedJson.sections[key].title + ":</h2><article>" + loadedJson.sections[key].description + "</article>";
        }*/


        //document.getElementsByClassName("profile")[0].innerHTML = "<h2>" + loadedJson.sections.profile.title + ":</h2><article>" + loadedJson.sections.profile.description + "</article>";
        //var contactTitle = document.querySelector('#contactTitle');
        //contactTitle.innerHTML = "<h1>" + loadedJson.data.title + "</h1>";
        //var contactContent = document.querySelector('#contactContent');
        //contactContent.innerHTML = "<p>" + loadedJson.data.content + "</p>";

    }
} catch (err) {
    alert(err)
}