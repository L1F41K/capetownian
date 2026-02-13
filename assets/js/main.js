document.addEventListener('DOMContentLoaded', () => {
	/* === 1. СЛАЙДЕР === */
	const slides = document.querySelectorAll('.hero-slide')
	const titles = document.querySelectorAll('.hero-title')
	const btnPrev = document.getElementById('btn-prev')
	const btnNext = document.getElementById('btn-next')
	let currentSlide = 0
	let isAnimating = false

	function initSlider() {
		if (slides.length > 0) {
			slides.forEach((s, i) => {
				if (i === 0) s.classList.add('is-active')
				else s.classList.remove('is-active', 'is-left', 'is-right')
			})
		}
		if (titles.length > 0) {
			titles.forEach((t, i) => {
				if (i === 0) t.classList.add('is-active')
				else t.classList.remove('is-active', 'is-exit')
			})
		}
	}

	initSlider()

	function changeSlide(direction) {
		if (isAnimating || slides.length < 2) return
		isAnimating = true

		const activeSlide = slides[currentSlide]
		const activeTitle = titles[currentSlide]

		let nextSlideIndex
		if (direction === 'next') {
			nextSlideIndex = (currentSlide + 1) % slides.length
		} else {
			nextSlideIndex = (currentSlide - 1 + slides.length) % slides.length
		}

		const nextSlide = slides[nextSlideIndex]
		const nextTitle = titles[nextSlideIndex]

		/* --- ФОН --- */
		nextSlide.classList.add('no-transition')

		if (direction === 'next') {
			nextSlide.classList.remove('is-left', 'is-active')
			nextSlide.classList.add('is-right')
		} else {
			nextSlide.classList.remove('is-right', 'is-active')
			nextSlide.classList.add('is-left')
		}

		nextSlide.offsetHeight // reflow
		nextSlide.classList.remove('no-transition')

		activeSlide.classList.remove('is-active')

		if (direction === 'next') {
			activeSlide.classList.add('is-left')
			activeSlide.classList.remove('is-right')
		} else {
			activeSlide.classList.add('is-right')
			activeSlide.classList.remove('is-left')
		}

		nextSlide.classList.add('is-active')
		nextSlide.classList.remove('is-left', 'is-right')

		/* --- ТЕКСТ --- */
		nextTitle.classList.add('no-transition')
		nextTitle.classList.remove('is-active', 'is-exit')
		nextTitle.offsetHeight
		nextTitle.classList.remove('no-transition')

		activeTitle.classList.remove('is-active')
		activeTitle.classList.add('is-exit')

		nextTitle.classList.add('is-active')

		currentSlide = nextSlideIndex

		setTimeout(() => {
			isAnimating = false
		}, 1400)
	}

	if (btnNext) btnNext.addEventListener('click', () => changeSlide('next'))
	if (btnPrev) btnPrev.addEventListener('click', () => changeSlide('prev'))

	/* === 2. PING-PONG VIDEO LOOP === */
	function setupPingPongVideos() {
		const videos = document.querySelectorAll('.hero-slide__video')
		videos.forEach(video => {
			video.removeAttribute('loop')
			let rewindInterval = null
			const intervalSpeed = 30
			const rewindStep = 0.04

			video.addEventListener('ended', () => {
				video.pause()
				if (rewindInterval) clearInterval(rewindInterval)
				rewindInterval = setInterval(() => {
					if (video.currentTime <= 0.1) {
						clearInterval(rewindInterval)
						video.currentTime = 0
						video.play()
					} else {
						video.currentTime -= rewindStep
					}
				}, intervalSpeed)
			})

			video.addEventListener('play', () => {
				if (rewindInterval) clearInterval(rewindInterval)
			})
		})
	}
	setupPingPongVideos()

	/* === 3. TYPEWRITER (Обновленная версия: без курсора, "Мы" остается) === */
	const textEl = document.getElementById('typewriter-text')
	const fullPhrase = 'Мы не делаем туры'
	const prefix = 'Мы ' // Часть, которая не стирается
	const partToRemove = 'не '

	// Тайминги
	const typeSpeed = 50
	const deleteSpeed = 60
	const backspaceSpeed = 30

	async function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}

	async function typeWriterLoop() {
		// Устанавливаем начальное состояние
		textEl.textContent = prefix

		while (true) {
			textEl.classList.remove('is-strike')

			// Сбрасываем текст до префикса перед началом круга
			textEl.textContent = prefix

			// Вычисляем, что нужно допечатать (всё, что после "Мы ")
			const textToType = fullPhrase.substring(prefix.length)

			// 1. Набор оставшегося текста
			for (let i = 0; i < textToType.length; i++) {
				textEl.textContent += textToType.charAt(i)
				await sleep(typeSpeed)
			}

			await sleep(1000)

			// 2. Удаление "не " из середины
			let currentString = textEl.textContent
			// Ищем "не " строго после префикса
			const startIndex = currentString.indexOf(partToRemove, prefix.length)

			if (startIndex !== -1) {
				let tempStr = currentString
				for (let i = 0; i < partToRemove.length; i++) {
					tempStr = tempStr.slice(0, startIndex) + tempStr.slice(startIndex + 1)
					textEl.textContent = tempStr
					await sleep(deleteSpeed)
				}
			}

			// 3. Зачеркивание
			textEl.classList.add('is-strike')

			await sleep(2000)

			// 4. Стираем всё, пока длина больше длины префикса ("Мы ")
			while (textEl.textContent.length > prefix.length) {
				textEl.textContent = textEl.textContent.slice(0, -1)
				await sleep(backspaceSpeed)
			}

			textEl.classList.remove('is-strike')

			await sleep(500)
		}
	}

	if (textEl) {
		typeWriterLoop()
	}

	/* === 4. MOBILE MENU === */
	const mobileTrigger = document.getElementById('mobile-trigger')
	const mobileMenu = document.getElementById('mobile-menu')
	const header = document.getElementById('header')

	if (mobileTrigger && mobileMenu && header) {
		mobileTrigger.addEventListener('click', () => {
			mobileTrigger.classList.toggle('is-active')
			mobileMenu.classList.toggle('is-open')
			header.classList.toggle('is-menu-open')

			document.body.style.overflow = mobileMenu.classList.contains('is-open')
				? 'hidden'
				: ''
		})
	}
	/* === 5. WORLD VIDEO CARDS INTERACTION === */
	const worldCards = document.querySelectorAll('.world-card')

	if (worldCards.length > 0) {
		worldCards.forEach(card => {
			const video = card.querySelector('video')

			if (video) {
				card.addEventListener('mouseenter', () => {
					video.pause()
				})

				card.addEventListener('mouseleave', () => {
					video.play()
				})
			}
		})
	}
})

document.addEventListener('DOMContentLoaded', () => {
	// === ЛОГИКА ДЛЯ СЛАЙДЕРА ОТЗЫВОВ ===
	const testimonialsSection = document.querySelector('.testimonials-section')

	if (testimonialsSection) {
		const slider = testimonialsSection.querySelector('.testimonials-grid')
		const prevBtn = testimonialsSection.querySelector('.prev')
		const nextBtn = testimonialsSection.querySelector('.next')

		if (slider && prevBtn && nextBtn) {
			// Функция клика "Вперед"
			nextBtn.addEventListener('click', () => {
				// Вычисляем ширину одной карточки прямо в момент клика
				// (чтобы работало и при повороте экрана)
				const card = slider.querySelector('.testi-card')
				if (card) {
					// Ширина карточки + отступ (gap: 1.6rem ≈ 16px)
					const scrollAmount = card.offsetWidth + 16

					slider.scrollBy({
						left: scrollAmount,
						behavior: 'smooth',
					})
				}
			})

			// Функция клика "Назад"
			prevBtn.addEventListener('click', () => {
				const card = slider.querySelector('.testi-card')
				if (card) {
					const scrollAmount = card.offsetWidth + 16

					slider.scrollBy({
						left: -scrollAmount,
						behavior: 'smooth',
					})
				}
			})
		}
	}
})
document.addEventListener('DOMContentLoaded', () => {
	// Находим ВСЕ обертки видео
	const wrappers = document.querySelectorAll('.video-wrapper')

	wrappers.forEach(wrapper => {
		const video = wrapper.querySelector('video')
		const btn = wrapper.querySelector('.play-btn')

		// Проверяем наличие элементов внутри конкретной обертки
		if (!video || !btn) return

		const playIcon = btn.querySelector('.play-icon')
		const pauseIcon = btn.querySelector('.pause-icon')

		const toggleVideo = () => {
			if (video.paused || video.ended) {
				video.play().catch(err => console.log('Ошибка воспроизведения:', err))
			} else {
				video.pause()
			}
		}

		btn.addEventListener('click', toggleVideo)

		// Слушатели событий теперь привязаны к конкретному видео в цикле
		video.addEventListener('play', () => {
			if (playIcon) playIcon.style.display = 'none'
			if (pauseIcon) pauseIcon.style.display = 'block'
			btn.setAttribute('aria-label', 'Pause video')
		})

		video.addEventListener('pause', () => {
			if (playIcon) playIcon.style.display = 'block'
			if (pauseIcon) pauseIcon.style.display = 'none'
			btn.setAttribute('aria-label', 'Play video')
		})

		video.addEventListener('ended', () => {
			if (playIcon) playIcon.style.display = 'block'
			if (pauseIcon) pauseIcon.style.display = 'none'
			btn.setAttribute('aria-label', 'Play video')
		})
	})
})
document.querySelectorAll('.faq-trigger').forEach(trigger => {
	trigger.addEventListener('click', () => {
		const parent = trigger.parentElement

		// Закрыть другие, если нужно (опционально)
		// document.querySelectorAll('.faq-item').forEach(item => {
		//   if (item !== parent) item.classList.remove('active');
		// });

		parent.classList.toggle('active')
	})
})
