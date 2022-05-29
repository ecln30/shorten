const input = document.querySelector(".url")
const result = document.querySelector(".clip")
const shorten = document.querySelector(".search-btn")
const form = document.querySelector("form")

form.addEventListener("submit", display)
result.addEventListener("click", Copy)

function display(e) {
   e.preventDefault()
   fetch('/new', {
     method: "POST",
     headers: {
       "Accept": "application/json", 
       "Content-Type" : "application/json"
     },
     body: JSON.stringify({
       url: input.value
     })
   }).then(response => {
     if (!response.ok) {
       throw Error(response.statusText)
     }
     return response.json()
   }).then (data => {
      result.innerHTML += `
      <div class="show-url">
       <p class="longUrl"> ${input.value}</p>    
       <p class="shortUrl">https:// ${data.short_id} </p> 
       <button class="copy">Copy</button>
      </div>
     `
     input.value = "" 
    })
    .catch(console.error)
}

function Copy(e) {
  const el = e.target
  const longUrl = el.previousElementSibling.previousElementSibling.textContent
  const copyText = el.previousElementSibling
  console.log(copyText)
  navigator.clipboard.writeText(copyText.textContent);
  alert("Copied the text: " + copyText.textContent);
}

















































































