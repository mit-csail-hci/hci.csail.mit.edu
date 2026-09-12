/**
 * MIT HCI — main.js
 * Group filters, breakpoint-aware collapsibles, Student of the Hour,
 * and the keyboard easter eggs (t / h / c / i).
 */
(function () {
	'use strict';

	const phone = window.matchMedia('(max-width: 639.98px)');
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	document.addEventListener('DOMContentLoaded', () => {
		shufflePhds();
		externalLinks();
		groupFilters();
		collapsibles();
		friendsVideo();
		easterEggs();
		studentOfTheHour();
	});

	/* Randomize student order so nobody is always last. */
	function shufflePhds() {
		const list = document.getElementById('phds');
		if (!list) return;
		const items = Array.from(list.children);
		for (let i = items.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[items[i], items[j]] = [items[j], items[i]];
		}
		items.forEach(el => list.appendChild(el));
	}

	/* External links open in a new tab. */
	function externalLinks() {
		document.querySelectorAll('a[href^="http"]').forEach(a => {
			if (!a.hasAttribute('target')) {
				a.setAttribute('target', '_blank');
				a.setAttribute('rel', 'noopener noreferrer');
			}
		});
	}

	/* Filter faculty and students by group. Hides blocks that end up empty. */
	function groupFilters() {
		const buttons = Array.from(document.querySelectorAll('.filter-btn'));
		if (!buttons.length) return;
		const people = Array.from(document.querySelectorAll('#faculty .person, #phds .person, #friends .person'));
		const blocks = Array.from(document.querySelectorAll('[data-people-block]'));

		buttons.forEach(button => {
			button.addEventListener('click', () => {
				const group = button.dataset.group;
				buttons.forEach(b => {
					const active = b === button;
					b.classList.toggle('active', active);
					b.setAttribute('aria-pressed', String(active));
				});
				people.forEach(p => {
					p.classList.toggle('is-hidden', group !== 'all' && p.dataset.group !== group);
				});
				blocks.forEach(block => {
					block.classList.toggle('is-empty', !block.querySelector('.person:not(.is-hidden)'));
				});
			});
		});
	}

	/* <details data-collapsible>: open on desktop, closed on phones. */
	function collapsibles() {
		const items = Array.from(document.querySelectorAll('details[data-collapsible]'));
		if (!items.length) return;
		const apply = () => items.forEach(d => { d.open = !phone.matches; });
		apply();
		phone.addEventListener('change', apply);
		// On desktop the summaries are not clickable, but keep keyboard toggles from collapsing them.
		items.forEach(d => d.addEventListener('toggle', () => { if (!phone.matches && !d.open) d.open = true; }));
	}

	/* Flash the friends video each time it loops. Respect reduced motion. */
	function friendsVideo() {
		const video = document.querySelector('#friends-media video');
		if (!video) return;
		if (reduceMotion.matches) {
			video.removeAttribute('autoplay');
			video.pause();
			return;
		}
		let last = 0;
		video.addEventListener('timeupdate', () => {
			if (video.currentTime < last - 0.1) {
				video.classList.remove('video-flash');
				void video.offsetWidth;
				video.classList.add('video-flash');
			}
			last = video.currentTime;
		});
	}

	/* ------------------------------------------------------------------ */
	/* Easter eggs                                                         */
	/* ------------------------------------------------------------------ */

	const PIC_SELECTOR = '#faculty img, #phds img, .student-avatar';

	function easterEggs() {
		document.addEventListener('keydown', event => {
			if (event.metaKey || event.ctrlKey || event.altKey) return;
			const tag = event.target && event.target.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA') return;
			const key = event.key.toLowerCase();
			if (key === 't') rollProfilePictures();
			if (key === 'h') { rotateProfilePictures(); showRotationHint(); }
			if (key === 'c') resetProfilePictures();
			if (key === 'i') rainProfilePictures();
		});
	}

	function rollProfilePictures() {
		if (reduceMotion.matches) return;
		document.querySelectorAll(PIC_SELECTOR).forEach(img => {
			img.classList.add('profile-roll');
			setTimeout(() => img.classList.remove('profile-roll'), 600);
		});
	}

	function rotateProfilePictures() {
		document.querySelectorAll(PIC_SELECTOR).forEach(img => {
			img.style.transform = `rotateZ(${Math.floor(Math.random() * 361)}deg)`;
			img.style.transition = 'transform .5s ease-in-out';
		});
	}

	function showRotationHint() {
		const now = Date.now();
		let last = 0;
		try { last = parseInt(localStorage.getItem('lastHPopupTime') || '0', 10); } catch (e) { /* ignore */ }
		if (now - last < 60 * 60 * 1000 || document.querySelector('.h-key-popup')) return;
		try { localStorage.setItem('lastHPopupTime', String(now)); } catch (e) { /* ignore */ }

		const popup = document.createElement('div');
		popup.className = 'h-key-popup';
		popup.innerHTML = '<p>press \'c\' when you\'ve had enough fun</p><div class="popup-timer"><div class="timer-bar"></div></div>';
		document.body.appendChild(popup);
		setTimeout(() => {
			popup.style.opacity = '0';
			setTimeout(() => popup.remove(), 300);
		}, 5000);
	}

	function resetProfilePictures() {
		document.querySelectorAll(PIC_SELECTOR).forEach(img => {
			img.style.transform = 'rotateZ(0deg)';
			img.style.transition = 'transform .5s ease-in-out';
		});
		const popup = document.querySelector('.h-key-popup');
		if (popup) popup.remove();
	}

	function confettiContainer() {
		let container = document.querySelector('.confetti-container');
		if (!container) {
			container = document.createElement('div');
			container.className = 'confetti-container';
			document.body.appendChild(container);
		}
		return container;
	}

	function dropPiece(container, el, duration) {
		el.style.left = Math.random() * window.innerWidth + 'px';
		el.style.top = '-50px';
		el.style.setProperty('--drift', ((Math.random() - 0.5) * 400) + 'px');
		el.style.animation = `confetti-fall ${duration}s ease-in forwards`;
		container.appendChild(el);
		setTimeout(() => el.remove(), duration * 1000 + 100);
	}

	/* Celebrate: confetti with the featured student's photo mixed in. */
	function createCelebrationConfetti() {
		if (reduceMotion.matches) return;
		const colors = ['#e64d00', '#ffb347', '#ffd93d', '#4ecdc4', '#45b7d1', '#6bcf7f', '#ff8787', '#a8dadc'];
		const container = confettiContainer();
		const featured = document.querySelector('#studentSpotlight .student-photo');
		const featuredSrc = featured ? featured.src : null;

		for (let i = 0; i < 150; i++) {
			setTimeout(() => {
				const isPhoto = featuredSrc && Math.random() < 0.12;
				const piece = document.createElement('div');
				piece.className = isPhoto ? 'confetti-photo' : 'confetti';
				if (isPhoto) {
					const size = Math.random() * 15 + 25;
					piece.style.backgroundImage = `url(${featuredSrc})`;
					piece.style.width = piece.style.height = size + 'px';
				} else {
					const size = Math.random() * 8 + 6;
					piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
					piece.style.width = piece.style.height = size + 'px';
				}
				dropPiece(container, piece, Math.random() * 1.5 + 2);
			}, i * 8);
		}
	}

	/* 'i': rain everyone's photo. */
	function rainProfilePictures() {
		if (reduceMotion.matches) return;
		const sources = Array.from(document.querySelectorAll('#phds img, #faculty img'))
			.map(img => img.currentSrc || img.src)
			.filter(Boolean);
		if (!sources.length) return;
		const container = confettiContainer();
		for (let i = 0; i < sources.length * 2; i++) {
			setTimeout(() => {
				const photo = document.createElement('div');
				photo.className = 'confetti-photo';
				photo.style.backgroundImage = `url(${sources[Math.floor(Math.random() * sources.length)]})`;
				photo.style.width = photo.style.height = '40px';
				dropPiece(container, photo, Math.random() * 1.5 + 2.5);
			}, i * 20);
		}
	}

	/* ------------------------------------------------------------------ */
	/* Student of the Hour                                                 */
	/* ------------------------------------------------------------------ */

	function studentOfTheHour() {
		const spotlight = document.getElementById('studentSpotlight');
		const title = document.getElementById('studentHourTitle');
		const past = document.getElementById('studentTickerTrack');
		if (!spotlight) return;

		const students = [];
		document.querySelectorAll('#phds .person').forEach(card => {
			if (card.dataset.level === 'visiting') return;
			const img = card.querySelector('img.avatar');
			const name = card.querySelector('.name');
			if (!img || !name) return;
			const link = card.querySelector('a[href]:not(.group)');
			const group = card.querySelector('.group');
			students.push({
				name: name.textContent.trim(),
				image: img.getAttribute('src'),
				group: group ? group.textContent.trim() : '',
				url: link ? link.getAttribute('href') : ''
			});
		});
		if (!students.length) return;

		// Stable order so every visitor sees the same student for a given hour.
		students.sort((a, b) => a.name.localeCompare(b.name));

		const seeded = seed => { const x = Math.sin(seed) * 10000; return x - Math.floor(x); };
		const pick = (hoursAgo = 0) => {
			const hour = Math.floor(Date.now() / 3600000) - hoursAgo;
			return students[Math.floor(seeded(hour) * students.length)];
		};
		const clock = date => {
			const h = date.getHours();
			return `${h % 12 || 12}:00 ${h >= 12 ? 'PM' : 'AM'}`;
		};

		function render() {
			const student = pick();
			const now = new Date();

			if (title) title.textContent = `Student of the hour · ${clock(now)}`;

			spotlight.innerHTML = `
				<img class="avatar student-photo student-avatar" src="${student.image}" alt="" width="120" height="120">
				<div class="soth-info">
					<p class="name">${student.name}</p>
					${student.group ? `<p class="group">${student.group}</p>` : ''}
					<p class="actions">
						${student.url ? `<a href="${student.url}" target="_blank" rel="noopener noreferrer">Website</a>` : ''}
						<button type="button" class="celebrate-btn">Celebrate</button>
					</p>
				</div>`;
			spotlight.querySelector('.celebrate-btn').addEventListener('click', createCelebrationConfetti);

			if (past) {
				let html = '';
				for (let i = 24; i >= 1; i--) {
					const s = pick(i);
					const when = new Date(now.getTime() - i * 3600000);
					const label = `${s.name}, ${when.getMonth() + 1}/${when.getDate()} ${clock(when)}`;
					html += `<li><img class="avatar" src="${s.image}" alt="${label}" title="${label}" width="32" height="32" loading="lazy"></li>`;
				}
				past.innerHTML = html;
			}
		}

		render();
		const now = new Date();
		const msToNextHour = (60 - now.getMinutes()) * 60000 - now.getSeconds() * 1000 - now.getMilliseconds();
		setTimeout(() => { render(); setInterval(render, 3600000); }, msToNextHour);
	}
})();
