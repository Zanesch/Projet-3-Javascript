
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
    //  async function handleDeleteWork() {
    const deleteWorkBtns = document.querySelectorAll(".trash-icon");
    deleteWorkBtns.forEach(btn => {
      btn.addEventListener("click", deletework);
    });

    // }
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
  <div class="image-container" id ="${data.id}">
    <img src="${data.imageUrl}" alt="${data.title}">
    <figcaption>${data.title}</figcaption>
    <i class="fa-solid fa-trash-can trash-icon"></i>
  </div>
`;

  ;
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
      edittitle.addEventListener('click', function () {
        const modalLink = document.querySelector('.js-modal');
        if (modalLink) {
          modalLink.click();
        } else {
          console.error("La modale ou le lien pour l'ouvrir n'a pas été trouvé.");
        }
      });
    } else {
      console.error("L'élément avec l'ID 'edit-title' n'a pas été trouvé.");
    }
    const authLink = document.getElementById("log");
    if (authLink) {
      authLink.innerHTML = '<a href="#" id="logout-link">logout</a>';


      const logoutLink = document.getElementById("logout-link");
      logoutLink.addEventListener("click", function (event) {
        event.preventDefault();
        sessionStorage.removeItem("authToken");
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
    modal.querySelectorAll('.js-modal-close')
      .forEach((e) => e.addEventListener('click', closemodal));

    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

  }
}
const closemodal = function (e) {
  if (modal === null) return
  e.preventDefault()
  modal.style.display = "none"
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute("aria-modal")
  const titleElement = document.getElementById("edit-title");
  if (titleElement) {
    const edittitle = titleElement.querySelector(".edit-title");
    if (edittitle) {
      edittitle.style.display = ''; // Réafficher le span
    }
    modal.removeEventListener('click', closemodal)
    modal.querySelector(".js-modal-close").removeEventListener('click', closemodal)
    modal.querySelector(".js-modal-stop").removeEventListener('click', stopPropagation)

    modal = null
  }
}
const stopPropagation = function (e) {
  e.stopPropagation()
}
document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openmodal)
})



async function deletework(e) {
  e.preventDefault();  // Empêche le comportement par défaut (comme la fermeture ou le rechargement)

  // Utiliser closest pour remonter au parent ayant l'ID
  const imageContainer = e.currentTarget.closest('.image-container');
  const id = imageContainer.id;
  console.log(id);  // Vérification si l'ID est bien récupéré

  const deleteApi = `http://localhost:5678/api/works/${id}`;
  const token = sessionStorage.authToken;

  try {
    let response = await fetch(deleteApi, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      }
    });

    if (response.ok) {
      console.log("Suppression réussie");


      imageContainer.remove();

    } else if (response.status === 401 || response.status === 500) {
      const errorbox = document.createElement("div");
      errorbox.className = "error-login";
      errorbox.innerHTML = "Il y a eu une erreur";
      document.querySelector(".modal-button-container").prepend(errorbox);
    }

  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
  }
}


//handleDeleteWork()



//switch modale//
const addPhotoButton = document.querySelector(".add-photo-button");
const backButton = document.querySelector(".js-modal-back");

addPhotoButton.addEventListener("click", toggleModal);
backButton.addEventListener("click", toggleModal);

function toggleModal() {
  const modalgallery = document.querySelector(".modal-gallery");
  const addModal = document.querySelector(".add-modal");

  if (modalgallery.style.display === "block" || modalgallery.style.display === "") {
    modalgallery.style.display = "none";
    addModal.style.display = "block";
  } else {
    modalgallery.style.display = "block";
    addModal.style.display = "none";
  }
}
// ajout photo input //



document.getElementById('file').addEventListener('change', function(event) {
  const fileInput = event.target;
  const file = fileInput.files[0]; 
  
  if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();

      reader.onload = function(e) {
          const img = document.createElement('img');
          img.src = e.target.result;
          img.alt = "Selected image";
          img.style.maxWidth = "100%"; 

          const preview = document.getElementById('load-picture');
          preview.innerHTML = ''; 
          preview.appendChild(img);
      }

      reader.readAsDataURL(file);
      document.querySelector('label[for="file"]').style.display = 'none';
      document.querySelector('.file-section p').style.display = 'none';
      document.querySelector('.icon-container').style.display = 'none';

  } else {
      alert('Please select a jpg or png image');
  }
});

 const titleInput= document.getElementById("title");
 const categorySelect = document.getElementById("category");

categorySelect.addEventListener("change", function() {
    const selectedValue = categorySelect.value;

    const selectedText = categorySelect.options[categorySelect.selectedIndex].text;
    console.log("Valeur sélectionnée :", selectedValue);
    console.log("Texte sélectionné :", selectedText);
});

 let titleValue = "";
 let selectedValue ="1";

 document.getElementById("category").addEventListener("change", function (){
  selectedValue = this.value;

 });
 titleInput.addEventListener("input", function() {
  titleValue = titleInput.value;
  console.log("titre actuel:", titleValue);
});

const pictureForm = document.getElementById("picture-form");

if (pictureForm) {
  pictureForm.addEventListener("submit", handleSubmit);
}


async function handleSubmit(event) {
  event.preventDefault();

  const titleInput = document.getElementById("title");
  if (!titleInput) {
    console.error("L'élément avec l'ID 'title' est introuvable.");
    return;
  }

  const titleValue = titleInput.value;
  const hasImage = document.querySelector("#load-picture img");

  if (titleValue && hasImage) {
    console.log("Titre et image sont présents.");
  } else {
    console.log("Le titre ou l'image est manquant.");
    return; // Si le titre ou l'image est manquant, on arrête ici
  }

  const formData = new FormData();
  const fileInput = document.getElementById('file'); // Assurez-vous que l'input file existe
  formData.append("image", fileInput.files[0]); // Passez le fichier image lui-même
  formData.append("title", titleValue);
  formData.append("category", selectedValue);

  const token = sessionStorage.authToken;

  formData.forEach((value, key) => {
    console.log(key, value);
  });

  let response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token, // Ne pas définir Content-Type pour FormData
    },
    body: formData,
  });

  if (response.status !== 200) {
    let existingErrorBox = document.querySelector(".error-login");
    if (!existingErrorBox) {
      const errorbox = document.createElement("div");
      errorbox.className = "error-login";
      errorbox.innerHTML = "Il y a eu une erreur de connexion";
      document.querySelector("form").prepend(errorbox);
    } else {
      let result = await response.json();
      console.log(result);
    }
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const submitButton = document.querySelector("input[type='submit']");

  // Définition de l'état initial du bouton
  function updateButtonState() {
    if (titleInput.value.trim() !== "" && categorySelect.value !== "") {
      submitButton.style.backgroundColor = "#1D6154";  // Bouton vert
      submitButton.style.cursor = "pointer";
      submitButton.disabled = false;
    } else {
      submitButton.style.backgroundColor = "grey";   // Bouton gris
      submitButton.style.cursor = "not-allowed";
      submitButton.disabled = true;
    }
  }

  // Initialisation de l'état du bouton au chargement de la page
  updateButtonState();

  // Ajout des écouteurs d'événements pour surveiller les changements
  titleInput.addEventListener("input", updateButtonState);
  categorySelect.addEventListener("change", updateButtonState);
});



document.getElementById("picture-form").addEventListener("submit", handleSubmit);
