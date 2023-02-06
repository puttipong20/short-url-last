const form = document.querySelector(".wrapper form"),
    fullURL = form.querySelector("input"),
    shortenBtn = form.querySelector("form button"),
    blurEffect = document.querySelector(".blur-effect"),
    popupBox = document.querySelector(".popup-box"),
    infoBox = popupBox.querySelector(".info-box"),
    form2 = popupBox.querySelector("form"),
    shortenURL = popupBox.querySelector("form .shorten-url"),
    copyIcon = popupBox.querySelector("form .copy-icon"),
    saveBtn = popupBox.querySelector("button");

const wrapper = document.querySelector(".container"),
    qrInput = wrapper.querySelector(".form input"),
    generateBtn = wrapper.querySelector(".form button"),
    qrImg = wrapper.querySelector(".qr-code img");
let preValue;

generateBtn.addEventListener("click", () => {
    let qrValue = fullURL.value.trim();
    if (!qrValue || preValue === qrValue) return;
    preValue = qrValue;
    generateBtn.innerText = "Generating QR Code...";
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrValue}`;
    qrImg.addEventListener("load", () => {
        wrapper.classList.add("active");
        generateBtn.innerText = "Generate QR Code";
    });
});
shortenURL.addEventListener("keyup", () => {
    if(!shortenURL.value.trim()) {
        wrapper.classList.remove("active");
        preValue = "";
    }
});

form.onsubmit = (e) => {
    e.preventDefault();
}

//generate short url
shortenBtn.onclick = () => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "php/url-controll.php", true);
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let data = xhr.response;
            if (data.length <= 5) {
                blurEffect.style.display = "block";
                popupBox.classList.add("show");

                //paste your url here. Like this: codingnepalweb.com/
                let domain = "localhost/url/";
                shortenURL.value = domain + data;
                copyIcon.onclick = () => {
                    shortenURL.select();
                    document.execCommand("copy");
                }

                saveBtn.onclick = () => {
                    form2.onsubmit = (e) => {
                        e.preventDefault();
                    }

                    let xhr2 = new XMLHttpRequest();
                    xhr2.open("POST", "php/save-url.php", true);
                    xhr2.onload = () => {
                        if (xhr2.readyState == 4 && xhr2.status == 200) {
                            let data = xhr2.response;
                            if (data == "success") {
                                location.reload();
                            } else {
                                infoBox.classList.add("error");
                                infoBox.innerText = data;
                            }
                        }
                    }
                    let shorten_url1 = shortenURL.value;
                    let hidden_url = data;
                    xhr2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhr2.send("shorten_url=" + shorten_url1 + "&hidden_url=" + hidden_url);
                };
            } else {
                alert(data);
            }
        }
    }
    let formData = new FormData(form);
    xhr.send(formData);
}