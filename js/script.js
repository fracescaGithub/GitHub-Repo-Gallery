const overview = document.querySelector(".overview");
const username = "francescabambozzi";
const repoList = document.querySelector(".repo-list");
const allReposContainer = document.querySelector(".repos-container");
const repoModal = document.querySelector("#repo-info-modal");
const filterInput = document.querySelector(".search-field");

const gitUserInfo = async function () {
  const userInfo = await fetch(`https://api.github.com/users/${username}`);
  const data = await userInfo.json();
  displayUserInfo(data);
};

gitUserInfo();

const displayUserInfo = function (data) {
  const div = document.createElement("div");
  div.classList.add("user-info");
  div.innerHTML = `
    <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
  `;
  overview.append(div);
  gitRepos(username);
};

const gitRepos = async function (username) {
  const fetchRepos = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
  );
  const repoModal = await fetchRepos.json();
  displayRepos(repoModal);
};

const displayRepos = function (repos) {
  filterInput.classList.remove("hide");
  for (const repo of repos) {
    const repoItem = document.createElement("div");

    //add css class name to single repo ("div")
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(repoItem);
  }

  getRepoInfo(repo);
};

repoList.addEventListener("click", function (e) {
  if (e.target.matches("div")) {
    const repoName = e.target.innerText;
    getRepoInfo(repoName);
  }
});

const getRepoInfo = async function (repoName) {
  const fetchInfo = await fetch(
    `https://api.github.com/repos/${username}/${repoName}`
  );
  const repoInfo = await fetchInfo.json();

  // Grab languages
  const fetchLanguages = await fetch(repoInfo.languages_url);
  const languageData = await fetchLanguages.json();

  // Make a list of languages
  const languages = [];
  for (const language in languageData) {
    languages.push(language);
  }

  displayRepoInfo(repoInfo, languages);
};

const displayRepoInfo = function (repoInfo, languages) {
  repoModal.style.display = "block";

  window.onclick = function (event) {
    if (event.target == repoModal) {
      repoModal.style.display = "none";
    }
  };

  repoModal.innerHTML = "";
  const div = document.createElement("div");
  div.classList.add("modal-content");

  div.innerHTML = `
  <h3>Name: ${repoInfo.name}</h3>
  <span class="close">&times;</span>
  <p><strong>Description:</strong> ${repoInfo.description}</p>
  <p><strong>Default Branch:</strong> ${repoInfo.default_branch}</p>
  <p><strong>Languages:</strong> ${languages.join(", ")}</p>
  <a class="visitLink" href="${
    repoInfo.html_url
  }" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
  `;

  repoModal.append(div);

  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    repoModal.style.display = "none";
  };
  
};

//Search functionality
filterInput.addEventListener("input", function (e) {
  const searchText = e.target.value;
  const repos = document.querySelectorAll(".repo");
  const searchLowerText = searchText.toLowerCase();

  for (const repo of repos) {
    const repoLowerText = repo.innerText.toLowerCase();
    if (repoLowerText.includes(searchLowerText)) {
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    }
  }
});
