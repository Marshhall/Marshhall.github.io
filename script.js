document.addEventListener("DOMContentLoaded", () => {
    // Toggle button functionality for expandable containers
    document.querySelectorAll(".toggle-button").forEach(button => {
        button.addEventListener("click", function () {
            const container = this.closest(".expandable-container");
            const description = container.querySelector(".description");
            const additionalInfo = container.querySelector(".additional-info");

            if (description.classList.contains("expanded")) {
                // Collapse
                description.style.height = "0";
                description.style.paddingTop = "0";
                description.style.paddingBottom = "0";

                description.classList.remove("expanded");

                if (additionalInfo) {
                    additionalInfo.classList.remove("visible");
                }

                this.classList.remove("expanded");
                this.textContent = "+";
            } else {
                // Expand
                description.style.height = description.scrollHeight + "px";
                description.style.paddingBottom = "12px";

                description.classList.add("expanded");

                if (additionalInfo) {
                    additionalInfo.classList.add("visible");
                }

                this.classList.add("expanded");
                this.textContent = "-";
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


    function initAboutAtomScene() {
        const svg = document.getElementById("about-atom-scene-svg");
        if (!svg) return;

        const atomGroup = document.getElementById("about-atom-group");
        const orbitGroup = document.getElementById("about-atom-orbits");

        const electron1 = document.getElementById("about-electron-1");
        const electron2 = document.getElementById("about-electron-2");
        const electron3 = document.getElementById("about-electron-3");

        const orbit1 = document.getElementById("about-orbit-1");
        const orbit2 = document.getElementById("about-orbit-2");
        const orbit3 = document.getElementById("about-orbit-3");

        const nucleusMain = document.getElementById("about-nucleus-main");
        const nucleusWarmDot = document.querySelector(".about-nucleus-dot--warm");
        const nucleusCoolDot = document.querySelector(".about-nucleus-dot--cool");

        const stressLines = Array.from(
            document.querySelectorAll("#about-nucleus-stress line")
        );

        const crackGlow = document.getElementById("about-nucleus-crack-glow");
        const crackPath = document.getElementById("about-nucleus-crack");

        const head = document.getElementById("about-stick-head");

        const neckLine = document.getElementById("about-stick-neck");
        const torsoLine = document.getElementById("about-stick-torso");

        const leftUpperArm = document.getElementById("about-stick-left-upper-arm");
        const leftLowerArm = document.getElementById("about-stick-left-lower-arm");
        const rightUpperArm = document.getElementById("about-stick-right-upper-arm");
        const rightLowerArm = document.getElementById("about-stick-right-lower-arm");

        const leftUpperLeg = document.getElementById("about-stick-left-upper-leg");
        const leftLowerLeg = document.getElementById("about-stick-left-lower-leg");
        const rightUpperLeg = document.getElementById("about-stick-right-upper-leg");
        const rightLowerLeg = document.getElementById("about-stick-right-lower-leg");

        const leftHand = document.getElementById("about-stick-left-hand");
        const rightHand = document.getElementById("about-stick-right-hand");
        const leftFoot = document.getElementById("about-stick-left-foot");
        const rightFoot = document.getElementById("about-stick-right-foot");

        /*
        Same proportions as the homepage stickman.
        The scene composition changes, but these body ratios are preserved.
        */
        const ABOUT_SVG = {
            width: 260,
            height: 210
        };

        const STICKMAN_SCALE = 0.82;

        const BODY = {
            headRadius: 0.062,
            neckLength: 0.01,
            torsoLength: 0.17,
            shoulderWidth: 0,
            upperArm: 0.105,
            lowerArm: 0.105,
            upperLeg: 0.125,
            lowerLeg: 0.125
        };

        /*
        Style adjustment:
        - smaller nucleus: nucleusR 13.5 instead of 17
        - larger orbits: orbitRx/orbitRy increased
        */
        const ATOM = {
            cx: 178,
            cy: 94,
            orbitRx: 62,
            orbitRy: 26,
            nucleusR: 13.5
        };

        function relativeLength(value, scale = STICKMAN_SCALE) {
            return value * ABOUT_SVG.height * scale;
        }

        function getBodyMeasurements(scale = STICKMAN_SCALE) {
            return {
                headRadius: relativeLength(BODY.headRadius, scale),
                neckLength: relativeLength(BODY.neckLength, scale),
                torsoLength: relativeLength(BODY.torsoLength, scale),
                shoulderWidth: relativeLength(BODY.shoulderWidth, scale),
                upperArm: relativeLength(BODY.upperArm, scale),
                lowerArm: relativeLength(BODY.lowerArm, scale),
                upperLeg: relativeLength(BODY.upperLeg, scale),
                lowerLeg: relativeLength(BODY.lowerLeg, scale)
            };
        }

        function clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }

        function add(a, b) {
            return {
                x: a.x + b.x,
                y: a.y + b.y
            };
        }

        function degreesToRadians(degrees) {
            return (degrees * Math.PI) / 180;
        }

        function vectorFromAngle(angleRadians, length) {
            return {
                x: Math.cos(angleRadians) * length,
                y: Math.sin(angleRadians) * length
            };
        }

        function setLine(element, a, b) {
            if (!element) return;

            element.setAttribute("x1", a.x);
            element.setAttribute("y1", a.y);
            element.setAttribute("x2", b.x);
            element.setAttribute("y2", b.y);
        }

        function setCircle(element, point) {
            if (!element) return;

            element.setAttribute("cx", point.x);
            element.setAttribute("cy", point.y);
        }

        function ellipsePoint(cx, cy, rx, ry, angle, rotationDegrees) {
            const xLocal = rx * Math.cos(angle);
            const yLocal = ry * Math.sin(angle);

            const rotation = degreesToRadians(rotationDegrees);
            const cos = Math.cos(rotation);
            const sin = Math.sin(rotation);

            return {
                x: cx + xLocal * cos - yLocal * sin,
                y: cy + xLocal * sin + yLocal * cos
            };
        }

        function createTorso({ hip, scale = STICKMAN_SCALE, lean = 0 }) {
            const m = getBodyMeasurements(scale);
            const leanRadians = degreesToRadians(lean);

            const chest = add(
                hip,
                vectorFromAngle(
                    -Math.PI / 2 + leanRadians,
                    m.torsoLength
                )
            );

            const neck = add(
                chest,
                vectorFromAngle(
                    -Math.PI / 2 + leanRadians,
                    m.neckLength
                )
            );

            const headCenter = add(
                neck,
                vectorFromAngle(
                    -Math.PI / 2 + leanRadians,
                    m.headRadius
                )
            );

            const shoulderAngle = leanRadians;
            const shoulderVector = vectorFromAngle(
                shoulderAngle,
                m.shoulderWidth / 2
            );

            return {
                head: headCenter,
                neck,
                chest,
                hip,
                leftShoulder: {
                    x: chest.x - shoulderVector.x,
                    y: chest.y - shoulderVector.y
                },
                rightShoulder: {
                    x: chest.x + shoulderVector.x,
                    y: chest.y + shoulderVector.y
                }
            };
        }

        function createBentLimb(start, end, upperLength, lowerLength, bend = 1) {
            const dx = end.x - start.x;
            const dy = end.y - start.y;

            const distance = Math.hypot(dx, dy) || 0.0001;
            const maxReach = upperLength + lowerLength - 0.001;
            const safeDistance = Math.min(distance, maxReach);

            const ux = dx / distance;
            const uy = dy / distance;

            const a =
                (
                    upperLength * upperLength -
                    lowerLength * lowerLength +
                    safeDistance * safeDistance
                ) /
                (2 * safeDistance);

            const hSquared = Math.max(upperLength * upperLength - a * a, 0);
            const h = Math.sqrt(hSquared);

            const mid = {
                x: start.x + ux * a,
                y: start.y + uy * a
            };

            const px = -uy;
            const py = ux;

            return {
                x: mid.x + px * h * bend,
                y: mid.y + py * h * bend
            };
        }

        function updateStaticAtomGeometry() {
            /*
            Keep the HTML flexible: even if the SVG file still has older orbit
            and nucleus sizes, JS updates them to the corrected proportions.
            */
            [orbit1, orbit2, orbit3].forEach((orbit) => {
                if (!orbit) return;

                orbit.setAttribute("cx", ATOM.cx);
                orbit.setAttribute("cy", ATOM.cy);
                orbit.setAttribute("rx", ATOM.orbitRx);
                orbit.setAttribute("ry", ATOM.orbitRy);
            });

            if (orbit2) {
                orbit2.setAttribute(
                    "transform",
                    `rotate(60 ${ATOM.cx} ${ATOM.cy})`
                );
            }

            if (orbit3) {
                orbit3.setAttribute(
                    "transform",
                    `rotate(-60 ${ATOM.cx} ${ATOM.cy})`
                );
            }

            if (nucleusMain) {
                nucleusMain.setAttribute("cx", ATOM.cx);
                nucleusMain.setAttribute("cy", ATOM.cy);
                nucleusMain.setAttribute("r", ATOM.nucleusR);
            }

            if (nucleusWarmDot) {
                nucleusWarmDot.setAttribute("cx", ATOM.cx - 9.5);
                nucleusWarmDot.setAttribute("cy", ATOM.cy + 5.5);
                nucleusWarmDot.setAttribute("r", 5.6);
            }

            if (nucleusCoolDot) {
                nucleusCoolDot.setAttribute("cx", ATOM.cx + 9.0);
                nucleusCoolDot.setAttribute("cy", ATOM.cy - 6.0);
                nucleusCoolDot.setAttribute("r", 5.6);
            }

            if (crackGlow) {
                crackGlow.setAttribute("cx", ATOM.cx);
                crackGlow.setAttribute("cy", ATOM.cy);
            }
        }

        function getCrackPath(cx, cy, r, strength) {
            /*
            Shorter continuous crack.
            The inset keeps it inside the nucleus boundary.
            */
            const s = 1 + 0.15 * strength;
            const inset = 1;

            return `
                M ${cx - 1.0 * s} ${cy - (r - inset)}
                L ${cx + 3.0 * s} ${cy - 5.8}
                L ${cx - 0.8 * s} ${cy - 0.7}
                L ${cx + 3.4 * s} ${cy + 4.5}
                L ${cx + 0.5 * s} ${cy + (r - inset)}
            `;
        }

        updateStaticAtomGeometry();

        function drawScene(time) {
            const m = getBodyMeasurements();

            const effort = (Math.sin(time / 430) + 1) / 2;
            const pull = Math.pow(effort, 1.7);
            const bodyBob = Math.sin(time / 260) * 0.85;
            const armTug = Math.sin(time / 150) * 0.9;

            const atomOffset = {
                x: 1.4 * pull,
                y: Math.sin(time / 180) * 0.65
            };

            if (atomGroup) {
                atomGroup.setAttribute(
                    "transform",
                    `translate(${atomOffset.x} ${atomOffset.y})`
                );
            }

            /*
            Electrons are calculated directly on the larger orbits.
            */
            setCircle(
                electron1,
                ellipsePoint(
                    ATOM.cx,
                    ATOM.cy,
                    ATOM.orbitRx,
                    ATOM.orbitRy,
                    time / 650,
                    0
                )
            );

            setCircle(
                electron2,
                ellipsePoint(
                    ATOM.cx,
                    ATOM.cy,
                    ATOM.orbitRx,
                    ATOM.orbitRy,
                    time / 780 + 1.8,
                    60
                )
            );

            setCircle(
                electron3,
                ellipsePoint(
                    ATOM.cx,
                    ATOM.cy,
                    ATOM.orbitRx,
                    ATOM.orbitRy,
                    time / 720 + 3.4,
                    -60
                )
            );

            /*
            Because the nucleus is smaller, the stickman needs to grip a little
            closer to the center while still grabbing the left boundary.
            */
            const hip = {
                x: 119 - 2.1 * pull,
                y: 150 + bodyBob
            };

            const torso = createTorso({
                hip,
                scale: STICKMAN_SCALE,
                lean: 24 + 3 * pull
            });

            const atomLeftEdge = {
                x: ATOM.cx - ATOM.nucleusR + atomOffset.x,
                y: ATOM.cy + atomOffset.y
            };

            const leftHandPoint = {
                x: atomLeftEdge.x + 1.0,
                y: atomLeftEdge.y - 6.0 + armTug
            };

            const rightHandPoint = {
                x: atomLeftEdge.x + 1.4,
                y: atomLeftEdge.y + 6.0 - armTug
            };

            const leftElbow = createBentLimb(
                torso.leftShoulder,
                leftHandPoint,
                m.upperArm,
                m.lowerArm,
                1
            );

            const rightElbow = createBentLimb(
                torso.rightShoulder,
                rightHandPoint,
                m.upperArm,
                m.lowerArm,
                -1
            );

            const leftFootPoint = {
                x: hip.x - 28,
                y: hip.y + 37
            };

            const rightFootPoint = {
                x: hip.x + 31,
                y: hip.y + 34
            };

            const leftKnee = createBentLimb(
                torso.hip,
                leftFootPoint,
                m.upperLeg,
                m.lowerLeg,
                -1
            );

            const rightKnee = createBentLimb(
                torso.hip,
                rightFootPoint,
                m.upperLeg,
                m.lowerLeg,
                1
            );

            if (head) {
                head.setAttribute("r", m.headRadius);
                setCircle(head, torso.head);
            }

            setLine(neckLine, torso.neck, torso.chest);
            setLine(torsoLine, torso.chest, torso.hip);

            setLine(leftUpperArm, torso.leftShoulder, leftElbow);
            setLine(leftLowerArm, leftElbow, leftHandPoint);

            setLine(rightUpperArm, torso.rightShoulder, rightElbow);
            setLine(rightLowerArm, rightElbow, rightHandPoint);

            setLine(leftUpperLeg, torso.hip, leftKnee);
            setLine(leftLowerLeg, leftKnee, leftFootPoint);

            setLine(rightUpperLeg, torso.hip, rightKnee);
            setLine(rightLowerLeg, rightKnee, rightFootPoint);

            setCircle(leftHand, leftHandPoint);
            setCircle(rightHand, rightHandPoint);
            setCircle(leftFoot, leftFootPoint);
            setCircle(rightFoot, rightFootPoint);

            const crackStrength = Math.pow(pull, 2.2);
            const flicker = 0.88 + 0.12 * Math.sin(time / 55);

            if (crackPath) {
                crackPath.setAttribute(
                    "d",
                    getCrackPath(
                        ATOM.cx,
                        ATOM.cy,
                        ATOM.nucleusR,
                        crackStrength
                    )
                );

                crackPath.style.opacity =
                    String(0.92 * crackStrength * flicker);
            }

            if (crackGlow) {
                /*
                The glow should be a thin halo around the smaller nucleus,
                not a filled disk. Otherwise it creates a pale/white-looking
                interior around the nucleus.
                */
                crackGlow.setAttribute("cx", ATOM.cx);
                crackGlow.setAttribute("cy", ATOM.cy);

                crackGlow.setAttribute(
                    "r",
                    String(ATOM.nucleusR + 0.8 + 3 * crackStrength)
                );

                crackGlow.setAttribute("fill", "none");
                crackGlow.setAttribute("stroke", "#ff7f7f");

                crackGlow.setAttribute(
                    "stroke-width",
                    String(4.0 + 1.2 * crackStrength)
                );

                crackGlow.style.opacity =
                    String(0.24 * crackStrength * flicker);
            }

            const stressBase = 0.16 + 0.45 * pull;

            stressLines.forEach((line, index) => {
                const extra = 0.10 * Math.sin(time / 90 + index * 0.9);
                line.style.opacity =
                    String(clamp(stressBase + extra, 0.08, 0.62));
            });
        }

        function animate(now) {
            drawScene(now);
            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }

    initAboutAtomScene();


    /* ========================= */
    /* Stickman guide animation  */
    /* ========================= */

    const siteGuide = document.getElementById("site-guide");
    if (!siteGuide) return;

    const ropeLine = document.getElementById("guide-rope-line");
    const ropeRing = document.getElementById("guide-rope-ring");
    const stickman = document.getElementById("guide-stickman");

    const floor = document.getElementById("guide-floor");
    const floorLine = document.getElementById("guide-floor-line");
    const floorGlow = document.getElementById("guide-floor-glow");

    /*
      Cone propulsors are created by JavaScript if they are missing from the HTML.

      This prevents the whole guide animation from breaking if your HTML still has
      the older board markup without:
        guide-left-propulsor
        guide-right-propulsor
        guide-left-propulsor-core
        guide-right-propulsor-core
    */
    const guideSvg = siteGuide.querySelector("svg");
    const SVG_NS = "http://www.w3.org/2000/svg";

    function ensureGuidePropulsionDefs() {
        if (!guideSvg) return;

        let defs = guideSvg.querySelector("defs");

        if (!defs) {
            defs = document.createElementNS(SVG_NS, "defs");
            guideSvg.insertBefore(defs, guideSvg.firstChild);
        }

        if (!document.getElementById("guide-thrust-outer-gradient")) {
            const outerGradient = document.createElementNS(SVG_NS, "linearGradient");
            outerGradient.setAttribute("id", "guide-thrust-outer-gradient");
            outerGradient.setAttribute("x1", "0");
            outerGradient.setAttribute("y1", "0");
            outerGradient.setAttribute("x2", "0");
            outerGradient.setAttribute("y2", "1");

            [
                ["0%", "#ff9f1c", "0.85"],
                ["55%", "#ff6b5f", "0.48"],
                ["100%", "#ff6b5f", "0"]
            ].forEach(([offset, color, opacity]) => {
                const stop = document.createElementNS(SVG_NS, "stop");
                stop.setAttribute("offset", offset);
                stop.setAttribute("stop-color", color);
                stop.setAttribute("stop-opacity", opacity);
                outerGradient.appendChild(stop);
            });

            defs.appendChild(outerGradient);
        }

        if (!document.getElementById("guide-thrust-core-gradient")) {
            const coreGradient = document.createElementNS(SVG_NS, "linearGradient");
            coreGradient.setAttribute("id", "guide-thrust-core-gradient");
            coreGradient.setAttribute("x1", "0");
            coreGradient.setAttribute("y1", "0");
            coreGradient.setAttribute("x2", "0");
            coreGradient.setAttribute("y2", "1");

            [
                ["0%", "#fef9c3", "0.75"],
                ["35%", "#ff6b5f", "0.95"],
                ["100%", "#d94f45", "0.12"]
            ].forEach(([offset, color, opacity]) => {
                const stop = document.createElementNS(SVG_NS, "stop");
                stop.setAttribute("offset", offset);
                stop.setAttribute("stop-color", color);
                stop.setAttribute("stop-opacity", opacity);
                coreGradient.appendChild(stop);
            });

            defs.appendChild(coreGradient);
        }

        if (!document.getElementById("guide-thrust-glow")) {
            const filter = document.createElementNS(SVG_NS, "filter");
            filter.setAttribute("id", "guide-thrust-glow");
            filter.setAttribute("x", "-80%");
            filter.setAttribute("y", "-80%");
            filter.setAttribute("width", "260%");
            filter.setAttribute("height", "260%");

            const blur = document.createElementNS(SVG_NS, "feGaussianBlur");
            blur.setAttribute("stdDeviation", "2.4");
            blur.setAttribute("result", "blur");

            const merge = document.createElementNS(SVG_NS, "feMerge");

            const blurNode = document.createElementNS(SVG_NS, "feMergeNode");
            blurNode.setAttribute("in", "blur");

            const sourceNode = document.createElementNS(SVG_NS, "feMergeNode");
            sourceNode.setAttribute("in", "SourceGraphic");

            merge.appendChild(blurNode);
            merge.appendChild(sourceNode);
            filter.appendChild(blur);
            filter.appendChild(merge);

            defs.appendChild(filter);
        }
    }

    function ensurePathElement(id, className) {
        let element = document.getElementById(id);

        /*
          If an older version used <ellipse> for this id, replace it with <path>.
          A cone flame needs a path because we animate the d attribute.
        */
        if (element && element.tagName.toLowerCase() !== "path") {
            element.remove();
            element = null;
        }

        if (!element) {
            element = document.createElementNS(SVG_NS, "path");
            element.setAttribute("id", id);
            element.setAttribute("class", className);
        }

        return element;
    }

    function ensureConePropulsors() {
        ensureGuidePropulsionDefs();

        const particlesGroup = document.getElementById("guide-floor-particles");

        let propulsorGroup = document.getElementById("guide-board-propulsors");

        if (!propulsorGroup) {
            propulsorGroup = document.createElementNS(SVG_NS, "g");
            propulsorGroup.setAttribute("id", "guide-board-propulsors");
            propulsorGroup.setAttribute("class", "guide-board-propulsors");

            if (particlesGroup) {
                floor.insertBefore(propulsorGroup, particlesGroup);
            } else {
                floor.appendChild(propulsorGroup);
            }
        }

        const leftOuter = ensurePathElement(
            "guide-left-propulsor",
            "guide-board-propulsor"
        );

        const rightOuter = ensurePathElement(
            "guide-right-propulsor",
            "guide-board-propulsor"
        );

        const leftCore = ensurePathElement(
            "guide-left-propulsor-core",
            "guide-board-propulsor-core"
        );

        const rightCore = ensurePathElement(
            "guide-right-propulsor-core",
            "guide-board-propulsor-core"
        );

        [leftOuter, rightOuter, leftCore, rightCore].forEach((path) => {
            if (!propulsorGroup.contains(path)) {
                propulsorGroup.appendChild(path);
            }
        });

        leftOuter.setAttribute("fill", "url(#guide-thrust-outer-gradient)");
        rightOuter.setAttribute("fill", "url(#guide-thrust-outer-gradient)");
        leftCore.setAttribute("fill", "url(#guide-thrust-core-gradient)");
        rightCore.setAttribute("fill", "url(#guide-thrust-core-gradient)");

        [leftOuter, rightOuter, leftCore, rightCore].forEach((path) => {
            path.setAttribute("filter", "url(#guide-thrust-glow)");
            path.style.opacity = "0";
        });

        return {
            leftOuter,
            rightOuter,
            leftCore,
            rightCore
        };
    }

    const conePropulsors = ensureConePropulsors();

    const leftPropulsor = conePropulsors.leftOuter;
    const rightPropulsor = conePropulsors.rightOuter;
    const leftPropulsorCore = conePropulsors.leftCore;
    const rightPropulsorCore = conePropulsors.rightCore;

    const floorParticles = [
        document.getElementById("guide-floor-particle-1"),
        document.getElementById("guide-floor-particle-2"),
        document.getElementById("guide-floor-particle-3"),
        document.getElementById("guide-floor-particle-4"),
        document.getElementById("guide-floor-particle-5"),
        document.getElementById("guide-floor-particle-6"),
        document.getElementById("guide-floor-particle-7"),
        document.getElementById("guide-floor-particle-8")
    ].filter(Boolean);

    const head = document.getElementById("guide-head");
    const neckBody = document.getElementById("guide-neck-body");
    const bodyHip = document.getElementById("guide-body-hip");
    const leftUpperArm = document.getElementById("guide-left-upper-arm");
    const leftLowerArm = document.getElementById("guide-left-lower-arm");
    const rightUpperArm = document.getElementById("guide-right-upper-arm");
    const rightLowerArm = document.getElementById("guide-right-lower-arm");
    const leftUpperLeg = document.getElementById("guide-left-upper-leg");
    const leftLowerLeg = document.getElementById("guide-left-lower-leg");
    const rightUpperLeg = document.getElementById("guide-right-upper-leg");
    const rightLowerLeg = document.getElementById("guide-right-lower-leg");
    const leftHand = document.getElementById("guide-left-hand");
    const rightHand = document.getElementById("guide-right-hand");
    const leftFoot = document.getElementById("guide-left-foot");
    const rightFoot = document.getElementById("guide-right-foot");

    const guideBubble = document.querySelector(".guide-bubble");
    const guideCloseButton = document.querySelector(".guide-close");

    const SVG = { width: 180, height: 260 };

    function point(x, y) { return { x: x * SVG.width, y: y * SVG.height }; }
    function nx(x) { return x * SVG.width; }
    function ny(y) { return y * SVG.height; }
    function relativeLength(value, scale = 1) { return value * SVG.height * scale; }

    const STICKMAN_SCALE = 0.82;

    const BODY = {
        headRadius: 0.062,
        neckLength: 0.01,
        torsoLength: 0.17,
        shoulderWidth: 0,
        upperArm: 0.105,
        lowerArm: 0.105,
        upperLeg: 0.125,
        lowerLeg: 0.125
    };

    const TIMING = {
        ropeFall: 1850,
        ropeSettle: 700,
        ropeClimbBlend: 500,
        climb: 3200,
        floorAppear: 850,
        stand: 1200,
        greet: 1400,
        pauseBeforeRopeRetract: 100,
        ropeRetract: 850,
        bubbleDelay: 150
    };

    function createTimeline(timing) {
        const timeline = {};

        timeline.ropeFallStart = 0;
        timeline.ropeFallEnd = timeline.ropeFallStart + timing.ropeFall;

        timeline.ropeSettleStart = timeline.ropeFallEnd;
        timeline.ropeSettleEnd = timeline.ropeSettleStart + timing.ropeSettle;

        timeline.ropeClimbBlendStart = timeline.ropeSettleEnd;
        timeline.ropeClimbBlendEnd = timeline.ropeClimbBlendStart + timing.ropeClimbBlend;

        timeline.climbStart = timeline.ropeClimbBlendEnd;
        timeline.climbEnd = timeline.climbStart + timing.climb;

        timeline.floorStart = timeline.climbEnd - timing.floorAppear;
        timeline.floorEnd = timeline.climbEnd;

        timeline.standStart = timeline.climbEnd;
        timeline.standEnd = timeline.standStart + timing.stand;

        timeline.greetStart = timeline.standEnd;
        timeline.greetEnd = timeline.greetStart + timing.greet;

        timeline.ropeRetractStart = timeline.greetEnd + timing.pauseBeforeRopeRetract;
        timeline.ropeRetractEnd = timeline.ropeRetractStart + timing.ropeRetract;
        timeline.bubbleStart = timeline.ropeRetractEnd + timing.bubbleDelay;

        return timeline;
    }

    const GUIDE = {
        ropeX: 0.5,
        ropeLength: 0.73,
        floorY: 0.88,
        ...createTimeline(TIMING)
    };

    function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
    function progress(time, start, end) { return clamp((time - start) / (end - start), 0, 1); }
    function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function easeInQuad(t) { return t * t; }
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function easeOutSoft(t) {return 1 - Math.pow(1 - t, 4);}
    function lerp(a, b, t) { return a + (b - a) * t; }
    function lerpPoint(a, b, t) { return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }; }
    function add(a, b) { return { x: a.x + b.x, y: a.y + b.y }; }
    function vectorFromAngle(angleRadians, length) { return { x: Math.cos(angleRadians) * length, y: Math.sin(angleRadians) * length }; }
    function degreesToRadians(degrees) { return (degrees * Math.PI) / 180; }

    function setLine(line, a, b) {
        line.setAttribute("x1", a.x);
        line.setAttribute("y1", a.y);
        line.setAttribute("x2", b.x);
        line.setAttribute("y2", b.y);
    }

    function setCircle(circle, p) {
        circle.setAttribute("cx", p.x);
        circle.setAttribute("cy", p.y);
    }

    function interpolatePose(a, b, t) {
        const result = {};
        Object.keys(a).forEach(key => {
            result[key] = lerpPoint(a[key], b[key], t);
        });
        return result;
    }

    function ropeSwingAngle(time) {
        const initialAngle = -0.42;
        const swingStart = GUIDE.ropeFallStart;
        const swingEnd = GUIDE.ropeClimbBlendEnd;
        const elapsed = Math.max(0, time - swingStart) / 1000;
        const u = progress(time, swingStart, swingEnd);
        const damping = 3.4;
        const decay = Math.exp(-damping * u);
        const frequency = 1.65;
        const oscillation = Math.cos(2 * Math.PI * frequency * elapsed);
        const fallVisibility = easeOutCubic(progress(time, GUIDE.ropeFallStart, GUIDE.ropeFallEnd));
        return initialAngle * decay * oscillation * fallVisibility;
    }

    function ropeClimbingSway(time) {
        return Math.sin(time / 260) * 0.010;
    }

    function getLandingMoment() {
        /*
          The board should dip when the stickman first becomes properly standing.
          This happens partway through the stand phase, not at the start and not
          as late as the greeting pose.
        */
        return lerp(GUIDE.standStart, GUIDE.standEnd, 0.32);
    }

    function getBodyMeasurements(scale = STICKMAN_SCALE) {
        return {
            headRadius: relativeLength(BODY.headRadius, scale),
            neckLength: relativeLength(BODY.neckLength, scale),
            torsoLength: relativeLength(BODY.torsoLength, scale),
            shoulderWidth: relativeLength(BODY.shoulderWidth, scale),
            upperArm: relativeLength(BODY.upperArm, scale),
            lowerArm: relativeLength(BODY.lowerArm, scale),
            upperLeg: relativeLength(BODY.upperLeg, scale),
            lowerLeg: relativeLength(BODY.lowerLeg, scale)
        };
    }

    function createTorso({ hip, scale = STICKMAN_SCALE, lean = 0 }) {
        const m = getBodyMeasurements(scale);
        const leanRadians = degreesToRadians(lean);

        const torsoVector = vectorFromAngle(-Math.PI / 2 + leanRadians, m.torsoLength);
        const chest = add(hip, torsoVector);

        const neckVector = vectorFromAngle(-Math.PI / 2 + leanRadians, m.neckLength);
        const neck = add(chest, neckVector);

        const head = add(neck, vectorFromAngle(-Math.PI / 2 + leanRadians, m.headRadius));

        const shoulderAngle = leanRadians;
        const shoulderVector = vectorFromAngle(shoulderAngle, m.shoulderWidth / 2);

        const leftShoulder = { x: chest.x - shoulderVector.x, y: chest.y - shoulderVector.y };
        const rightShoulder = { x: chest.x + shoulderVector.x, y: chest.y + shoulderVector.y };

        return { head, neck, chest, hip, leftShoulder, rightShoulder };
    }

    function createBentLimb(start, end, upperLength, lowerLength, bend = 1) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance === 0) return { x: start.x, y: start.y };

        const maxReach = upperLength + lowerLength - 0.001;
        const safeDistance = Math.min(distance, maxReach);
        const ux = dx / distance;
        const uy = dy / distance;

        const a = (upperLength * upperLength - lowerLength * lowerLength + safeDistance * safeDistance) / (2 * safeDistance);
        const hSquared = Math.max(upperLength * upperLength - a * a, 0);
        const h = Math.sqrt(hSquared);

        const mid = { x: start.x + ux * a, y: start.y + uy * a };
        const px = -uy;
        const py = ux;

        return { x: mid.x + px * h * bend, y: mid.y + py * h * bend };
    }

    function createTwoSegmentLimbFromAngles({ start, upperLength, lowerLength, upperAngle, lowerAngle }) {
        const joint = add(start, vectorFromAngle(degreesToRadians(upperAngle), upperLength));
        const end = add(joint, vectorFromAngle(degreesToRadians(lowerAngle), lowerLength));
        return { joint, end };
    }

    function offsetPose(pose, offsetX, offsetY) {
        const shiftedPose = {};
        Object.keys(pose).forEach(key => {
            shiftedPose[key] = { x: pose[key].x + offsetX, y: pose[key].y + offsetY };
        });
        return shiftedPose;
    }

    function alignPoseFeetToBoard(pose, footInset = 6) {
        /*
        Board center is ny(GUIDE.floorY).
        The board has stroke thickness, so the feet should touch slightly
        above the center line, not exactly at the center.
        */
        const targetFootY = ny(GUIDE.floorY) - footInset;

        const currentLowestFootY = Math.max(
            pose.leftFoot.y,
            pose.rightFoot.y
        );

        const correctionY = targetFootY - currentLowestFootY;

        return offsetPose(pose, 0, correctionY);
    }

    function createStandingPose({ hip, scale = STICKMAN_SCALE, lean = 0 }) {
        const m = getBodyMeasurements(scale);
        const torso = createTorso({ hip, scale, lean });

        const leftHandPoint = add(torso.leftShoulder, vectorFromAngle(degreesToRadians(130), m.upperArm + m.lowerArm));
        const rightHandPoint = add(torso.rightShoulder, vectorFromAngle(degreesToRadians(50), m.upperArm + m.lowerArm));

        const leftElbow = createBentLimb(torso.leftShoulder, leftHandPoint, m.upperArm, m.lowerArm, -1);
        const rightElbow = createBentLimb(torso.rightShoulder, rightHandPoint, m.upperArm, m.lowerArm, 1);

        const leftFootPoint = add(hip, vectorFromAngle(degreesToRadians(105), m.upperLeg + m.lowerLeg));
        const rightFootPoint = add(hip, vectorFromAngle(degreesToRadians(75), m.upperLeg + m.lowerLeg));

        const leftKnee = createBentLimb(hip, leftFootPoint, m.upperLeg, m.lowerLeg, -1);
        const rightKnee = createBentLimb(hip, rightFootPoint, m.upperLeg, m.lowerLeg, 1);

        return {
            head: torso.head,
            neck: torso.neck,
            chest: torso.chest,
            hip: torso.hip,
            leftShoulder: torso.leftShoulder,
            rightShoulder: torso.rightShoulder,
            leftElbow,
            leftHand: leftHandPoint,
            rightElbow,
            rightHand: rightHandPoint,
            leftKnee,
            leftFoot: leftFootPoint,
            rightKnee,
            rightFoot: rightFootPoint
        };
    }

    function createWelcomingPose({ hip, scale = STICKMAN_SCALE, lean = -2 }) {
        const m = getBodyMeasurements(scale);
        const torso = createTorso({ hip, scale, lean });

        const leftArm = createTwoSegmentLimbFromAngles({
            start: torso.leftShoulder,
            upperLength: m.upperArm,
            lowerLength: m.lowerArm,
            upperAngle: 120,
            lowerAngle: 70
        });

        const rightArm = createTwoSegmentLimbFromAngles({
            start: torso.rightShoulder,
            upperLength: m.upperArm,
            lowerLength: m.lowerArm,
            upperAngle: 10,
            lowerAngle: -85
        });

        const leftLeg = createTwoSegmentLimbFromAngles({
            start: torso.hip,
            upperLength: m.upperLeg,
            lowerLength: m.lowerLeg,
            upperAngle: 105,
            lowerAngle: 110
        });

        const rightLeg = createTwoSegmentLimbFromAngles({
            start: torso.hip,
            upperLength: m.upperLeg,
            lowerLength: m.lowerLeg,
            upperAngle: 75,
            lowerAngle: 70
        });

        return {
            head: torso.head,
            neck: torso.neck,
            chest: torso.chest,
            hip: torso.hip,
            leftShoulder: torso.leftShoulder,
            rightShoulder: torso.rightShoulder,
            leftElbow: leftArm.joint,
            leftHand: leftArm.end,
            rightElbow: rightArm.joint,
            rightHand: rightArm.end,
            leftKnee: leftLeg.joint,
            leftFoot: leftLeg.end,
            rightKnee: rightLeg.joint,
            rightFoot: rightLeg.end
        };
    }

    const flyingPose = (() => {
        const m = getBodyMeasurements(STICKMAN_SCALE);

        const torso = createTorso({
            hip: point(0.45, 0.66),
            scale: STICKMAN_SCALE,
            lean: -10
        });

        const frontArm = createTwoSegmentLimbFromAngles({
            start: torso.rightShoulder,
            upperLength: m.upperArm,
            lowerLength: m.lowerArm,
            upperAngle: 10,
            lowerAngle: -10
        });

        const backArm = createTwoSegmentLimbFromAngles({
            start: torso.leftShoulder,
            upperLength: m.upperArm,
            lowerLength: m.lowerArm,
            upperAngle: 120,
            lowerAngle: 180
        });

        const frontLeg = createTwoSegmentLimbFromAngles({
            start: torso.hip,
            upperLength: m.upperLeg,
            lowerLength: m.lowerLeg,
            upperAngle: 30,
            lowerAngle: 60
        });

        const backLeg = createTwoSegmentLimbFromAngles({
            start: torso.hip,
            upperLength: m.upperLeg,
            lowerLength: m.lowerLeg,
            upperAngle: 150,
            lowerAngle: 70
        });

        const rawPose = {
            head: torso.head,
            neck: torso.neck,
            chest: torso.chest,
            hip: torso.hip,
            leftShoulder: torso.leftShoulder,
            rightShoulder: torso.rightShoulder,

            leftElbow: backArm.joint,
            leftHand: backArm.end,

            rightElbow: frontArm.joint,
            rightHand: frontArm.end,

            leftKnee: backLeg.joint,
            leftFoot: backLeg.end,

            rightKnee: frontLeg.joint,
            rightFoot: frontLeg.end
        };

        return alignPoseFeetToBoard(rawPose, 6);
    })();

    function createClimbingPose({
        hip,
        ropeX,
        leftHandY,
        rightHandY,
        leftFoot,
        rightFoot,
        scale = STICKMAN_SCALE,
        lean = -7,
        leftArmBend = -1,
        rightArmBend = 1,
        leftLegBend = -1,
        rightLegBend = 1
    }) {
        const m = getBodyMeasurements(scale);
        const torso = createTorso({ hip, scale, lean });

        const leftHandPoint = point(ropeX, leftHandY);
        const rightHandPoint = point(ropeX, rightHandY);

        const leftElbow = createBentLimb(torso.leftShoulder, leftHandPoint, m.upperArm, m.lowerArm, leftArmBend);
        const rightElbow = createBentLimb(torso.rightShoulder, rightHandPoint, m.upperArm, m.lowerArm, rightArmBend);
        const leftKnee = createBentLimb(hip, leftFoot, m.upperLeg, m.lowerLeg, leftLegBend);
        const rightKnee = createBentLimb(hip, rightFoot, m.upperLeg, m.lowerLeg, rightLegBend);

        return {
            head: torso.head,
            neck: torso.neck,
            chest: torso.chest,
            hip: torso.hip,
            leftShoulder: torso.leftShoulder,
            rightShoulder: torso.rightShoulder,
            leftElbow,
            leftHand: leftHandPoint,
            rightElbow,
            rightHand: rightHandPoint,
            leftKnee,
            leftFoot,
            rightKnee,
            rightFoot
        };
    }

    const climbingPoseA = createClimbingPose({
        hip: point(0.61, 0.65),
        ropeX: GUIDE.ropeX,
        leftHandY: 0.34,
        rightHandY: 0.52,
        leftFoot: point(0.43, 0.80),
        rightFoot: point(0.78, 0.76),
        scale: STICKMAN_SCALE,
        lean: -8,
        leftArmBend: -1,
        rightArmBend: -1,
        leftLegBend: -1,
        rightLegBend: 1
    });

    const climbingPoseB = createClimbingPose({
        hip: point(0.59, 0.65),
        ropeX: GUIDE.ropeX,
        leftHandY: 0.42,
        rightHandY: 0.46,
        leftFoot: point(0.75, 0.78),
        rightFoot: point(0.42, 0.82),
        scale: STICKMAN_SCALE,
        lean: -5,
        leftArmBend: -1,
        rightArmBend: -1,
        leftLegBend: 1,
        rightLegBend: -1
    });

    const climbStartYOffset = -ny(0.23);
    const highClimbingPoseA = offsetPose(climbingPoseA, 0, climbStartYOffset);
    const highClimbingPoseB = offsetPose(climbingPoseB, 0, climbStartYOffset);

    const standingPose = createStandingPose({
        hip: point(0.5, 0.66),
        scale: STICKMAN_SCALE,
        lean: 0
    });

    const welcomingPose = createWelcomingPose({
        hip: point(0.5, 0.66),
        scale: STICKMAN_SCALE,
        lean: -2
    });

    function drawStickman(pose, yOffset, squash) {
        const hipForSquash = pose.hip;
        const transform = `
            translate(0 ${yOffset})
            translate(${hipForSquash.x} ${hipForSquash.y})
            scale(1 ${squash})
            translate(${-hipForSquash.x} ${-hipForSquash.y})
        `;

        stickman.setAttribute("transform", transform);

        setCircle(head, pose.head);
        setLine(neckBody, pose.neck, pose.chest);
        setLine(bodyHip, pose.chest, pose.hip);
        setLine(leftUpperArm, pose.leftShoulder, pose.leftElbow);
        setLine(leftLowerArm, pose.leftElbow, pose.leftHand);
        setLine(rightUpperArm, pose.rightShoulder, pose.rightElbow);
        setLine(rightLowerArm, pose.rightElbow, pose.rightHand);
        setLine(leftUpperLeg, pose.hip, pose.leftKnee);
        setLine(leftLowerLeg, pose.leftKnee, pose.leftFoot);
        setLine(rightUpperLeg, pose.hip, pose.rightKnee);
        setLine(rightLowerLeg, pose.rightKnee, pose.rightFoot);
        setCircle(leftHand, pose.leftHand);
        setCircle(rightHand, pose.rightHand);
        setCircle(leftFoot, pose.leftFoot);
        setCircle(rightFoot, pose.rightFoot);

        head.setAttribute("r", getBodyMeasurements(STICKMAN_SCALE).headRadius);
    }

    function drawRope(length, time) {
        const anchorX = nx(GUIDE.ropeX);
        const anchorY = 0;
        const retractT = progress(time, GUIDE.ropeRetractStart, GUIDE.ropeRetractEnd);

        let angle = 0;

        if (time < GUIDE.ropeClimbBlendStart) {
            angle = ropeSwingAngle(time);
        } else if (time < GUIDE.ropeClimbBlendEnd) {
            const blendT = easeInOut(progress(time, GUIDE.ropeClimbBlendStart, GUIDE.ropeClimbBlendEnd));
            const settlingAngle = ropeSwingAngle(time);
            const climbingAngle = ropeClimbingSway(time);
            angle = lerp(settlingAngle, climbingAngle, blendT);
        } else if (time < GUIDE.ropeRetractStart) {
            angle = ropeClimbingSway(time);
        } else {
            angle = ropeClimbingSway(time) * (1 - retractT);
        }

        const endX = anchorX + length * Math.sin(angle);
        const endY = anchorY + length * Math.cos(angle);

        const dx = endX - anchorX;
        const dy = endY - anchorY;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const ux = dx / distance;
        const uy = dy / distance;
        const px = -uy;
        const py = ux;

        let bowStrength = 0;

        if (time < GUIDE.ropeClimbBlendStart) {
            const u = progress(time, GUIDE.ropeFallStart, GUIDE.ropeClimbBlendStart);
            bowStrength = relativeLength(0.026, STICKMAN_SCALE) * Math.sin(Math.PI * u) * Math.exp(-1.2 * u);
        } else if (time < GUIDE.ropeClimbBlendEnd) {
            const blendT = easeInOut(progress(time, GUIDE.ropeClimbBlendStart, GUIDE.ropeClimbBlendEnd));
            const settlingU = progress(time, GUIDE.ropeFallStart, GUIDE.ropeClimbBlendEnd);
            const settlingBow = relativeLength(0.026, STICKMAN_SCALE) * Math.sin(Math.PI * settlingU) * Math.exp(-1.2 * settlingU);
            const climbingBow = relativeLength(0.004, STICKMAN_SCALE) * Math.sin(time / 180);
            bowStrength = lerp(settlingBow, climbingBow, blendT);
        } else {
            bowStrength = relativeLength(0.004, STICKMAN_SCALE) * Math.sin(time / 180);
        }

        const bowSign = angle >= 0 ? 1 : -1;
        const bow = bowStrength * bowSign;

        const c1 = { x: anchorX + dx * 0.33 + px * bow, y: anchorY + dy * 0.33 + py * bow };
        const c2 = { x: anchorX + dx * 0.70 - px * bow * 0.55, y: anchorY + dy * 0.70 - py * bow * 0.55 };

        const d = `
            M ${anchorX} ${anchorY}
            C ${c1.x} ${c1.y},
              ${c2.x} ${c2.y},
              ${endX} ${endY}
        `;

        ropeLine.setAttribute("d", d);
        ropeRing.setAttribute("cx", endX);
        ropeRing.setAttribute("cy", endY);
    }

    function getPlatformMotion(time) {
        const baseY = ny(GUIDE.floorY);

        const landingMoment = getLandingMoment();

        /*
        The board should stay visually stable before the stickman's feet touch it.
        So hover starts only after the landing dip has mostly finished.
        */
        const landingDipDuration = 360;
        const hoverStart = landingMoment + landingDipDuration;

        const landingT = progress(
            time,
            landingMoment,
            landingMoment + landingDipDuration
        );

        const landingDip =
            Math.sin(Math.PI * landingT) * 3.5;

        const hoverFadeT = easeOutCubic(
            progress(time, hoverStart, hoverStart + 500)
        );

        const hover =
            Math.sin(time / 420) * 1.6 * hoverFadeT;

        return {
            baseY,
            hover,
            landingDip,
            y: baseY + landingDip + hover
        };
    }

    function conePath(cx, topY, halfWidth, length) {
        const tipY = topY + length;

        return `
            M ${cx - halfWidth} ${topY}
            C ${cx - halfWidth * 0.75} ${topY + length * 0.30},
            ${cx - halfWidth * 0.25} ${topY + length * 0.75},
            ${cx} ${tipY}

            C ${cx + halfWidth * 0.25} ${topY + length * 0.75},
            ${cx + halfWidth * 0.75} ${topY + length * 0.30},
            ${cx + halfWidth} ${topY}

            Q ${cx} ${topY + 2},
            ${cx - halfWidth} ${topY}
            Z
        `;
    }

    function drawHoverPlatform(time) {
        const floorStart = GUIDE.floorStart;
        const floorEnd = GUIDE.floorEnd;
        const platformCenterX = nx(0.5);
        const fullHalfWidth = nx(0.21);
        const appearT = easeOutCubic(progress(time, floorStart, floorEnd));
        const platformMotion = getPlatformMotion(time);
        const y = platformMotion.y;

        const halfWidth = fullHalfWidth * appearT;
        const boardLeftX = platformCenterX - halfWidth;
        const boardRightX = platformCenterX + halfWidth;

        floor.style.opacity = appearT;

        floorLine.setAttribute("x1", boardLeftX);
        floorLine.setAttribute("x2", boardRightX);
        floorLine.setAttribute("y1", y);
        floorLine.setAttribute("y2", y);

        floorGlow.setAttribute("x1", boardLeftX);
        floorGlow.setAttribute("x2", boardRightX);
        floorGlow.setAttribute("y1", y);
        floorGlow.setAttribute("y2", y);

        const glowPulse = Math.sin(Math.PI * appearT) * 0.45;
        floorGlow.style.opacity = 0.16 + glowPulse;

        const landingMoment = getLandingMoment();
        const preLandingT = easeInOut(progress(time, landingMoment - 700, landingMoment));
        const thrustFadeT = easeInOut(progress(time, landingMoment + 6000, landingMoment + 12000));
        const idleThrust = 0.48;
        const sustainedThrust = preLandingT * lerp(1, idleThrust, thrustFadeT);

        const propulsorAppearT = easeOutCubic(progress(time, floorStart + 120, floorEnd + 150));
        const propulsorOffsetX = fullHalfWidth * 0.48;
        const leftPropulsorX = platformCenterX - propulsorOffsetX;
        const rightPropulsorX = platformCenterX + propulsorOffsetX;
        const propulsorTopY = y + 4;

        const flicker = 1 + Math.sin(time / 85) * 0.06 + Math.sin(time / 47) * 0.035;

        const coneHalfWidth = 5.2;
        const coneLength = (12 + sustainedThrust * 5.0) * flicker;

        const coreHalfWidth = 1.8;
        const coreLength = (9 + sustainedThrust * 3.8) * flicker;

        leftPropulsor.setAttribute(
            "d",
            conePath(leftPropulsorX, propulsorTopY, coneHalfWidth, coneLength)
        );

        rightPropulsor.setAttribute(
            "d",
            conePath(rightPropulsorX, propulsorTopY, coneHalfWidth, coneLength)
        );

        leftPropulsorCore.setAttribute(
            "d",
            conePath(leftPropulsorX, propulsorTopY + 1.2, coreHalfWidth, coreLength)
        );

        rightPropulsorCore.setAttribute(
            "d",
            conePath(rightPropulsorX, propulsorTopY + 1.2, coreHalfWidth, coreLength)
        );
        const flameOpacity =
            propulsorAppearT *
            lerp(0.42, 0.72, sustainedThrust);

        const coreOpacity =
            propulsorAppearT *
            lerp(0.55, 0.98, sustainedThrust);

        leftPropulsor.style.opacity = flameOpacity;
        rightPropulsor.style.opacity = flameOpacity;
        leftPropulsorCore.style.opacity = coreOpacity;
        rightPropulsorCore.style.opacity = coreOpacity;

        drawPlatformParticles({
            time,
            leftEmitter: { x: leftPropulsorX, y: propulsorTopY + coneLength },
            rightEmitter: { x: rightPropulsorX, y: propulsorTopY + coneLength },
            platformVisible: appearT
        });
    }

    function drawPlatformParticles({ time, leftEmitter, rightEmitter, platformVisible }) {
        const landingMoment = getLandingMoment();
        const preLandingT = easeInOut(progress(time, landingMoment - 700, landingMoment));
        const thrustFadeT = easeInOut(progress(time, landingMoment + 6000, landingMoment + 12000));
        const idleThrust = 0.48;
        const sustainedThrust = preLandingT * lerp(1, idleThrust, thrustFadeT);
        const engineStrength = Math.min(1, platformVisible * 3);
        const idleBase = 0.68;
        const idleIntensity = engineStrength * lerp(0.16, idleBase, preLandingT);
        const extraParticleIntensity = engineStrength * sustainedThrust * 0.75;

        floorParticles.forEach((particle, index) => {
            const isExtraParticle = index >= 4;
            const emitter = index % 2 === 0 ? leftEmitter : rightEmitter;
            const side = index % 2 === 0 ? -1 : 1;
            const speed = isExtraParticle ? 420 : 650;
            const phase = (time / speed + index * 0.19) % 1;
            const wiggle = Math.sin(time / 180 + index * 1.7) * 2.2;
            const drift = side * phase * 2.5;
            const particleX = emitter.x + wiggle + drift;
            const travelDistance = isExtraParticle ? 30 : 22;
            const particleY = emitter.y + 4 + phase * travelDistance;
            const fade = Math.sin(Math.PI * phase);

            const opacity = isExtraParticle
                ? fade * extraParticleIntensity
                : fade * idleIntensity;

            particle.setAttribute("cx", particleX);
            particle.setAttribute("cy", particleY);
            particle.setAttribute("r", "1.7");
            particle.style.opacity = opacity;
        });
    }

    const CLIMB_CYCLES = 3;
    let animationStartTime = null;

    let guideCanFlyAway = false;
    let guideHasFlownAway = false;
    let guideDismissRequested = false;

    function getGuideScrollTrigger() {
        return Math.max(60, window.innerHeight * 0.08);
    }

    function flyGuideToNavbar() {
        if (guideHasFlownAway) return;

        guideHasFlownAway = true;

        ropeLine.style.opacity = "0";
        ropeRing.style.opacity = "0";

        const startRect = siteGuide.getBoundingClientRect();

        const startX = startRect.left;
        const startY = startRect.top;

        const endX = window.innerWidth + 80;
        const endY = -startRect.height - 120;

        const controlX = startX + window.innerWidth * 0.22;
        const controlY = startY - window.innerHeight * 0.35;

        const poseTransitionDuration = 900;
        const flightDuration = 2100;

        const takeoffStartTime = performance.now();

        const guideTimeAtTakeoff =
            performance.now() - animationStartTime;

        const takeoffRotation = -5;
        const flightRotation = -14;

        siteGuide.style.pointerEvents = "none";
        siteGuide.style.willChange = "transform, opacity";
        siteGuide.style.opacity = "1";

        function quadraticBezier(a, b, c, t) {
            return (
                (1 - t) * (1 - t) * a +
                2 * (1 - t) * t * b +
                t * t * c
            );
        }

        function animateTakeoffPose(now) {
            const rawPoseT = Math.min(
                (now - takeoffStartTime) / poseTransitionDuration,
                1
            );

            const poseT = easeInOut(rawPoseT);

            /*
            Use one continuous animation clock.
            This prevents a visual jump between takeoff and flight.
            */
            const guideTime =
                guideTimeAtTakeoff + (now - takeoffStartTime);

            drawHoverPlatform(guideTime);

            const platformMotion = getPlatformMotion(guideTime);

            const pose = interpolatePose(
                welcomingPose,
                flyingPose,
                poseT
            );

            drawStickman(
                pose,
                platformMotion.hover + platformMotion.landingDip,
                1
            );

            const rotation =
                takeoffRotation * poseT;

            /*
            Important:
            Use the same transform structure as the flight phase.
            This avoids a jump when flight begins.
            */
            siteGuide.style.transform =
                `translate(0px, 0px) rotate(${rotation}deg) scale(1)`;

            if (rawPoseT < 1) {
                requestAnimationFrame(animateTakeoffPose);
            } else {
                startFlight(now);
            }
        }

        function startFlight(flightStartTime) {
            function animateFlight(now) {
                const rawT = Math.min(
                    (now - flightStartTime) / flightDuration,
                    1
                );

                const t = easeInOut(rawT);

                const x = quadraticBezier(startX, controlX, endX, t);
                const y = quadraticBezier(startY, controlY, endY, t);

                const deltaX = x - startX;
                const deltaY = y - startY;

                /*
                Same continuous guide clock as the takeoff phase.
                No guideTime jump.
                */
                const guideTime =
                    guideTimeAtTakeoff + (now - takeoffStartTime);

                drawHoverPlatform(guideTime);

                const platformMotion = getPlatformMotion(guideTime);

                drawStickman(
                    flyingPose,
                    platformMotion.hover + platformMotion.landingDip,
                    1
                );

                /*
                Start from the exact takeoff rotation.
                Do not jump from -5deg to -14deg instantly.
                */
                const rotationBase =
                    lerp(takeoffRotation, flightRotation, easeOutCubic(rawT));

                const flightTilt =
                    -4 * Math.sin(Math.PI * t);

                const rotation =
                    rotationBase + flightTilt;

                const scale =
                    1 - 0.08 * t;

                const fadeT =
                    Math.max(0, (rawT - 0.78) / 0.22);

                const opacity =
                    1 - fadeT;

                siteGuide.style.transform =
                    `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg) scale(${scale})`;

                siteGuide.style.opacity = opacity;

                if (rawT < 1) {
                    requestAnimationFrame(animateFlight);
                } else {
                    siteGuide.classList.add("hidden");
                }
            }

            requestAnimationFrame(animateFlight);
        }

        requestAnimationFrame(animateTakeoffPose);
    }


    function handleGuideScrollAway() {
        if (guideHasFlownAway) return;

        if (window.scrollY <= getGuideScrollTrigger()) return;

        /*
        If the user scrolls before the entrance/landing is finished,
        remember the request, but do not interrupt the rope animation yet.
        */
        if (!guideCanFlyAway) {
            guideDismissRequested = true;
            return;
        }

        flyGuideToNavbar();
    }

    function applyRightArmWave(pose, time) {
        /*
        Wave only after the stickman has reached the welcoming phase.
        This prevents the arm from waving while climbing or landing.
        */
        const waveStart = GUIDE.greetStart + 250;
        const waveEnd = GUIDE.greetEnd + 2500;

        const waveVisibility = Math.sin(
            Math.PI * progress(time, waveStart, waveEnd)
        );

        if (waveVisibility <= 0) {
            return pose;
        }

        const wave = Math.sin(time / 160) * waveVisibility;

        /*
        Copy the pose so we do not mutate the original pose object.
        */
        const wavedPose = {
            ...pose,
            rightElbow: { ...pose.rightElbow },
            rightHand: { ...pose.rightHand }
        };

        /*
        Keep the shoulder fixed, then wiggle only the lower part of the arm.
        Small values are best; otherwise it looks chaotic.
        */
        wavedPose.rightElbow.x += wave * 2.0;
        wavedPose.rightElbow.y += wave * 1.0;

        wavedPose.rightHand.x += wave * 5.5;
        wavedPose.rightHand.y += Math.abs(wave) * 2.2;

        return wavedPose;
    }

    window.addEventListener("scroll", handleGuideScrollAway, {
        passive: true
    });

    function animateGuide(timestamp) {
        const t = timestamp - animationStartTime;

        if (siteGuide.classList.contains("hidden")) return;

        if (guideHasFlownAway) return;

        const fullRopeLength = ny(GUIDE.ropeLength);
        let currentRopeLength = 0;

        if (t < GUIDE.ropeFallEnd) {
            const rawFallT = progress(t, GUIDE.ropeFallStart, GUIDE.ropeFallEnd);
            const fallT = easeInQuad(rawFallT);
            currentRopeLength = fullRopeLength * fallT;
        } else if (t < GUIDE.ropeRetractStart) {
            currentRopeLength = fullRopeLength;
        } else {
            const retractT = easeInOut(progress(t, GUIDE.ropeRetractStart, GUIDE.ropeRetractEnd));
            currentRopeLength = fullRopeLength * (1 - retractT);
        }

        drawRope(currentRopeLength, t);
        ropeRing.style.opacity = currentRopeLength > 10 && t < GUIDE.ropeRetractEnd ? "1" : "0";

        let currentPose = climbingPoseA;
        let yOffset = -ny(0.56);
        let squash = 1;

        if (t < GUIDE.climbStart) {
            stickman.style.opacity = "0";
        }

        if (t >= GUIDE.climbStart && t < GUIDE.climbEnd) {
            stickman.style.opacity = "1";

            const climbT = easeInOut(progress(t, GUIDE.climbStart, GUIDE.climbEnd));
            yOffset = lerp(-ny(0.56), 0, climbT);

            const cycle = (Math.sin(climbT * Math.PI * 2 * CLIMB_CYCLES) + 1) / 2;
            const highClimbingPose = interpolatePose(highClimbingPoseA, highClimbingPoseB, cycle);
            const normalClimbingPose = interpolatePose(climbingPoseA, climbingPoseB, cycle);
            const descendT = easeInOut(climbT);

            currentPose = interpolatePose(highClimbingPose, normalClimbingPose, descendT);
        }

        if (t >= GUIDE.standStart) {
            stickman.style.opacity = "1";

            const landingPose = interpolatePose(climbingPoseA, climbingPoseB, 0.5);
            const feetTouchT = 0.55;

            if (t < GUIDE.standEnd) {
                const rawStandT = progress(t, GUIDE.standStart, GUIDE.standEnd);

                if (rawStandT < feetTouchT) {
                    const settleT = easeInOut(rawStandT / feetTouchT);
                    currentPose = interpolatePose(landingPose, standingPose, settleT);
                } else {
                    currentPose = standingPose;
                }
            } else {
                const welcomeT = easeInOut(
                    progress(t, GUIDE.greetStart, GUIDE.greetEnd)
                );

                currentPose = interpolatePose(standingPose, welcomingPose, welcomeT);
            }

            const landingMoment = getLandingMoment();
            const platformMotion = getPlatformMotion(t);

            const rideBoardT = t >= landingMoment ? 1 : 0;

            yOffset = (platformMotion.hover + platformMotion.landingDip) * rideBoardT;
            const impactT = progress(t, landingMoment, landingMoment + 360);

            if (impactT < 0.5) {
                squash = lerp(1, 0.94, impactT / 0.5);
            } else {
                squash = lerp(0.94, 1, (impactT - 0.5) / 0.5);
            }
        }

        currentPose = applyRightArmWave(currentPose, t);

        drawStickman(currentPose, yOffset, squash);
        drawHoverPlatform(t);

        if (t > GUIDE.standEnd) {
            guideCanFlyAway = true;

            if (guideDismissRequested || window.scrollY > getGuideScrollTrigger()) {
                flyGuideToNavbar();
                return;
            }
        }

        if (guideBubble && t > GUIDE.bubbleStart) {
            guideBubble.classList.add("visible");
        }

        requestAnimationFrame(animateGuide);
    }

    function startGuideAnimation(timestamp) {
        animationStartTime = timestamp;
        requestAnimationFrame(animateGuide);
    }

    if (window.scrollY > getGuideScrollTrigger()) {
        guideHasFlownAway = true;
        siteGuide.classList.add("hidden");
        siteGuide.style.opacity = "0";
        siteGuide.style.pointerEvents = "none";
        return;
    }

    requestAnimationFrame(startGuideAnimation);

    if (guideCloseButton) {
        guideCloseButton.addEventListener("click", function () {
            siteGuide.classList.add("hidden");
        });
    }
});
