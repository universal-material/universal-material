(function () {
    var sidebar = document.querySelector(".sidebar");
    var sidebarBackdrop = document.querySelector(".sidebar-backdrop");
    var appbar = document.getElementById("app-bar");

    function toggleSidebar() {
        if (sidebar.classList.contains("open")) {
            sidebar.classList.remove("open");
        } else {
            sidebar.classList.add("open");
        }
    }

    function toggleDenseLayout() {
        document.body.classList.toggle("dense-layout");
    }

    function mainContentScroll(e) {
        if (e.target.scrollTop) {
            appbar.classList.add('elevation-6dp');
        } else {
            appbar.classList.remove('elevation-6dp');
        }
    }

    function initializeRipples() {
        var rippleContainers = document.querySelectorAll('.btn, .btn-flat, .btn-borderless, .btn-solid, .btn-raised, .btn-outline, .list-hover .list-item, .list-item .list-item-hover, .tab, .selection-control, .chip-remove');

        function createRipple(rippleContainer, releaseEventName, releaseCallback, pageX, pageY) {
            var rippleWrapper = document.createElement('DIV');
            rippleWrapper.classList.add('ripple-wrapper');

            var ripple = document.createElement('DIV');
            ripple.classList.add('ripple');
            rippleWrapper.appendChild(ripple);
            rippleContainer.insertAdjacentElement('afterbegin', rippleWrapper);

            var release = function () {
                ripple.classList.add('dismiss');

                if (releaseCallback) {
                    releaseCallback();
                }
                console.log('released');
            };

            requestAnimationFrame(function () {
                ripple.addEventListener('transitionend', function () {
                    if (ripple.classList.contains('dismiss')) {
                        rippleContainer.removeChild(rippleWrapper);
                        window.removeEventListener(releaseEventName, release)
                    }
                });

                var clientRect = rippleContainer.getBoundingClientRect();
                var largestDimensionSize = Math.max(rippleWrapper.clientWidth, rippleWrapper.clientHeight);
                var rippleSize = largestDimensionSize * 2;
                ripple.style.width = rippleSize + 'px';
                ripple.style.height = rippleSize + 'px';
                ripple.style.marginLeft = -rippleSize / 2 + 'px';
                ripple.style.marginTop = -rippleSize / 2 + 'px';

                var x = (pageX - clientRect.left) + ((rippleSize - rippleContainer.clientWidth) / 2);
                var y = (pageY - clientRect.top) + ((rippleSize - rippleContainer.clientHeight) / 2);

                ripple.style.transformOrigin = x + "px " + y + "px"
                ripple.classList.add('show');

                window.addEventListener(releaseEventName, release);
            });
        }

        rippleContainers.forEach(function (rippleContainer) {

            if (window.getComputedStyle(rippleContainer).position !== "absolute" && window.getComputedStyle(rippleContainer).position !== "fixed") {
                rippleContainer.style.position = "relative";
            }

            var isTouching = false;

            rippleContainer.addEventListener('mousedown', function (e) {
                if (!isTouching) {
                    createRipple(rippleContainer, 'mouseup', null, e.pageX, e.pageY);
                }
            });

            rippleContainer.addEventListener('touchstart', function (e) {
                console.log(e);
                e.cancelBubble = true;
                e.returnValue = false;

                isTouching = true;
                createRipple(rippleContainer, 'touchend', function () {
                    setTimeout(function () {
                        isTouching = false;
                    }, 100);
                }, e.touches[0].clientX, e.touches[0].clientY);
                return false;
            });
        });
    }

    document
        .getElementById("menu-toggle")
        .addEventListener("click", toggleSidebar);

    document
        .getElementById("dense-toggle")
        .addEventListener("click", toggleDenseLayout);

    sidebarBackdrop.addEventListener("click", toggleSidebar);


    document.getElementById("main-content").addEventListener("scroll", mainContentScroll);

    initializeRipples();
})();

hljs.initHighlightingOnLoad();

