document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            loadHero(data.hero);
            loadEvents(data.events);
            loadGallery(data.gallery);
        });

    function loadHero(hero) {
        const heroSection = document.getElementById('hero');
        heroSection.style.backgroundImage = `url(${hero.image})`;
        heroSection.innerHTML = `
            <h1>${hero.title}</h1>
            <p>${hero.subtitle}</p>
            <a href="${hero.buttonLink}" class="btn">${hero.buttonText}</a>
        `;
    }

    function loadEvents(events) {
        const eventsContainer = document.querySelector('.events-container');
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <img src="${event.image}" alt="${event.title}">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Prix:</strong> ${event.price}€</p>
                <div id="paypal-button-container-${event.paypalId}"></div>
            `;
            eventsContainer.appendChild(eventCard);
            
            // --- PayPal Button Integration ---
            const paypalForm = document.createElement('form');
            paypalForm.action = 'https://www.paypal.com/cgi-bin/webscr';
            paypalForm.method = 'post';
            paypalForm.target = '_blank'; // Open in a new tab

            paypalForm.innerHTML = `
                <!-- Replace with your PayPal business email -->
                <input type="hidden" name="business" value="your-email@example.com">
                <input type="hidden" name="cmd" value="_xclick">
                <input type="hidden" name="item_name" value="${event.title}">
                <input type="hidden" name="amount" value="${event.price}">
                <input type="hidden" name="currency_code" value="EUR">
                <input type="hidden" name="no_shipping" value="1">
                <input type="hidden" name="return" value="${window.location.href}">
                <input type="hidden" name="cancel_return" value="${window.location.href}">
                
                <button type="submit" class="btn">Acheter un billet</button>
            `;
            
            document.getElementById(`paypal-button-container-${event.paypalId}`).appendChild(paypalForm);
        });
    }

    function loadGallery(gallery) {
        const galleryContainer = document.querySelector('.gallery-container');
        gallery.forEach(imageSrc => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = 'Gallery Image';
            galleryContainer.appendChild(img);
        });
    }
});
