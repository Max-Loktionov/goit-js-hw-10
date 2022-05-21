import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from '../src/function'
import getRefs from '../src/getRefs'
import './css/styles.css';
import listOfCountries from '../src/templates/listOfCountries.hbs'
import countryInfo from '../src/templates/countryInfo.hbs'

// ====================================================

const DEBOUNCE_DELAY = 300;

const refs = getRefs();

Notify.init({
    width: '280px',
    position: 'right-top',
    distance: '120px',
    pauseOnHover: false,
    showOnlyTheLastOne: true,
});

refs.input.addEventListener('input', debounce(getCountryName, DEBOUNCE_DELAY));

function getCountryName() {
    const name = (refs.input.value).trim();
   
    if (refs.input.value === '') {
       return 
    }

    API.fetchCountries(name).then(response => {
        cleanQuery();

        if (response.length === 1) {
            renderCountryInfo(response[0]);

        } else if (response.length > 1 && response.length < 10) {
            let elements = {};
            elements = response.forEach(renderCountryList);
           
        } else if (response.length >= 10) {
            Notify.info("Too many matches found. Please enter a more specific name.");
        } else { Notify.failure("Oops, there is no country with that name"); }
    }).catch(onFetchError);
        
};

function renderCountryList(response) {
    let markup = '';
    markup = listOfCountries(response);
    refs.countryList.insertAdjacentHTML('beforeend', markup);
};

function renderCountryInfo({ flags, name, capital, population, languages }) {
    const lang = Object.values(languages);
    let markup = countryInfo({ flags, name, capital, population, lang });   
    refs.card.innerHTML = markup;
}

function cleanQuery() {
    refs.card.innerHTML = '';
    refs.countryList.innerHTML = '';
}

function onFetchError() {
   Notify.failure("Oops, something goes wrong") ; 
}