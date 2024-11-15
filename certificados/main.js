class Slider {
    constructor(slider) {
        this.slider = slider;
        this.display = slider.querySelector(".image-display");
        this.navButtons = Array.from(slider.querySelectorAll(".nav-button"));
        this.prevButton = slider.querySelector(".prev-button");
        this.nextButton = slider.querySelector(".next-button");
        this.sliderNavigation = slider.querySelector(".slider-navigation");
        this.currentSlideIndex = 0;
        this.preloadedImages = {};
        this.certificates = [
            "certificados/Certificados/introdução_a_web.pdf",
            "certificados/Certificados/Iniciação_cientifica.pdf",
            "certificados/Certificados/Certificado_Técnico_em_eletrotecnica.pdf",
            "certificados/Certificados/SQL - Alura.pdf",
            "certificados/Certificados/Douglas Ramos Charqueiro - Formação Engenharia de software - Alura.pdf",
            "certificados/Certificados/Certificado_imerção_Dev_com_gemini.pdf"
        ];

        this.initialize();
    }

    initialize() {
        this.setupSlider();
        this.preloadImages();
        this.eventListeners();
        this.updateDownloadLink(); // Atualiza o link inicialmente
    }

    setupSlider() {
        this.showSlide(this.currentSlideIndex);
    }

    showSlide(index) {
        this.currentSlideIndex = index;
        const navButtonImg = this.navButtons[this.currentSlideIndex].querySelector("img");
        if (navButtonImg) {
            const imgClone = navButtonImg.cloneNode();
            this.display.replaceChildren(imgClone);
            this.updateDownloadLink(); // Atualiza o link ao trocar de slide
        }
        this.updateNavButtons();
    }

    updateNavButtons() {
        this.navButtons.forEach((button, buttonIndex) => {
            const isSelected = buttonIndex === this.currentSlideIndex;
            button.setAttribute("aria-selected", isSelected);
            if (isSelected) button.focus();
        });
    }

    preloadImages() {
        this.navButtons.forEach((button) => {
            const imgElement = button.querySelector("img");
            if (imgElement) {
                const imgSrc = imgElement.src;
                if (!this.preloadedImages[imgSrc]) {
                    this.preloadedImages[imgSrc] = new Image();
                    this.preloadedImages[imgSrc].src = imgSrc;
                }
            }
        });
    }

    createDownloadLink() {
        const downloadLink = document.createElement("a");
        downloadLink.id = "download-link";
        downloadLink.textContent = "Baixar Certificado";
        downloadLink.classList.add("download-button");
        document.body.appendChild(downloadLink);
        return downloadLink;
    }

    updateDownloadLink() {
        const downloadLink = document.getElementById("download-link") || this.createDownloadLink();
        downloadLink.href = this.certificates[this.currentSlideIndex];
        downloadLink.download = this.certificates[this.currentSlideIndex];
    }

    eventListeners() {
        document.addEventListener("keydown", (event) => {
            this.handleAction(event.key);
        });

        this.sliderNavigation.addEventListener("click", (event) => {
            const targetButton = event.target.closest(".nav-button");
            const index = targetButton ? this.navButtons.indexOf(targetButton) : -1;
            if (index !== -1) {
                this.showSlide(index);
            }
        });

        this.prevButton.addEventListener("click", () => this.handleAction("prev"));
        this.nextButton.addEventListener("click", () => this.handleAction("next"));
    }

    handleAction(action) {
        if (action === "Home") {
            this.currentSlideIndex = 0;
        } else if (action === "End") {
            this.currentSlideIndex = this.navButtons.length - 1;
        } else if (action === "ArrowRight" || action === "next") {
            this.currentSlideIndex = (this.currentSlideIndex + 1) % this.navButtons.length;
        } else if (action === "ArrowLeft" || action === "prev") {
            this.currentSlideIndex = (this.currentSlideIndex - 1 + this.navButtons.length) % this.navButtons.length;
        }

        this.showSlide(this.currentSlideIndex);
    }
}

const ImageSlider = new Slider(document.querySelector(".image-slider"));


