window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];

// ===== Carousel Functionality - Global scope =====
var carouselCurrentSlide = 1;
var carouselAutoplayInterval = null;
var CAROUSEL_AUTOPLAY_INTERVAL = 5000; // 5秒自动轮播

window.changeCarouselSlide = function(n) {
    console.log('changeCarouselSlide called with:', n);
    if (carouselAutoplayInterval) {
        clearInterval(carouselAutoplayInterval);
    }
    carouselCurrentSlide += n;
    showCarouselSlide(carouselCurrentSlide);
    startCarouselAutoplay();
}

window.currentCarouselSlide = function(n) {
    console.log('currentCarouselSlide called with:', n);
    if (carouselAutoplayInterval) {
        clearInterval(carouselAutoplayInterval);
    }
    carouselCurrentSlide = n;
    showCarouselSlide(carouselCurrentSlide);
    startCarouselAutoplay();
}

function showCarouselSlide(n) {
    var slides = document.querySelectorAll('.carousel-item');
    var dots = document.querySelectorAll('.dot');
    var totalSlides = slides.length;
    
    console.log('showCarouselSlide - n:', n, 'totalSlides:', totalSlides);
    
    if (totalSlides === 0) {
        console.warn('No carousel items found');
        return;
    }
    
    if (n > totalSlides) {
        carouselCurrentSlide = 1;
    } else if (n < 1) {
        carouselCurrentSlide = totalSlides;
    } else {
        carouselCurrentSlide = n;
    }
    
    var wrapper = document.querySelector('.carousel-wrapper');
    if (wrapper) {
        var offset = -(carouselCurrentSlide - 1) * 100;
        wrapper.style.transform = 'translateX(' + offset + '%)';
        wrapper.style.overflow = '';
        console.log('Transform applied:', 'translateX(' + offset + '%)');
    } else {
        console.error('carousel-wrapper not found');
    }
    
    dots.forEach(function(dot, index) {
        if (index === carouselCurrentSlide - 1) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function startCarouselAutoplay() {
    carouselAutoplayInterval = setInterval(function() {
        var slides = document.querySelectorAll('.carousel-item');
        var totalSlides = slides.length;
        
        if (totalSlides === 0) return;
        
        carouselCurrentSlide++;
        if (carouselCurrentSlide > totalSlides) {
            carouselCurrentSlide = 1;
        }
        showCarouselSlide(carouselCurrentSlide);
    }, CAROUSEL_AUTOPLAY_INTERVAL);
}

function initCarousel() {
    var slides = document.querySelectorAll('.carousel-item');
    console.log('Initializing carousel, found', slides.length, 'slides');
    if (slides.length > 0) {
        showCarouselSlide(1);
        startCarouselAutoplay();
    }
}
// ===== End Carousel Functionality =====

function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    // Initialize carousel
    initCarousel();

})
