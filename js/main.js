// ===========================
// CONFIGURACIÓN
// ===========================
const API_KEY = 'c244c3c6575052ecbd4b6b259d05a081'; // <-- pegá tu key acá
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ===========================
// ELEMENTOS DEL DOM
// ===========================
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const emptyState = document.getElementById('emptyState');
const errorState = document.getElementById('errorState');
const errorMsg = document.getElementById('errorMsg');
const loading = document.getElementById('loading');

// ===========================
// ÍCONOS POR CLIMA
// ===========================
function getWeatherIcon(code) {
    if (code >= 200 && code < 300) return '⛈️';   // tormenta
    if (code >= 300 && code < 400) return '🌦️';   // llovizna
    if (code >= 500 && code < 600) return '🌧️';   // lluvia
    if (code >= 600 && code < 700) return '❄️';   // nieve
    if (code >= 700 && code < 800) return '🌫️';   // niebla
    if (code === 800) return '☀️';   // despejado
    if (code === 801) return '🌤️';   // pocas nubes
    if (code === 802) return '⛅';   // nubes dispersas
    return '☁️';                                   // nublado
}

// ===========================
// MOSTRAR / OCULTAR ESTADOS
// ===========================
function showLoading() {
    emptyState.classList.add('hidden');
    errorState.classList.add('hidden');
    weatherCard.classList.add('hidden');
    loading.classList.remove('hidden');
}

function showError(msg) {
    loading.classList.add('hidden');
    weatherCard.classList.add('hidden');
    emptyState.classList.add('hidden');
    errorMsg.textContent = msg;
    errorState.classList.remove('hidden');
}

function showWeather() {
    loading.classList.add('hidden');
    errorState.classList.add('hidden');
    emptyState.classList.add('hidden');
    weatherCard.classList.remove('hidden');
}

// ===========================
// FETCH DEL CLIMA
// ===========================
async function fetchWeather(city) {
    showLoading();

    try {
        const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=es`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                showError('Ciudad no encontrada. Verificá el nombre e intentá de nuevo.');
            } else if (response.status === 401) {
                showError('API key inválida. Verificá tu configuración.');
            } else {
                showError('Ocurrió un error. Intentá más tarde.');
            }
            return;
        }

        const data = await response.json();
        renderWeather(data);

    } catch (error) {
        showError('Sin conexión a internet. Revisá tu red.');
    }
}

// ===========================
// RENDERIZAR DATOS
// ===========================
function renderWeather(data) {
    const {
        name,
        sys: { country },
        main: { temp, feels_like, humidity },
        wind: { speed },
        clouds: { all: cloudiness },
        weather: [{ description, id }],
    } = data;

    document.getElementById('cityName').textContent = name;
    document.getElementById('countryName').textContent = `${country} · ${description}`;
    document.getElementById('temperature').textContent = Math.round(temp);
    document.getElementById('description').textContent = description;
    document.getElementById('weatherIcon').textContent = getWeatherIcon(id);
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('wind').textContent = `${Math.round(speed * 3.6)} km/h`;
    document.getElementById('feelsLike').textContent = `${Math.round(feels_like)}°C`;
    document.getElementById('clouds').textContent = `${cloudiness}%`;

    const now = new Date();
    document.getElementById('lastUpdated').textContent =
        `Actualizado: ${now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`;

    showWeather();
}

// ===========================
// EVENTOS
// ===========================
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) fetchWeather(city);
    }
});

// Ciudades rápidas
document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const city = btn.dataset.city;
        cityInput.value = city;
        fetchWeather(city);
    });
});