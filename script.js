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
                description.style.paddingBottom = "12px";
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


    // Intersection Observer for timeline animation
    const timeline = document.querySelector(".about-horizontal-timeline-single");

    if (timeline) {
        const timelineItems = timeline.querySelectorAll(".timeline-item");

        // Store final widths and reset them
        timelineItems.forEach(item => {
            const targetWidth = item.getAttribute("data-width") || item.style.width;
            item.setAttribute("data-width", targetWidth);
            item.style.width = "0";
        });

        const timelineObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const timelineElement = entry.target;

                    // Sort visually (top → bottom, left → right)
                    const items = Array.from(timelineElement.querySelectorAll(".timeline-item"))
                        .sort((a, b) => {
                            const topA = parseFloat(a.style.top) || 0;
                            const topB = parseFloat(b.style.top) || 0;
                            const leftA = parseFloat(a.style.left) || 0;
                            const leftB = parseFloat(b.style.left) || 0;

                            if (topA !== topB) return topA - topB;
                            return leftA - leftB;
                        });

                    // Animate bars sequentially
                    items.forEach((item, index) => {
                        const targetWidth = item.getAttribute("data-width");

                        setTimeout(() => {
                            item.style.width = targetWidth;
                            item.querySelector(".timeline-item-content").classList.add("visible");
                        }, 250 * index);
                    });

                    // Show axis AFTER all bars
                    const totalDelay = items.length * 250 + 300;

                    setTimeout(() => {
                        timelineElement.classList.add("timeline-axis-visible");
                    }, totalDelay);

                    observer.unobserve(timelineElement);
                }
            });
        }, {
            root: null,
            threshold: 0.2
        });

        timelineObserver.observe(timeline);
    }
});
