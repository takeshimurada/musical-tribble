const albums = [
  {
    id: "neo-soul",
    title: "Midnight Prism",
    artist: "Luna Park",
    year: 2021,
    genre: "Neo Soul",
    label: "Aurora Sound",
    contributors: "Park Ji-min (Bass), Rina Cho (Keys)",
    credits: "작곡/작사: Luna Park, Rina Cho",
    discography: "EP: Blue Hour (2019) · Album: Midnight Prism (2021)",
    map: "재즈-소울 교차점, 2010s 이후 Neo Soul 라인",
    rating: 0,
  },
  {
    id: "city-pop",
    title: "Neon Harbor",
    artist: "Seaside Avenue",
    year: 1984,
    genre: "City Pop",
    label: "Tokyo Breeze",
    contributors: "Kenji Ito (Guitar), Mika Sato (Sax)",
    credits: "작곡: Seaside Avenue · 작사: Mika Sato",
    discography: "Album: Neon Harbor (1984) · Live: Bayside Night (1986)",
    map: "80s 일본 시티팝 중심, AOR과 펑크 영향권",
    rating: 0,
  },
  {
    id: "indie-rock",
    title: "Parallel Lines",
    artist: "Aurora District",
    year: 2016,
    genre: "Indie Rock",
    label: "Northern Lights",
    contributors: "Evan Lee (Drums), Hana Kim (Synth)",
    credits: "작곡/작사: Aurora District",
    discography: "EP: Spark (2014) · Album: Parallel Lines (2016)",
    map: "2010s 인디 록 후반부, 신스-록 라인",
    rating: 0,
  },
  {
    id: "electronica",
    title: "Polychrome",
    artist: "Sora Wave",
    year: 2023,
    genre: "Electronica",
    label: "Pulse Lab",
    contributors: "Yuki Mori (Programming), J. Rivera (Vocals)",
    credits: "작곡: Sora Wave · 작사: J. Rivera",
    discography: "Album: Polychrome (2023)",
    map: "현대 일렉트로닉/IDM 경계, 실험적 사운드",
    rating: 0,
  },
];

const albumList = document.getElementById("album-list");
const infoPanel = document.getElementById("album-info");
const recommendList = document.getElementById("recommend-list");
const profileSummary = document.getElementById("profile-summary");
const profileText = document.getElementById("profile-text");
const copyButton = document.getElementById("copy-profile");

const formatStars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);

const renderAlbums = () => {
  albumList.innerHTML = "";
  albums.forEach((album) => {
    const card = document.createElement("div");
    card.className = "album-card";

    const title = document.createElement("h3");
    title.textContent = `${album.title} · ${album.artist}`;

    const meta = document.createElement("div");
    meta.className = "album-meta";
    meta.innerHTML = `<span>${album.year}</span><span>${album.genre}</span><span>${album.label}</span>`;

    const rating = document.createElement("div");
    rating.className = "rating";
    rating.dataset.albumId = album.id;

    for (let i = 1; i <= 5; i += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "★";
      button.dataset.value = i.toString();
      if (i <= album.rating) {
        button.classList.add("active");
      }
      rating.appendChild(button);
    }

    const ratingValue = document.createElement("span");
    ratingValue.textContent = album.rating ? formatStars(album.rating) : "아직 평가되지 않음";
    ratingValue.className = "album-meta";

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(rating);
    card.appendChild(ratingValue);
    albumList.appendChild(card);
  });
};

const renderInfo = (album) => {
  if (!album) {
    infoPanel.innerHTML = "앨범을 선택하면 자세한 정보가 표시됩니다.";
    infoPanel.className = "info-empty";
    return;
  }

  infoPanel.className = "info-grid";
  infoPanel.innerHTML = `
    <div><strong>${album.title}</strong> · ${album.artist}</div>
    <div><span>참여 연주자</span><br />${album.contributors}</div>
    <div><span>작곡/작사</span><br />${album.credits}</div>
    <div><span>레이블</span><br />${album.label}</div>
    <div><span>디스코그래피</span><br />${album.discography}</div>
    <div><span>음악역사 지형도</span><br />${album.map}</div>
  `;
};

const renderRecommendations = () => {
  const rated = albums.filter((album) => album.rating >= 4);
  const genreCounts = rated.reduce((acc, album) => {
    acc[album.genre] = (acc[album.genre] || 0) + 1;
    return acc;
  }, {});
  const topGenre = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a])[0];

  const suggestions = albums
    .filter((album) => album.rating === 0)
    .map((album) => {
      const reason = topGenre && album.genre === topGenre
        ? `당신이 ${topGenre}에 높은 평점을 주었습니다.`
        : `${album.genre} 계열을 탐험해보세요.`;
      return { album, reason };
    });

  recommendList.innerHTML = "";
  if (suggestions.length === 0) {
    recommendList.innerHTML = "<li>평가를 추가하면 더 정확한 추천이 표시됩니다.</li>";
    return;
  }

  suggestions.forEach(({ album, reason }) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${album.title}</strong> · ${album.artist}<br /><span>${reason}</span>`;
    recommendList.appendChild(item);
  });
};

const renderProfile = () => {
  const rated = albums.filter((album) => album.rating > 0);
  if (rated.length === 0) {
    profileSummary.textContent = "아직 평가가 없습니다. 별점을 남기면 취향 프로필이 생성됩니다.";
    profileText.value = "";
    return;
  }

  const average = rated.reduce((sum, album) => sum + album.rating, 0) / rated.length;
  const topAlbum = rated.sort((a, b) => b.rating - a.rating)[0];

  const genreStats = rated.reduce((acc, album) => {
    acc[album.genre] = acc[album.genre] || [];
    acc[album.genre].push(album.rating);
    return acc;
  }, {});

  const genreSummary = Object.entries(genreStats)
    .map(([genre, ratings]) => {
      const avg = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      return `${genre} 평균 ${avg.toFixed(1)}점`;
    })
    .join(" · ");

  profileSummary.innerHTML = `
    <div>평균 별점: <strong>${average.toFixed(1)}</strong></div>
    <div>최고 평가 앨범: <strong>${topAlbum.title}</strong> (${topAlbum.rating}점)</div>
    <div>${genreSummary}</div>
  `;

  profileText.value = `나의 앨범 취향 요약\n` +
    `- 평균 별점: ${average.toFixed(1)}\n` +
    `- 최고 평가 앨범: ${topAlbum.title} (${topAlbum.rating}점)\n` +
    `- 장르 성향: ${genreSummary}\n` +
    `#AlbumHistography`;
};

const updateAll = (selectedAlbum) => {
  renderAlbums();
  renderInfo(selectedAlbum);
  renderRecommendations();
  renderProfile();
};

albumList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const rating = Number(button.dataset.value);
  const card = button.closest(".rating");
  const album = albums.find((item) => item.id === card.dataset.albumId);
  if (!album) return;

  album.rating = rating;
  updateAll(album);
});

albumList.addEventListener("mouseover", (event) => {
  const card = event.target.closest(".album-card");
  if (!card) return;

  const albumId = card.querySelector(".rating")?.dataset.albumId;
  const album = albums.find((item) => item.id === albumId);
  renderInfo(album);
});

copyButton.addEventListener("click", async () => {
  if (!profileText.value) return;
  try {
    await navigator.clipboard.writeText(profileText.value);
    copyButton.textContent = "복사 완료!";
    setTimeout(() => {
      copyButton.textContent = "프로필 공유 텍스트 복사";
    }, 1500);
  } catch (error) {
    copyButton.textContent = "복사 실패";
  }
});

updateAll(null);
