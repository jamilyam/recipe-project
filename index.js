const recipesList = document.getElementById("recipesCenter");
const query = document.getElementById("searchBar");
const searchBar = document.getElementById("searchBar");
const searchHeading = document.getElementById("searchResultHeading");
const banner = document.getElementById("categories");
const cart = document.getElementById("cart-content");
let DATA = [];
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");

function fetchData() {
  fetch(
      "https://api.spoonacular.com/recipes/random?apiKey=ff32537512d242b9bcfb8e4ac6474a9b&number=4"
    )
    .then((response) => {
      if (!response.ok) {
        throw Error("Error");
      }
      return response.json();
    })
    .then((data) => {
      displayRecipes(data);
    })
    .catch((error) => {
      console.log(error);
    });
}
fetchData();

function displayRecipes(data) {
  DATA = data;
  const htmlString = data.recipes
    .map((recipe) => {
      return ` <article class="recipe">
                <div class="img-container">
                <img src="${recipe.image}"
                 alt="${recipe.title}"
                 class="recipe-img">
                <button class="bag-btn">
                <span>ready in ${recipe.readyInMinutes} minutes</span></button> 
               </div> 
                <div class="meal-info" data-mealid="${recipe.id}">
                <a><h3 class="recipe-name">${recipe.title}</h3></a>
                </div>
                 <button class="add-recipe-btn" btn-id="${recipe.id}">
                <i class="fas fa-clipboard-list"></i></button> 
            </article>`;
    })
    .join("");

  recipesList.innerHTML = htmlString;
  recipesList.addEventListener("click", (e) => {
    const mealInfo = e.path.find((item) => {
      if (item.classList) {
        return item.classList.contains("meal-info");
      } else {
        return false;
      }
    });

    if (mealInfo) {
      const id = mealInfo.getAttribute("data-mealid");
      showRecipe(id);

      function showRecipe(id) {
        fetch(
            "https://api.spoonacular.com/recipes/" +
            id +
            "/information?apiKey=ff32537512d242b9bcfb8e4ac6474a9b&includeNutrition=false"
          )
          .then((response) => {
            if (!response.ok) {
              throw Error("Error");
            }
            return response.json();
          })
          .then((data) => {
            getRecipe(data);

            function getRecipe(data) {
              banner.remove();
              banner.style.background = "none";
              searchHeading.innerHTML = `<h2>${data.title}</h2>`;
              recipesList.innerHTML = ` <article class="single-recipe">
               <div class="recipe-header">
                 <img src="${data.image}"
                 alt="${data.title}"
                 class="img">
                  <div class="recipe-details">
                  <div class="details-table"><h4>${
                    data.readyInMinutes
                  }</h4><span>minutes</span></div>
                  <div class="details-table"><h4>${
                    data.extendedIngredients.length
                  }</h4><span>Ingredients</span></div>
                  <div class="details-table"><h4>${
                    data.servings
                  }</h4><span>Servings</span></div>
                  </div>
               </div>
               <div class="main">
        <h1>Ingredients</h1>
        <ul>
          ${data.extendedIngredients
            .map(
              (extendedIngredients) =>
                `<li><span><strong>${extendedIngredients.name}</strong></span> - ${extendedIngredients.originalString}</li>`
            )
            .join("")}
        </ul>
        <h1>Instructions</h1>
        <ul>${data.instructions}</ul>
      </div>
            </article>`;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
    const btn = e.path.find((item) => {
      if (item.classList) {
        return item.classList.contains("add-recipe-btn");
      } else {
        return false;
      }
    });
    if (btn) {
      btn.addEventListener("click", addItem);

      function addItem() {
        let id = btn.getAttribute("btn-id");
        console.log("add item", id);
        CART.add(id, 1);
        showCart();
      }
    }
  });
}

searchBar.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    fetch(
        "https://api.spoonacular.com/recipes/search?apiKey=ff32537512d242b9bcfb8e4ac6474a9b&number=4&query=" +
        query.value
      )
      .then((response) => {
        if (!response.ok) {
          throw Error("Error");
        }
        return response.json();
      })
      .then((data) => {
        searchResults(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

function searchResults(data) {
  if (data.results === null) {
    searchHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
  } else {
    const htmlString = data.results
      .map((recipe) => {
        return ` <article class="recipe">
               <div class="img-container">
               <img src="https://spoonacular.com/recipeImages/${recipe.image}"
                 alt="img"
                 class="recipe-img">
               <button class="bag-btn">
                <span>ready in ${recipe.readyInMinutes} minutes</span></button> 
               </div> 
                <div class="meal-info" data-mealid="${recipe.id}">
                <a><h3 class="recipe-name">${recipe.title}</h3></a>
                </div>
                <button class="add-recipe-btn" btn-id="${recipe.id}">
                  <i class="fas fa-clipboard-list"></i></button>
            </article>`;
      })
      .join("");
    banner.remove();
    banner.style.background = "none";
    recipesList.innerHTML = htmlString;
    searchHeading.innerHTML = `<h2>Search results for ${query.value}:</h2>`;
    query.value = "";
    recipesList.addEventListener("click", (e) => {
      const mealInfo = e.path.find((item) => {
        if (item.classList) {
          return item.classList.contains("meal-info");
        } else {
          return false;
        }
      });
      if (mealInfo) {
        const id = mealInfo.getAttribute("data-mealid");
        showRecipe(id);

        function showRecipe(id) {
          fetch(
              "https://api.spoonacular.com/recipes/" +
              id +
              "/information?apiKey=ff32537512d242b9bcfb8e4ac6474a9b&includeNutrition=false"
            )
            .then((response) => {
              if (!response.ok) {
                throw Error("Error");
              }
              return response.json();
            })
            .then((data) => {
              getRecipe(data);

              function getRecipe(data) {
                banner.remove();
                banner.style.background = "none";
                searchHeading.innerHTML = `<h2>${data.title}</h2>`;
                recipesList.innerHTML = ` <article class="single-recipe">
               <div class="recipe-header">
                 <img src="${data.image}"
                 alt="${data.title}"
                 class="img">
                  <div class="recipe-details">
                  <div class="details-table"><h4>${
                    data.readyInMinutes
                  }</h4><span>minutes</span></div>
                  <div class="details-table"><h4>${
                    data.extendedIngredients.length
                  }</h4><span>Ingredients</span></div>
                  <div class="details-table"><h4>${
                    data.servings
                  }</h4><span>Servings</span></div>
                  </div>
               </div>
               <div class="main">
        <h1>Ingredients</h1>
        <ul>
          ${data.extendedIngredients
            .map(
              (extendedIngredients) =>
                `<li><span><strong>${extendedIngredients.name}</strong></span> - ${extendedIngredients.originalString}</li>`
            )
            .join("")}
        </ul>
        <h1>Instructions</h1>
        <ul>${data.instructions}</ul>
      </div>
            </article>`;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
      const btn = e.path.find((item) => {
        if (item.classList) {
          return item.classList.contains("add-recipe-btn");
        } else {
          return false;
        }
      });
      if (btn) {
        btn.addEventListener("click", addItem);

        function addItem() {
          let id = btn.getAttribute("btn-id");
          console.log("add item", id);
          CART.add(id, 1);
          showCart();
        }
      }
    });
  }
}

const CART = {
  KEY: "saved_recipes",
  contents: [],
  init() {
    let _contents = localStorage.getItem(CART.KEY);
    if (_contents) {
      CART.contents = JSON.parse(_contents);
    } else {
      CART.contents = [];
      CART.sync();
    }
  },
  async sync() {
    let _cart = JSON.stringify(CART.contents);
    await localStorage.setItem(CART.KEY, _cart);
  },
  add(id) {
    let arr = DATA.recipes.filter((product) => {
      if (product.id == id) {
        return true;
      }
    });
    if (arr && arr[0]) {
      let obj = {
        id: arr[0].id,
        title: arr[0].title,
        image: arr[0].image,
      };
      CART.contents.push(obj);
      CART.sync();
    } else {
      console.error("Invalid Product");
    }
  },
  remove(id) {
    CART.contents = CART.contents.filter((item) => {
      if (item.id !== id) return true;
    });
    CART.sync();
  },
  empty() {
    CART.contents = [];
    CART.sync();
  },
};

function showCart() {
  cart.innerHTML = "";
  let s = CART.contents;
  s.forEach((item) => {
    let cartitem = document.createElement("div");
    cartitem.className = "cart-item";
    let image = document.createElement("img");
    image.src = item.image;
    image.className = "cart-item img";
    let title = document.createElement("h3");
    title.textContent = item.title;
    title.className = "title";
    cartitem.appendChild(title);
    cartitem.appendChild(image);
    cart.appendChild(cartitem);
  });
}
closeCartBtn.addEventListener("click", this.hideSaved);
cartBtn.addEventListener("click", this.showSaved);

function showSaved() {
  cartOverlay.classList.add("transparentBcg");
  cartDOM.classList.add("showCart ");
  showCart();
}

function hideSaved() {
  cartOverlay.classList.remove("transparentBcg");
  cartDOM.classList.remove("showCart ");
}

function select_tab(id) {
  document
    .querySelectorAll(".route")
    .forEach((item) => item.classList.remove("selected"));
  document
    .querySelectorAll("#" + id)
    .forEach((item) => item.classList.add("selected"));
}

function loadContent(id) {
  searchHeading.innerHTML = "";
  document.querySelector("#recipesCenter").innerHTML = fetchData() + id;
}

function push(event) {
  let id = event.target.id;
  select_tab(id);
  document.title = id;
  loadContent(id);
  window.history.pushState({
      id,
    },
    `${id}`,
    `/page/${id}`
  );
}
window.onload = (event) => {
  window["home"].addEventListener("click", (event) => push(event));
  window["random"].addEventListener("click", (event) => push(event));
};
window.addEventListener("popstate", (event) => {
  let stateId = event.state.id;
  console.log("stateId = ", stateId);
  select_tab(stateId);
  loadContent(id);
});