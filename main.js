










const url = document.querySelector(".url")
const clip  = document.querySelector(".clip")
const shorten = document.querySelector(".search-btn")

shorten.addEventListener("click", display)


function display() {
    console.log("Hello")
     clip.innerHTML += `
      <div class="show-url">
       <p class="http"> ${url.value}</p>  <button className="copy">Copy</button>
      </div>
     `
}






















































































