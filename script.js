document.addEventListener("DOMContentLoaded", () => {
    // Toggle button functionality for expandable containers
    document.querySelectorAll(".toggle-button").forEach(button => {
        button.addEventListener("click", function () {
            const container = this.closest(".expandable-container"); // Get the closest container
            const description = container.querySelector(".description");

            if (description.classList.contains("expanded")) {
                // Collapse
                description.style.height = "0";
                description.style.paddingTop = "0";
                description.style.paddingBottom = "0";
                description.classList.remove("expanded");
                this.classList.remove("expanded"); // Rotate back the button
                this.textContent = "+"; // Change back to "+"
            } else {
                // Expand
                description.style.height = description.scrollHeight + "px"; // Set dynamic height
                description.style.paddingBottom = "20px";
                description.classList.add("expanded");
                this.classList.add("expanded"); // Rotate the button
                this.textContent = "-"; // Change to "-"
            }
        });
    });

    // Intersection Observer for animating linear progress bars
    const progressBars = document.querySelectorAll(".progress-fill");

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% of the element is visible
    };

    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute("data-width"); // Get the width from a data attribute
                progressBar.style.width = targetWidth; // Animate to the target width
                observer.unobserve(progressBar); // Stop observing after animation is triggered
            }
        });
    }, observerOptions);

    // Prepare progress bars for animation
    progressBars.forEach(bar => {
        bar.setAttribute("data-width", bar.style.width); // Store the target width in a data attribute
        bar.style.width = "0"; // Reset to 0 initially
        progressObserver.observe(bar);
    });

    // Intersection Observer for animating circular progress bars
    const circularProgressBars = document.querySelectorAll(".circle-fill");

    const circularObserverOptions = {
        root: null, // Use the viewport as the root
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% of the element is visible
    };

    const circularObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const percentage = circle.getAttribute("data-percentage");
                const radius = circle.getAttribute("r");
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (percentage / 100) * circumference;

                circle.style.strokeDashoffset = offset; // Animate the circular progress
                observer.unobserve(circle); // Stop observing after animation is triggered
            }
        });
    }, circularObserverOptions);

    // Initialize circular progress bars for animation
    circularProgressBars.forEach(bar => {
        const radius = bar.getAttribute("r");
        const circumference = 2 * Math.PI * radius;

        bar.style.strokeDasharray = `${circumference}`; // Set the stroke-dasharray
        bar.style.strokeDashoffset = `${circumference}`; // Initially hide the fill
        circularObserver.observe(bar);
    });
});
