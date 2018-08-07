var Ripple = /** @class */ (function () {
    function Ripple(element) {
        var _this = this;
        if (window.getComputedStyle(element).position !== "absolute" && window.getComputedStyle(element).position !== "fixed") {
            element.style.position = "relative";
        }
        var isTouching = false;
        element.addEventListener('mousedown', function (e) {
            if (!isTouching) {
                _this.createRipple(element, 'mouseup', null, e.clientX, e.clientY);
            }
        });
        element.addEventListener('touchstart', function (e) {
            isTouching = true;
            _this.createRipple(element, 'touchend', function () {
                setTimeout(function () {
                    isTouching = false;
                }, 100);
            }, e.touches[0].clientX, e.touches[0].clientY);
        });
    }
    Ripple.prototype.createRipple = function (rippleContainer, releaseEventName, releaseCallback, pageX, pageY) {
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
        };
        window.addEventListener(releaseEventName, release);
        rippleContainer.addEventListener("dragover", release);
        ripple.addEventListener('transitionend', function () {
            if (ripple.classList.contains('dismiss')) {
                rippleContainer.removeChild(rippleWrapper);
                rippleContainer.removeEventListener("dragover", release);
                window.removeEventListener(releaseEventName, release);
            }
        });
        requestAnimationFrame(function () {
            var clientRect = rippleContainer.getBoundingClientRect();
            var largestDimensionSize = Math.max(rippleWrapper.clientWidth, rippleWrapper.clientHeight);
            var rippleSize = largestDimensionSize * 2;
            ripple.style.width = rippleSize + 'px';
            ripple.style.height = rippleSize + 'px';
            ripple.style.marginLeft = -rippleSize / 2 + 'px';
            ripple.style.marginTop = -rippleSize / 2 + 'px';
            ripple.style.transitionDuration = (1080 * Math.pow(rippleSize, 0.3)) + 'ms, 750ms';
            var x = (pageX - clientRect.left) + ((rippleSize - rippleContainer.clientWidth) / 2);
            var y = (pageY - clientRect.top) + ((rippleSize - rippleContainer.clientHeight) / 2);
            ripple.style.transformOrigin = x + "px " + y + "px";
            ripple.classList.add('show');
        });
    };
    Ripple.initializeRipples = function () {
        var rippleContainers = document.querySelectorAll(Ripple.rippleContainersSelectors);
        rippleContainers.forEach(function (rippleContainer) {
            new Ripple(rippleContainer);
        });
    };
    Ripple.rippleContainersSelectors = [
        '.btn',
        '.btn-flat',
        '.btn-borderless',
        '.btn-solid',
        '.btn-raised',
        '.btn-outline',
        '.list-hover .list-item',
        '.list-item .list-item-hover',
        '.tab',
        '.dropdown-item',
        '.radio .selection-control',
        '.checkbox .selection-control',
        '.switch .check-indicator',
        '.chip-remove',
        '.chip-hover'
    ].join(',');
    return Ripple;
}());

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QkFBaUIsR0FBeEI7UUFDSSxJQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUVyRixnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxlQUE0QjtZQUNsRCxJQUFJLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUE5Rk0sZ0NBQXlCLEdBQzVCO1FBQ0ksTUFBTTtRQUNOLFdBQVc7UUFDWCxpQkFBaUI7UUFDakIsWUFBWTtRQUNaLGFBQWE7UUFDYixjQUFjO1FBQ2Qsd0JBQXdCO1FBQ3hCLDZCQUE2QjtRQUM3QixNQUFNO1FBQ04sZ0JBQWdCO1FBQ2hCLDJCQUEyQjtRQUMzQiw4QkFBOEI7UUFDOUIsMEJBQTBCO1FBQzFCLGNBQWM7UUFDZCxhQUFhO0tBQ2hCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBOEVwQixhQUFDO0NBaEdELEFBZ0dDLElBQUEiLCJmaWxlIjoicmlwcGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUmlwcGxlIHtcclxuICAgIHN0YXRpYyByaXBwbGVDb250YWluZXJzU2VsZWN0b3JzID1cclxuICAgICAgICBbXHJcbiAgICAgICAgICAgICcuYnRuJyxcclxuICAgICAgICAgICAgJy5idG4tZmxhdCcsXHJcbiAgICAgICAgICAgICcuYnRuLWJvcmRlcmxlc3MnLFxyXG4gICAgICAgICAgICAnLmJ0bi1zb2xpZCcsXHJcbiAgICAgICAgICAgICcuYnRuLXJhaXNlZCcsXHJcbiAgICAgICAgICAgICcuYnRuLW91dGxpbmUnLFxyXG4gICAgICAgICAgICAnLmxpc3QtaG92ZXIgLmxpc3QtaXRlbScsXHJcbiAgICAgICAgICAgICcubGlzdC1pdGVtIC5saXN0LWl0ZW0taG92ZXInLFxyXG4gICAgICAgICAgICAnLnRhYicsXHJcbiAgICAgICAgICAgICcuZHJvcGRvd24taXRlbScsXHJcbiAgICAgICAgICAgICcucmFkaW8gLnNlbGVjdGlvbi1jb250cm9sJyxcclxuICAgICAgICAgICAgJy5jaGVja2JveCAuc2VsZWN0aW9uLWNvbnRyb2wnLFxyXG4gICAgICAgICAgICAnLnN3aXRjaCAuY2hlY2staW5kaWNhdG9yJyxcclxuICAgICAgICAgICAgJy5jaGlwLXJlbW92ZScsXHJcbiAgICAgICAgICAgICcuY2hpcC1ob3ZlcidcclxuICAgICAgICBdLmpvaW4oJywnKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbiAhPT0gXCJhYnNvbHV0ZVwiICYmIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLnBvc2l0aW9uICE9PSBcImZpeGVkXCIpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpc1RvdWNoaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFpc1RvdWNoaW5nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVJpcHBsZShlbGVtZW50LCAnbW91c2V1cCcsIG51bGwsIGUuY2xpZW50WCwgZS5jbGllbnRZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZTogVG91Y2hFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpc1RvdWNoaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVSaXBwbGUoZWxlbWVudCwgJ3RvdWNoZW5kJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNUb3VjaGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgfSwgZS50b3VjaGVzWzBdLmNsaWVudFgsIGUudG91Y2hlc1swXS5jbGllbnRZKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVSaXBwbGUocmlwcGxlQ29udGFpbmVyLCByZWxlYXNlRXZlbnROYW1lLCByZWxlYXNlQ2FsbGJhY2ssIHBhZ2VYLCBwYWdlWSkge1xyXG4gICAgICAgIGNvbnN0IHJpcHBsZVdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdESVYnKTtcclxuICAgICAgICByaXBwbGVXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ3JpcHBsZS13cmFwcGVyJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xyXG4gICAgICAgIHJpcHBsZS5jbGFzc0xpc3QuYWRkKCdyaXBwbGUnKTtcclxuICAgICAgICByaXBwbGVXcmFwcGVyLmFwcGVuZENoaWxkKHJpcHBsZSk7XHJcbiAgICAgICAgcmlwcGxlQ29udGFpbmVyLmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJiZWdpbicsIHJpcHBsZVdyYXBwZXIpO1xyXG5cclxuICAgICAgICBjb25zdCByZWxlYXNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByaXBwbGUuY2xhc3NMaXN0LmFkZCgnZGlzbWlzcycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlbGVhc2VDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgcmVsZWFzZUNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihyZWxlYXNlRXZlbnROYW1lLCByZWxlYXNlKTtcclxuICAgICAgICByaXBwbGVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIHJlbGVhc2UpO1xyXG5cclxuICAgICAgICByaXBwbGUuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJpcHBsZS5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc21pc3MnKSkge1xyXG4gICAgICAgICAgICAgICAgcmlwcGxlQ29udGFpbmVyLnJlbW92ZUNoaWxkKHJpcHBsZVdyYXBwZXIpO1xyXG4gICAgICAgICAgICAgICAgcmlwcGxlQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCByZWxlYXNlKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKHJlbGVhc2VFdmVudE5hbWUsIHJlbGVhc2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2xpZW50UmVjdCA9IHJpcHBsZUNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgY29uc3QgbGFyZ2VzdERpbWVuc2lvblNpemUgPSBNYXRoLm1heChyaXBwbGVXcmFwcGVyLmNsaWVudFdpZHRoLCByaXBwbGVXcmFwcGVyLmNsaWVudEhlaWdodCk7XHJcbiAgICAgICAgICAgIGxldCByaXBwbGVTaXplID0gbGFyZ2VzdERpbWVuc2lvblNpemUgKiAyO1xyXG4gICAgICAgICAgICByaXBwbGUuc3R5bGUud2lkdGggPSByaXBwbGVTaXplICsgJ3B4JztcclxuICAgICAgICAgICAgcmlwcGxlLnN0eWxlLmhlaWdodCA9IHJpcHBsZVNpemUgKyAncHgnO1xyXG4gICAgICAgICAgICByaXBwbGUuc3R5bGUubWFyZ2luTGVmdCA9IC1yaXBwbGVTaXplIC8gMiArICdweCc7XHJcbiAgICAgICAgICAgIHJpcHBsZS5zdHlsZS5tYXJnaW5Ub3AgPSAtcmlwcGxlU2l6ZSAvIDIgKyAncHgnO1xyXG4gICAgICAgICAgICByaXBwbGUuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gKDEwODAgKiBNYXRoLnBvdyhyaXBwbGVTaXplLDAuMykpICsgJ21zLCA3NTBtcyc7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB4ID0gKHBhZ2VYIC0gY2xpZW50UmVjdC5sZWZ0KSArICgocmlwcGxlU2l6ZSAtIHJpcHBsZUNvbnRhaW5lci5jbGllbnRXaWR0aCkgLyAyKTtcclxuICAgICAgICAgICAgY29uc3QgeSA9IChwYWdlWSAtIGNsaWVudFJlY3QudG9wKSArICgocmlwcGxlU2l6ZSAtIHJpcHBsZUNvbnRhaW5lci5jbGllbnRIZWlnaHQpIC8gMik7XHJcblxyXG4gICAgICAgICAgICByaXBwbGUuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0geCArIFwicHggXCIgKyB5ICsgXCJweFwiO1xyXG4gICAgICAgICAgICByaXBwbGUuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbml0aWFsaXplUmlwcGxlcygpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCByaXBwbGVDb250YWluZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChSaXBwbGUucmlwcGxlQ29udGFpbmVyc1NlbGVjdG9ycyk7XHJcblxyXG4gICAgICAgIHJpcHBsZUNvbnRhaW5lcnMuZm9yRWFjaCgocmlwcGxlQ29udGFpbmVyOiBIVE1MRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBuZXcgUmlwcGxlKHJpcHBsZUNvbnRhaW5lcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXX0=
