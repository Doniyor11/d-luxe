// on document load event in js pure
const BACKEND_URL = 'http://5.45.94.221:8000';
// const API_URL = 'http://localhost:8000/api';
const API_URL = 'http://5.45.94.221:8000/api';

document.addEventListener('formSent', function (event) {
    const formData = new FormData(event.detail.form);

    const name = formData.get('name');
    const phone = formData.get('phone');
    const message = formData.get('message');

    if (!name || !phone || !message) return;

    fetch(API_URL + '/consult_request',
        {
            method: 'POST',
            body: JSON.stringify({name, phone, message}),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            alert('Ваша заявка принята!')
            document.getElementById('consult_request_form').reset();
        })
        .catch(error => {
            console.log('error', error)
        });
});

document.addEventListener("DOMContentLoaded", function (event) {

    document.getElementById('sponsors').innerHTML = '';
    fetch(API_URL + '/sponsors')
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                document.getElementById('sponsors').innerHTML += renderSponsor(
                    element.name,
                    element.logo
                )
            });
        });

    fetch(API_URL + '/editables')
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                document.getElementById(element.key).innerText = element.value
            });
        });

});

function formatPrice(price) {
    // 15500 => 15 500
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function renderSponsor(name, logo) {
    return `
<div class="choose__slide swiper-slide">
<picture><source srcset="${BACKEND_URL}/storage/${logo}" type="image/webp"><img class="img-fluid" src="img/reviews/3.png" alt="${name}"></picture>
</div>
`;
}