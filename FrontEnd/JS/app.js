
async function getworks(filter) {
  document.querySelector(".gallery").innerHTML = "";
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    if (filter) {
      const filtered = json.filter((data) => data.categoryId == filter)
      for (let i = 0; i < filtered.length; i++) {
        setFigure(filtered[i])
        setModalFigure(filtered[i])
      }
    } else {
      for (let i = 0; i < json.length; i++) {
        setFigure(json[i]);
        setModalFigure(json[i]);
       
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}
getworks()

function setFigure(data) {

  const figure = document.createElement("figure")
  figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
                        <figcaption>${data.title}</figcaption>`

  document.querySelector(".gallery").append(figure);
}
function setModalFigure(data) {

  const figure = document.createElement("figure")
  figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
                        <figcaption>${data.title}</figcaption>`

  document.querySelector(".gallery-modal").append(figure);
}


async function getcategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    for (let i = 0; i < json.length; i++) {
      setfilter(json[i]);
    }

  } catch (error) {
    console.error(error.message);
  }
}
getcategories()

function setfilter(data) {
  const div = document.createElement("div");
  div.classname = data.id;
  div.addEventListener("click", () => getworks(data.id));
  div.innerHTML = `${data.name}`
  document.querySelector(".div-container").append(div);
}


document.querySelector(".tous").addEventListener("click", () => getworks());

function displayAdminMode() {
  if (sessionStorage.authToken) {
    console.log("ok");
    const editbanner = document.createElement("div");
    editbanner.className = "edit";
    editbanner.innerHTML = '<p><a href="#modal" class="js-modal"> <i class="fa-solid fa-pen-to-square"></i>Mode édition</a></p>';
    document.body.prepend(editbanner);
  }

}
displayAdminMode();

let modal = null

const openmodal = function (e) {
  e.preventDefault()
  const target = document.querySelector(e.target.getAttribute('href'));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute('aria-modal', 'true');
  modal = target
  modal.addEventListener('click', closemodal)
  modal.querySelector('.js-modal-close').addEventListener('click',closemodal)
  modal.querySelector('.js-modal-stop').addEventListener('click',stopPropagation)

}

const closemodal = function(e) {
  if (modal === null) return
  e.preventDefault()
  modal.style.display = "none"
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute("aria-modal")
  modal.removeEventListener('click', closemodal)
  modal.querySelector(".js-modal-close").removeEventListener('click', closemodal)
  modal.querySelector(".js-modal-stop").removeEventListener('click', stopPropagation)

  modal= null

}
const stopPropagation = function(e) {
  e.stopPropagation()
}
document.querySelectorAll('.js-modal').forEach(a => {a.addEventListener('click', openmodal)
})