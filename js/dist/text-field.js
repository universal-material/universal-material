var TextField = /** @class */ (function () {
    function TextField(element) {
        var _this = this;
        var input = element.querySelector('input.text-input')
            || element.querySelector('textarea.text-input')
            || element.querySelector('.text-input input')
            || element.querySelector('.text-input textarea');
        if (input) {
            input.addEventListener('focus', function () {
                element.classList.add('focus');
            });
            input.addEventListener('blur', function () {
                element.classList.remove('focus');
            });
            input.addEventListener('input', function () {
                _this.setEmpty();
            });
        }
        this.input = input;
        this.element = element;
        this.setEmpty();
    }
    TextField.prototype.setEmpty = function () {
        if (this.input.value) {
            this.element.classList.remove('empty');
        }
        else {
            this.element.classList.add('empty');
        }
    };
    TextField.initializeTextFields = function () {
        var textFields = document.querySelectorAll('.text-field');
        for (var i = 0; i < textFields.length; i++) {
            var textField = textFields[i];
            new TextField(textField);
        }
    };
    return TextField;
}());

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRleHQtZmllbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFLSSxtQkFBWSxPQUFPO1FBQW5CLGlCQXdCQztRQXZCRyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDO2VBQ2hELE9BQU8sQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUM7ZUFDNUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztlQUMxQyxPQUFPLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFFckQsSUFBSSxLQUFLLEVBQUU7WUFDUCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO2dCQUM1QixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7Z0JBQzNCLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxDQUFDO1lBRUgsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRTtnQkFDNUIsS0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1NBQ047UUFFRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUV2QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELDRCQUFRLEdBQVI7UUFDSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtTQUN6QzthQUFNO1lBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQ3RDO0lBQ0wsQ0FBQztJQUVNLDhCQUFvQixHQUEzQjtRQUNJLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM1RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QyxJQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDNUI7SUFDTCxDQUFDO0lBQ0wsZ0JBQUM7QUFBRCxDQTlDQSxBQThDQyxJQUFBIiwiZmlsZSI6InRleHQtZmllbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBUZXh0RmllbGQge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZWxlbWVudDogRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGlucHV0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dC50ZXh0LWlucHV0JylcclxuICAgICAgICAgICAgfHwgZWxlbWVudC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYS50ZXh0LWlucHV0JylcclxuICAgICAgICAgICAgfHwgZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dC1pbnB1dCBpbnB1dCcpXHJcbiAgICAgICAgICAgIHx8IGVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRleHQtaW5wdXQgdGV4dGFyZWEnKTtcclxuXHJcbiAgICAgICAgaWYgKGlucHV0KSB7XHJcbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmb2N1cycpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZvY3VzJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVtcHR5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RW1wdHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRFbXB0eSgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbnB1dC52YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHknKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdlbXB0eScpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbml0aWFsaXplVGV4dEZpZWxkcygpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB0ZXh0RmllbGRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRleHQtZmllbGQnKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHRGaWVsZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdGV4dEZpZWxkID0gdGV4dEZpZWxkc1tpXTtcclxuICAgICAgICAgICAgbmV3IFRleHRGaWVsZCh0ZXh0RmllbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=
