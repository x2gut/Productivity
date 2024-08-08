// HERO SLIDER
const heroSliderItems = {
    container: document.querySelector(".slider__container"),
    slides: document.querySelectorAll(".slider__item"),
    thumbs: document.querySelectorAll(".hero__thumb"),
    stat: document.querySelectorAll(".hero__stat"),
    paginationDots: document.querySelectorAll(".pagination__dot")
};
// BLOG SLIDER 
const blogSliderItems = {
    arrows: {
        left: document.querySelector(".slider__arrow-left"),
        right: document.querySelector(".slider__arrow-right")
    },
    slides: document.querySelectorAll(".blog__slide"),
    container: document.querySelector(".blog__slide"),
    paginationDots: document.querySelectorAll(".blog__pagination-dot")
};

// TESTIMONIALS

const testimonicalsItems = {
    testimonicals: document.querySelector(".testimonicals"),
    container: document.querySelector(".testimonicals__slider-container"),
    slides: Array.from(document.querySelectorAll(".testimonicals__slider-item")),
    activeSlide: document.querySelector(".testimonicals__slider-item.active"),
    paginationDots: Array.from(document.querySelectorAll(".testimonicals__pagination-dot"))
}

const testimonialsVars = {
    coords: {startX: 0,   
            endX: 0
        },
    isPressed: false,
    baseStep: testimonicalsItems.slides[0].offsetWidth + 64,
    initialTranslateX: 0,
    currentIndex: 0
}

const BURGER_BTN = document.querySelector(".header__burger-btn");
const BURGER_MENU = document.querySelector(".header__left");
const totalSlides = blogSliderItems.slides.length;

const faqBtns = document.querySelectorAll(".faq__btn");
const faqAnswers = document.querySelectorAll(".faq__answer");

let currentIndex = 1;
let blogCurrentIndex = 0;

const indexMapThumb = {
    2: 0,
    3: 1,
    0: 2,
    1: 3
};

const indexMapStat = {
    3: 2,
    2: 1,
    1: 0,
    0: 3
};

function handleStart(event) {
    testimonialsVars.isPressed = true;
    testimonialsVars.startX = event.clientX || event.touches[0].clientX;
    testimonialsVars.initialTranslateX = getTranslateX(testimonicalsItems.activeSlide);
};

function handleEnd(event) {
    if (testimonialsVars.isPressed){
        testimonialsVars.isPressed = false;
        testimonialsVars.endX = event.clientX || event.changedTouches[0].clientX;
    
        const paginationDotsArray = Array.from(testimonicalsItems.paginationDots);
        const activeDot = document.querySelector(".testimonicals__pagination-dot.active");
        if (!activeDot || paginationDotsArray.length === 0) {
            console.error("Active dot not found or pagination dots are empty.");
            return;
        }
    
        const distanceMoved = Math.abs(testimonialsVars.endX - testimonialsVars.startX);
        if (distanceMoved < 184) {
            resetSlides();
            return;
        }
    
        testimonialsVars.currentIndex = paginationDotsArray.indexOf(activeDot);
        if (currentIndex === -1) {
            console.error("Current index not found in pagination dots.");
            return;
        }
    
        if (handleSlideOutOfBounds()) {
            return;
        }
    
        let steps = Math.floor(getTranslateX(testimonicalsItems.activeSlide) / (testimonialsVars.initialTranslateX - testimonialsVars.baseStep) + 1);
    
        const direction = testimonialsVars.endX - testimonialsVars.startX > 0 ? "left" : "right";
    
        moveSlide(direction, steps);
        testimonialsVars.startX = 0;
        testimonialsVars.endX = 0;
    } 
    };

function listeners() {

    heroSliderItems.thumbs.forEach((item, index) => {
        item.addEventListener("click", () => {
            changeSlide(indexMapThumb[index], heroSliderItems.slides, heroSliderItems.paginationDots, heroSliderItems.container.offsetWidth, heroSliderItems.thumbs, heroSliderItems.stat);
            currentIndex = index;
        });
    });

    heroSliderItems.paginationDots.forEach((item, index) => {
        item.addEventListener("click", () => {
            changeSlide(index, heroSliderItems.slides, heroSliderItems.paginationDots, heroSliderItems.container.offsetWidth, heroSliderItems.thumbs, heroSliderItems.stat);
            currentIndex = index;
        });
    });

    BURGER_BTN.addEventListener("click", () => {
        BURGER_MENU.classList.toggle("burger-active");
        BURGER_BTN.classList.toggle("active");
        document.body.classList.toggle("no-scroll");
    })

    blogSliderItems.arrows.left.addEventListener("click", () => {
        if (blogCurrentIndex > 0) {
            blogCurrentIndex--;
            changeSlide(blogCurrentIndex, blogSliderItems.slides, blogSliderItems.paginationDots, blogSliderItems.container.offsetWidth);
        }
    });
    
    blogSliderItems.arrows.right.addEventListener("click", () => {
        if (blogCurrentIndex < totalSlides - 1) {
            blogCurrentIndex++;
            changeSlide(blogCurrentIndex, blogSliderItems.slides, blogSliderItems.paginationDots, blogSliderItems.container.offsetWidth);
        };
    });
    
    blogSliderItems.paginationDots.forEach((item, index) => {
        item.addEventListener("click", () => {
            changeSlide(index, blogSliderItems.slides, blogSliderItems.paginationDots, blogSliderItems.container.offsetWidth);
            blogCurrentIndex = index;
        });
    });

    window.addEventListener('resize', () => {
        changeSlide(currentIndex, heroSliderItems.slides, heroSliderItems.paginationDots, heroSliderItems.container.offsetWidth, heroSliderItems.thumbs, heroSliderItems.stat);
        changeSlide(blogCurrentIndex, blogSliderItems.slides, blogSliderItems.paginationDots, blogSliderItems.container.offsetWidth);
        changeSlide(testimonialsVars.currentIndex, testimonicalsItems.slides, testimonicalsItems.paginationDots, testimonicalsItems.slides[0].offsetWidth + 64);
    });

    // TESTIMONIALS

    testimonicalsItems.container.addEventListener("mousedown", handleStart)

    testimonicalsItems.testimonicals.addEventListener("mouseup", handleEnd)

    testimonicalsItems.testimonicals.addEventListener("mousemove", function(event) {
        if(testimonialsVars.isPressed) {
            let translation = -(testimonialsVars.startX - event.clientX) + testimonialsVars.initialTranslateX;
            testimonicalsItems.slides.forEach(item => {
                item.style.transform = `translateX(${translation}px)`;
                item.style.transition = "";
                })
            }
        })

    testimonicalsItems.container.addEventListener("touchstart", handleStart, { passive: true });
    testimonicalsItems.testimonicals.addEventListener("touchend", handleEnd, { passive: true });
    testimonicalsItems.testimonicals.addEventListener("touchmove", function(event) {
        if (testimonialsVars.isPressed) {
            const currentX = event.touches[0].clientX;
            const translation = -(testimonialsVars.startX - currentX) + testimonialsVars.initialTranslateX;
            testimonicalsItems.slides.forEach(slide => {
                slide.style.transform = `translateX(${translation}px)`;
                slide.style.transition = "";
            });
        }
    }, { passive: true });
        
}


function changeSlide(index, sliderItems, paginationDots, sliderContainerOffset, thumbs, stats) {
    baseStep = sliderContainerOffset;
    
    sliderItems.forEach(item => {
        item.style.transform = `translateX(${baseStep * -index}px)`;
    });

    if (thumbs) {
        thumbs.forEach((item) => {
            item.classList.remove("active");
        });
        let activeThumb = thumbs[indexMapThumb[index]];
        if (activeThumb) {
            activeThumb.classList.add("active");
        }
    }

    if (stats) {
        stats.forEach(item => {
            item.classList.remove("active");
        });
        let activeStat = stats[indexMapStat[index]];
        if(activeStat) {
            activeStat.classList.add("active");
        }
    }

    paginationDots.forEach(item => {
        item.classList.remove("active");
    })
    let activeDot = paginationDots[index];
    if(activeDot) {
        activeDot.classList.add("active");
    }
}

function startSlideShow() {
    setInterval(() => {
        changeSlide(currentIndex, heroSliderItems.slides, heroSliderItems.paginationDots, heroSliderItems.container.offsetWidth, heroSliderItems.thumbs, heroSliderItems.stat);
        currentIndex++;

        if (currentIndex >= heroSliderItems.slides.length) {
            currentIndex = 0;
        }
    }, 3500); 
}

startSlideShow();
listeners();

function moveSlide(direction, steps) {
    testimonicalsItems.slides.forEach(item => {
        item.style.transform = `translateX(${testimonialsVars.initialTranslateX}px)`;
        item.style.transition = "transform 0.4s ease";
    })

    let newIndex = direction === "left" ? testimonialsVars.currentIndex - steps : testimonialsVars.currentIndex + steps;
    changeSlide(newIndex, testimonicalsItems.slides, testimonicalsItems.paginationDots, testimonicalsItems.slides[0].offsetWidth + 64);

    testimonicalsItems.slides.forEach(slide => {
        slide.classList.remove("active");
    })
    testimonicalsItems.slides[newIndex].classList.add("active");

    testimonialsVars.currentIndex = steps;
};

function getTranslateX(element) {
    let style = window.getComputedStyle(element);
    let matrix = new WebKitCSSMatrix(style.transform);

    return matrix.m41;
}

function handleSlideOutOfBounds() {
    const activeSlideTranslateX = getTranslateX(testimonicalsItems.activeSlide);
    const maxTranslateX = -((testimonicalsItems.slides.length - 1) * testimonialsVars.baseStep);
    testimonicalsItems.activeSlide = document.querySelector(".testimonicals__slider-item.active");

    if (activeSlideTranslateX > 0) {
        resetSlides(0);
        return true;
    }

    else if (activeSlideTranslateX < maxTranslateX) {
        resetSlides(testimonicalsItems.slides.length - 1);
        return true;
    }

    return false;
}

function resetSlides(step = null) {
    const activeDot = document.querySelector(".testimonicals__pagination-dot.active");
    const currentIndex = testimonicalsItems.paginationDots.indexOf(activeDot);
    
    const targetIndex = step !== null ? step : currentIndex;

    testimonicalsItems.slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${testimonialsVars.initialTranslateX}px)`;
        slide.style.transition = "transform 0.4s ease";
        slide.classList.remove("active");
    });

    if (testimonicalsItems.slides[targetIndex]) {
        testimonicalsItems.slides[targetIndex].classList.add("active");
    }

    changeSlide(targetIndex, testimonicalsItems.slides, testimonicalsItems.paginationDots, testimonicalsItems.slides[0].offsetWidth + 64);
}

faqBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        const isActive = btn.classList.contains("active");

        faqBtns.forEach(button => button.classList.remove("active"));
        faqAnswers.forEach(answer => answer.classList.remove("active"))

        if (!isActive) {
            btn.classList.add("active");
            if (faqBtns[index]) {
                faqBtns[index].classList.add("active");
                faqAnswers[index].classList.add("active");
            }
        }
    });
});