//drpdwn of userdetail in navbar
document.querySelector('.userdetail').addEventListener('click', function() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'none' || dropdown.style.display === '' ? 'block' : 'none';
});
//to close the drpdwn
window.addEventListener('click', function(event) {
    const dropdown = document.getElementById('userDropdown');
    if (!event.target.matches('.userdetail') && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});


//for search bar
document.querySelector(".search-btn").addEventListener("click", function() {
    const query = document.querySelector(".search-input").value.toLowerCase(); 
    let url = "";

    if (query === "instagram") {
        url = "http://localhost:3000/instainfluencer.html";
    } else if (query === "about") {
        url = "http://localhost:3000/aboutus.html";
    } 
    else if (query === "facebook") {
        url = "http://localhost:3000/facebook.com";
    } 
    else if (query === "youtube") {
        url = "http://localhost:3000/youtubeinflu.html";
    } else {
        url = "404.html";//if no match found
    }
    window.location.href = url;
    });


//first  influencer list
function fetchInfluencers() {
    fetch('homeinfluencer.json')
        .then(response => response.json())
        .then(data => {
            const influencerContainer = document.querySelector('.influencer-container');
            influencerContainer.innerHTML = ''; //clear existing content

            data.forEach(influencer => {
                influencerContainer.innerHTML += `
                    <div class="influencer">
                        <a href="${influencer.socialMediaLink}" target="_blank">
                            <img src="${influencer.image}" alt="${influencer.name}">
                            <h3>${influencer.name}</h3>
                            <p>${influencer.location}</p>
                            <p>${influencer.platform}</p>
                            <p>${influencer.category}</p>
                            <p>${influencer.price}</p>
                        </a>
                    </div>
                `;
            });
        })
        .catch(error => console.error('Error loading influencer data:', error));
}

// Call this on page load
document.addEventListener('DOMContentLoaded', fetchInfluencers);
//influencer list 2
fetch('homeinflu2.json')
        .then(response => response.json())
        .then(data => {
            const influencerContainer = document.querySelector('#influencer-container2');
            influencerContainer.innerHTML = '';

            data.forEach(influencer => {
                influencerContainer.innerHTML += `
                    <div class="influencer">
                        <a href="${influencer.url}" target="_blank">
                            <img src="${influencer.image}" alt="${influencer.name}">
                            <h3>${influencer.name}</h3>
                            <p>${influencer.platform}</p>
                            <p>${influencer.category}</p>
                            <p>${influencer.price}</p>
                        </a>
                    </div>
                `;
            });
        })
        .catch(error => console.error('Error loading influencer data:', error));

        
//bb works arrow animation
 document.addEventListener("DOMContentLoaded", function () {
            const arrows = document.querySelectorAll(".arrow");
            arrows.forEach(arrow => {
              arrow.style.animation = "arrow-bounce 1s infinite";
            });
          });
          

//categories grid
// Fetch and render categories grid
fetch('categoriesgrid.json')
    .then(response => response.json())
    .then(data => {
        renderCategories(data);
    })
    .catch(error => console.error('Error fetching categories data:', error));

function renderCategories(categories) {
    const gridContainer = document.getElementById('category-grid');
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        categoryDiv.innerHTML = `
            <a href="${category.link}">
                <img src="${category.image}" alt="${category.name}">
            </a>
            <div class="overlay">${category.name}</div>
        `;
        gridContainer.appendChild(categoryDiv);
    });
}

//highlights
fetch('highlights.json')
    .then(response => response.json())
    .then(data => {
        renderHighlights(data);
    })
    .catch(error => console.error('Error fetching highlights data:', error));

function renderHighlights(features) {
    const container = document.getElementById('highlights-container');
    if (!container) {
        console.error("No element with ID 'highlights-container' found.");
        return;
    }

    features.forEach(feature => {
        const featureBox = document.createElement('div');
        featureBox.classList.add('feature-box');
        featureBox.innerHTML = `
            <div class="icon">${feature.icon}</div>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
        `;
        container.appendChild(featureBox);
    });

    console.log('Highlights rendered successfully');
}


//FAQS
fetch('faqs.json')
    .then(response => response.json())
    .then(data => {
        renderFAQ(data);
    })
    .catch(error => console.error('Error fetching FAQ data:', error));

function renderFAQ(faqs) {
    const faqContainer = document.querySelector('.faq');
    faqs.forEach(faq => {
        const faqItem = document.createElement('div');
        faqItem.classList.add('faq-item');
        
        faqItem.innerHTML = `
            <h3 class="faq-question">
                <p>${faq.question}</p>
                <p class="symbol">▾</p>
            </h3>
            <div class="faq-answer" style="display: none;">
                <p>${faq.answer}</p>
            </div>
            <hr>
        `;
        faqItem.querySelector('.faq-question').addEventListener('click', function() {
            const answer = faqItem.querySelector('.faq-answer');
            const symbol = faqItem.querySelector('.symbol');
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                symbol.textContent = '▾';
            } else {
                answer.style.display = 'block';
                symbol.textContent = '▴';
            }
        });

        faqContainer.appendChild(faqItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const newlyAddedContainer = document.getElementById('newly-added-influencers');
  
    async function fetchNewlyAddedInfluencers() {
        try {
          // Use the full server URL
          const response = await fetch('http://localhost:3000/newly-added-influencers');
          const newInfluencers = await response.json();
      
          // Rest of the code remains the same
          const newlyAddedContainer = document.getElementById('newly-added-influencers');
          newlyAddedContainer.innerHTML = ''; 
      
          newInfluencers.forEach(influencer => {
            const influencerCard = document.createElement('div');
            influencerCard.classList.add('influencer');
            
            influencerCard.innerHTML = `
              <a href="${influencer.socialMediaLink}" target="_blank">
                <img src="${influencer.image ? '/' + influencer.image : 'default-profile.jpg'}" alt="${influencer.name}">
                <h3>${influencer.name}</h3>
                <p>${influencer.platform} Influencer</p>
                <p>${influencer.category} | ${influencer.location}</p>
                <p>Price: $${influencer.price}</p>
              </a>
            `;
      
            newlyAddedContainer.appendChild(influencerCard);
          });
        } catch (error) {
          console.error('Error fetching newly added influencers:', error);
          document.getElementById('newly-added-influencers').innerHTML = '<p>Unable to load new influencers</p>';
        }
      }
  
    // Fetch newly added influencers when page loads
    fetchNewlyAddedInfluencers();
  });