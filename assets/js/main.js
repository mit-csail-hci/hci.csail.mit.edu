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
	initializeStudentOfTheHour();
	initializeResearchCarousel();
	initializeFriendsVideo();
});

/**
 * Flash the friends video briefly each time it loops back to the start
 */
function initializeFriendsVideo() {
	const video = document.querySelector('#friends-media video');
	if (!video) return;

	let lastTime = 0;
	video.addEventListener('timeupdate', function() {
		// currentTime jumping backwards means the clip just looped
		if (video.currentTime < lastTime - 0.1) {
			video.classList.remove('video-flash');
			void video.offsetWidth; // force reflow so the animation restarts
			video.classList.add('video-flash');
		}
		lastTime = video.currentTime;
	});
}

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
 * Group filtering functionality for faculty and PhD students
 */
function initializeGroupFilters() {
	const filterButtons = document.querySelectorAll('.filter-btn');
	const facultyArticles = document.querySelectorAll('#faculty article[data-group]');
	const phdArticles = document.querySelectorAll('#phds article[data-group]');
	const allArticles = [...facultyArticles, ...phdArticles];

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

			// Filter articles (both faculty and PhDs)
			allArticles.forEach(article => {
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

		// 'i' - Rain down all student and faculty photos
		if (key === 'i') {
			rainProfilePictures();
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

/**
 * Student of the Hour - randomly features a student every hour
 */
function initializeStudentOfTheHour() {
	const spotlightContainer = document.getElementById('studentSpotlight');
	const titleElement = document.getElementById('studentHourTitle');
	if (!spotlightContainer) return;

	// Get all PhD students from the page
	const students = [];
	const phdArticles = document.querySelectorAll('#phds article');

	phdArticles.forEach(article => {
		const nameElement = article.querySelector('h1');
		const imgElement = article.querySelector('img');
		const groupElement = article.querySelector('.group');
		const linkElement = article.querySelector('a[href]');

		if (nameElement && imgElement && imgElement.src && !imgElement.src.includes('data:image')) {
			// Get URL from link element, exclude if empty or just a hash anchor
			let url = '';
			if (linkElement && linkElement.href) {
				// Only exclude if it's JUST a hash (like "#" or starts with "#" but not "http")
				if (linkElement.href.startsWith('http') || !linkElement.href.startsWith('#')) {
					url = linkElement.href;
				}
			}

			students.push({
				name: nameElement.textContent.trim(),
				image: imgElement.src,
				group: groupElement ? groupElement.textContent.trim() : '',
				url: url
			});
		}
	});

	if (students.length === 0) return;

	// Sort students alphabetically by name to ensure consistent ordering across page loads
	students.sort((a, b) => a.name.localeCompare(b.name));

	// Simple seeded random number generator (Linear Congruential Generator)
	function seededRandom(seed) {
		const x = Math.sin(seed) * 10000;
		return x - Math.floor(x);
	}

	// Function to select a student based on the current UTC hour
	// Uses hours since epoch as a random seed - totally random but synchronized for everyone
	function selectStudentOfTheHour(hourOffset = 0) {
		const now = new Date();
		// Get UTC hours since epoch
		const hoursSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60)) - hourOffset;

		// Use hours as random seed to pick a random student
		// Same hour = same seed = same random result for everyone
		const randomValue = seededRandom(hoursSinceEpoch);
		const studentIndex = Math.floor(randomValue * students.length);

		return students[studentIndex];
	}

	// Function to format time and date in local timezone
	function formatLocalTime(hoursAgo) {
		const now = new Date();
		const targetTime = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
		const hours = targetTime.getHours();
		const period = hours >= 12 ? 'PM' : 'AM';
		const displayHours = hours % 12 || 12;

		// Format date
		const month = targetTime.getMonth() + 1;
		const day = targetTime.getDate();
		const dateString = `${month}/${day}`;

		return `${dateString} ${displayHours}:00 ${period}`;
	}

	// Function to update the title with current hour
	function updateTitle() {
		if (!titleElement) return;
		const now = new Date();
		const hours = now.getHours();
		const period = hours >= 12 ? 'PM' : 'AM';
		const displayHours = hours % 12 || 12;
		titleElement.textContent = `Student of the Hour (${displayHours}:00 ${period})`;
	}


	// Function to update the ticker ribbon
	function updateTickerRibbon() {
		const tickerTrack = document.getElementById('studentTickerTrack');
		if (!tickerTrack) return;

		// Generate ticker items for past 24 hours (duplicated twice for seamless loop)
		let html = '';
		const itemsToShow = 24;

		// Create two sets of the same items for seamless infinite scroll
		for (let set = 0; set < 2; set++) {
			// Reverse order: earliest to latest (24 hours ago to 1 hour ago)
			for (let i = itemsToShow; i >= 1; i--) {
				const student = selectStudentOfTheHour(i);
				const timeString = formatLocalTime(i);

				html += `
					<div class="ticker-student-item">
						<img src="${student.image}" alt="${student.name}" class="ticker-student-avatar" />
						<div class="ticker-student-info">
							<div class="ticker-student-name">${student.name}</div>
							<div class="ticker-student-time">Student of the Hour · ${timeString}</div>
						</div>
					</div>
				`;

				// Add separator after every item except the very last one
				const isLastItem = (set === 1 && i === 1);
				if (!isLastItem) {
					html += '<span class="ticker-separator"></span>';
				}
			}
		}

		tickerTrack.innerHTML = html;
	}

	// Function to update the display
	function updateStudentDisplay() {
		const student = selectStudentOfTheHour();

		const websiteLink = student.url
			? `<a href="${student.url}" target="_blank" rel="noopener noreferrer" class="website-link">Personal Website</a>`
			: '';

		// Create share text
		const shareText = `${student.name} is Student of the Hour on the MIT HCI website! 🎉🥳 See it for yourself: https://hci.csail.mit.edu/ @mithci #mithci`;

		// URL encode for share links
		const encodedText = encodeURIComponent(shareText);
		const siteUrl = encodeURIComponent('https://hci.csail.mit.edu/');

		// Create share URLs
		const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
		const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${siteUrl}&quote=${encodedText}`;
		const blueskyUrl = `https://bsky.app/intent/compose?text=${encodedText}`;

		spotlightContainer.innerHTML = `
			<div class="celebrate-wrapper">
				<button class="celebrate-btn">Celebrate! 🎉</button>
			</div>
			<div class="top-section">
				<div class="photo-container">
					<img src="${student.image}" alt="${student.name}" class="student-photo" />
					<div class="trophy">🏆</div>
				</div>
				<div class="info">
					<h2>${student.name}</h2>
					${student.group ? `<p class="student-group">${student.group}</p>` : ''}
					${websiteLink}
				</div>
			</div>
			<div class="button-group">
				<a href="${twitterUrl}" target="_blank" rel="noopener noreferrer" class="share-btn twitter">Share on X</a>
				<a href="${facebookUrl}" target="_blank" rel="noopener noreferrer" class="share-btn facebook">Share on Facebook</a>
				<a href="${blueskyUrl}" target="_blank" rel="noopener noreferrer" class="share-btn bluesky">Share on Bluesky</a>
			</div>
		`;

		// Add confetti on celebrate button click
		const celebrateBtn = spotlightContainer.querySelector('.celebrate-btn');
		if (celebrateBtn) {
			celebrateBtn.addEventListener('click', createCelebrationConfetti);
		}

		// Update title and ticker ribbon
		updateTitle();
		updateTickerRibbon();
	}

	// Initial display
	updateStudentDisplay();

	// Update at the top of every hour
	const now = new Date();
	const msUntilNextHour = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();

	setTimeout(() => {
		updateStudentDisplay();
		// Then update every hour after that
		setInterval(updateStudentDisplay, 60 * 60 * 1000);
	}, msUntilNextHour);

}

/**
 * Create celebration confetti from top of page
 */
function createCelebrationConfetti() {
	const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#6bcf7f', '#ff8787', '#a8dadc', '#ff9ff3', '#feca57'];
	const confettiCount = 150;

	// Create container if it doesn't exist
	let container = document.querySelector('.confetti-container');
	if (!container) {
		container = document.createElement('div');
		container.className = 'confetti-container';
		document.body.appendChild(container);
	}

	// Get the current student of the hour image
	const studentOfTheHourImg = document.querySelector('#studentSpotlight .student-photo');
	const studentImage = studentOfTheHourImg ? studentOfTheHourImg.src : null;

	// Create confetti pieces from top of screen
	for (let i = 0; i < confettiCount; i++) {
		setTimeout(() => {
			const isPhoto = Math.random() < 0.12 && studentImage; // 12% chance of being the featured student photo
			const confetti = document.createElement('div');
			confetti.className = isPhoto ? 'confetti-photo' : 'confetti';

			// Random properties
			const startX = Math.random() * window.innerWidth;
			const startY = -30;
			const drift = (Math.random() - 0.5) * 400;

			if (isPhoto) {
				// Featured student photo confetti
				confetti.style.backgroundImage = `url(${studentImage})`;
				const size = Math.random() * 15 + 25; // 25-40px
				confetti.style.width = size + 'px';
				confetti.style.height = size + 'px';
			} else {
				// Regular confetti
				const color = colors[Math.floor(Math.random() * colors.length)];
				const size = Math.random() * 8 + 6;
				confetti.style.backgroundColor = color;
				confetti.style.width = size + 'px';
				confetti.style.height = size + 'px';
			}

			confetti.style.left = startX + 'px';
			confetti.style.top = startY + 'px';
			confetti.style.setProperty('--drift', drift + 'px');

			// Add animation
			const duration = Math.random() * 1.5 + 2;
			confetti.style.animation = `confetti-fall ${duration}s ease-in forwards`;

			container.appendChild(confetti);

			// Remove after animation
			setTimeout(() => {
				confetti.remove();
			}, duration * 1000 + 100);
		}, i * 8); // Stagger the creation
	}
}

/**
 * Rain down all student and faculty profile pictures
 */
function rainProfilePictures() {
	// Create container if it doesn't exist
	let container = document.querySelector('.confetti-container');
	if (!container) {
		container = document.createElement('div');
		container.className = 'confetti-container';
		document.body.appendChild(container);
	}

	// Get all student and faculty images
	const allImages = [];
	document.querySelectorAll('#phds article img, #faculty article img').forEach(img => {
		if (img.src && !img.src.includes('data:image')) {
			allImages.push(img.src);
		}
	});

	if (allImages.length === 0) return;

	// Create falling profile pictures
	const photoCount = allImages.length * 2; // Show each person twice for variety
	for (let i = 0; i < photoCount; i++) {
		setTimeout(() => {
			const photo = document.createElement('div');
			photo.className = 'confetti-photo';

			// Random properties
			const randomImage = allImages[Math.floor(Math.random() * allImages.length)];
			const size = 40; // Fixed size for all
			const startX = Math.random() * window.innerWidth;
			const startY = -50;
			const drift = (Math.random() - 0.5) * 300;

			photo.style.backgroundImage = `url(${randomImage})`;
			photo.style.width = size + 'px';
			photo.style.height = size + 'px';
			photo.style.left = startX + 'px';
			photo.style.top = startY + 'px';
			photo.style.setProperty('--drift', drift + 'px');

			// Add animation
			const duration = Math.random() * 1.5 + 2.5;
			photo.style.animation = `confetti-fall ${duration}s ease-in forwards`;

			container.appendChild(photo);

			// Remove after animation
			setTimeout(() => {
				photo.remove();
			}, duration * 1000 + 100);
		}, i * 20); // Stagger the creation more for smoother rain
	}
}

/**
 * Research carousel - swipe through research projects
 */
function initializeResearchCarousel() {
	const track = document.querySelector('.carousel-track');
	const prevBtn = document.querySelector('.prev-btn');
	const nextBtn = document.querySelector('.next-btn');

	if (!track || !prevBtn || !nextBtn) return;

	const slides = Array.from(track.querySelectorAll('.carousel-slide'));
	const slideCount = slides.length;

	// Start on a random slide
	let currentIndex = Math.floor(Math.random() * slideCount);

	function updateCarousel() {
		const offset = -currentIndex * 100;
		track.style.transform = `translateX(${offset}%)`;
	}

	// Set initial position
	updateCarousel();

	function nextSlide() {
		currentIndex = (currentIndex + 1) % slideCount;
		updateCarousel();
	}

	function prevSlide() {
		currentIndex = (currentIndex - 1 + slideCount) % slideCount;
		updateCarousel();
	}

	// Button click handlers
	nextBtn.addEventListener('click', nextSlide);
	prevBtn.addEventListener('click', prevSlide);

	// Keyboard navigation
	document.addEventListener('keydown', function(event) {
		// Only handle arrow keys when not typing in an input
		if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
			return;
		}

		if (event.key === 'ArrowLeft') {
			prevSlide();
		} else if (event.key === 'ArrowRight') {
			nextSlide();
		}
	});

	// Touch/swipe support
	let touchStartX = 0;
	let touchEndX = 0;

	track.addEventListener('touchstart', function(event) {
		touchStartX = event.changedTouches[0].screenX;
	}, { passive: true });

	track.addEventListener('touchend', function(event) {
		touchEndX = event.changedTouches[0].screenX;
		handleSwipe();
	}, { passive: true });

	function handleSwipe() {
		const swipeThreshold = 50;
		const diff = touchStartX - touchEndX;

		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				// Swiped left - go to next
				nextSlide();
			} else {
				// Swiped right - go to previous
				prevSlide();
			}
		}
	}
}
