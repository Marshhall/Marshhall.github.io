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

    const ropeLine = document.getElementById("guide-rope-line");
    const ropeRing = document.getElementById("guide-rope-ring");
    const stickman = document.getElementById("guide-stickman");
    const floorLine = document.getElementById("guide-floor-line");

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

    /* ========================= */
    /* SVG coordinate system     */
    /* ========================= */

    /*
    The SVG has viewBox="0 0 180 260".

    But below, most positions are written in normalized coordinates.

    x = 0 means left edge of SVG
    x = 1 means right edge of SVG

    y = 0 means top edge of SVG
    y = 1 means bottom edge of SVG

    So point(0.5, 0.5) is the center of the SVG.
    */

    const SVG = {
        width: 180,
        height: 260
    };

    function point(x, y) {
        return {
            x: x * SVG.width,
            y: y * SVG.height
        };
    }

    function nx(x) {
        return x * SVG.width;
    }

    function ny(y) {
        return y * SVG.height;
    }

    function relativeLength(value, scale = 1) {
        return value * SVG.height * scale;
    }

    /* ========================= */
    /* Body proportions          */
    /* ========================= */

    /*
    These values define the stickman proportions.

    They are relative to the SVG height, not raw pixels.

    To make the stickman bigger or smaller inside the SVG,
    change STICKMAN_SCALE below.
    */

    const STICKMAN_SCALE = 0.82;

    const BODY = {
        headRadius: 0.062,
        neckLength: 0.035,
        torsoLength: 0.17,
        shoulderWidth: 0,

        upperArm: 0.105,
        lowerArm: 0.105,

        upperLeg: 0.125,
        lowerLeg: 0.125
    };

    /* ========================= */
    /* Animation settings        */
    /* ========================= */

    const TIMING = {
        ropeFall: 700,
        climb: 3700,
        floorAppear: 350,
        stand: 600,
        pauseBeforeRopeRetract: 100,
        ropeRetract: 850,
        bubbleDelay: 150
    };

    function createTimeline(timing) {
        const timeline = {};

        timeline.ropeFallStart = 0;
        timeline.ropeFallEnd = timeline.ropeFallStart + timing.ropeFall;

        timeline.climbStart = timeline.ropeFallEnd;
        timeline.climbEnd = timeline.climbStart + timing.climb;

        timeline.floorStart = timeline.climbEnd - timing.floorAppear;
        timeline.floorEnd = timeline.floorStart + timing.floorAppear;

        timeline.standStart = timeline.climbEnd;
        timeline.standEnd = timeline.standStart + timing.stand;

        timeline.ropeRetractStart =
            timeline.standEnd + timing.pauseBeforeRopeRetract;

        timeline.ropeRetractEnd =
            timeline.ropeRetractStart + timing.ropeRetract;

        timeline.bubbleStart =
            timeline.ropeRetractEnd + timing.bubbleDelay;

        return timeline;
    }

    const GUIDE = {
        ropeX: 0.5,
        ropeLength: 0.73,
        floorY: 0.88,
        ...createTimeline(TIMING)
    };


    /* ========================= */
    /* Utility functions         */
    /* ========================= */

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function progress(time, start, end) {
        return clamp((time - start) / (end - start), 0, 1);
    }

    function easeInOut(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function lerpPoint(a, b, t) {
        return {
            x: lerp(a.x, b.x, t),
            y: lerp(a.y, b.y, t)
        };
    }

    function add(a, b) {
        return {
            x: a.x + b.x,
            y: a.y + b.y
        };
    }

    function vectorFromAngle(angleRadians, length) {
        return {
            x: Math.cos(angleRadians) * length,
            y: Math.sin(angleRadians) * length
        };
    }

    function degreesToRadians(degrees) {
        return (degrees * Math.PI) / 180;
    }

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

        Object.keys(a).forEach((key) => {
            result[key] = lerpPoint(a[key], b[key], t);
        });

        return result;
    }

    /* ========================= */
    /* Body-building helpers     */
    /* ========================= */

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

    /*
    This creates the stable torso geometry from only:
    - hip position
    - scale
    - lean

    Lean is in degrees.
    Positive lean moves the upper body to the right.
    Negative lean moves it to the left.
    */

    function createTorso({ hip, scale = STICKMAN_SCALE, lean = 0 }) {
        const m = getBodyMeasurements(scale);

        const leanRadians = degreesToRadians(lean);

        const torsoVector = vectorFromAngle(
            -Math.PI / 2 + leanRadians,
            m.torsoLength
        );

        const chest = add(hip, torsoVector);

        const neckVector = vectorFromAngle(
            -Math.PI / 2 + leanRadians,
            m.neckLength
        );

        const neck = add(chest, neckVector);

        const head = add(
            neck,
            vectorFromAngle(-Math.PI / 2 + leanRadians, m.headRadius)
        );

        /*
            Shoulders are perpendicular to the torso direction.
        */

        const shoulderAngle = leanRadians;
        const shoulderVector = vectorFromAngle(shoulderAngle, m.shoulderWidth / 2);

        const leftShoulder = {
            x: chest.x - shoulderVector.x,
            y: chest.y - shoulderVector.y
        };

        const rightShoulder = {
            x: chest.x + shoulderVector.x,
            y: chest.y + shoulderVector.y
        };

        return {
            head,
            neck,
            chest,
            hip,
            leftShoulder,
            rightShoulder
        };
    }

    /*
    This creates a bent limb between a start point and an end point.

    Example:
        shoulder -> elbow -> hand

    The bend controls which side the elbow/knee bends toward.

    bend = 1 bends one way
    bend = -1 bends the other way
    */

    function createBentLimb(start, end, upperLength, lowerLength, bend = 1) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        /*
            If the target is too far away for the limb lengths,
            clamp it so the geometry still works.
        */

        const maxReach = upperLength + lowerLength - 0.001;
        const safeDistance = Math.min(distance, maxReach);

        const ux = dx / distance;
        const uy = dy / distance;

        /*
            Law of cosines:
            distance from start to the projection of the elbow
            along the start-end line.
        */

        const a =
            (upperLength * upperLength -
            lowerLength * lowerLength +
            safeDistance * safeDistance) /
            (2 * safeDistance);

        const hSquared = Math.max(upperLength * upperLength - a * a, 0);
        const h = Math.sqrt(hSquared);

        const mid = {
            x: start.x + ux * a,
            y: start.y + uy * a
        };

        /*
            Perpendicular direction.
        */

        const px = -uy;
        const py = ux;

        const joint = {
            x: mid.x + px * h * bend,
            y: mid.y + py * h * bend
        };

    return joint;
    }

    function createTwoSegmentLimbFromAngles({
        start,
        upperLength,
        lowerLength,
        upperAngle,
        lowerAngle
    }) {
        const joint = add(
            start,
            vectorFromAngle(degreesToRadians(upperAngle), upperLength)
        );

        const end = add(
            joint,
            vectorFromAngle(degreesToRadians(lowerAngle), lowerLength)
        );

        return {
            joint,
            end
        };
    }

    /* ========================= */
    /* Pose builders             */
    /* ========================= */

    /*
    Standing pose:
    You only give the hip position and scale.

    The helper calculates:
    - head
    - neck
    - chest
    - shoulders
    - elbows
    - hands
    - knees
    - feet
    */

    function createStandingPose({
        hip,
        scale = STICKMAN_SCALE,
        lean = 0
        }) {
        const m = getBodyMeasurements(scale);
        const torso = createTorso({ hip, scale, lean });

        const leftHand = add(
            torso.leftShoulder,
            vectorFromAngle(degreesToRadians(130), m.upperArm + m.lowerArm)
        );

        const rightHand = add(
            torso.rightShoulder,
            vectorFromAngle(degreesToRadians(50), m.upperArm + m.lowerArm)
        );

        const leftElbow = createBentLimb(
            torso.leftShoulder,
            leftHand,
            m.upperArm,
            m.lowerArm,
            -1
        );

        const rightElbow = createBentLimb(
            torso.rightShoulder,
            rightHand,
            m.upperArm,
            m.lowerArm,
            1
        );

        const leftFoot = add(
            hip,
            vectorFromAngle(degreesToRadians(105), m.upperLeg + m.lowerLeg)
        );

        const rightFoot = add(
            hip,
            vectorFromAngle(degreesToRadians(75), m.upperLeg + m.lowerLeg)
        );

        const leftKnee = createBentLimb(
            hip,
            leftFoot,
            m.upperLeg,
            m.lowerLeg,
            -1
        );

        const rightKnee = createBentLimb(
            hip,
            rightFoot,
            m.upperLeg,
            m.lowerLeg,
            1
        );

        return {
            head: torso.head,
            neck: torso.neck,
            chest: torso.chest,
            hip: torso.hip,

            leftShoulder: torso.leftShoulder,
            rightShoulder: torso.rightShoulder,

            leftElbow,
            leftHand,

            rightElbow,
            rightHand,

            leftKnee,
            leftFoot,

            rightKnee,
            rightFoot
        };
    }


    function createGreetingPose({
        hip,
        scale = STICKMAN_SCALE,
        lean = 0,
        wavingSide = "right"
    }) {
        const pose = createStandingPose({ hip, scale, lean });
        const m = getBodyMeasurements(scale);

        /*
        We start from the standing pose, then override one arm.

        If the stickman is facing us:
        - its right arm appears on the viewer's left/right depending on your naming convention.
        - Here I use rightArm = guide's right arm.
        */

        if (wavingSide === "right") {
            pose.rightElbow = {
                x: pose.rightShoulder.x + relativeLength(0.06, scale),
                y: pose.rightShoulder.y - relativeLength(0.035, scale)
            };

            pose.rightHand = {
                x: pose.rightElbow.x + relativeLength(0.035, scale),
                y: pose.rightElbow.y - relativeLength(0.075, scale)
            };
        } else {
            pose.leftElbow = {
                x: pose.leftShoulder.x - relativeLength(0.06, scale),
                y: pose.leftShoulder.y - relativeLength(0.035, scale)
            };

            pose.leftHand = {
                x: pose.leftElbow.x - relativeLength(0.035, scale),
                y: pose.leftElbow.y - relativeLength(0.075, scale)
            };
        }

        return pose;
    }

    function createRelaxedGreetingPose({
        hip,
        scale = STICKMAN_SCALE,
        lean = -2
    }) {
        const m = getBodyMeasurements(scale);

        /*
        Torso and head still respect:
        neckLength, torsoLength, headRadius.
        */
        const torso = createTorso({ hip, scale, lean });

        /*
        For this pose, both arms attach near the chest because
        shoulderWidth is 0 in your BODY settings.
        */

        /*
        Screen-left arm:
        hand-on-hip style.

        The upper arm goes down-left.
        The lower arm folds inward toward the hip.
        */
        const leftArm = createTwoSegmentLimbFromAngles({
            start: torso.leftShoulder,
            upperLength: m.upperArm,
            lowerLength: m.lowerArm,
            upperAngle: 120,
            lowerAngle: 70
        });

        /*
        Screen-right arm:
        raised greeting arm.

        The upper arm goes out-right.
        The lower arm curves upward.
        */
        const rightArm = createTwoSegmentLimbFromAngles({
            start: torso.rightShoulder,
            upperLength: m.upperArm,
            lowerLength: m.lowerArm,
            upperAngle: 10,
            lowerAngle: -85
        });

        /*
        Legs:
        wide, confident stance while preserving leg lengths.
        */
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

    /*
    Climbing pose:
    You give:
    - hip
    - ropeX
    - leftHandY
    - rightHandY
    - foot positions

    The hands are automatically constrained to the rope.

    This means:
        leftHand.x = ropeX
        rightHand.x = ropeX

    So the guide cannot accidentally stop touching the rope.
    */

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

        const leftElbow = createBentLimb(
            torso.leftShoulder,
            leftHandPoint,
            m.upperArm,
            m.lowerArm,
            leftArmBend
        );

        const rightElbow = createBentLimb(
            torso.rightShoulder,
            rightHandPoint,
            m.upperArm,
            m.lowerArm,
            rightArmBend
        );

        const leftKnee = createBentLimb(
            hip,
            leftFoot,
            m.upperLeg,
            m.lowerLeg,
            leftLegBend
        );

        const rightKnee = createBentLimb(
            hip,
            rightFoot,
            m.upperLeg,
            m.lowerLeg,
            rightLegBend
        );

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

    /* ========================= */
    /* Poses                     */
    /* ========================= */

    /*
    To move the guide around inside the SVG, edit only these hip positions.

    To make the guide smaller/larger inside the SVG, edit STICKMAN_SCALE.
    */

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

    const standingPose = createStandingPose({
        hip: point(0.5, 0.66),
        scale: STICKMAN_SCALE,
        lean: 0
    });

    const greetingPose = createGreetingPose({
        hip: point(0.5, 0.66),
        scale: STICKMAN_SCALE,
        lean: 0,
        wavingSide: "left"
    });

    const relaxedGreetingPose = createRelaxedGreetingPose({
    hip: point(0.5, 0.66),
    scale: STICKMAN_SCALE,
    lean: -2,
});

    /* ========================= */
    /* Drawing                   */
    /* ========================= */

    function drawStickman(pose, yOffset, squash) {
        /*
            yOffset moves the whole stickman up/down.
            squash gives the small landing compression.
        */

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

    function drawRope(length) {
        const ropeX = nx(GUIDE.ropeX);

        ropeLine.setAttribute("x1", ropeX);
        ropeLine.setAttribute("y1", 0);
        ropeLine.setAttribute("x2", ropeX);
        ropeLine.setAttribute("y2", length);

        ropeRing.setAttribute("cx", ropeX);
        ropeRing.setAttribute("cy", length);
    }

    function drawFloor(scale) {
        const floorY = ny(GUIDE.floorY);

        floorLine.setAttribute("x1", nx(0.30));
        floorLine.setAttribute("y1", floorY);
        floorLine.setAttribute("x2", nx(0.70));
        floorLine.setAttribute("y2", floorY);

        floorLine.style.opacity = String(scale);
        floorLine.style.transformBox = "fill-box";
        floorLine.style.transformOrigin = "center";
        floorLine.style.transform = `scaleX(${scale})`;
    }

    /* ========================= */
    /* Animation loop            */
    /* ========================= */

    const CLIMB_CYCLES = 3;

    let animationStartTime = null;

    function animateGuide(timestamp) {
        const t = timestamp - animationStartTime;

        /*
            1. Rope falls from the navbar.
        */

        const fullRopeLength = ny(GUIDE.ropeLength);

        let currentRopeLength = 0;

        if (t < GUIDE.ropeFallEnd) {
            const ropeT = easeOutBack(
            progress(t, GUIDE.ropeFallStart, GUIDE.ropeFallEnd)
            );

            currentRopeLength = fullRopeLength * ropeT;
        } else if (t < GUIDE.ropeRetractStart) {
            currentRopeLength = fullRopeLength;
        } else {
            const retractT = easeInOut(
            progress(t, GUIDE.ropeRetractStart, GUIDE.ropeRetractEnd)
            );

            currentRopeLength = fullRopeLength * (1 - retractT);
        }

        drawRope(currentRopeLength);

        ropeRing.style.opacity =
            currentRopeLength > 10 && t < GUIDE.ropeRetractEnd ? "1" : "0";

        /*
            2. Stickman climbs down the rope.
        */

        let currentPose = climbingPoseA;
        let yOffset = -ny(0.56);
        let squash = 1;

        if (t < GUIDE.climbStart) {
            stickman.style.opacity = "0";
        }

        if (t >= GUIDE.climbStart && t < GUIDE.climbEnd) {
            stickman.style.opacity = "1";

            const climbT = easeInOut(
            progress(t, GUIDE.climbStart, GUIDE.climbEnd)
            );

            yOffset = lerp(-ny(0.56), 0, climbT);

            /*
            This cycles between the two climbing poses.

            The hands remain on the rope because both generated poses
            place the hands at x = GUIDE.ropeX.
            */

            const cycle = (Math.sin(climbT * Math.PI * 2 * CLIMB_CYCLES) + 1) / 2;

            currentPose = interpolatePose(climbingPoseA, climbingPoseB, cycle);
        }

        /*
            3. Convert into standing pose.
        */

        if (t >= GUIDE.standStart) {
            stickman.style.opacity = "1";

            const standT = easeInOut(
                progress(t, GUIDE.standStart, GUIDE.standEnd)
            );

            const landingPose = interpolatePose(climbingPoseA, climbingPoseB, 0.5);

            currentPose = interpolatePose(landingPose, relaxedGreetingPose, standT);
            yOffset = 0;

            if (standT < 0.5) {
                squash = lerp(1, 0.94, standT / 0.5);
            } else {
                squash = lerp(0.94, 1, (standT - 0.5) / 0.5);
            }
        }

        drawStickman(currentPose, yOffset, squash);

        /*
            4. Floor appears just before landing.
        */

        const floorT = easeOutBack(
            progress(t, GUIDE.floorStart, GUIDE.floorEnd)
        );

        drawFloor(clamp(floorT, 0, 1));

        /*
            5. Optional speech bubble.
        */

        if (guideBubble && t > GUIDE.bubbleStart) {
            guideBubble.classList.add("visible");
        }

        if (t < GUIDE.ropeRetractEnd + 400) {
            requestAnimationFrame(animateGuide);
        }
    }

    function startGuideAnimation(timestamp) {
        animationStartTime = timestamp;
        requestAnimationFrame(animateGuide);
    }

    if (siteGuide) {
        requestAnimationFrame(startGuideAnimation);
    }

    /* ========================= */
    /* Close button              */
    /* ========================= */

    if (siteGuide && guideCloseButton) {
        guideCloseButton.addEventListener("click", function () {
            siteGuide.classList.add("hidden");
        });
    }
});
