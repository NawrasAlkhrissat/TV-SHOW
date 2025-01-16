document.addEventListener("DOMContentLoaded", function () {
    const boxes = document.querySelectorAll(".box");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add("show");
                    }, index * 300); 
                }
            });
        },
        { threshold: 0.3 } 
    );

    boxes.forEach((box) => {
        observer.observe(box);
    });
});