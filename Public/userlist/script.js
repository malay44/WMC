const list = document.getElementById("list");

// Render Users
const template = listItem => {
	return `
			<a class="list-item">
			  <div class="list-item__avatar">
			  </div>
			  <div class="list-item__content">
					  <strong class="list-item__name">${listItem.name}</strong>
					  <span class="list-item__info">@${listItem.username} <br>  @${listItem.email}</span>
					</div>
			  <form action="/admin/deregisteruser/${listItem._id}" method="post">	
			  <button type="submit" class="list-item__button">
			  <img  id="${listItem._id}" style="height: 18px; width: 18px;" src='data:image/png;base64,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'/>
			  </button>
			  </form>
			</a>
  `;
};
console.log(eventid);
fetch(`http://localhost:3000/userdata/${eventid}`, { method: "get" })
	.then(response => response.json())
	.then(data =>
		data.forEach(result => (list.innerHTML += template(result)))
	)

	const onClick = (event)=>{
		if (event.target.nodeName === 'IMG'){
			console.log(event.target.id);
		}
	}
	window.addEventListener('click', onClick);
	

// Search
const userSearch = document.querySelector("[data-search]");

userSearch.addEventListener("keyup", filter);

function filter() {
	var term = document.querySelector("[data-search]").value.toLowerCase();
	var tag = document.querySelectorAll("[data-searchable] .list-item");
	for (i = 0; i < tag.length; i++) {
		if (tag[i].innerHTML.indexOf(term) !== -1) {
			tag[i].style.display = "flex";
		} else {
			tag[i].style.display = "none";
		}
	}
}

const recentSearch = document.querySelector(".recent-search");
const recentSearchList = document.querySelector(".recent-search__list");
const recentSearchTitle = document.querySelector(".recent-search__title");
const recentSearchCount = recentSearchList.childNodes.length;
const clearBtn = document.querySelector(".clear-btn");
const clearSearch = document.querySelector('.search__clear');

clearSearch.addEventListener('click', () => {
	userSearch.value = "";
	filter();
})

userSearch.addEventListener("keydown", event => {
	const keyName = event.key;
	if (event.key == "Enter") {
		let inputText = userSearch.value.toLowerCase();
		recentSearchList.insertAdjacentHTML(
			"beforeend",
			`<span class="search-item" onclick="labelSearch('${inputText}')">${inputText}<span class="search-item__close">×</span></span>`
		);
		if (recentSearchList.childNodes.length > 0) {
			clearBtn.innerHTML = "Clear Items";
			clearBtn.removeAttribute("disabled");
			var btn = document.querySelectorAll(".search-item__close");

			for (var i = 0; i < btn.length; i++) {
				btn[i].addEventListener("click",function(e) {
						e.currentTarget.parentNode.remove();
					},false
				);
			}
		}
	} else {
	}
});

function labelSearch(x) {
	userSearch.value = x;
	filter();
}

const clearRecent = () => {
	recentSearchList.innerHTML = "";
	clearBtn.setAttribute("disabled", true);
	clearBtn.innerHTML = "No Recent Items";
	userSearch.value = '';
	filter();
};