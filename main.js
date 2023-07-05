const navToggle = document.querySelector(".mobile-nav-toggle");
const primaryNav = document.querySelector(".primary-navigation");
const form = document.querySelector("form.url-input");
const urlInput = document.querySelector("#url-input");
let linkLocation = 0;
let shortenedURLs;

navToggle.addEventListener("click", () => {
  primaryNav.hasAttribute("data-visible")
    ? navToggle.setAttribute("aria-expanded", false)
    : navToggle.setAttribute("aria-expanded", true);
  primaryNav.toggleAttribute("data-visible");
});

window.onload = (event) => {
  if (!urlInput.validity.valid) {
    form.classList.add("error");
  }
  loadLinks();
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.querySelector("input").value) {
    form.querySelector("input").setAttribute("aria-invalid", "true");
    form.classList.add("error");
    setTimeout(() => {
      form.querySelector("input").setAttribute("aria-invalid", "false");
      form.classList.remove("error");
    }, 5000);
  } else {
    if (addLink(form.querySelector("input").value)) {
      form.querySelector("input").value = "";
      loadLinks();
    } else {
      form.querySelector("input").value = "";

      document.querySelectorAll(".hashed-link").forEach((listLink, index) => {
        if (index === linkLocation) {
          listLink.scrollIntoView({ behavior: "smooth" });
          listLink.classList.add("pulsing");
          setTimeout(() => {
            listLink.classList.remove("pulsing");
          }, 2000);
        }
      });
    }
  }
});

urlInput.addEventListener("focus", function () {
  form.classList.remove("error");
});

urlInput.addEventListener("blur", function () {
  if (!urlInput.validity.valid) {
    form.classList.add("error");
  }
});

function addLink(link) {
  const links = localStorage.links;
  // check for dups
  if (!links) {
    const hashedLinks = [];
    hashedLinks.push(hashLink(link));
    localStorage.setItem("links", JSON.stringify(hashedLinks));
    return true;
  } else {
    const linksParsed = JSON.parse(links);
    let result = false;
    linksParsed.some((element, index) => {
      if (element.link === link) {
        result = true;
        linkLocation = index;
        return true;
      }
    });
    if (!result) {
      const hashedLinks = [];
      hashedLinks.push(hashLink(link));

      linksParsed.forEach((link) => {
        hashedLinks.push(link);
      });
      localStorage.setItem("links", JSON.stringify(hashedLinks));
      return true;
    } else {
      return false;
    }
  }
}

function hashLink(link) {
  const hashMap = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "v",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  let base = "https://rel.ink/";
  for (let count = 0; count < 6; count++) {
    base += hashMap[Math.floor(Math.random() * hashMap.length)];
  }
  base += "/";
  return { link: link, shortenedlink: base };
}

function loadLinks() {
  const links = localStorage.links;
  // check for dups
  if (!links) {
  } else {
    const linksParsed = JSON.parse(links);
    let linksToBeDisplayed = `<div class="container">
    <ul class="links-list flow" role="list">`;
    linksToBeDisplayed += linksParsed
      .map((link, index) => {
        return `<li class="hashed-link"><p class="long-link">${link.link}</p><hr><div class="flow"><p class="short-link">${link.shortenedlink}</p><button class="button" data-type="copy">Copy</button></div></li>`;
      })
      .join("");
    linksToBeDisplayed += `</ul></div>`;
    document.querySelector("#hashed-links").innerHTML = linksToBeDisplayed;
    const copyBtns = document.querySelectorAll(".button[data-type='copy']");

    copyBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.classList.add("copied");
        btn.textContent = "Copied";
        btn.previousElementSibling.textContent;
        navigator.clipboard
          .writeText(btn.previousElementSibling.textContent)
          .then(
            () => {
              console.log("success");
            },
            () => {
              console.log("failed");
            }
          );
      });
    });
  }
}
