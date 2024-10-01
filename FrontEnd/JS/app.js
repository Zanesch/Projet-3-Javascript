
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

  const figure = document.createElement("figure");
  figure.innerHTML = `
  <div class="image-container">
    <img src="${data.imageUrl}" alt="${data.title}">
    <figcaption>${data.title}</figcaption>
    <i class="fa-solid fa-trash-can trash-icon"></i>
  </div>
`;
  const trashIcon = figure.querySelector(".fa-solid.fa-trash-can.trash-icon");
  trashIcon.addEventListener("click", async function () {
    const confirmed = confirm("Are you sure you want to delete this image?");

    if (confirmed) {
      const authToken = sessionStorage.getItem("authToken");

      if (!authToken) {
        alert("You are not authorized to delete this image. Please log in.");
        return;
      }
      try {
        const response = await fetch(`http://localhost:5678/api/works/${data.imageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (response.ok) {

          figure.remove();
          alert("Image deleted successfully.");
        } else {
          alert("Failed to delete the image.");
        }
      } catch (error) {
        console.error("Error deleting the image:", error);
        alert("Error deleting the image. Please try again.");
      }
    }
  });
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
    const divContainer = document.querySelector('.div-container');
    if (divContainer) {
      divContainer.style.display = 'none';
    } else {
      console.error("L'élément avec la classe 'div-container' n'a pas été trouvé.");
    }
    const editbanner = document.createElement("div");
    editbanner.className = "edit";
    editbanner.innerHTML = '<p><a href="#modal" class="js-modal"> <i class="fa-solid fa-pen-to-square"></i>Mode édition</a></p>';
    document.body.prepend(editbanner);
    const titleElement = document.getElementById("edit-title");
    if (titleElement) {
      const edittitle = document.createElement("span");
      edittitle.className = "edit-title";
      edittitle.innerHTML = '<i class="fa-regular fa-pen-to-square"></i></i> Modifier';
      titleElement.appendChild(edittitle);
    } else {
      console.error("L'élément avec l'ID 'edit-title' n'a pas été trouvé.");
    }
    const authLink = document.getElementById("log");
    if (authLink) {
      authLink.innerHTML = '<a href="#" id="logout-link">logout</a>';

      // Ajouter un écouteur d'événement pour gérer la déconnexion
      const logoutLink = document.getElementById("logout-link");
      logoutLink.addEventListener("click", function(event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        
        // Suppression des données d'authentification dans sessionStorage
        sessionStorage.removeItem("authToken");

        // Redirection vers la page de connexion
        window.location.href = "index.html";
      });
    } else {
      console.error("L'élément avec l'ID 'log' n'a pas été trouvé.");
    }
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
  const titleElement = document.getElementById("edit-title");
  if (titleElement) {
    const edittitle = titleElement.querySelector(".edit-title");
    if (edittitle) {
      edittitle.style.display = 'none'; // Hide the span
    }
  modal = target
  modal.addEventListener('click', closemodal)
  modal.querySelector('.js-modal-close').addEventListener('click', closemodal)
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

}
}
const closemodal = function (e) {
  if (modal === null) return
  e.preventDefault()
  modal.style.display = "none"
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute("aria-modal")
  modal.removeEventListener('click', closemodal)
  modal.querySelector(".js-modal-close").removeEventListener('click', closemodal)
  modal.querySelector(".js-modal-stop").removeEventListener('click', stopPropagation)

  modal = null

}
const stopPropagation = function (e) {
  e.stopPropagation()
}
document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openmodal)
})
//switch modale//
const switchModale = function() {
  document.querySelector(".modal-wrapper").innerHTML = `<div class="modal-wrapper js-modal-stop">
			<div class="close-button">
			<button class="js-modal-close"> <i class="fa-solid fa-xmark"></i></button>
		</div>
			<h3 id="titlemodal">Ajout Photo</h3>
      <form action="#" method="post">
				<label for="name">Nom</label>
				<input type="text" name="name" id="name">
				<label for="email">Email</label>
				<input type="email" name="email" id="email">
				<label for="message">Message</label>
				<textarea name="message" id="message" cols="30" rows="10"></textarea>
				<input type="submit" value="Envoyer">
			</form>
			<div class="gallery-modal"></div>
			<hr />
			<div class="modal-button-container">
				<button class="add-photo-button">Valider</button>
			</div>
		</div>`;
};

const addphotobutton = document.querySelector(".add-photo-button");
addphotobutton.addEventListener('click', switchModale);
