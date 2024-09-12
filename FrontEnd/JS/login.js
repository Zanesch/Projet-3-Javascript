const loginApi = "http://localhost:5678/api/users/login";

document.getElementById('logbox').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let user = {
      email: email,
      password: password,
  };

  try {
      let response = await fetch(loginApi, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
      });
      if (response.status != 200) {
        let existingErrorBox = document.querySelector(".error-login");
        if (!existingErrorBox) {
            const errorbox = document.createElement("div");
            errorbox.className = "error-login";
            errorbox.innerHTML = "Il y a eu une erreur de connexion";
            document.querySelector("form").prepend(errorbox);
        }
        /*console.log(response);
        let result = await response.json();
        const token = result.token;
        console.log(result.token);
        console.log(response);
        if (token) {
          window.sessionStorage.setItem("authToken", token);
          console.log("Token enregistré:", token);
      } else {
          console.error("Token non trouvé dans la réponse");
      }*/
    }else{
      console.log(response);
      let result = await response.json();
      const token = result.token;
      console.log(result.token);
      console.log(response);
      if (token) {
        window.sessionStorage.setItem("authToken", token);
        console.log("Token enregistré:", token);
    } else {
        console.error("Token non trouvé dans la réponse");
    }
    }
    console.log("Session Storage:", sessionStorage.getItem("authToken"));
console.log("Local Storage:", localStorage.getItem("authToken"));

      

      let result = await response.json();
  } catch (error) {
      console.error("Error:", error);
   }
});
