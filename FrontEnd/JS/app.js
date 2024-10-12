
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
      const deleteWorkBtns = document.querySelectorAll(".image-container");
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
      edittitle.addEventListener('click', function() {
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
      logoutLink.addEventListener("click", function(event) {
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
  .forEach((e)=> e.addEventListener('click', closemodal));

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

// deleteworks//
//const trashCans = document.querySelectorAll(".fa-trash-can");
  //  console.log(trashCans);
  //  trashCans.forEach((e) => e.addEventListener("click", deleteworks));
  /*async function handleDeleteWork() {
    const deleteWorkBtns = document.querySelectorAll(".image-container");
    deleteWorkBtns.forEach(btn => {
        btn.addEventListener("click", deletework);
    });
}*/
    
async function deletework(e) {
  e.preventDefault(e)
  const id = e.currentTarget.id;
  console.log(id);
  const deleteApi = `http://localhost:5678/api/works/${id}`;
  const token = sessionStorage.authToken;
  let response = await fetch(deleteApi, {
    method: "DELETE",
    headers :{
      Authorization: "Bearer " + token,
    }
  });
  if (response.status == 401 || response.status == 500) {
    const errorbox = document.createElement("div");
    errorbox.className = "error-login";
    errorbox.innerHTML = "il y a eu une erreur";
    document.querySelector(".modal-button-container").prepend(errorbox);
  }else {
    let result = await response.json();
    console.log(result);
  }
}
//handleDeleteWork()



//switch modale//
const switchModale = function() {
  document.querySelector(".modal-wrapper").innerHTML = `
			<div class="modal-switch-container">
      <button class="js-modal-back">
      <i class="fa-solid fa-arrow-left"></i>
      </button>
			<button class="js-modal-close">
       <i class="fa-solid fa-xmark"></i>
       </button>
		  </div>
			<h3 >Ajout Photo</h3>
      <div class="form">
      <form action="#" method="post">
				<label for="title">Titre</label>
				<input type="text" name="title" id="title">
				<label for="category">Categorie</label>
				<input type="category" name="category" id="category">
        <hr />
				<input type="submit" value="Valider">
			</form>
      </div>
		</div>`;
    
};

const addphotobutton = document.querySelector(".add-photo-button");
addphotobutton.addEventListener('click', switchModale);

//back-modal
document.querySelector(".js-modal-back").addEventListener("click", function() {
  closemodal(); // Ferme la modale active
  openmodal({target: {getAttribute: () => "#modal"}}); // Ouvre la modale précédente
});
