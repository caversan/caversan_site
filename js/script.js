try {
    let language = "";
    const flags = document.getElementsByClassName('flag');
    const data = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const jsonEN = new XMLHttpRequest();
    jsonEN.open('GET', 'js/data/en/data.json', true);
    jsonEN.send();

    const jsonPTBR = new XMLHttpRequest();
    jsonPTBR.open('GET', `js/data/pt-br/data.json?${Math.floor(Math.random() * 1000000)}`, true);

    jsonPTBR.onreadystatechange = function() {
        if (this.readyState === 4 && this.status >= 200 && this.status < 400) {
            language = "pt-br";
            fillHtml(JSON.parse(this.responseText));
        }
    };

    jsonPTBR.send();

    flags[0].onclick = function() {
        if (language !== "pt-br" && jsonPTBR.readyState === 4 && jsonPTBR.status >= 200 && jsonPTBR.status < 400) {
            language = "pt-br";
            fillHtml(JSON.parse(jsonPTBR.responseText));
        }
    };

    flags[1].onclick = function() {
        if (language !== "en" && jsonEN.readyState === 4 && jsonEN.status >= 200 && jsonEN.status < 400) {
            language = "en";
            fillHtml(JSON.parse(jsonEN.responseText));
        }
    };

    function fillHtml(loadedJson) {
        document.title = loadedJson.name;
        document.querySelector(".icoMore.pdf").parentElement.setAttribute("href", loadedJson.pdf);
        document.querySelector(".topBarTitle").innerHTML = `${loadedJson.name} - ${loadedJson.title} - ${data.getFullYear()}`;
        document.querySelector(".nome").innerHTML = loadedJson.name;
        document.querySelector(".occupation").innerHTML = `${loadedJson.profile.occupation.title}: <span class="txtAmarelo">${loadedJson.profile.occupation.description}</span>`;
        
        const birth = new Date(loadedJson.profile.birth.description);
        const birthFormatted = language === "en" ? `${months[birth.getMonth()]}/0${birth.getDate()}/${birth.getFullYear()}` : `0${birth.getDate()}/0${birth.getMonth() + 1}/${birth.getFullYear()}`;
        document.querySelector(".birth").innerHTML = `${loadedJson.profile.birth.title}: ${birthFormatted}`;

        document.querySelector(".phone").innerHTML = `${loadedJson.profile.phone.title}: <a href="tel:${loadedJson.profile.phone.description}">${loadedJson.profile.phone.description}</a>`;
        document.querySelector(".email").innerHTML = `${loadedJson.profile.email.title}: <a href="mailto:${loadedJson.profile.email.description}">${loadedJson.profile.email.description}</a>`;
        document.querySelector(".address").innerHTML = `${loadedJson.profile.address.title}: ${loadedJson.profile.address.description}`;
        document.querySelector(".nationality").innerHTML = `${loadedJson.profile.nationality.title}: ${loadedJson.profile.nationality.description}`;
        document.querySelector(".matrialstatus").innerHTML = `${loadedJson.profile.matrialstatus.title}: ${loadedJson.profile.matrialstatus.description}`;
        document.querySelector(".children").innerHTML = `${loadedJson.profile.children.title}: ${loadedJson.profile.children.description}`;
        document.querySelector(".driverlicense").innerHTML = `${loadedJson.profile.driverlicense.title}: ${loadedJson.profile.driverlicense.description}`;
        document.querySelector(".car").innerHTML = `${loadedJson.profile.car.title}: ${loadedJson.profile.car.description}`;
        document.querySelector(".travel").innerHTML = `${loadedJson.profile.travel.title}: ${loadedJson.profile.travel.description}`;
        document.querySelector(".move").innerHTML = `${loadedJson.profile.move.title}: ${loadedJson.profile.move.description}`;

        document.querySelector(".opportunity").innerHTML = `<h2>${loadedJson.sections.opportunity.title}:</h2><article>${loadedJson.sections.opportunity.description}</article>`;
        document.querySelector(".profile").innerHTML = `<h2>${loadedJson.sections.profile.title}:</h2><article>${loadedJson.sections.profile.description}</article>`;
        document.querySelector(".skills").innerHTML = `<h2>${loadedJson.sections.skills.title}:</h2><ul class="skillsList">${loadedJson.sections.skills.grid.map(skill => `<li>${skill}</li>`).join('')}</ul>`;
        document.querySelector(".languages").innerHTML = `<h2>${loadedJson.sections.languages.title}:</h2><ul class="languagesList">${loadedJson.sections.languages.grid.map(language => `<li>${language}</li>`).join('')}</ul>`;
        document.querySelector(".graduation").innerHTML = `<h2>${loadedJson.sections.graduation.title}:</h2><ul class="graduationList">${loadedJson.sections.graduation.grid.map(grad => `<li><b>${grad.title}</b> - ${grad.description}</li>`).join('')}</ul>`;
        document.querySelector(".courses").innerHTML = `<h2>${loadedJson.sections.courses.title}:</h2><ul class="coursesList">${loadedJson.sections.courses.grid.map(course => `<li><b>${course.title}</b> - ${course.description}</li>`).join('')}</ul>`;
        document.querySelector(".experience").innerHTML = `<h2>${loadedJson.sections.experience.title}:</h2><ul class="experienceList">${loadedJson.sections.experience.grid.map(exp => `<li><b>${exp.title}</b><br/>${exp.description}<br/>${exp.link ? `<a href="${exp.link}" target="_blank">${exp.link}</a>` : ''}</li><br/><br/>`).join('')}</ul>`;
        document.querySelector(".portifolio").innerHTML = `<h2>${loadedJson.sections.portifolio.title}</h2><div class="portifolioList">${loadedJson.sections.portifolio.grid.map(port => `<div class="portifolioListTitle">${port.title}</div>${port.grid.map(item => `<div class="portifolioListItem"><div class="portifolioListItemThumb"><a href="javascript:void(null)" class="btnContent" content="${item.content}"><img src="${item.thumb}" /></a></div><div class="portifolioListItemDescription">${item.title}<br/><br/>${item.description}</div></div>`).join('')}`).join('')}</div>`;

        const btnContent = document.getElementsByClassName('btnContent');
        const imageModalFrame = document.querySelector('.imageModalFrame');
        window.onclick = function(event) {
            if (event.target === imageModalFrame) {
                closeModal();
            }
        };
        for (let i = 0; i < btnContent.length; i++) {
            btnContent[i].onclick = function() {
                if (this.getAttribute("content")) {
                    const content = this.getAttribute("content");
                    const contentType = content.split(".")[1];
                    switch (contentType) {
                        case "m4v":
                        case "mp4":
                            videoOpen(content, document.querySelector('.contentView'));
                            break;
                        case "jpg":
                        case "png":
                            imageOpen(content, document.querySelector('.contentView'));
                            break;
                        case "pdf":
                            pdfOpen(content);
                            break;
                        default:
                            console.log("web");
                            break;
                    }
                } else {
                    console.log("vazio");
                }
            };
        }

        function imageOpen(img, target) {
            target.innerHTML = `<div class="imageModalFrameClose"><div class="btnClose">[X]</div></div><img src="${img}" />`;
            showModal();
        }

        function pdfOpen(pdf) {
            window.open(pdf);
        }

        function videoOpen(video, target) {
            target.innerHTML = `<div class="imageModalFrameClose"><div class="btnClose">[X]</div></div><video autoplay controls><source src="${video}" type="video/mp4"></video>`;
            showModal();
        }

        function showModal() {
            document.querySelector('.btnClose').onclick = function() {
                closeModal();
            };
            imageModalFrame.style.display = imageModalFrame.style.display === "flex" ? "none" : "flex";
        }

        function closeModal() {
            imageModalFrame.style.display = "none";
            document.querySelector('.contentView').innerHTML = "";
        }
    }
} catch (err) {
    alert(err);
}