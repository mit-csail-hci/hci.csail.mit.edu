/**
 * MIT HCI Group Website - Main JavaScript
 * Handles scroll effects, filtering, and interactive features
 */

// Scroll effect for sticky nav
window.addEventListener("scroll", evt => {
	let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	let header = document.querySelector('body > header');
	let headerHeight = header ? header.offsetHeight : 0;
	document.documentElement.classList.toggle("scrolled", scrollTop > headerHeight - 100);
});

// Add anchor links to section headings
for (let h1 of document.querySelectorAll("body > section > h1")) {
	let hash = document.createElement("a");
	hash.href = "#" + h1.parentNode.id;
	while(h1.firstChild) hash.appendChild(h1.firstChild);
	h1.appendChild(hash);
}

// Initialize functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
	initializePhDShuffle();
	initializeExternalLinks();
	initializeGroupFilters();
	initializeEasterEggs();
});

/**
 * Randomize PhD student order
 */
function shuffleElements(container) {
	const articles = Array.from(container.querySelectorAll('article'));
	const shuffled = articles.sort(() => Math.random() - 0.5);
	shuffled.forEach(article => container.appendChild(article));
}

function initializePhDShuffle() {
	const phdSection = document.querySelector('#phds');
	if (phdSection) shuffleElements(phdSection);
}

/**
 * Open external links in new tabs
 */
function initializeExternalLinks() {
	document.querySelectorAll('a[href^="http"]').forEach(link => {
		if (!link.hasAttribute('target')) {
			link.setAttribute('target', '_blank');
			link.setAttribute('rel', 'noopener noreferrer');
		}
	});
}

/**
 * Group filtering functionality for PhD students
 */
function initializeGroupFilters() {
	const filterButtons = document.querySelectorAll('.filter-btn');
	const phdArticles = document.querySelectorAll('#phds article[data-group]');

	filterButtons.forEach(button => {
		button.addEventListener('click', function() {
			const selectedGroup = this.getAttribute('data-group');

			// Update active button state
			filterButtons.forEach(btn => btn.classList.remove('active'));
			this.classList.add('active');

			// Update container state
			const filterContainer = document.querySelector('.group-filters');
			if (selectedGroup === 'all') {
				filterContainer.classList.remove('has-active');
			} else {
				filterContainer.classList.add('has-active');
			}

			// Filter articles
			phdArticles.forEach(article => {
				const articleGroup = article.getAttribute('data-group');
				article.classList.remove('filtered', 'selected');

				if (selectedGroup === 'all') {
					// Show all
				} else if (articleGroup === selectedGroup) {
					article.classList.add('selected');
				} else {
					article.classList.add('filtered');
				}
			});
		});
	});
}

/**
 * Easter eggs - keyboard shortcuts for fun interactions
 */
function initializeEasterEggs() {
	document.addEventListener('keydown', function(event) {
		const key = event.key.toLowerCase();

		// 't' - Roll all profile pictures
		if (key === 't') {
			rollProfilePictures();
		}

		// 'h' - Rotate profile pictures randomly
		if (key === 'h') {
			rotateProfilePictures();
			showRotationHint();
		}

		// 'c' - Clear/reset all profile picture effects
		if (key === 'c') {
			resetProfilePictures();
		}
	});
}

function rollProfilePictures() {
	const profilePics = document.querySelectorAll('#faculty img, #phds img, .student-avatar');

	profilePics.forEach(img => {
		img.classList.add('profile-roll');
		setTimeout(() => {
			img.classList.remove('profile-roll');
		}, 600);
	});
}

function rotateProfilePictures() {
	const profilePics = document.querySelectorAll('#faculty img, #phds img, .student-avatar');
	profilePics.forEach(img => {
		const randomRotation = Math.floor(Math.random() * 361);
		img.style.transform = `rotateZ(${randomRotation}deg)`;
		img.style.transition = 'transform 0.5s ease-in-out';
	});
}

function showRotationHint() {
	const now = Date.now();
	const lastPopupTime = localStorage.getItem('lastHPopupTime');
	const oneHour = 60 * 60 * 1000;

	if (!lastPopupTime || (now - parseInt(lastPopupTime)) > oneHour) {
		if (!document.querySelector('.h-key-popup')) {
			localStorage.setItem('lastHPopupTime', now.toString());

			const popup = document.createElement('div');
			popup.className = 'h-key-popup';
			popup.innerHTML = `
				<div class="popup-content">
					<p>press 'c' when you've had enough fun</p>
					<div class="popup-timer">
						<div class="timer-bar"></div>
					</div>
				</div>
			`;

			document.body.appendChild(popup);

			setTimeout(() => {
				if (popup.parentNode) {
					popup.style.opacity = '0';
					setTimeout(() => popup.remove(), 300);
				}
			}, 5000);
		}
	}
}

function resetProfilePictures() {
	const profilePics = document.querySelectorAll('#faculty img, #phds img, .student-avatar');
	profilePics.forEach(img => {
		img.style.transform = 'rotateZ(0deg)';
		img.style.transition = 'transform 0.5s ease-in-out';
		img.classList.remove('profile-fall');
		img.style.animation = '';
		img.style.position = '';
		img.style.top = '';
		img.style.left = '';
		img.style.zIndex = '';
	});

	// Clean up dynamic styles
	const dynamicStyles = document.querySelectorAll('style');
	dynamicStyles.forEach(style => {
		if (style.textContent.includes('@keyframes bounce-')) {
			style.remove();
		}
	});

	// Remove popup
	const hPopup = document.querySelector('.h-key-popup');
	if (hPopup) hPopup.remove();
}
