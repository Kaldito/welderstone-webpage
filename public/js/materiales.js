const buttons = document.getElementsByClassName('edit');

for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    const btn_id = btn.id;
    btn.addEventListener('click', function () {
        const h_div = document.querySelector('.' + btn_id);
        const hidden = h_div.hidden;
        const inputs = h_div.getElementsByTagName('input');

        if (hidden) {
            for (var i = 0; i < inputs.length; i++) {
                const inp = inputs[i];
                inp.removeAttribute('disabled');
            }

            h_div.removeAttribute('hidden');
        } else {
            let status = true;

            for (var i = 0; i < inputs.length - 1; i++) {
                const inp = inputs[i];
                if (inp.value != '') {
                    status = false;
                    break;
                }
            }

            if (status) {
                for (var i = 0; i < inputs.length; i++) {
                    const inp = inputs[i];

                    inp.setAttribute('disabled', 'disabled');
                }

                h_div.setAttribute('hidden', 'hidden');
            }
        }
    });
}
