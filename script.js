let clickCount = 0;
let countries = [];

const countryInput = document.getElementById('country');
const countryCodeInput = document.getElementById('countryCode');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');
const suggestionsContainer = document.getElementById('country-suggestions');
const zipCodeInput = document.getElementById('zipCode');
const cityInput = document.getElementById('city');
const emailInput = document.getElementById('exampleInputEmail1');
const phoneInput = document.getElementById('phoneNumber');
const vatNumberInput = document.getElementById('vatNumber');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        countries = data.map(country => country.name.common).sort();
        countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function showSuggestions(query) {
    const filteredCountries = countries.filter(country =>
        country.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    suggestionsContainer.innerHTML = '';
    if (filteredCountries.length > 0 && query.trim() !== '') {
        filteredCountries.forEach(country => {
            const suggestion = document.createElement('a');
            suggestion.className = 'list-group-item list-group-item-action';
            suggestion.textContent = country;
            suggestion.addEventListener('click', () => {
                countryInput.value = country;
                countryInput.dispatchEvent(new Event('change'));
                suggestionsContainer.style.display = 'none';
            });
            suggestionsContainer.appendChild(suggestion);
        });
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            countryInput.value = country;
            countryInput.dispatchEvent(new Event('change'));
            showSuggestions('');
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Błąd pobierania danych');
            }
            return response.json();
        })
        .then(data => {
            const countryCode = data[0].idd.root + data[0].idd.suffixes.join("");
            countryCodeInput.value = countryCode;
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
}

function focusPreviousField(currentElement) {
    const focusableElements = Array.from(document.querySelectorAll('input, textarea, select, button'))
        .filter(el => !el.disabled && el.tabIndex >= 0)
        .sort((a, b) => a.tabIndex - b.tabIndex);
    const currentIndex = focusableElements.indexOf(currentElement);
    if (currentIndex > 0) {
        focusableElements[currentIndex - 1].focus();
    }
}

function focusSection(sectionNumber) {
    const section = document.querySelector(`.section[data-section="${sectionNumber}"]`);
    if (section) {
        const firstFocusable = section.querySelector('input, textarea, select, button');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
}

function validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailError = document.getElementById('emailHelp');
    if (emailInput.value && !emailPattern.test(emailInput.value)) {
        emailError.textContent = 'Proszę wprowadzić poprawny adres e-mail, np. user@domain.com';
        emailInput.setCustomValidity('Niepoprawny adres e-mail');
    } else {
        emailError.textContent = '';
        emailInput.setCustomValidity('');
    }
}

function validatePhone() {
    const phonePattern = /^\d{9}$/;
    const phoneError = document.getElementById('phoneError');
    if (!phonePattern.test(phoneInput.value)) {
        phoneError.textContent = 'Numer telefonu powinien zawierać dokładnie 9 cyfr, np. 123456789';
        phoneInput.setCustomValidity('Niepoprawny numer telefonu');
    } else {
        phoneError.textContent = '';
        phoneInput.setCustomValidity('');
    }
}

function validateZipCode() {
    const zipPattern = /^\d{2}-\d{3}$/;
    const zipError = document.getElementById('zipCodeError');
    if (!zipPattern.test(zipCodeInput.value)) {
        zipError.textContent = 'Kod pocztowy powinien być w formacie XX-XXX, np. 12-345';
        zipCodeInput.setCustomValidity('Niepoprawny kod pocztowy');
    } else {
        zipError.textContent = '';
        zipCodeInput.setCustomValidity('');
        cityInput.focus(); // Automatyczne przejście do pola Miasto
    }
}

function validateVatNumber() {
    const vatPattern = /^[A-Z]{2}\d+$/;
    const vatError = document.getElementById('vatError');
    if (vatNumberInput.value && !vatPattern.test(vatNumberInput.value)) {
        vatError.textContent = 'Numer VAT powinien zaczynać się od kodu kraju (np. PL) i zawierać cyfry, np. PL1234567890';
        vatNumberInput.setCustomValidity('Niepoprawny numer VAT');
    } else {
        vatError.textContent = '';
        vatNumberInput.setCustomValidity('');
    }
}

function selectRadioOption(groupName, index) {
    const radios = document.querySelectorAll(`input[name="${groupName}"]`);
    if (index >= 0 && index < radios.length) {
        radios[index].checked = true;
    }
}

(() => {
    document.addEventListener('click', handleClick);

    fetchAndFillCountries().then(() => {
        countryInput.addEventListener('input', (e) => {
            showSuggestions(e.target.value);
        });

        countryInput.addEventListener('change', () => {
            getCountryCode(countryInput.value);
        });

        document.addEventListener('click', (e) => {
            if (!countryInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.style.display = 'none';
            }
        });

        getCountryByIP();
    });

    myForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const modalInstance = new bootstrap.Modal(document.getElementById('form-feedback-modal'));
        modalInstance.show();
    });

    // Walidacja w czasie rzeczywistym
    emailInput.addEventListener('input', validateEmail);
    phoneInput.addEventListener('input', validatePhone);
    zipCodeInput.addEventListener('input', validateZipCode);
    vatNumberInput.addEventListener('input', validateVatNumber);

    document.addEventListener('keydown', (e) => {
        // Shift + Enter: Przejście do poprzedniego pola
        if (e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            focusPreviousField(document.activeElement);
        }

        // Ctrl + S: Wysłanie formularza
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            myForm.dispatchEvent(new Event('submit'));
        }

        // Esc: Ukrycie podpowiedzi w polu kraju
        if (e.key === 'Escape') {
            suggestionsContainer.style.display = 'none';
        }

        // Alt + 1-5: Przejście do sekcji
        if (e.altKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            focusSection(e.key);
        }

        // Klawisze numeryczne dla pól radio
        if (document.activeElement.name === 'shippingMethod' && e.key >= '1' && e.key <= '3') {
            e.preventDefault();
            selectRadioOption('shippingMethod', parseInt(e.key) - 1);
        }
        if (document.activeElement.name === 'paymentMethod' && e.key >= '1' && e.key <= '4') {
            e.preventDefault();
            selectRadioOption('paymentMethod', parseInt(e.key) - 1);
        }
    });
})();