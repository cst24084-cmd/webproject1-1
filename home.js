// ---------- SLIDER ----------
const slides = document.querySelectorAll('.slide');
let index = 0;

slides[index].classList.add('active');

function showSlide() {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  index = (index + 1) % slides.length;
}
setInterval(showSlide, 3000);

// ---------- COMMENTS (localStorage only) ----------
const form = document.getElementById('commentForm');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('customerName').value.trim();
  const comment = document.getElementById('customerComment').value.trim();

  if (!name || !comment) return;

  const commentData = {
    name,
    comment,
    date: new Date().toISOString()
  };

  let comments = JSON.parse(localStorage.getItem("comments")) || [];
  comments.push(commentData);
  localStorage.setItem("comments", JSON.stringify(comments));

  alert("Thank you! Your comment has been submitted.");
  form.reset();
});
