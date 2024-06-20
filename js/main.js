import uzLang from './uz.lang.js';

// on document load event in js pure
const BACKEND_URL = 'https://admin.dluxe.uz';
// const API_URL = 'http://localhost:8000/api';
const API_URL = 'https://admin.dluxe.uz/api';

function changeLanguage() {
    const lang = localStorage.getItem('lang') || 'ru';
    document.querySelector('[data-laguage-picker]').innerHTML = lang === 'uz' ? 'Uz' : 'Ру';
    document.querySelectorAll('.lang-picker-item').forEach(item => {
        if (item.dataset.lang === lang) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    if (lang === 'uz' && uzLang) {
        Object.entries(uzLang).forEach(([key, value]) => {
            document.querySelectorAll(`[data-lang="${key}"]`)?.forEach(element => {
                element.innerHTML = value;
            });

            document.querySelectorAll(`[data-lang-input="${key}"]`)?.forEach(element => {
                element.setAttribute('placeholder', value);
                element.setAttribute('data-error', `${value} ni to'ldiring`);
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", function (event) {

    changeLanguage();

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
                document.querySelector(`.${element.key}`).innerHTML = String(element.value);

                const swiperContainer = document.querySelector('.comfort__slider');
                if (swiperContainer && swiperContainer.swiper) {
                    swiperContainer.swiper.update();
                }

            });
        });

});

document.querySelectorAll('.lang-picker-item').forEach(item => {
    item.addEventListener('click', function (event) {
        const lang = item.dataset.lang;
        localStorage.setItem('lang', lang);
        location.reload();
    });
});

document.querySelectorAll('.menu__link[data-switch]').forEach(item => {
    item.addEventListener('click', function (event) {
        const switchTab = item.dataset.switch;
        const tab = document.querySelector('.tabs-services__navigation [data-tab="' + switchTab + '"]');

        tab.click();

        // goto #services div scroll
        const services = document.getElementById('services');
        const servicesTop = services.offsetTop;
        window.scrollTo(0, servicesTop + 100);
    });
});

document.addEventListener('formSent', function (event) {
    const form = event.detail.form;
    const formData = new FormData(form);

    const name = formData.get('name');
    const phone = formData.get('phone');
    const message = formData.get('message');

    const submitButton = form.querySelector('button[type="submit"]');

    if (!name || !phone || !message) return;

    submitButton.setAttribute('disabled', 'disabled');
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
            console.log('data.success', data.success)
            if (data.success !== false) {
                alert('Ваша заявка принята!')
                document.getElementById('consult_request_form').reset();
            } else {
                alert('Ошибка при отправке заявки! Попробуйте позже.')
            }
        })
        .catch(error => {
            console.log('error', error)
            alert('Ошибка при отправке заявки! Попробуйте позже.')
        })
        .finally(() => {
            submitButton.removeAttribute('disabled');
        });
});

function renderSponsor(name, logo) {
    return `
<div class="choose__slide swiper-slide">
<picture><source srcset="${BACKEND_URL}/storage/${logo}" type="image/webp"><img class="img-fluid" src="img/reviews/3.png" alt="${name}"></picture>
</div>
`;
}