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
        floorAppear: 350,
        stand: 1200,
        greet: 700,
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
        return lerp(GUIDE.standStart, GUIDE.standEnd, 0.72);
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
        const floorEnd = GUIDE.floorEnd;
        const hover = time >= floorEnd ? Math.sin(time / 420) * 1.6 : 0;
        const landingMoment = getLandingMoment();
        const landingT = progress(time, landingMoment, landingMoment + 450);
        const landingDip = Math.sin(Math.PI * landingT) * 5;

        return {
            baseY,
            hover,
            landingDip,
            y: baseY + hover + landingDip
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

    function animateGuide(timestamp) {
        const t = timestamp - animationStartTime;

        if (siteGuide.classList.contains("hidden")) return;

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

            const standT = easeInOut(progress(t, GUIDE.standStart, GUIDE.standEnd));
            const landingPose = interpolatePose(climbingPoseA, climbingPoseB, 0.5);
            currentPose = interpolatePose(landingPose, welcomingPose, standT);

            const landingMoment = getLandingMoment();
            const rideBoardT = easeInOut(progress(t, landingMoment, landingMoment + 350));
            const platformMotion = getPlatformMotion(t);
            yOffset = (platformMotion.hover + platformMotion.landingDip) * rideBoardT;

            if (standT < 0.5) {
                squash = lerp(1, 0.94, standT / 0.5);
            } else {
                squash = lerp(0.94, 1, (standT - 0.5) / 0.5);
            }
        }

        drawStickman(currentPose, yOffset, squash);
        drawHoverPlatform(t);

        if (guideBubble && t > GUIDE.bubbleStart) {
            guideBubble.classList.add("visible");
        }

        requestAnimationFrame(animateGuide);
    }

    function startGuideAnimation(timestamp) {
        animationStartTime = timestamp;
        requestAnimationFrame(animateGuide);
    }

    requestAnimationFrame(startGuideAnimation);

    if (guideCloseButton) {
        guideCloseButton.addEventListener("click", function () {
            siteGuide.classList.add("hidden");
        });
    }
});
