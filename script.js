
document.addEventListener("DOMContentLoaded",()=>{
  const menu=document.querySelector(".menu");
  const links=document.querySelector(".navlinks");
  if(menu) menu.addEventListener("click",()=>links.classList.toggle("open"));
  links?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")));
  const page=document.body.dataset.page;
  document.querySelectorAll(".navlinks a").forEach(a=>{
    if(a.dataset.page===page) a.classList.add("active");
  });
});

/* =========================================================
   HERO CAROUSEL JAVASCRIPT
========================================================= */

(function () {

    const backgrounds =
        document.querySelectorAll(
            ".hero-bg-slide"
        );


    const texts =
        document.querySelectorAll(
            ".hero-text"
        );


    const dots =
        document.querySelectorAll(
            ".hero-dot"
        );


    const next =
        document.getElementById(
            "heroNext"
        );


    const previous =
        document.getElementById(
            "heroPrev"
        );


    let current = 0;

    let changing = false;


    /* =====================================================
       CHANGE SLIDE
    ====================================================== */

    function changeSlide(index) {

        if (changing)
            return;


        if (index === current)
            return;


        changing = true;


        const oldIndex =
            current;


        current = index;


        /* ================================================
           BACKGROUND
        ================================================= */

        backgrounds.forEach(
            item => {

                item.classList.remove(
                    "active",
                    "previous"
                );

            }
        );


        backgrounds[oldIndex]
            .classList.add(
                "previous"
            );


        backgrounds[current]
            .classList.add(
                "active"
            );


        /* ================================================
           TEXT
        ================================================= */

        texts.forEach(
            item => {

                item.classList.remove(
                    "active"
                );

            }
        );


        const newText =
            texts[current];


        /*
           Force CSS animation restart.
        */

        void newText.offsetWidth;


        newText.classList.add(
            "active"
        );


        /* ================================================
           DOT
        ================================================= */

        dots.forEach(
            dot => {

                dot.classList.remove(
                    "active"
                );

            }
        );


        dots[current]
            .classList.add(
                "active"
            );


        /*
           Animation is only 320ms.
        */

        setTimeout(
            () => {

                changing = false;

            },
            350
        );

    }


    /* =====================================================
       NEXT
    ====================================================== */

    function nextSlide() {

        const index =
            (current + 1)
            % backgrounds.length;

        changeSlide(index);

    }


    /* =====================================================
       PREVIOUS
    ====================================================== */

    function previousSlide() {

        const index =
            (
                current -
                1 +
                backgrounds.length
            )
            % backgrounds.length;

        changeSlide(index);

    }


    /* =====================================================
       ARROWS
    ====================================================== */

    next.addEventListener(
        "click",
        nextSlide
    );


    previous.addEventListener(
        "click",
        previousSlide
    );


    /* =====================================================
       DOTS
    ====================================================== */

    dots.forEach(
        (dot, index) => {

            dot.addEventListener(
                "click",
                function () {

                    changeSlide(index);

                }

            );

        }
    );


    /* =====================================================
       KEYBOARD
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "ArrowRight"
            ) {

                nextSlide();

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                previousSlide();

            }

        }
    );


    /* =====================================================
       AUTOMATIC SLIDE
    ====================================================== */

    let timer =
        setInterval(
            nextSlide,
            7000
        );


    const hero =
        document.querySelector(
            ".hero-carousel"
        );


    hero.addEventListener(
        "mouseenter",
        function () {

            clearInterval(timer);

        }
    );


    hero.addEventListener(
        "mouseleave",
        function () {

            timer =
                setInterval(
                    nextSlide,
                    7000
                );

        }
    );


})();