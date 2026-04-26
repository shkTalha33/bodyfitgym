import GymAssetLoader from "@/components/gym-asset-loader";
import LandingHtmlWithClientNav from "@/components/landing-html-with-client-nav";

const LANDING_HTML = `<!-- Header -->

    <header>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <nav class="navbar navbar-expand-lg">
                        <a class="navbar-brand" href="/">
                            <img src="/images/logo/bodyfitlogo.png" alt="Body Fit" height="50" style="height:50px;width:auto;">
                        </a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                            aria-label="Toggle navigation">
                            <span class="menu hamburger" data-menu="12">
                                <span class="icon"></span>
                            </span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav nav">
                                <li class="nav-item" id="about-parent" onclick="slideDown('about', 'about-parent');">
                                    <a class="nav-link" href="javascript:void(0)">Home
                                        <img src="/images/menu-arrow-down.svg" class="rotate-arrow">
                                    </a>
                                    <ul class="sub-menu" id="about">
                                        <li>
                                            <a href="/" class="nav-link-scroll active">Home Version 1</a>
                                        </li>
                                        <li>
                                            <a href="/home-two" class="nav-link-scroll">Home Version 2</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-link="about-section" href="#about">About</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-link="classes-section" href="#classes">Classes</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-link="pricing-section" href="#pricing">Pricing</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-link="team-section" href="#team">Team</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-link="blog-section" href="#blog">Blog</a>
                                </li>
                            </ul>
                            <a class="theme-btn d-inline-block d-lg-none text-decoration-none" href="/auth/login">
                                Join Now
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 11.4713V0H0.526055V1.49626H9.44913L0 10.9426L1.05211 12L10.5112 2.54364V11.4713H12Z"
                                        fill="#F41E1E"></path>
                                </svg>
                            </a>
                        </div>
                        <div class="header-button-block d-lg-block d-none">
                            <a class="theme-btn text-decoration-none" href="/auth/login">
                                Join Now
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 11.4713V0H0.526055V1.49626H9.44913L0 10.9426L1.05211 12L10.5112 2.54364V11.4713H12Z"
                                        fill="#F41E1E"></path>
                                </svg>
                            </a>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    </header>

    <!-- Hero -->

    <section class="hero">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="hero-content">
                        <span data-aos="fade-up" data-aos-duration="800">skill
                            <img src="/images/arrows.png" data-aos="fade-right" data-aos-duration="1200" alt="arrow">
                        </span>
                        <div class="stroke-text">
                            <h3 data-aos="fade-up" data-aos-duration="900">Endurance</h3>
                            <h3 data-aos="fade-up" data-aos-duration="900">Endurance</h3>
                        </div>
                        <h2 data-aos="fade-up" data-aos-duration="800">DISCIPLINE</h2>
                        <div data-aos="fade-up" data-aos-duration="800" class="hero-text">
                            <p>Join Body Fit and experience
                                personalized training programs, cutting-edge equipment, and a supportive
                                community. Achieve unparalleled results and elevate your fitness journey
                                with us.</p>
                            <a class="theme-btn text-decoration-none d-inline-flex align-items-center" href="/auth/login">
                                Join Now
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 11.4713V0H0.526055V1.49626H9.44913L0 10.9426L1.05211 12L10.5112 2.54364V11.4713H12Z"
                                        fill="#F41E1E"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <img src="/images/background/hero-person.png" class="hero-person" data-aos="fade-right" data-aos-duration="1400"
            alt="person">
    </section>

    <!-- Introduction -->

    <section class="introduction" id="about" data-id="about-section">
        <div class="container">
            <div class="row">
                <div class="col-md-12 col-lg-4">
                    <div class="main-title-block">
                        <span data-aos="fade-up" data-aos-duration="900">introduction</span>
                        <h2 data-aos="fade-up" data-aos-duration="900">Body Fit</h2>
                        <img src="/images/title-light-arrow.svg" data-aos="fade-right" data-aos-duration="1400"
                            alt="arrow">
                    </div>
                    <img src="/images/introduction/introduction.png" class="intro-image d-none d-lg-block"
                        alt="introduction" data-aos="fade-up" data-aos-duration="1100">
                    <!-- <img src="/images/shadow.svg" class="shadow"> -->
                </div>
                <div class="col-md-12 col-lg-8">
                    <div class="row">
                        <div class="col-md-6 col-lg-6 col-xl-6">
                            <div class="introduction-card">
                                <div class="intro-image-block">
                                    <img src="/images/introduction/mission-1.jpg" alt="mission" class="img-fluid"
                                        data-aos="zoom-in-down" data-aos-duration="1500">
                                    <img src="/images/arrows.png" alt="arrows" class="border-0 three-arrows"
                                        data-aos="fade-right" data-aos-duration="1200">
                                </div>
                                <h3>mission</h3>
                                <p>Our purpose is to pass on empowering knowledge and training guidance in order to have
                                    a
                                    positive impact on the health and fitness of everyone we work with.</p>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-6 col-xl-6">
                            <div class="introduction-card">
                                <div class="intro-image-block">
                                    <img src="/images/introduction/story-1.jpg" alt="story" class="img-fluid"
                                        data-aos="zoom-in-down" data-aos-duration="1500">
                                    <img src="/images/arrows.png" alt="arrows" class="border-0 three-arrows"
                                        data-aos="fade-right" data-aos-duration="1200">
                                </div>
                                <h3>story</h3>
                                <p>Our main focus at Body Fit is functional training because of the proven
                                    benefits.
                                    With an emphasis on mobility, strength, and conditioning, the benefits of functional
                                    training differ from other workouts because of the way it targets your body.</p>
                            </div>
                        </div>
                        <div class="col-md-12 col-lg-12">
                            <div class="introduction-card mt-30 mb-0">
                                <div class="intro-image-block approach">
                                    <img src="/images/introduction/approach-1.jpg" alt="approach" class="img-fluid"
                                        data-aos="zoom-in-down" data-aos-duration="1500">
                                    <img src="/images/arrows.png" alt="arrows" class="border-0 three-arrows"
                                        data-aos="fade-right" data-aos-duration="1200">
                                </div>
                                <h3>approach</h3>
                                <p>We are a hybrid gym and training facility. We have clean, state of the art facilities
                                    with
                                    the most knowledgeable staff and cutting-edge training methods. We offer open gym,
                                    team
                                    training, group classes, boxing, cycle and personal training.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Classes -->

    <section class="classes position-relative overflow-hidden" id="classes" data-id="classes-section">
        <div class="container">
            <div class="row class-slider-row">

                <div class="col-md-12 col-lg-4">
                    <div class="main-title-block">
                        <span data-aos="fade-up" data-aos-duration="900">BUILD YOUR BEST BODY</span>
                        <h2 data-aos="fade-up" data-aos-duration="900">Body Fit Classes</h2>
                        <img src="/images/arrow_02.svg" data-aos="fade-right" data-aos-duration="1400" alt="arrow">
                    </div>
                    <div class="review-content" data-aos="fade-up" data-aos-duration="900">
                        <p>Join our Body Fit Classes for dynamic, high-intensity workouts suitable for all fitness
                            levels. From strength training to cardio, transform your fitness routine with expert-led
                            sessions.</p>
                    </div>
                    <div class="slider-button-block d-none d-lg-block" data-aos="fade-up" data-aos-duration="900">
                        <button class="owl-prev">
                            <svg width="20" height="11" viewBox="0 0 20 11" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.931435 5.77796C0.905968 5.74633 0.880499 5.71469 0.858669 5.67955C0.858669 5.67955 0.855032 5.67603 0.855032 5.67252C0.833202 5.63737 0.811373 5.60222 0.79682 5.56356V5.56004C0.778629 5.52138 0.764076 5.48272 0.75316 5.44405C0.75316 5.44054 0.75316 5.44054 0.75316 5.43703C0.749523 5.41594 0.742247 5.39836 0.738607 5.38079C0.73497 5.36321 0.731331 5.34212 0.727692 5.32455C0.727692 5.32104 0.727692 5.31752 0.727692 5.31049C0.724054 5.29292 0.724054 5.27534 0.724054 5.25777C0.724054 5.25426 0.724054 5.25426 0.724054 5.25074C0.724054 5.23317 0.724054 5.21559 0.724054 5.1945C0.724054 5.18747 0.724054 5.18396 0.724054 5.17693C0.724054 5.15936 0.724054 5.14178 0.727692 5.12421C0.731331 5.09609 0.727692 5.12069 0.727692 5.12069C0.727692 5.10312 0.731331 5.08203 0.73497 5.06446L0.738607 5.0504C0.745884 5.01173 0.7568 4.96956 0.771353 4.93089V4.92738C0.800459 4.84654 0.840479 4.76921 0.891415 4.69892L0.895052 4.69189C0.905968 4.67431 0.920521 4.66025 0.931435 4.64619C0.931435 4.64268 0.935074 4.64268 0.938713 4.63916C0.949627 4.6251 0.960543 4.61456 0.971457 4.60402L0.98237 4.59347L0.989649 4.58644L4.96628 0.741248C5.32283 0.396797 5.89768 0.396797 6.25423 0.741248C6.61078 1.0857 6.61078 1.64104 6.25423 1.98549L3.8275 4.32986L18.4352 4.32986C18.9372 4.32986 19.3447 4.72352 19.3447 5.21208C19.3447 5.69712 18.9372 6.09078 18.4352 6.09078L3.83114 6.09078L6.46525 8.6355C6.8218 8.97995 6.8218 9.53528 6.46525 9.87974C6.1087 10.2242 5.53385 10.2242 5.1773 9.87974L0.98601 5.83068C0.971457 5.81662 0.956903 5.80256 0.945988 5.78851L0.931435 5.77796Z"
                                    fill="#333333" />
                            </svg>
                        </button>
                        <button class="owl-next">
                            <svg width="20" height="11" viewBox="0 0 20 11" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M19.0686 5.77796C19.094 5.74633 19.1195 5.71469 19.1413 5.67955C19.1413 5.67955 19.145 5.67603 19.145 5.67252C19.1668 5.63737 19.1886 5.60222 19.2032 5.56356V5.56004C19.2214 5.52138 19.2359 5.48272 19.2468 5.44405C19.2468 5.44054 19.2468 5.44054 19.2468 5.43703C19.2505 5.41594 19.2578 5.39836 19.2614 5.38079C19.265 5.36321 19.2687 5.34212 19.2723 5.32455C19.2723 5.32104 19.2723 5.31752 19.2723 5.31049C19.2759 5.29292 19.2759 5.27534 19.2759 5.25777C19.2759 5.25426 19.2759 5.25426 19.2759 5.25074C19.2759 5.23317 19.2759 5.21559 19.2759 5.1945C19.2759 5.18747 19.2759 5.18396 19.2759 5.17693C19.2759 5.15936 19.2759 5.14178 19.2723 5.12421C19.2687 5.09609 19.2723 5.12069 19.2723 5.12069C19.2723 5.10312 19.2687 5.08203 19.265 5.06446L19.2614 5.0504C19.2541 5.01173 19.2432 4.96956 19.2286 4.93089V4.92738C19.1995 4.84654 19.1595 4.76921 19.1086 4.69892L19.1049 4.69189C19.094 4.67431 19.0795 4.66025 19.0686 4.64619C19.0686 4.64268 19.0649 4.64268 19.0613 4.63916C19.0504 4.6251 19.0395 4.61456 19.0285 4.60402L19.0176 4.59347L19.0104 4.58644L15.0337 0.741248C14.6772 0.396797 14.1023 0.396797 13.7458 0.741248C13.3892 1.0857 13.3892 1.64104 13.7458 1.98549L16.1725 4.32986L1.56484 4.32986C1.06276 4.32986 0.655273 4.72352 0.655273 5.21208C0.655273 5.69712 1.06276 6.09078 1.56484 6.09078L16.1689 6.09078L13.5348 8.6355C13.1782 8.97995 13.1782 9.53528 13.5348 9.87974C13.8913 10.2242 14.4662 10.2242 14.8227 9.87974L19.014 5.83068C19.0285 5.81662 19.0431 5.80256 19.054 5.78851L19.0686 5.77796Z"
                                    fill="#333333" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="classes-slider-wrapper">
                    <div class="owl-theme owl-carousel classes-slider">
                        <div class="classes-wrapper position-relative" data-aos="fade-left" data-aos-duration="800">
                            <img src="/images/classes/classes_01.jpg" alt="classes">
                            <a href="javascript:void(0)">
                                <div class="class-title">
                                    <span>Boxing</span>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 11.4713V0H0.526055V1.49626H9.44913L0 10.9426L1.05211 12L10.5112 2.54364V11.4713H12Z"
                                            fill="#F41E1E" />
                                    </svg>
                                </div>
                            </a>
                        </div>
                        <div class="classes-wrapper position-relative" data-aos="fade-left" data-aos-duration="1800">
                            <img src="/images/classes/classes_02.jpg" alt="classes">
                            <a href="javascript:void(0)">
                                <div class="class-title">
                                    <span>Cycling</span>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 11.4713V0H0.526055V1.49626H9.44913L0 10.9426L1.05211 12L10.5112 2.54364V11.4713H12Z"
                                            fill="#F41E1E" />
                                    </svg>
                                </div>
                            </a>
                        </div>
                        <div class="classes-wrapper position-relative" data-aos="fade-left" data-aos-duration="2200">
                            <img src="/images/classes/classes_03.jpg" alt="classes">
                            <a href="javascript:void(0)">
                                <div class="class-title">
                                    <span>Workout</span>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 11.4713V0H0.526055V1.49626H9.44913L0 10.9426L1.05211 12L10.5112 2.54364V11.4713H12Z"
                                            fill="#F41E1E" />
                                    </svg>
                                </div>
                            </a>
                        </div>
                        <div class="classes-wrapper position-relative" data-aos="fade-left" data-aos-duration="2200">
                            <img src="/images/classes/classes_04.jpg" alt="classes">
                            <a href="javascript:void(0)">
                                <div class="class-title">
                                    <span>RUNNING</span>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 11.4713V0H0.526055V1.49626H9.44913L0 10.9426L1.05211 12L10.5112 2.54364V11.4713H12Z"
                                            fill="#F41E1E" />
                                    </svg>
                                </div>
                            </a>
                        </div>
                        <div class="classes-wrapper position-relative">
                            <img src="/images/classes/classes_05.jpg" alt="classes">
                            <a href="javascript:void(0)">
                                <div class="class-title">
                                    <span>CARDIO</span>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 11.4713V0H0.526055V1.49626H9.44913L0 10.9426L1.05211 12L10.5112 2.54364V11.4713H12Z"
                                            fill="#F41E1E" />
                                    </svg>
                                </div>
                            </a>
                        </div>
                        <div class="classes-wrapper position-relative">
                            <img src="/images/classes/classes_06.jpg" alt="classes">
                            <a href="javascript:void(0)">
                                <div class="class-title">
                                    <span>CROSSFIT</span>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 11.4713V0H0.526055V1.49626H9.44913L0 10.9426L1.05211 12L10.5112 2.54364V11.4713H12Z"
                                            fill="#F41E1E" />
                                    </svg>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="slider-button-block d-block d-lg-none" data-aos="fade-up" data-aos-duration="900">
                    <button class="owl-prev">
                        <svg width="20" height="11" viewBox="0 0 20 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.931435 5.77796C0.905968 5.74633 0.880499 5.71469 0.858669 5.67955C0.858669 5.67955 0.855032 5.67603 0.855032 5.67252C0.833202 5.63737 0.811373 5.60222 0.79682 5.56356V5.56004C0.778629 5.52138 0.764076 5.48272 0.75316 5.44405C0.75316 5.44054 0.75316 5.44054 0.75316 5.43703C0.749523 5.41594 0.742247 5.39836 0.738607 5.38079C0.73497 5.36321 0.731331 5.34212 0.727692 5.32455C0.727692 5.32104 0.727692 5.31752 0.727692 5.31049C0.724054 5.29292 0.724054 5.27534 0.724054 5.25777C0.724054 5.25426 0.724054 5.25426 0.724054 5.25074C0.724054 5.23317 0.724054 5.21559 0.724054 5.1945C0.724054 5.18747 0.724054 5.18396 0.724054 5.17693C0.724054 5.15936 0.724054 5.14178 0.727692 5.12421C0.731331 5.09609 0.727692 5.12069 0.727692 5.12069C0.727692 5.10312 0.731331 5.08203 0.73497 5.06446L0.738607 5.0504C0.745884 5.01173 0.7568 4.96956 0.771353 4.93089V4.92738C0.800459 4.84654 0.840479 4.76921 0.891415 4.69892L0.895052 4.69189C0.905968 4.67431 0.920521 4.66025 0.931435 4.64619C0.931435 4.64268 0.935074 4.64268 0.938713 4.63916C0.949627 4.6251 0.960543 4.61456 0.971457 4.60402L0.98237 4.59347L0.989649 4.58644L4.96628 0.741248C5.32283 0.396797 5.89768 0.396797 6.25423 0.741248C6.61078 1.0857 6.61078 1.64104 6.25423 1.98549L3.8275 4.32986L18.4352 4.32986C18.9372 4.32986 19.3447 4.72352 19.3447 5.21208C19.3447 5.69712 18.9372 6.09078 18.4352 6.09078L3.83114 6.09078L6.46525 8.6355C6.8218 8.97995 6.8218 9.53528 6.46525 9.87974C6.1087 10.2242 5.53385 10.2242 5.1773 9.87974L0.98601 5.83068C0.971457 5.81662 0.956903 5.80256 0.945988 5.78851L0.931435 5.77796Z"
                                fill="#333333" />
                        </svg>
                    </button>
                    <button class="owl-next">
                        <svg width="20" height="11" viewBox="0 0 20 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M19.0686 5.77796C19.094 5.74633 19.1195 5.71469 19.1413 5.67955C19.1413 5.67955 19.145 5.67603 19.145 5.67252C19.1668 5.63737 19.1886 5.60222 19.2032 5.56356V5.56004C19.2214 5.52138 19.2359 5.48272 19.2468 5.44405C19.2468 5.44054 19.2468 5.44054 19.2468 5.43703C19.2505 5.41594 19.2578 5.39836 19.2614 5.38079C19.265 5.36321 19.2687 5.34212 19.2723 5.32455C19.2723 5.32104 19.2723 5.31752 19.2723 5.31049C19.2759 5.29292 19.2759 5.27534 19.2759 5.25777C19.2759 5.25426 19.2759 5.25426 19.2759 5.25074C19.2759 5.23317 19.2759 5.21559 19.2759 5.1945C19.2759 5.18747 19.2759 5.18396 19.2759 5.17693C19.2759 5.15936 19.2759 5.14178 19.2723 5.12421C19.2687 5.09609 19.2723 5.12069 19.2723 5.12069C19.2723 5.10312 19.2687 5.08203 19.265 5.06446L19.2614 5.0504C19.2541 5.01173 19.2432 4.96956 19.2286 4.93089V4.92738C19.1995 4.84654 19.1595 4.76921 19.1086 4.69892L19.1049 4.69189C19.094 4.67431 19.0795 4.66025 19.0686 4.64619C19.0686 4.64268 19.0649 4.64268 19.0613 4.63916C19.0504 4.6251 19.0395 4.61456 19.0285 4.60402L19.0176 4.59347L19.0104 4.58644L15.0337 0.741248C14.6772 0.396797 14.1023 0.396797 13.7458 0.741248C13.3892 1.0857 13.3892 1.64104 13.7458 1.98549L16.1725 4.32986L1.56484 4.32986C1.06276 4.32986 0.655273 4.72352 0.655273 5.21208C0.655273 5.69712 1.06276 6.09078 1.56484 6.09078L16.1689 6.09078L13.5348 8.6355C13.1782 8.97995 13.1782 9.53528 13.5348 9.87974C13.8913 10.2242 14.4662 10.2242 14.8227 9.87974L19.014 5.83068C19.0285 5.81662 19.0431 5.80256 19.054 5.78851L19.0686 5.77796Z"
                                fill="#333333" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Improve Life -->

    <section class="improve">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-12 col-lg-6">
                    <div class="main-title-block">
                        <span class="text-white" data-aos="fade-up" data-aos-duration="900">Do it for you!</span>
                        <h2 data-aos="fade-up" data-aos-duration="900">Improve your life</h2>
                        <img src="/images/white-arrow.png" data-aos="fade-right" data-aos-duration="1400" alt="arrow">
                    </div>
                </div>
                <div class="col-md-12 col-lg-6">
                    <div class="improve-video position-relative" data-aos="zoom-in" data-aos-duration="900">
                        <button data-bs-toggle="modal" data-bs-target="#exampleModal">
                            <img src="/images/play.png" alt="play">
                        </button>
                        <img src="/images/background/video-poster.jpg" class="img-fluid poster" alt="poster">
                        <img src="/images/poster_arrow.svg" class="poster-arrow" data-aos="fade-right"
                            data-aos-duration="1200" alt="arrow">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Calculate BMI -->

    <section class="bmi-calculate">
        <div class="container">
            <div class="row g-4">
                <div class="col-md-12 col-lg-6">
                    <div class="main-title-block">
                        <span data-aos="fade-up" data-aos-duration="900">SET HIGH FITNESS GOALS</span>
                        <h2 data-aos="fade-up" data-aos-duration="900">CALCULATE YOUR BMI</h2>
                        <img src="/images/arrow_02.svg" data-aos="fade-right" data-aos-duration="1400" alt="arrow">
                    </div>
                    <div class="bmi-chart" data-aos="fade-right" data-aos-duration="800">
                        <div class="table-responsive">
                            <table class="w-100">
                                <thead>
                                    <tr>
                                        <th>BMI</th>
                                        <th>WEIGHT Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Below 18.5</strong></td>
                                        <td>Underweight</td>
                                    </tr>
                                    <tr>
                                        <td> <strong>18.5 - 24.9</strong> </td>
                                        <td>Normal</td>
                                    </tr>
                                    <tr>
                                        <td> <strong>25 - 29.9</strong> </td>
                                        <td>Overweight</td>
                                    </tr>
                                    <tr>
                                        <td> <strong>30 and Above</strong> </td>
                                        <td>Obese</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p><span>*BMR:</span> Body Metabolic Rate / <span>BMI:</span> Body Mass Index</p>
                    </div>
                </div>
                <div class="col-md-12 col-lg-6">
                    <div class="bmi-form" data-aos="fade-up" data-aos-duration="1000">
                        <h2>INPUT YOUR BMI</h2>
                        <p>Discover your body's composition and health insights with our BMI calculator.</p>
                        <form>
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Height / CM</label>
                                        <input type="text" class="form-control" placeholder="e.g. 175">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Weight / KG</label>
                                        <input type="text" class="form-control" placeholder="e.g. 80">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Age</label>
                                        <input type="text" class="form-control" placeholder="e.g. 35">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Gender</label>
                                        <select class="form-select">
                                            <option value="0">Male</option>
                                            <option value="1">Feamle</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label>SELECT AN ACTIVITY FACTOR</label>
                                        <select class="form-select">
                                            <option value="0">Male</option>
                                            <option value="1">Feamle</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button class="theme-btn" type="button">
                                Calculate
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 11.4713V0H0.526055V1.49626H9.44913L0 10.9426L1.05211 12L10.5112 2.54364V11.4713H12Z"
                                        fill="#F41E1E"></path>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing -->

    <section class="pricing" id="pricing" data-id="pricing-section">
        <div class="container">
            <div class="row">
                <div class="col-md-12 col-lg-8">
                    <div class="main-title-block">
                        <span data-aos="fade-up" data-aos-duration="900">AI pricing</span>
                        <h2 data-aos="fade-up" data-aos-duration="900">Pay per use with USDC</h2>
                        <p class="mt-3" data-aos="fade-up" data-aos-duration="950" style="max-width: 42rem; color: rgba(255,255,255,0.7);">
                            Fund your in-app Circle wallet after signup. Each AI feature deducts a small USDC amount only when you run it—no monthly gym tiers.
                        </p>
                        <img src="/images/title-light-arrow.svg" data-aos="fade-right" data-aos-duration="1400"
                            alt="arrow">
                    </div>
                </div>
            </div>
            <div class="row pricing-row justify-content-center">
                <div class="col-md-6 col-lg-4 pricing-col premium">
                    <div class="pricing-wrapper" data-aos="fade-up" data-aos-duration="1200">
                        <div class="pricing-image">
                            <img src="/images/plans/plan_02.jpg" class="img-fluid" alt="Diet Planner">
                        </div>
                        <div class="pricing-content">
                            <h3>DIET PLANNER</h3>
                            <span class="price">$0.005</span>
                            <ul>
                                <li>
                                    <img src="/images/list_arrow.svg" alt="">
                                    <p>Personalized calories, macro split, and hydration from your profile</p>
                                </li>
                                <li>
                                    <img src="/images/list_arrow.svg" alt="">
                                    <p>Three ready-made day plans (primary, office, training)</p>
                                </li>
                                <li>
                                    <img src="/images/list_arrow.svg" alt="">
                                    <p>Meal timing and pre-workout fueling guidance</p>
                                </li>
                            </ul>
                            <a class="theme-btn text-decoration-none d-inline-flex align-items-center" href="/auth/login">
                                Get started
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 11.4713V0H0.526055V1.49626H9.44913L0 10.9426L1.05211 12L10.5112 2.54364V11.4713H12Z"
                                        fill="#F41E1E"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4 pricing-col individual">
                    <div class="pricing-wrapper" data-aos="fade-up" data-aos-duration="1400">
                        <div class="pricing-image">
                            <img src="/images/plans/plan_01.jpg" class="img-fluid" alt="AI Coach">
                        </div>
                        <div class="pricing-content">
                            <h3>AI COACH</h3>
                            <span class="price">$0.001</span>
                            <ul>
                                <li>
                                    <img src="/images/list_arrow.svg" alt="">
                                    <p>Profile-aware answers using your saved goals and stats</p>
                                </li>
                                <li>
                                    <img src="/images/list_arrow.svg" alt="">
                                    <p>Multi-turn chats with history synced to your account</p>
                                </li>
                                <li>
                                    <img src="/images/list_arrow.svg" alt="">
                                    <p>Fast coaching for training, nutrition, and recovery questions</p>
                                </li>
                            </ul>
                            <a class="theme-btn text-decoration-none d-inline-flex align-items-center" href="/auth/login">
                                Get started
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 11.4713V0H0.526055V1.49626H9.44913L0 10.9426L1.05211 12L10.5112 2.54364V11.4713H12Z"
                                        fill="#F41E1E"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4 pricing-col standard">
                    <div class="pricing-wrapper" data-aos="fade-up" data-aos-duration="1600">
                        <div class="pricing-image">
                            <img src="/images/plans/plan_03.jpg" class="img-fluid" alt="Workout generator">
                        </div>
                        <div class="pricing-content">
                            <h3>WORKOUT GENERATOR</h3>
                            <span class="price">$0.008</span>
                            <ul>
                                <li>
                                    <img src="/images/list_arrow.svg" alt="">
                                    <p>One full session built for your equipment and focus muscles</p>
                                </li>
                                <li>
                                    <img src="/images/list_arrow.svg" alt="">
                                    <p>Warm-up, main blocks, and cool-down with set/rep prescriptions</p>
                                </li>
                                <li>
                                    <img src="/images/list_arrow.svg" alt="">
                                    <p>Execution tips on every exercise to reduce injury and improve form</p>
                                </li>
                            </ul>
                            <a class="theme-btn text-decoration-none d-inline-flex align-items-center" href="/auth/login">
                                Get started
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 11.4713V0H0.526055V1.49626H9.44913L0 10.9426L1.05211 12L10.5112 2.54364V11.4713H12Z"
                                        fill="#F41E1E"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Opening Hours -->

    <section class="opening-hours">
        <div class="container">
            <div class="row">
                <div class="col-md-12 col-lg-6">
                    <div class="main-title-block">
                        <span data-aos="fade-up" data-aos-duration="900">Time gives you strength</span>
                        <h2 data-aos="fade-up" data-aos-duration="900">Opening Hours</h2>
                        <img src="/images/arrow_02.svg" data-aos="fade-right" data-aos-duration="1400" alt="arrow">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-5">
                    <div class="hours-content" data-aos="fade-up" data-aos-duration="800">
                        <p>Check our flexible opening hours to find the perfect time for your workout. We're here to fit
                            your schedule.</p>
                        <div class="hours-block">
                            <div class="hours-flex">
                                <img src="/images/watch.svg" alt="watch">
                                <div>
                                    <span>Mon to Fri</span>
                                    <h6>5am - 9pm</h6>
                                </div>
                            </div>
                            <div class="hours-flex">
                                <img src="/images/watch.svg" alt="watch">
                                <div>
                                    <span>Sat to Sun</span>
                                    <h6>7am - 9pm </h6>
                                </div>
                            </div>
                        </div>
                        <a class="theme-btn text-decoration-none d-inline-flex align-items-center" href="/auth/login">
                            Join Now
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 11.4713V0H0.526055V1.49626H9.44913L0 10.9426L1.05211 12L10.5112 2.54364V11.4713H12Z"
                                    fill="#F41E1E"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Review -->

    <section class="review">
        <div class="container">
            <div class="row">
                <div class="col-md-12 col-lg-4">
                    <div class="main-title-block">
                        <span data-aos="fade-up" data-aos-duration="900">Getting into shape</span>
                        <h2 data-aos="fade-up" data-aos-duration="900">What People Says</h2>
                        <img src="/images/title-light-arrow.svg" data-aos="fade-right" data-aos-duration="1400"
                            alt="arrow">
                    </div>
                    <div class="review-content" data-aos="fade-up" data-aos-duration="800">
                        <p>Experience the epitome of fitness at Body Fit with state-of-the-art facilities, expert
                            trainers, and personalized programs to unleash your best self!</p>
                        <div class="review-rating">
                            <ul>
                                <li>
                                    <img src="/images/people/people_01.png" alt="people">
                                </li>
                                <li>
                                    <img src="/images/people/people_02.png" alt="people">
                                </li>
                                <li>
                                    <img src="/images/people/people_03.png" alt="people">
                                </li>
                                <li>
                                    <img src="/images/people/people_04.png" alt="people">
                                </li>
                                <li>
                                    <img src="/images/people/people_05.png" alt="people">
                                </li>
                            </ul>

                            <div>
                                <span>
                                    <i class="fa-solid fa-star"></i>
                                    4.8
                                </span>
                                <p>(530 Reviews)</p>
                            </div>
                        </div>

                    </div>
                    <div class="slider-button-block d-none d-lg-block" data-aos="fade-up" data-aos-duration="800">
                        <button class="owl-prev">
                            <svg width="20" height="11" viewBox="0 0 20 11" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.931435 5.77796C0.905968 5.74633 0.880499 5.71469 0.858669 5.67955C0.858669 5.67955 0.855032 5.67603 0.855032 5.67252C0.833202 5.63737 0.811373 5.60222 0.79682 5.56356V5.56004C0.778629 5.52138 0.764076 5.48272 0.75316 5.44405C0.75316 5.44054 0.75316 5.44054 0.75316 5.43703C0.749523 5.41594 0.742247 5.39836 0.738607 5.38079C0.73497 5.36321 0.731331 5.34212 0.727692 5.32455C0.727692 5.32104 0.727692 5.31752 0.727692 5.31049C0.724054 5.29292 0.724054 5.27534 0.724054 5.25777C0.724054 5.25426 0.724054 5.25426 0.724054 5.25074C0.724054 5.23317 0.724054 5.21559 0.724054 5.1945C0.724054 5.18747 0.724054 5.18396 0.724054 5.17693C0.724054 5.15936 0.724054 5.14178 0.727692 5.12421C0.731331 5.09609 0.727692 5.12069 0.727692 5.12069C0.727692 5.10312 0.731331 5.08203 0.73497 5.06446L0.738607 5.0504C0.745884 5.01173 0.7568 4.96956 0.771353 4.93089V4.92738C0.800459 4.84654 0.840479 4.76921 0.891415 4.69892L0.895052 4.69189C0.905968 4.67431 0.920521 4.66025 0.931435 4.64619C0.931435 4.64268 0.935074 4.64268 0.938713 4.63916C0.949627 4.6251 0.960543 4.61456 0.971457 4.60402L0.98237 4.59347L0.989649 4.58644L4.96628 0.741248C5.32283 0.396797 5.89768 0.396797 6.25423 0.741248C6.61078 1.0857 6.61078 1.64104 6.25423 1.98549L3.8275 4.32986L18.4352 4.32986C18.9372 4.32986 19.3447 4.72352 19.3447 5.21208C19.3447 5.69712 18.9372 6.09078 18.4352 6.09078L3.83114 6.09078L6.46525 8.6355C6.8218 8.97995 6.8218 9.53528 6.46525 9.87974C6.1087 10.2242 5.53385 10.2242 5.1773 9.87974L0.98601 5.83068C0.971457 5.81662 0.956903 5.80256 0.945988 5.78851L0.931435 5.77796Z"
                                    fill="#333333" />
                            </svg>
                        </button>
                        <button class="owl-next">
                            <svg width="20" height="11" viewBox="0 0 20 11" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M19.0686 5.77796C19.094 5.74633 19.1195 5.71469 19.1413 5.67955C19.1413 5.67955 19.145 5.67603 19.145 5.67252C19.1668 5.63737 19.1886 5.60222 19.2032 5.56356V5.56004C19.2214 5.52138 19.2359 5.48272 19.2468 5.44405C19.2468 5.44054 19.2468 5.44054 19.2468 5.43703C19.2505 5.41594 19.2578 5.39836 19.2614 5.38079C19.265 5.36321 19.2687 5.34212 19.2723 5.32455C19.2723 5.32104 19.2723 5.31752 19.2723 5.31049C19.2759 5.29292 19.2759 5.27534 19.2759 5.25777C19.2759 5.25426 19.2759 5.25426 19.2759 5.25074C19.2759 5.23317 19.2759 5.21559 19.2759 5.1945C19.2759 5.18747 19.2759 5.18396 19.2759 5.17693C19.2759 5.15936 19.2759 5.14178 19.2723 5.12421C19.2687 5.09609 19.2723 5.12069 19.2723 5.12069C19.2723 5.10312 19.2687 5.08203 19.265 5.06446L19.2614 5.0504C19.2541 5.01173 19.2432 4.96956 19.2286 4.93089V4.92738C19.1995 4.84654 19.1595 4.76921 19.1086 4.69892L19.1049 4.69189C19.094 4.67431 19.0795 4.66025 19.0686 4.64619C19.0686 4.64268 19.0649 4.64268 19.0613 4.63916C19.0504 4.6251 19.0395 4.61456 19.0285 4.60402L19.0176 4.59347L19.0104 4.58644L15.0337 0.741248C14.6772 0.396797 14.1023 0.396797 13.7458 0.741248C13.3892 1.0857 13.3892 1.64104 13.7458 1.98549L16.1725 4.32986L1.56484 4.32986C1.06276 4.32986 0.655273 4.72352 0.655273 5.21208C0.655273 5.69712 1.06276 6.09078 1.56484 6.09078L16.1689 6.09078L13.5348 8.6355C13.1782 8.97995 13.1782 9.53528 13.5348 9.87974C13.8913 10.2242 14.4662 10.2242 14.8227 9.87974L19.014 5.83068C19.0285 5.81662 19.0431 5.80256 19.054 5.78851L19.0686 5.77796Z"
                                    fill="#333333" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="col-md-12 col-lg-8">
                    <div>
                        <div class="carousel-wrapper owl-theme owl-carousel">
                            <div class="review-slider" data-aos="fade-left" data-aos-duration="1200">
                                <ul>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                </ul>

                                <div class="slider-review-content">
                                    <p>GYM is a game-changer. Instead of drowning in an endless chain of emails, there
                                        is
                                        clear
                                        and
                                        easy accountability meaning tasks actually get done! GYm has helped my team and
                                        I
                                        stay
                                        on
                                        the same page. Previously, we were all over the board. Using Gym has definitely
                                        saved us
                                        time and money.</p>
                                </div>

                                <div class="reviewer-name">
                                    <div class="review-person">
                                        <img src="/images/people/review_01.jpg" alt="person">
                                        <div>
                                            <h5>Nyla Shaw</h5>
                                            <p>New York</p>
                                        </div>
                                    </div>
                                    <img src="/images/quote.png" alt="quote">
                                </div>

                            </div>
                            <div class="review-slider" data-aos="fade-left" data-aos-duration="1800">
                                <ul>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>

                                </ul>
                                <div class="slider-review-content">
                                    <p>I would recommend GYm for anyone trying to get the word out about their business.
                                        It
                                        has
                                        saved me so much time!</p>
                                </div>

                                <div class="reviewer-name">
                                    <div class="review-person">
                                        <img src="/images/people/review_02.jpg" alt="person">
                                        <div>
                                            <h5>Dannie Jupiter</h5>
                                            <p>UK</p>
                                        </div>
                                    </div>
                                    <img src="/images/quote.png" alt="quote">
                                </div>

                            </div>
                            <div class="review-slider">
                                <ul>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                </ul>

                                <div class="slider-review-content">
                                    <p>GYM is a game-changer. Instead of drowning in an endless chain of emails, there
                                        is
                                        clear
                                        and
                                        easy accountability meaning tasks actually get done! GYm has helped my team and
                                        I
                                        stay
                                        on
                                        the same page. Previously, we were all over the board. Using Gym has definitely
                                        saved us
                                        time and money.</p>
                                </div>

                                <div class="reviewer-name">
                                    <div class="review-person">
                                        <img src="/images/people/review_01.jpg" alt="person">
                                        <div>
                                            <h5>Nyla Shaw</h5>
                                            <p>New York</p>
                                        </div>
                                    </div>
                                    <img src="/images/quote.png" alt="quote">
                                </div>

                            </div>
                            <div class="review-slider">
                                <ul>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-star"></i>
                                    </li>

                                </ul>
                                <div class="slider-review-content">
                                    <p>I would recommend GYm for anyone trying to get the word out about their business.
                                        It
                                        has
                                        saved me so much time!</p>
                                </div>

                                <div class="reviewer-name">
                                    <div class="review-person">
                                        <img src="/images/people/review_02.jpg" alt="person">
                                        <div>
                                            <h5>Dannie Jupiter</h5>
                                            <p>UK</p>
                                        </div>
                                    </div>
                                    <img src="/images/quote.png" alt="quote">
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="slider-button-block d-block d-lg-none" data-aos="fade-up" data-aos-duration="800">
                        <button class="owl-prev">
                            <svg width="20" height="11" viewBox="0 0 20 11" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.931435 5.77796C0.905968 5.74633 0.880499 5.71469 0.858669 5.67955C0.858669 5.67955 0.855032 5.67603 0.855032 5.67252C0.833202 5.63737 0.811373 5.60222 0.79682 5.56356V5.56004C0.778629 5.52138 0.764076 5.48272 0.75316 5.44405C0.75316 5.44054 0.75316 5.44054 0.75316 5.43703C0.749523 5.41594 0.742247 5.39836 0.738607 5.38079C0.73497 5.36321 0.731331 5.34212 0.727692 5.32455C0.727692 5.32104 0.727692 5.31752 0.727692 5.31049C0.724054 5.29292 0.724054 5.27534 0.724054 5.25777C0.724054 5.25426 0.724054 5.25426 0.724054 5.25074C0.724054 5.23317 0.724054 5.21559 0.724054 5.1945C0.724054 5.18747 0.724054 5.18396 0.724054 5.17693C0.724054 5.15936 0.724054 5.14178 0.727692 5.12421C0.731331 5.09609 0.727692 5.12069 0.727692 5.12069C0.727692 5.10312 0.731331 5.08203 0.73497 5.06446L0.738607 5.0504C0.745884 5.01173 0.7568 4.96956 0.771353 4.93089V4.92738C0.800459 4.84654 0.840479 4.76921 0.891415 4.69892L0.895052 4.69189C0.905968 4.67431 0.920521 4.66025 0.931435 4.64619C0.931435 4.64268 0.935074 4.64268 0.938713 4.63916C0.949627 4.6251 0.960543 4.61456 0.971457 4.60402L0.98237 4.59347L0.989649 4.58644L4.96628 0.741248C5.32283 0.396797 5.89768 0.396797 6.25423 0.741248C6.61078 1.0857 6.61078 1.64104 6.25423 1.98549L3.8275 4.32986L18.4352 4.32986C18.9372 4.32986 19.3447 4.72352 19.3447 5.21208C19.3447 5.69712 18.9372 6.09078 18.4352 6.09078L3.83114 6.09078L6.46525 8.6355C6.8218 8.97995 6.8218 9.53528 6.46525 9.87974C6.1087 10.2242 5.53385 10.2242 5.1773 9.87974L0.98601 5.83068C0.971457 5.81662 0.956903 5.80256 0.945988 5.78851L0.931435 5.77796Z"
                                    fill="#333333" />
                            </svg>
                        </button>
                        <button class="owl-next">
                            <svg width="20" height="11" viewBox="0 0 20 11" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M19.0686 5.77796C19.094 5.74633 19.1195 5.71469 19.1413 5.67955C19.1413 5.67955 19.145 5.67603 19.145 5.67252C19.1668 5.63737 19.1886 5.60222 19.2032 5.56356V5.56004C19.2214 5.52138 19.2359 5.48272 19.2468 5.44405C19.2468 5.44054 19.2468 5.44054 19.2468 5.43703C19.2505 5.41594 19.2578 5.39836 19.2614 5.38079C19.265 5.36321 19.2687 5.34212 19.2723 5.32455C19.2723 5.32104 19.2723 5.31752 19.2723 5.31049C19.2759 5.29292 19.2759 5.27534 19.2759 5.25777C19.2759 5.25426 19.2759 5.25426 19.2759 5.25074C19.2759 5.23317 19.2759 5.21559 19.2759 5.1945C19.2759 5.18747 19.2759 5.18396 19.2759 5.17693C19.2759 5.15936 19.2759 5.14178 19.2723 5.12421C19.2687 5.09609 19.2723 5.12069 19.2723 5.12069C19.2723 5.10312 19.2687 5.08203 19.265 5.06446L19.2614 5.0504C19.2541 5.01173 19.2432 4.96956 19.2286 4.93089V4.92738C19.1995 4.84654 19.1595 4.76921 19.1086 4.69892L19.1049 4.69189C19.094 4.67431 19.0795 4.66025 19.0686 4.64619C19.0686 4.64268 19.0649 4.64268 19.0613 4.63916C19.0504 4.6251 19.0395 4.61456 19.0285 4.60402L19.0176 4.59347L19.0104 4.58644L15.0337 0.741248C14.6772 0.396797 14.1023 0.396797 13.7458 0.741248C13.3892 1.0857 13.3892 1.64104 13.7458 1.98549L16.1725 4.32986L1.56484 4.32986C1.06276 4.32986 0.655273 4.72352 0.655273 5.21208C0.655273 5.69712 1.06276 6.09078 1.56484 6.09078L16.1689 6.09078L13.5348 8.6355C13.1782 8.97995 13.1782 9.53528 13.5348 9.87974C13.8913 10.2242 14.4662 10.2242 14.8227 9.87974L19.014 5.83068C19.0285 5.81662 19.0431 5.80256 19.054 5.78851L19.0686 5.77796Z"
                                    fill="#333333" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Trainer -->

    <section class="trainer" id="team" data-id="team-section">
        <div class="container">
            <div class="row">
                <div class="col-md-12 col-lg-6">
                    <div class="main-title-block">
                        <span data-aos="fade-up" data-aos-duration="900">Expert Team</span>
                        <h2 data-aos="fade-up" data-aos-duration="900">World Class Trainers</h2>
                        <img src="/images/arrow_02.svg" data-aos="fade-right" data-aos-duration="1400" alt="arrow">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div>
                        <div class="owl-carousel owl-theme trainer-slider">
                            <div class="trainer-card" data-aos="fade-up" data-aos-duration="1200">
                                <div class="trainer-image position-relative">
                                    <img src="/images/trainer/trainer_01.jpg" class="img-fluid" alt="trainer">
                                    <div class="trainer-content">
                                        <h6>Skyla Smith</h6>
                                        <p>Fitness trainer</p>
                                    </div>
                                </div>
                            </div>
                            <div class="trainer-card" data-aos="fade-up" data-aos-duration="1800">
                                <div class="trainer-image position-relative">
                                    <img src="/images/trainer/trainer_02.jpg" class="img-fluid" alt="trainer">
                                    <div class="trainer-content">
                                        <h6>Clemmie Bins</h6>
                                        <p>Lifestyle coach</p>
                                    </div>
                                </div>
                            </div>
                            <div class="trainer-card" data-aos="fade-up" data-aos-duration="2200">
                                <div class="trainer-image position-relative">
                                    <img src="/images/trainer/trainer_03.jpg" class="img-fluid" alt="trainer">
                                    <div class="trainer-content">
                                        <h6>Shannon Mann</h6>
                                        <p>Personal trainer</p>
                                    </div>
                                </div>
                            </div>
                            <div class="trainer-card" data-aos="fade-up" data-aos-duration="2400">
                                <div class="trainer-image position-relative">
                                    <img src="/images/trainer/trainer_04.jpg" class="img-fluid" alt="trainer">
                                    <div class="trainer-content">
                                        <h6>Kaci Swift</h6>
                                        <p>Wellness specialist</p>
                                    </div>
                                </div>
                            </div>
                            <div class="trainer-card">
                                <div class="trainer-image position-relative">
                                    <img src="/images/trainer/trainer_05.jpg" class="img-fluid" alt="trainer">
                                    <div class="trainer-content">
                                        <h6>Karen Flores</h6>
                                        <p>Wellness specialist</p>
                                    </div>
                                </div>
                            </div>
                            <div class="trainer-card">
                                <div class="trainer-image position-relative">
                                    <img src="/images/trainer/trainer_06.jpg" class="img-fluid" alt="trainer">
                                    <div class="trainer-content">
                                        <h6>Barry Smith</h6>
                                        <p>Wellness specialist</p>
                                    </div>
                                </div>
                            </div>
                            <div class="trainer-card">
                                <div class="trainer-image position-relative">
                                    <img src="/images/trainer/trainer_07.jpg" class="img-fluid" alt="trainer">
                                    <div class="trainer-content">
                                        <h6>Oscar Adams</h6>
                                        <p>Wellness specialist</p>
                                    </div>
                                </div>
                            </div>
                            <div class="trainer-card">
                                <div class="trainer-image position-relative">
                                    <img src="/images/trainer/trainer_08.jpg" class="img-fluid" alt="trainer">
                                    <div class="trainer-content">
                                        <h6>David Northrup</h6>
                                        <p>Wellness specialist</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Blog -->

    <section class="blog" id="blog" data-id="blog-section">
        <div class="container">
            <div class="row">
                <div class="col-md-12 col-lg-6">
                    <div class="main-title-block">
                        <span data-aos="fade-up" data-aos-duration="900">latest blogs</span>
                        <h2 data-aos="fade-up" data-aos-duration="900">Together we succeed</h2>
                        <img src="/images/title-light-arrow.svg" data-aos="fade-right" data-aos-duration="1400"
                            alt="arrow">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="owl-theme owl-carousel blog-slider">
                        <div class="blog-card" data-aos="fade-up" data-aos-duration="1200">
                            <div class="blog-image position-relative">
                                <a href="javascript:void(0)">
                                    <img src="/images/blog/blog_01.jpg" class="img-fluid" alt="blog">
                                </a>
                                <span>18 jul'23</span>
                            </div>
                            <div class="blog-content">
                                <a href="javascript:void(0)">Box Fundamental Methods</a>
                                <p class="content">Lorem Ipsum is simply dummy text of the printing and typesetting
                                    industry.</p>
                            </div>
                        </div>
                        <div class="blog-card" data-aos="fade-up" data-aos-duration="1600">
                            <div class="blog-image position-relative">
                                <a href="javascript:void(0)">
                                    <img src="/images/blog/blog_02.jpg" class="img-fluid" alt="blog">
                                </a>
                                <span>12 Mar'23</span>
                            </div>
                            <div class="blog-content">
                                <a href="javascript:void(0)">Strength Training Fundamentals</a>
                                <p class="content">Lorem Ipsum is simply dummy text of the printing and typesetting
                                    industry.</p>
                            </div>
                        </div>
                        <div class="blog-card" data-aos="fade-up" data-aos-duration="1800">
                            <div class="blog-image position-relative">
                                <a href="javascript:void(0)">
                                    <img src="/images/blog/blog_03.jpg" class="img-fluid" alt="blog">
                                </a>
                                <span>18 Jan'23</span>
                            </div>
                            <div class="blog-content">
                                <a href="javascript:void(0)">How to do Workout with gym</a>
                                <p class="content">Lorem Ipsum is simply dummy text of the printing and typesetting
                                    industry.</p>
                            </div>
                        </div>
                        <div class="blog-card" data-aos="fade-up" data-aos-duration="1200">
                            <div class="blog-image position-relative">
                                <a href="javascript:void(0)">
                                    <img src="/images/blog/blog_01.jpg" class="img-fluid" alt="blog">
                                </a>
                                <span>18 jul'23</span>
                            </div>
                            <div class="blog-content">
                                <a href="javascript:void(0)">Box Fundamental Methods</a>
                                <p class="content">Lorem Ipsum is simply dummy text of the printing and typesetting
                                    industry.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>

    <!-- Contact -->

    <section class="contact" id="contact">
        <div class="container">
            <div class="row justify-content-end">
                <div class="col-md-12 col-lg-8">
                    <div class="main-title-block">
                        <span class="text-white" data-aos="fade-up" data-aos-duration="900">Get in touch</span>
                        <h2 data-aos="fade-up" data-aos-duration="900">Join Today!</h2>
                        <img src="/images/white-arrow.png" data-aos="fade-right" data-aos-duration="1400" alt="arrow">
                    </div>
                    <form data-aos="fade-up" data-aos-duration="800">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <label>First Name</label>
                                <input type="text" placeholder="Enter first name">
                            </div>
                            <div class="col-md-6">
                                <label>Last Name</label>
                                <input type="text" placeholder="Enter last name">
                            </div>
                            <div class="col-md-6">
                                <label>Email</label>
                                <input type="email" placeholder="Enter email">
                            </div>
                            <div class="col-md-6">
                                <label>Phone</label>
                                <input type="text" placeholder="Enter phone">
                            </div>
                            <div class="col-md-12">
                                <label>Message</label>
                                <textarea placeholder="Write your message" rows="2"></textarea>
                            </div>
                        </div>
                        <a class="theme-btn text-decoration-none d-inline-flex align-items-center" href="/auth/login">
                            Join now
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 11.4713V0H0.526055V1.49626H9.44913L0 10.9426L1.05211 12L10.5112 2.54364V11.4713H12Z"
                                    fill="#F41E1E"></path>
                            </svg>
                        </a>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->

    <footer>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="footer-logo">
                        <a href="/" data-aos="fade-right" data-aos-duration="1200"><img
                                src="/images/logo/bodyfitlogo.png" alt="Body Fit" style="max-height:56px;width:auto;"></a>
                        <div class="footer-logo-title position-relative">
                            <h5 class="text-center text-lg-start" data-aos="fade-up" data-aos-duration="900">The
                                <span>secret</span> of getting ahead is getting
                                <span>started.</span>
                            </h5>
                            <img src="/images/footer-arrow.svg" data-aos="fade-right" data-aos-duration="1200"
                                alt="arrow">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row justify-content-between">
                <div class="col-md-12 col-lg-4">
                    <div class="footer-links" data-aos="fade-up" data-aos-duration="800">
                        <span>Contact us</span>
                        <a href="mailto:hello@bodyfit.com">hello@bodyfit.com</a>
                        <a href="tel:+1234567890">+123 456 7890</a>
                    </div>
                    <div class="footer-links" data-aos="fade-up" data-aos-duration="800">
                        <span>follow on</span>
                        <ul>
                            <li><a href="javascript:void(0)"><i class="fa-brands fa-facebook"></i></a></li>
                            <li><a href="javascript:void(0)"><i class="fa-brands fa-x-twitter"></i></a></li>
                            <li><a href="javascript:void(0)"><i class="fa-brands fa-instagram"></i></a></li>
                            <li><a href="javascript:void(0)"><i class="fa-brands fa-linkedin"></i></a></li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-12 col-lg-7">
                    <div class="row justify-content-end">
                        <div class="col-md-12 col-lg-5">
                            <div class="locations" data-aos="fade-up" data-aos-duration="800">
                                <span>Our location</span>
                                <div class="mb-3 mb-md-4 mb-lg-5" data-aos="fade-right" data-aos-duration="800">
                                    <h6>New York</h6>
                                    <p>45 Grand Ventral
                                        New York, NY 10017</p>
                                </div>
                                <div data-aos="fade-right" data-aos-duration="1200">
                                    <h6>Los Angeles</h6>
                                    <p>10 Port Hueneme
                                        Los Angeles, CA 10088</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12 col-lg-5">
                            <div class="hours" data-aos="fade-up" data-aos-duration="800">
                                <span>Working Hours</span>
                                <div class="mb-3 mb-md-4 mb-lg-5" data-aos="fade-right" data-aos-duration="1400">
                                    <h6>Monday - Friday</h6>
                                    <p>Our doors are open from 5 AM - 9 PM.</p>
                                </div>
                                <div data-aos="fade-right" data-aos-duration="1600">
                                    <h6>Weekends</h6>
                                    <p>Our doors are open from 7 AM - 9 PM.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <div class="copyright">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="copyright-content">
                        <p>©2024 Body Fit, All rights reserved.</p>
                        <ul>
                            <li><a href="javascript:void(0)">Privacy Policy</a></li>
                            <li><a href="javascript:void(0)">Terms & Conditions</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade video-modal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header d-none">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <iframe src="https://www.youtube.com/embed/yAoLSRbwxL8" title="Dummy Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen></iframe>
                </div>
                <div class="modal-footer d-none">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>`;

export default function LandingPage() {
  return (
    <>
      <GymAssetLoader />
      <LandingHtmlWithClientNav html={LANDING_HTML} />
    </>
  );
}

